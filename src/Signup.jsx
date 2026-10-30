import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (cleanName.length < 2) {
        throw new Error("Please enter your full name.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.some((u) => u.email === cleanEmail)) {
        throw new Error("An account with this email already exists.");
      }

      users.push({
        id: Date.now().toString(),
        name: cleanName,
        email: cleanEmail,
        password,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("userName", cleanName);
      localStorage.setItem("userEmail", cleanEmail);
      sessionStorage.setItem("auth_token", "local-" + Date.now());

      setMessage("Account created successfully!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 600);
    } catch (error) {
      setMessage(error.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Branding */}
      <div className="relative hidden flex-col justify-between bg-black p-12 text-white md:flex">
        <h2 className="text-2xl font-bold">
          Portfolio<span className="font-light"> Generator</span>
        </h2>

        <div>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Build a portfolio that speaks for you.
          </h1>
          <p className="max-w-sm text-gray-400">
            Create a professional portfolio, showcase your skills, and share
            your work with the world.
          </p>
        </div>

        <p className="text-xs tracking-widest text-gray-600">BLACK / WHITE</p>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center bg-white px-6 py-12 text-black sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400">
            Get started
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            No backend required — works instantly in your browser.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

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
              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 focus-within:border-black focus-within:bg-white">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {message && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-black underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
