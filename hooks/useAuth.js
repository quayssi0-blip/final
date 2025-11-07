"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
        } else if (session?.user) {
          // Fetch complete admin user data including role
          try {
            const response = await fetch("/api/auth/me", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
              setError(null);
            } else {
              // If /api/auth/me fails, user might not be admin, clear user state
              console.log("User is not an admin or session invalid");
              setUser(null);
            }
          } catch (adminError) {
            console.error("Error fetching admin data:", adminError);
            setUser(null);
            setError(adminError.message);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch complete admin user data including role
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setError(null);
          } else {
            // If /api/auth/me fails, user might not be admin
            setUser(null);
          }
        } catch (adminError) {
          console.error(
            "Error fetching admin data on auth change:",
            adminError,
          );
          setUser(null);
          setError(adminError.message);
        }
      } else {
        setUser(null);
        setError(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("useAuth: Starting login process");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("useAuth: Login response received:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Set the user state
      setUser(data.user);

      // Set the session in Supabase client
      if (data.session) {
        const { error: sessionError } = await supabaseClient.auth.setSession(
          data.session,
        );
        if (sessionError) {
          console.error("Error setting session:", sessionError);
        }
      }

      console.log("useAuth: Login process completed successfully");
      return data;
    } catch (err) {
      console.error("useAuth: Login error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("useAuth: Starting logout process");

      // Call server-side logout API first
      const logoutResponse = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!logoutResponse.ok) {
        console.warn(
          "Server logout had issues, continuing with client cleanup",
        );
      } else {
        console.log("Server logout successful");
      }

      // Clear Supabase client session with error handling
      try {
        const { error: signOutError } = await supabaseClient.auth.signOut();
        if (signOutError) {
          // Handle specific error cases
          if (signOutError.message.includes("Auth session missing")) {
            console.log("Client session already invalidated by server logout");
          } else {
            console.error("Client sign out error:", signOutError);
          }
        } else {
          console.log("Client sign out successful");
        }
      } catch (clientError) {
        // Catch AuthSessionMissingError and other client errors
        if (
          clientError.message &&
          clientError.message.includes("Auth session missing")
        ) {
          console.log("Client session already invalidated by server logout");
        } else {
          console.error("Client sign out exception:", clientError);
        }
      }

      // Clear local state immediately
      setUser(null);
      setError(null);

      console.log("useAuth: Logout completed");

      // Use window.location for navigation (more reliable)
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("useAuth: Logout error:", err);
      setError(err.message);

      // Even if there's an error, clear the user state
      setUser(null);

      // Try to redirect anyway
      try {
        window.location.href = "/admin/login";
      } catch (redirectError) {
        console.error("Redirect error:", redirectError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("Check auth error:", err);
      setUser(null);
      return null;
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
}
