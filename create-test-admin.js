// Create test admin user
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hpymvpexiunftdgeobiw.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweW12cGV4aXVuZnRkZ2VvYml3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAyOTYwMCwiZXhwIjoyMDc1NjA1NjAwfQ.iRjT5Kuw_zCp08W7Px3cve6d1cNsEd9BUNhZsPSaKBw";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function createTestAdmin() {
  const admin = {
    email: "test@assalam.org",
    password: "Test123!",
    name: "Test Admin",
    role: "super_admin",
  };

  try {
    console.log("Creating test admin user...");

    // First, try to delete existing test user if any
    const {
      data: { users },
      error: listError,
    } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.log("Cannot list users:", listError.message);
    } else {
      const testUser = users.find((u) => u.email === admin.email);
      if (testUser) {
        console.log("Deleting existing test user...");
        await supabase.auth.admin.deleteUser(testUser.id);
      }
    }

    // Create user in Supabase auth
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
      });

    if (userError) {
      console.error("User creation error:", userError);
      return;
    }

    const userId = userData.user.id;
    console.log("User created with ID:", userId);

    // Delete existing admin record if any
    await supabase.from("admins").delete().eq("id", userId);

    // Insert into admins table
    const { error: insertError } = await supabase.from("admins").insert({
      id: userId,
      name: admin.name,
      role: admin.role,
    });

    if (insertError) {
      console.error("Error inserting admin:", insertError);
    } else {
      console.log("✅ Test admin created successfully!");
      console.log("🔑 Login credentials:");
      console.log("   Email: ", admin.email);
      console.log("   Password: ", admin.password);
      console.log("");
      console.log("You can now login with these credentials.");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

createTestAdmin();
