import supabaseServer from "../supabaseServer";

export class AdminsController {
  static async getAllAdmins(user) {
    console.log("getAllAdmins - User ID:", user.id);

    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("getAllAdmins - Admin data:", adminData, "Role error:", roleError);

    if (roleError || !adminData) {
      console.log("getAllAdmins - Forbidden: roleError or no adminData");
      throw new Error("Forbidden");
    }

    let query = supabaseServer.from("admins").select(`
        id,
        name,
        role,
        last_login,
        created_at,
        email
      `);

    console.log("getAllAdmins - Admin role:", adminData.role);

    // Removed filtering to allow all admins to see all admin accounts
    console.log("getAllAdmins - Fetching all admins");

    const { data: admins, error } = await query.order("created_at", {
      ascending: false,
    });

    console.log("getAllAdmins - Query result:", admins?.length, "admins found, error:", error);

    if (error) {
      throw new Error("Failed to fetch admins");
    }

    return admins;
  }

  static async createAdmin(user, adminData) {
    const { data: currentAdmin, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || currentAdmin?.role !== "super_admin") {
      throw new Error("Only super admins can create admin accounts");
    }

    const { email, password, name, role } = adminData;

    if (!email || !password || !name || !role) {
      throw new Error("Email, password, name, and role are required");
    }

    if (
      !["super_admin", "content_manager", "messages_manager"].includes(role)
    ) {
      throw new Error("Invalid role");
    }

    // Create the auth user
    const { data: authData, error: authError } =
      await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role },
      });

    if (authError) {
      throw new Error("Failed to create admin account");
    }

    // Create the admin record
    const { data: adminRecord, error: adminError } = await supabaseServer
      .from("admins")
      .insert({
        id: authData.user.id,
        name,
        role,
        email: authData.user.email,
      })
      .select()
      .single();

    if (adminError) {
      // Attempt to delete the auth user if admin record creation failed
      await supabaseServer.auth.admin.deleteUser(authData.user.id);
      throw new Error("Failed to create admin record");
    }

    return adminRecord;
  }

  static async getAdminById(user, id) {
    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !adminData) {
      throw new Error("Forbidden");
    }

    // Check if user can access this admin record
    if (adminData.role !== "super_admin" && id !== user.id) {
      throw new Error("Forbidden");
    }

    const { data: admin, error } = await supabaseServer
      .from("admins")
      .select(`
        id,
        name,
        role,
        last_login,
        created_at,
        email
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Admin not found");
      }
      throw new Error("Failed to fetch admin");
    }

    return admin;
  }

  static async updateAdmin(user, id, updateData) {
    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !adminData) {
      throw new Error("Forbidden");
    }

    // Check if user can modify this admin record
    if (adminData.role !== "super_admin" && id !== user.id) {
      throw new Error("Forbidden");
    }

    const { name, role } = updateData;

    if (!name) {
      throw new Error("Name is required");
    }

    // Only super admins can change roles
    if (role && adminData.role !== "super_admin") {
      throw new Error("Only super admins can change roles");
    }

    if (
      role &&
      !["super_admin", "content_manager", "messages_manager"].includes(role)
    ) {
      throw new Error("Invalid role");
    }

    const updatePayload = { name };
    if (role && adminData.role === "super_admin") {
      updatePayload.role = role;
    }

    const { data: admin, error } = await supabaseServer
      .from("admins")
      .update(updatePayload)
      .eq("id", id)
      .select(`
        id,
        name,
        role,
        last_login,
        created_at,
        email
      `)
      .single();

    if (error) {
      throw new Error("Failed to update admin");
    }

    return admin;
  }

  static async deleteAdmin(user, id) {
    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || adminData?.role !== "super_admin") {
      throw new Error("Only super admins can delete admin accounts");
    }

    // Prevent deleting the last super admin
    const { count: superAdminCount } = await supabaseServer
      .from("admins")
      .select("*", { count: "exact", head: true })
      .eq("role", "super_admin");

    const { count: targetIsSuperAdmin } = await supabaseServer
      .from("admins")
      .select("*", { count: "exact", head: true })
      .eq("id", id)
      .eq("role", "super_admin");

    if (superAdminCount === 1 && targetIsSuperAdmin === 1) {
      throw new Error("Cannot delete the last super admin");
    }

    const { error } = await supabaseServer.from("admins").delete().eq("id", id);

    if (error) {
      throw new Error("Failed to delete admin");
    }

    // Also delete the auth user
    await supabaseServer.auth.admin.deleteUser(id);

    return { message: "Admin deleted successfully" };
  }
}
