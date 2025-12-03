"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signUp(formData);
      // Success - redirect to login page
      router.push("/login");
    } catch (err: unknown) {
      // Display error message
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      {/* Background Effects */}
      <SoulParticles />
      <FogEffect />

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Stone Gate */}
          <div className="relative border-4 border-stone-700/80 rounded-lg p-8 bg-gradient-to-b from-stone-800/20 to-stone-900/30 backdrop-blur-md shadow-2xl animate-[stoneRise_1.5s_ease-out]">
            {/* Ancient Runes Decoration */}
            <div className="absolute top-4 left-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>
            <div className="absolute top-4 right-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>
            <div className="absolute bottom-4 left-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>
            <div className="absolute bottom-4 right-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>

            <h1 className="font-cinzel text-4xl tracking-[0.2em] text-stone-300 mb-2 text-center">
              Sign Up
            </h1>
            <p className="text-stone-500 text-sm mb-8 text-center">
              Enter the afterlife of memories
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-stone-400 text-sm mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[var(--soul-blue)] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-stone-400 text-sm mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[var(--soul-blue)] transition-colors"
                  placeholder="Username"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-stone-400 text-sm mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[var(--soul-blue)] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="seal"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign Up"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-stone-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--soul-blue)] hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
