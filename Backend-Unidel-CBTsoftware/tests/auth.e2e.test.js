import { test, describe, it, before, after } from "node:test";
import assert from "node:assert";

const BASE_URL = "http://127.0.0.1:3000/api/auth";
const TEST_EMAIL = `e2e_test_${Date.now()}@example.com`;
const TEST_PASSWORD = "password123";

// Helper to parse cookies
function parseCookies(headers) {
  const cookieStore = {};
  let cookies = [];
  if (headers && headers.getSetCookie) {
    cookies = headers.getSetCookie();
  } else if (headers && headers.get) {
    const header = headers.get("set-cookie");
    if (header) cookies = [header];
  }

  cookies.forEach((cookie) => {
    const parts = cookie.split(";");
    const [name, value] = parts[0].split("=");
    cookieStore[name.trim()] = value;
  });
  return cookieStore;
}

// Helper to format cookies for request
function formatCookieHeader(cookieStore) {
  return Object.entries(cookieStore)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

describe("Auth Flow E2E Tests", async () => {
  let cookieStore = {};
  let agentUser = null;

  it("should register a new agent", async () => {
    const res = await fetch(`${BASE_URL}/agent/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: "E2E Test Agent",
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        organisation: "E2E Corp",
      }),
    });

    const data = await res.json();
    // 201 Created or 400 if already exists (for re-runs)
    if (res.status === 400 && data.message === "Agent already exists") {
      assert.ok(true, "Agent already exists, skipping signup");
    } else {
      assert.strictEqual(res.status, 201);
      assert.strictEqual(data.success, true);
    }
  });

  it("should login with valid credentials", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        role: "agent",
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.user);
    assert.strictEqual(data.user.email, TEST_EMAIL);

    cookieStore = parseCookies(res.headers);
    assert.ok(cookieStore["access_token"], "access_token cookie missing");
    assert.ok(cookieStore["refresh_token"], "refresh_token cookie missing");

    agentUser = data.user;
  });

  it("should access protected /me route", async () => {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Cookie: formatCookieHeader(cookieStore) },
    });

    if (res.status !== 200) {
      console.error("Helper Error Log (/me):", await res.text());
    }
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.email, TEST_EMAIL);
  });

  it("should fail /me without cookies", async () => {
    const res = await fetch(`${BASE_URL}/me`);
    assert.strictEqual(res.status, 401);
  });

  it("should fail login with wrong password", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: "wrongpassword",
        role: "agent",
      }),
    });
    assert.strictEqual(res.status, 401);
  });

  it("should refresh token", async () => {
    const oldAccessToken = cookieStore["access_token"];

    // Wait 1s to ensure iat changes if possible, though not strictly needed for this test
    await new Promise((r) => setTimeout(r, 1000));

    const res = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      headers: { Cookie: formatCookieHeader(cookieStore) },
    });

    if (res.status !== 200) {
      console.error("Helper Error Log (Refresh):", await res.text());
    }
    assert.strictEqual(res.status, 200);

    // Update cookies
    const newCookies = parseCookies(res.headers);
    Object.assign(cookieStore, newCookies);

    const newAccessToken = cookieStore["access_token"];
    assert.notStrictEqual(
      newAccessToken,
      oldAccessToken,
      "Access token should rotate",
    );
  });

  it("should verify access with rotated token", async () => {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Cookie: formatCookieHeader(cookieStore) },
    });
    assert.strictEqual(res.status, 200);
  });

  it("should logout", async () => {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: { Cookie: formatCookieHeader(cookieStore) },
    });
    assert.strictEqual(res.status, 200);

    // Update cookies (expecting clears)
    const newCookies = parseCookies(res.headers);
    // Note: fetch doesn't handle cookie expiration logic automatically in this manual parser,
    // but the header should set Max-Age=0 or generic empty value.
    // We check if the server sent set-cookie to clear it.

    // In Express res.cookie('', {maxAge:0}) sets Set-Cookie: token=; Max-Age=0...
    // My parser just takes value. Value will be empty string.

    if (newCookies["access_token"] !== undefined) {
      assert.strictEqual(newCookies["access_token"], "");
    }
  });

  it("should fail access after logout", async () => {
    // We manually clear our store to simulate browser behavior
    delete cookieStore["access_token"];
    delete cookieStore["refresh_token"];

    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Cookie: formatCookieHeader(cookieStore) },
    });
    assert.strictEqual(res.status, 401);
  });
});
