// Create admin user directly
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hpymvpexiunftdgeobiw.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweW12cGV4aXVuZnRkZ2VvYml3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDAyOTYwMCwiZXhwIjoyMDc1NjA1NjAwfQ.iRjT5Kuw_zCp08W7Px3cve6d1cNsEd9BUNhZsPSaKBw";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function createAdminUser() {
  const admin = {
    email: "admin@assalam.org",
    password: "Admin123!",
    name: "Admin",
    role: "super_admin",
  };

  try {
    console.log("Creating admin user...");

    // Create user in Supabase auth
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
      });

    if (userError) {
      if (
        userError.message.includes("already registered") ||
        userError.message.includes("duplicate")
      ) {
        console.log("User already exists, finding user...");

        // Get existing user
        const {
          data: { users },
          error: listError,
        } = await supabase.auth.admin.listUsers();
        if (listError) {
          throw listError;
        }

        const existingUser = users.find((u) => u.email === admin.email);
        if (!existingUser) {
          throw new Error("User exists but could not be found");
        }

        userData.user = existingUser;
      } else {
        throw userError;
      }
    } else {
      console.log("Created user successfully");
    }

    const userId = userData.user.id;
    console.log("User ID:", userId);

    // Check if already in admins table
    const { data: existingAdmin, error: adminSelectError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", userId)
      .single();

    if (adminSelectError && adminSelectError.code !== "PGRST116") {
      console.error("Error checking admin table:", adminSelectError);
      return;
    }

    if (existingAdmin) {
      console.log("Admin already exists in table");
      return;
    }

    // Insert into admins table
    const { error: insertError } = await supabase.from("admins").insert({
      id: userId,
      name: admin.name,
      role: admin.role,
    });

    if (insertError) {
      console.error("Error inserting admin:", insertError);
    } else {
      console.log("Admin added successfully!");
      console.log("Login credentials:");
      console.log("Email:", admin.email);
      console.log("Password:", admin.password);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

createAdminUser();
