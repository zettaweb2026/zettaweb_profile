import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { API_BASE_URL, getFriendlyErrorMessage, parseApiResponse, saveAuthSession } from "../../lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await parseApiResponse(response);

      if (!data.token || !data.user) {
        throw new Error("LOGIN_RESPONSE_INVALID");
      }

      saveAuthSession({
        token: data.token,
        user: data.user,
      });

      if (data.user.role !== "admin") {
        navigate("/access-denied", { replace: true });
        return;
      }

      const redirectTo = location.state?.from?.pathname || "/admin/dashboard";
      navigate(redirectTo === "/admin" ? "/admin/dashboard" : redirectTo, { replace: true });
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "Unable to login right now. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_34%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.16),transparent_30%)]" />

      <section className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="hidden lg:block">
          <Link to="/" className="mb-10 inline-flex items-center gap-3">
            <img src="/logo.png" alt="Zettaweb Logo" className="h-12 w-12 rounded-xl object-contain" />
            <span className="text-3xl font-black gradient-text glow-text">Zettaweb</span>
          </Link>

          <h1 className="max-w-xl text-4xl font-extrabold leading-tight lg:text-6xl">
            Welcome back to your digital command center.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
            Sign in to manage projects, review updates, and keep your Zettaweb workspace moving.
          </p>
        </div>

        <Card className="glass-card rounded-2xl border-primary/10">
          <CardHeader className="space-y-3 text-center">
            <Link to="/" className="mx-auto inline-flex items-center gap-3 lg:hidden">
              <img src="/logo.png" alt="Zettaweb Logo" className="h-11 w-11 rounded-xl object-contain" />
              <span className="text-2xl font-black gradient-text glow-text">Zettaweb</span>
            </Link>
            <CardTitle className="text-3xl">Login</CardTitle>
            <CardDescription>Enter your account details to continue.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="h-11 px-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                Remember me on this device
              </label>

              <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl font-bold">
                <LogIn className="h-4 w-4" />
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Do not have an account?{" "}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Login;
