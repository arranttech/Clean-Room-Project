// Test script: simulate Google login, call protected route, wait for expiry, call again
(async () => {
  const API = 'http://localhost:3000';
  // Dummy Google ID token (header.payload.signature) with payload containing sub,email,name
  const fakeGoogleIdToken = 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from(JSON.stringify({ sub: '123', email: 'e2e@test.local', name: 'E2E Test' })).toString('base64url') + '.sig';

  console.log('POSTing to /auth/google-login with fake Google token...');
  const loginRes = await fetch(`${API}/auth/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: fakeGoogleIdToken }),
    credentials: 'include'
  });

  const loginText = await loginRes.text();
  console.log('Login status:', loginRes.status);
  console.log('Login response:', loginText);

  if (!loginRes.ok) {
    console.error('Login failed; aborting test.');
    process.exit(1);
  }

  const loginJson = JSON.parse(loginText);
  const appToken = loginJson.token;
  if (!appToken) {
    console.error('No app token returned; aborting');
    process.exit(1);
  }

  // Call protected route with token in Authorization header
  console.log('\nCalling /api/profile with token...');
  let profileRes = await fetch(`${API}/api/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${appToken}` }
  });
  console.log('Profile status (before expiry):', profileRes.status);
  console.log('Profile body:', await profileRes.text());

  // Parse token expiry
  const parts = appToken.split('.');
  let exp = null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    exp = payload.exp;
    console.log('Token exp (unix seconds):', exp);
    const msLeft = exp * 1000 - Date.now();
    console.log('MS until expiry:', msLeft);
  } catch (e) {
    console.error('Failed to parse app token payload');
  }

  const waitMs = 65000; // wait 65s
  console.log(`\nWaiting ${waitMs/1000}s for token to expire...`);
  await new Promise((r) => setTimeout(r, waitMs));

  console.log('\nCalling /api/profile after expiry...');
  profileRes = await fetch(`${API}/api/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${appToken}` }
  });
  console.log('Profile status (after expiry):', profileRes.status);
  console.log('Profile body:', await profileRes.text());

  console.log('\nE2E test complete.');
  process.exit(0);
})();
