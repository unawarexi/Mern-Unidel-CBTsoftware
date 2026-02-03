AUTH COOKIE SETUP & CONSENT PROMPT (FULL IMPLEMENTATION)

You are a senior full-stack engineer tasked with implementing secure cookie-based authentication and cookie consent management for an existing web application that currently does not use cookies.

🎯 Goals

Move authentication tokens from client storage to secure HttpOnly cookies

Implement proper backend cookie handling

Add frontend support for cookie-based auth

Implement a cookie consent banner (accept / reject)

Ensure compliance-friendly structure and clean architecture

🧱 Backend Implementation
1️⃣ Required Packages

Install and configure the following:

cookie-parser

(If Express) cors

(Optional) csurf for CSRF protection

2️⃣ Cookie Configuration

Configure cookies with:

httpOnly: true

secure: true (conditional for production)

sameSite: 'lax' or 'strict'

Proper path and maxAge

3️⃣ Auth Flow Changes

On successful login:

Set access token in an HttpOnly cookie

Optionally set a refresh token in a separate cookie

Remove token return in JSON responses

Example responsibilities:

POST /auth/login → sets cookies

POST /auth/logout → clears cookies

GET /auth/me → reads token from cookies

4️⃣ Middleware

Implement auth middleware that:

Reads token from cookies

Verifies token

Attaches user to request context

Ensure rate limiting still works correctly with cookies

5️⃣ CORS & Credentials

Enable credentials:

credentials: true

Ensure allowed origins are explicitly set

Cookies must be sent automatically by the browser

🎨 Frontend Implementation
6️⃣ API Layer Changes

Remove all token reads from:

localStorage

sessionStorage

Ensure all API calls use:

credentials: 'include'

Update auth hooks and API clients accordingly

7️⃣ Auth State

Store user data only in client state (Zustand / React)

Do NOT store tokens in state

Auth status is determined by /auth/me

🍪 Cookie Consent Banner
8️⃣ Banner Requirements

Implement a cookie consent banner that:

Appears on first visit

Allows:

Accept all cookies

Reject non-essential cookies

Stores user choice (cookie or localStorage)

Does not block essential auth cookies

9️⃣ Banner Behavior

Essential cookies (auth) are always allowed

Analytics / marketing cookies are conditional

Banner does not reappear once choice is made

Banner UI must be accessible and responsive

🧪 Edge Cases & Validation

Handle expired cookies gracefully

Handle blocked cookies

Ensure login/logout works without page reload

Ensure SSR or page refresh does not lose auth state

Confirm no tokens exist in JS-accessible storage

🧠 Engineering Standards

Follow existing project structure

Separate:

Auth logic

Cookie logic

Consent logic

Do not introduce global state for tokens

Add comments where security decisions are made

✅ Deliverables

Cookie-based auth fully working

Backend cookie configuration

Updated frontend auth flow

Cookie consent banner component

Documentation or comments explaining the flow

🔐 Guiding Principle

Tokens belong to the browser, not JavaScript.
