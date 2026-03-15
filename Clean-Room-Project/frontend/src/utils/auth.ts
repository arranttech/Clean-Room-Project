export function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];

    // base64url -> base64
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    // decode utf-8 safely in browser
    const binary = atob(base64);
    const bytes = Array.from(binary)
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("");
    const json = decodeURIComponent(bytes);
    const decoded = JSON.parse(json);
    return decoded;
  } catch (err) {
    return null;
  }
}

let logoutTimer: ReturnType<typeof setTimeout> | null = null;
let warningTimer: ReturnType<typeof setTimeout> | null = null;

type SessionTimerOptions = {
  warnBeforeMs: number;
  onWarn: () => void;
  onExpire: () => void;
};

export function clearSessionTimers() {
  if (warningTimer) {
    clearTimeout(warningTimer);
    warningTimer = null;
  }

  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}

export function scheduleSessionTimers(token: string, options: SessionTimerOptions) {
  clearSessionTimers();
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) {
    return;
  }

  const expiresAt = decoded.exp * 1000;
  const ms = expiresAt - Date.now();

  if (ms <= 0) {
    options.onExpire();
    return;
  }

  const maxDelay = 2 ** 31 - 1;
  const warningMs = ms - options.warnBeforeMs;
  if (warningMs <= 0) {
    options.onWarn();
  } else {
    warningTimer = setTimeout(options.onWarn, Math.min(warningMs, maxDelay));
  }

  logoutTimer = setTimeout(options.onExpire, Math.min(ms, maxDelay));
}

export function scheduleAutoLogout(token: string, onLogout: () => void) {
  scheduleSessionTimers(token, {
    warnBeforeMs: 0,
    onWarn: () => {},
    onExpire: onLogout,
  });
}

export function clearAutoLogout() {
  clearSessionTimers();
}

export function initAutoLogout(onLogout: () => void) {
  const token = localStorage.getItem("token");
  if (!token) return;
  scheduleAutoLogout(token, onLogout);
}
