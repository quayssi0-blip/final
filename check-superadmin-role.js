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

async function checkAndUpdateSuperadminRole() {
  const emailToCheck = "superadmin@assalam.org";
  const expectedRole = "super_admin";

  try {
    console.log(`🔍 Vérification du rôle pour l'utilisateur ${emailToCheck}...`);

    // Query the admins table for the user
    const { data: adminData, error: selectError } = await supabaseServer
      .from("admins")
      .select("id, email, role")
      .eq("email", emailToCheck)
      .single();

    if (selectError) {
      if (selectError.code === "PGRST116") {
        console.log(`❌ Utilisateur ${emailToCheck} non trouvé dans la table admins.`);
        console.log("Vous devez d'abord créer cet utilisateur ou l'ajouter via le script add-admins.js");
        return;
      } else {
        console.error("❌ Erreur lors de la requête:", selectError.message);
        return;
      }
    }

    console.log(`✅ Utilisateur trouvé: ${adminData.email}`);
    console.log(`📋 Rôle actuel: ${adminData.role}`);

    // Check if the role is correct
    const validRoles = ["super_admin", "content_manager", "messages_manager"];

    if (!validRoles.includes(adminData.role)) {
      console.log(`⚠️ Le rôle '${adminData.role}' n'est pas valide. Mise à jour vers '${expectedRole}'...`);

      const { error: updateError } = await supabaseServer
        .from("admins")
        .update({ role: expectedRole })
        .eq("email", emailToCheck);

      if (updateError) {
        console.error("❌ Erreur lors de la mise à jour:", updateError.message);
        return;
      }

      console.log(`✅ Rôle mis à jour vers '${expectedRole}'`);
    } else if (adminData.role === expectedRole) {
      console.log(`✅ Le rôle est déjà correct: '${expectedRole}'`);
    } else {
      console.log(`⚠️ Le rôle actuel '${adminData.role}' est valide mais différent de '${expectedRole}'.`);
      console.log("Voulez-vous le mettre à jour ? Si oui, modifiez le script.");
    }

    console.log("🎉 Vérification terminée !");

  } catch (err) {
    console.error("❌ Erreur générale:", err);
  }
}

checkAndUpdateSuperadminRole();