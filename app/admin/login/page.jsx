"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm/AdminLoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (formData) => {
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Redirect to dashboard on successful login
      router.push("/admin/dashboard");
    } catch (err) {
      // Error is handled by the useAuth hook and passed to AdminLoginForm
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 50%, #6495ED 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AdminLoginForm
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
      />
    </div>
  );
}
