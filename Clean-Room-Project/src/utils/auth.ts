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
  onWarn?: () => void;
  onExpire: () => void;
  warnBeforeMs?: number;
};

function getTokenExpiryMs(token: string): number | null {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const expiresAt = decoded.exp * 1000; // exp is in seconds
  const now = Date.now();
  return expiresAt - now;
}

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
  const { onWarn, onExpire, warnBeforeMs = 2 * 60 * 1000 } = options;

  clearSessionTimers();

  const ms = getTokenExpiryMs(token);
  if (ms === null) {
    return;
  }

  if (ms <= 0) {
    onExpire();
    return;
  }

  const warningDelay = ms - warnBeforeMs;
  if (onWarn && warningDelay > 0) {
    warningTimer = setTimeout(() => {
      onWarn();
    }, warningDelay);
  }

  // Cap timeout to a safe value
  const timeoutMs = Math.min(ms, 2 ** 31 - 1);
  logoutTimer = setTimeout(() => {
    onExpire();
  }, timeoutMs);
}

export function scheduleAutoLogout(token: string, onLogout: () => void) {
  scheduleSessionTimers(token, { onExpire: onLogout });
}

export function clearAutoLogout() {
  clearSessionTimers();
}

export function initAutoLogout(onLogout: () => void) {
  const token = localStorage.getItem("token");
  if (!token) return;
  scheduleAutoLogout(token, onLogout);
}
