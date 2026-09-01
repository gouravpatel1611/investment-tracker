import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TrendingUp,
  WalletCards,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import auth from "../services/firebase/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled. Please contact support."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError(
            "Unable to login. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="relative flex min-h-screen overflow-hidden">

        {/* Background Glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Desktop Left Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative items-center justify-center px-12">
          <div className="relative z-10 max-w-xl">

            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp
                  size={25}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  InvestTrack
                </h1>

                <p className="text-xs text-slate-500">
                  Personal Finance Manager
                </p>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              Take control of
              <span className="block text-emerald-400">
                your financial future.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Track your investments, monitor your portfolio,
              and keep your financial journey organized — all
              in one secure place.
            </p>

            {/* Feature Cards */}
            <div className="mt-10 grid grid-cols-2 gap-4">

              <FeatureCard
                icon={<WalletCards size={19} />}
                title="Portfolio"
                description="Track all your investments"
              />

              <FeatureCard
                icon={<ShieldCheck size={19} />}
                title="Secure"
                description="Your financial data stays private"
              />

            </div>

          </div>
        </div>

        {/* Right Login Section */}
        <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:w-1/2 xl:w-[45%]">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h1 className="text-lg font-bold">
                    InvestTrack
                  </h1>

                  <p className="text-[11px] text-slate-500">
                    Personal Finance Manager
                  </p>
                </div>

              </div>
            </div>

            {/* Login Card */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0d111a]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-7">

              {/* Header */}
              <div className="mb-7">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <LockKeyhole
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-1.5 text-sm text-slate-500">
                  Sign in to continue to your portfolio.
                </p>

              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#080b12] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#080b12] pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-[#06100c] transition hover:bg-emerald-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>

              </form>

              {/* Security Note */}
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />

                <p className="text-[11px] leading-5 text-slate-500">
                  Your account is protected by Firebase
                  Authentication. Never share your password
                  with anyone.
                </p>
              </div>

            </div>

            {/* Footer */}
            <p className="mt-5 text-center text-[11px] text-slate-600">
              Secure access to your personal financial dashboard
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        {icon}
      </div>

      <p className="text-sm font-semibold text-slate-200">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Login;