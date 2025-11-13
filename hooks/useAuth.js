"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      console.log("DEBUG: useAuth initialization started");
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        console.log("DEBUG: getSession result - session exists:", !!session, "error:", !!sessionError);

        if (sessionError) {
          console.error("Session error:", sessionError);
          if (isMounted) setError(sessionError.message);
        } else if (session?.user) {
          console.log("DEBUG: Session found, fetching admin data for user:", session.user.email);
          // Fetch complete admin user data including role
          try {
            const response = await fetch("/api/auth/me", {
              method: "GET",
              credentials: "include", // Ensure cookies are sent
              headers: {
                "Content-Type": "application/json",
              },
            });

            console.log("DEBUG: /api/auth/me response status:", response.status);

            if (isMounted) {
              if (response.ok) {
                const data = await response.json();
                console.log("DEBUG: Admin data fetched successfully, setting user:", data.user.email);
                setUser(data.user);
                setError(null);
              } else {
                // If /api/auth/me fails, user might not be admin, clear user state
                console.log("DEBUG: User is not an admin or session invalid, clearing user state. Response:", await response.text());
                setUser(null);
              }
            }
          } catch (adminError) {
            console.error("Error fetching admin data:", adminError);
            if (isMounted) {
              setUser(null);
              setError(adminError.message);
            }
          }
        } else {
          console.log("DEBUG: No session found, user remains null");
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isMounted) {
          setError(err.message);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          console.log("DEBUG: useAuth initialization completed, setting isLoading to false");
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("DEBUG: onAuthStateChange triggered - event:", event, "session exists:", !!session, "user exists in session:", !!session?.user);
      // Now that login doesn't set user state, we always handle auth changes here consistently

      if (session?.user) {
        console.log("DEBUG: Session exists, fetching admin data for user:", session.user.email);
        // Fetch complete admin user data including role
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include", // Ensure cookies are sent
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("DEBUG: onAuthStateChange /api/auth/me response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("DEBUG: Admin data fetched on auth change, setting user:", data.user.email);
            setUser(data.user);
            setError(null);
            // Set loading to false after successful user fetch
            setIsLoading(false);
          } else {
            console.log("DEBUG: /api/auth/me failed - user not admin or session invalid, clearing user. Status:", response.status, "Response:", await response.text());
            // If /api/auth/me fails, user might not be admin, clear user state
            setUser(null);
            setIsLoading(false);
          }
        } catch (adminError) {
          console.error("DEBUG: Error fetching admin data on auth change:", adminError);
          setUser(null);
          setError(adminError.message);
          setIsLoading(false);
        }
      } else {
        console.log("DEBUG: Auth state change - no session, clearing user");
        setUser(null);
        setError(null);
        setIsLoading(false);
      }
      console.log("DEBUG: onAuthStateChange completed");
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (credentials) => {
    console.log("DEBUG: useAuth login started - setting isLoading true");
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

      const responseText = await response.text();
      console.log("useAuth: Login response received:", responseText);

      let data;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          throw new Error("Invalid response from server");
        }
      } else {
        throw new Error("Empty response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("DEBUG: Login successful, setting client session");
      // Set the session on the client side to synchronize with server auth
      await supabaseClient.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      // DÉLAI AJOUTÉ : Attendre 50ms pour permettre la synchronisation des cookies
      console.log("DEBUG: Waiting 50ms for cookie synchronization");
      await new Promise(resolve => setTimeout(resolve, 50));

      console.log("DEBUG: Calling checkAuth for immediate auth state verification");
      const userData = await checkAuth();

      if (!userData) {
        console.log("DEBUG: checkAuth failed - auth verification failed");
        throw new Error("Auth verification failed");
      }

      console.log("DEBUG: Auth state verified successfully:", userData.email);

      console.log("DEBUG: Client session set successfully");
      console.log("useAuth: Login process completed successfully");
      return data;
    } catch (err) {
      console.error("useAuth: Login error:", err);
      setError(err.message);
      setUser(null); // Clear any partial state
      throw err;
    } finally {
      console.log("DEBUG: Login finally block - setting isLoading to false");
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
      console.log("DEBUG: checkAuth called");
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("DEBUG: checkAuth response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("DEBUG: checkAuth successful, setting user:", data.user.email);
        setUser(data.user);
        return data.user;
      } else {
        console.log("DEBUG: checkAuth failed, clearing user. Response:", await response.text());
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("DEBUG: Check auth error:", err);
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
