"use client";

import { useRouter } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm/AdminLoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (formData) => {
    try {
      console.log("DEBUG: Login page handleLogin called with email:", formData.email);
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("DEBUG: Login completed successfully, auth state should be synced");

      // Auth state will be handled by useEffect in AdminLayout
    } catch (err) {
      // Error is handled by the useAuth hook and passed to AdminLoginForm
      console.error("DEBUG: Login failed:", err.message);
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
