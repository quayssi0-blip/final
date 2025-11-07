// Test script to debug authentication
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function testAuth() {
  console.log("=== Authentication Test ===");

  try {
    // Test 1: Check if we can connect to Supabase
    console.log("1. Testing Supabase connection...");
    const { data, error } = await supabase.from("admins").select("count");
    if (error) {
      console.error("   ❌ Connection failed:", error);
    } else {
      console.log("   ✅ Connected to Supabase");
    }

    // Test 2: Check admin table structure
    console.log("2. Checking admin table...");
    const { data: admins, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .limit(5);

    if (adminError) {
      console.error("   ❌ Admin table error:", adminError);
    } else {
      console.log("   ✅ Admin table accessible");
      console.log("   📊 Found", admins?.length || 0, "admins in database");

      if (admins && admins.length > 0) {
        console.log(
          "   📋 Sample admin data:",
          JSON.stringify(admins[0], null, 2),
        );
      } else {
        console.log("   ⚠️  No admins found in database");
      }
    }

    // Test 3: Check auth users
    console.log("3. Checking auth users...");
    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.log(
        "   ⚠️  Cannot list auth users (might need different permissions)",
      );
    } else {
      console.log("   ✅ Auth users accessible");
      console.log("   📊 Found", users?.length || 0, "auth users");
    }
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testAuth();
