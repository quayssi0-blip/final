import { createRequire } from "module";
import { supabaseServer } from "./lib/supabaseServer.js";

const require = createRequire(import.meta.url);
const fs = require("fs");

// Load environment variables
if (fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

const admins = [
  {
    email: "superadmin@assalam.org",
    password: "SuperAdmin123!",
    name: "Super Admin",
    role: "super_admin",
  },
  {
    email: "contentmanager@assalam.org",
    password: "SuperAdmin123!",
    name: "Content Manager",
    role: "content_manager",
  },
  {
    email: "messagesmanager@assalam.org",
    password: "SuperAdmin123!",
    name: "Messages Manager",
    role: "messages_manager",
  },
];

async function addAdmins() {
  for (const admin of admins) {
    try {
      // First, try to create the user in Supabase auth
      const { data: userData, error: userError } =
        await supabaseServer.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true, // Confirm email immediately
        });

      if (userError) {
        // If user creation fails due to duplicate, try to find existing user
        if (
          userError.message.includes("already registered") ||
          userError.message.includes("duplicate")
        ) {
          console.log(
            `User ${admin.email} already exists, checking if in admins table...`,
          );
        } else {
          console.error(
            `Error creating user ${admin.email}:`,
            userError.message,
          );
          continue;
        }
      } else {
        console.log(`Created user ${admin.email}.`);
      }

      const userId = userData.user.id;

      // Check if already in admins table
      const { data: existingAdmin, error: adminSelectError } =
        await supabaseServer
          .from("admins")
          .select("id")
          .eq("id", userId)
          .single();

      if (adminSelectError && adminSelectError.code !== "PGRST116") {
        console.error(
          `Error checking admin table for ${admin.email}:`,
          adminSelectError.message,
        );
        continue;
      }

      if (existingAdmin) {
        console.log(
          `Admin ${admin.name} (${admin.email}) already exists in admins table.`,
        );
        continue;
      }

      // Insert into admins table
      const { error: insertError } = await supabaseServer
        .from("admins")
        .insert({
          id: userId,
          name: admin.name,
          role: admin.role,
        });

      if (insertError) {
        console.error(
          `Error inserting admin ${admin.email}:`,
          insertError.message,
        );
      } else {
        console.log(`Successfully added admin: ${admin.name} (${admin.email})`);
      }
    } catch (err) {
      console.error(`Unexpected error for ${admin.email}:`, err);
    }
  }
}

addAdmins().catch(console.error);
