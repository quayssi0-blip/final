import { createRequire } from "module";
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const fs = require("fs");

// Load environment variables FIRST
if (fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  envContent.split("\n").forEach((line) => {
    // Skip comments and empty lines
    if (line.trim() === '' || line.trim().startsWith('#')) return;
    
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

// Now create Supabase client after env vars are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
}

const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function collectAndAddAdmins() {
  try {
    console.log("🔍 Récupération des utilisateurs depuis auth.users...");
    
    // Get all users from auth.users
    const { data: users, error: usersError } = await supabaseServer.auth.admin.listUsers();
    
    if (usersError) {
      console.error("❌ Erreur lors de la récupération des utilisateurs:", usersError.message);
      return;
    }
    
    console.log(`✅ ${users.users.length} utilisateurs trouvés dans auth.users`);
    
    for (const user of users.users) {
      try {
        // Check if user already exists in admins table
        const { data: existingAdmin, error: adminSelectError } =
          await supabaseServer
            .from("admins")
            .select("id")
            .eq("id", user.id)
            .single();

        if (adminSelectError && adminSelectError.code !== "PGRST116") {
          console.error(
            `❌ Erreur lors de la vérification pour ${user.email}:`,
            adminSelectError.message,
          );
          continue;
        }

        if (existingAdmin) {
          console.log(`ℹ️ Admin ${user.email} existe déjà dans public.admins`);
          continue;
        }

        // Determine role based on email
        let role = "content_manager"; // default role
        if (user.email.includes("superadmin")) {
          role = "super_admin";
        } else if (user.email.includes("contentmanager")) {
          role = "content_manager";
        } else if (user.email.includes("messagesmanager")) {
          role = "messages_manager";
        }

        // Extract name from email or use a default
        const name = user.email.split('@')[0]
          .replace(/admin/g, ' Admin')
          .replace(/super/g, 'Super')
          .replace(/content/g, 'Content')
          .replace(/manager/g, 'Manager')
          .replace(/messages/g, 'Messages')
          .replace(/superadmin/g, 'Super Admin')
          .replace(/contentmanager/g, 'Content Manager')
          .replace(/messagesmanager/g, 'Messages Manager')
          .trim();

        // Insert into admins table
        const { error: insertError } = await supabaseServer
          .from("admins")
          .insert({
            id: user.id,
            name: name,
            role: role,
          });

        if (insertError) {
          console.error(
            `❌ Erreur lors de l'insertion de ${user.email}:`,
            insertError.message,
          );
        } else {
          console.log(`✅ Admin ajouté: ${name} (${user.email}) avec le rôle ${role}`);
        }
      } catch (err) {
        console.error(`❌ Erreur inattendue pour ${user.email}:`, err);
      }
    }
    
    console.log("🎉 Processus terminé !");
    
  } catch (err) {
    console.error("❌ Erreur générale:", err);
  }
}

collectAndAddAdmins();
