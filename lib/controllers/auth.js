import supabaseServer from "../supabaseServer";

export class AuthController {
  static async login(credentials) {
    const { email, password } = credentials;

    console.log("AuthController.login called with email:", email);

    if (!email || !password) {
      console.error("Missing email or password");
      throw new Error("Email and password are required");
    }

    console.log("Attempting to sign in with Supabase...");
    const { data: authData, error: authError } =
      await supabaseServer.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Supabase auth error:", authError);
      throw new Error("Invalid credentials");
    }

    console.log("Supabase auth successful for user:", authData.user?.id);

    // Check if user is an admin
    console.log("Checking admin status for user:", authData.user.id);
    const { data: adminData, error: adminError } = await supabaseServer
      .from("admins")
      .select("name, role")
      .eq("id", authData.user.id)
      .single();

    if (adminError || !adminData) {
      console.log("User is not an admin, signing out");
      // Sign out the user since they're not an admin
      await supabaseServer.auth.signOut();
      throw new Error("Access denied");
    }

    console.log("Admin verification successful for:", adminData.name);

    // Update last login
    console.log("Updating last login...");
    await supabaseServer
      .from("admins")
      .update({ last_login: new Date().toISOString() })
      .eq("id", authData.user.id);

    console.log("Login process completed successfully");
    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: adminData.name,
        role: adminData.role,
      },
      session: authData.session,
    };
  }

  static async logout() {
    console.log("AuthController.logout called");

    const { error } = await supabaseServer.auth.signOut();

    if (error) {
      console.error("AuthController.logout error:", error);
      throw new Error(`Failed to logout: ${error.message}`);
    }

    console.log("AuthController.logout successful");
    return { message: "Logged out successfully" };
  }

  static async getCurrentUser(user) {
    console.log("DEBUG: AuthController.getCurrentUser called with user:", user?.id, user?.email);

    const { data: adminData, error: adminError } = await supabaseServer
      .from("admins")
      .select("name, role, last_login, created_at")
      .eq("id", user.id)
      .single();

    console.log("DEBUG: Admin query result:");
    console.log("DEBUG: - adminData:", !!adminData, adminError?.message);
    console.log("DEBUG: - adminError:", adminError?.message);

    if (adminError || !adminData) {
      console.log("DEBUG: User is not admin or query failed, throwing error");
      throw new Error("Not an admin user");
    }

    console.log("DEBUG: Admin user found:", adminData.name, adminData.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: adminData.name,
        role: adminData.role,
        last_login: adminData.last_login,
        created_at: adminData.created_at,
      },
    };
  }
}
