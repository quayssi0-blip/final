// Script de test pour vérifier les requêtes Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQueries() {
  console.log("🧪 Test des requêtes Supabase corrigées...\n");
  
  // Test 1: Requête sur la table messages
  console.log("1️⃣ Test de la table 'messages'...");
  try {
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
      
    if (messagesError) {
      console.error("❌ Erreur sur messages:", messagesError);
    } else {
      console.log("✅ Messages récupérés:", messages?.length || 0, "enregistrements");
      if (messages && messages.length > 0) {
        console.log("   Structure d'un message:", Object.keys(messages[0]));
      }
    }
  } catch (err) {
    console.error("❌ Exception sur messages:", err.message);
  }
  
  console.log("\n" + "=".repeat(50) + "\n");
  
  // Test 2: Requête sur la table projects avec jointure
  console.log("2️⃣ Test de la table 'projects' avec project_images...");
  try {
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        id,
        slug,
        title,
        excerpt,
        image,
        categories,
        start_date,
        location,
        people_helped,
        status,
        content,
        goals,
        created_at,
        updated_at,
        project_images (
          id,
          image_url,
          alt_text
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5);
      
    if (projectsError) {
      console.error("❌ Erreur sur projects:", projectsError);
    } else {
      console.log("✅ Projects récupérés:", projects?.length || 0, "enregistrements");
      if (projects && projects.length > 0) {
        console.log("   Structure d'un projet:", Object.keys(projects[0]));
        console.log("   project_images:", projects[0].project_images?.length || 0, "images");
      }
    }
  } catch (err) {
    console.error("❌ Exception sur projects:", err.message);
  }
  
  console.log("\n" + "=".repeat(50) + "\n");
  
  // Test 3: Requête sur la table blog_posts
  console.log("3️⃣ Test de la table 'blog_posts'...");
  try {
    const { data: blogs, error: blogsError } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
      
    if (blogsError) {
      console.error("❌ Erreur sur blog_posts:", blogsError);
    } else {
      console.log("✅ Blog posts récupérés:", blogs?.length || 0, "enregistrements");
      if (blogs && blogs.length > 0) {
        console.log("   Structure d'un blog:", Object.keys(blogs[0]));
      }
    }
  } catch (err) {
    console.error("❌ Exception sur blog_posts:", err.message);
  }
}

// Exécuter les tests
testQueries()
  .then(() => {
    console.log("\n🎉 Tests terminés");
  })
  .catch((err) => {
    console.error("\n💥 Erreur lors des tests:", err);
    process.exit(1);
  });