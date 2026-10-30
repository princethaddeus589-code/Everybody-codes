import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1) Try Vercel admin login first (ADMIN_EMAIL / ADMIN_PASSWORD)
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.token) {
          sessionStorage.setItem("auth_token", data.token);
          localStorage.setItem("userEmail", data.email || cleanEmail);
          localStorage.setItem(
            "userName",
            localStorage.getItem("userName") || "Admin"
          );
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch {
        // API not available — fall through to local users
      }

      // 2) Fall back to local registered users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const match = users.find(
        (u) =>
          u.email === cleanEmail &&
          u.password === password
      );

      if (!match) {
        throw new Error("Email or password is incorrect.");
      }

      sessionStorage.setItem("auth_token", "local-" + Date.now());
      localStorage.setItem("userName", match.name);
      localStorage.setItem("userEmail", match.email);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left – form */}
      <div className="flex flex-col justify-center bg-white px-6 py-12 text-black sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="mb-10 text-3xl font-bold tracking-tight">A.</p>

          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400">
            Secure workspace
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Welcome back.
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Sign in to your portfolio workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
              {!busy && <span aria-hidden>→</span>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-black underline">
              Create one
            </Link>
          </p>

          <p className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            Private workspace access
          </p>
        </div>
      </div>

      {/* Right – brand panel */}
      <div className="relative hidden flex-col justify-between bg-black p-12 text-white md:flex">
        <div className="flex items-center justify-between text-xs tracking-widest text-gray-500">
          <span>PORTFOLIO GENERATOR</span>
          <span>V1.0</span>
        </div>

        <div>
          <p className="mb-3 text-xs tracking-widest text-gray-500">
            CONTROL CENTER
          </p>
          <h2 className="max-w-md text-5xl font-bold leading-tight tracking-tight">
            Everything in its place.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
            A clean workspace designed for focused portfolio creation and
            administration.
          </p>
        </div>

        <div className="flex justify-between text-xs tracking-widest text-gray-600">
          <span>BLACK / WHITE</span>
          <span>BUILT FOR CLARITY</span>
        </div>
      </div>
    </div>
  );
}
