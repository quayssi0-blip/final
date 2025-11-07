import { notFound } from "next/navigation";

// Content builder components
import ContentBlock from "@/components/blocks/ContentBlock.jsx";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Alert from "@/components/Alert/Alert";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero";
import StyledProjectInfoCard from "@/components/StyledProjectInfoCard/StyledProjectInfoCard";
import ProjectContentSection from "@/components/ProjectContentSection/ProjectContentSection";
import ProjectGallery from "@/components/ProjectGallery/ProjectGallery";
import ProjectGalleryClient from "@/components/ProjectGallery/ProjectGalleryClient";
import ProjectSidebar from "@/components/ProjectSidebar/ProjectSidebar";
import { CalendarDays, MapPin, Users, Award, Target } from "lucide-react";
import { ProjectsController } from "@/lib/controllers/projects";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White (used for UI background)
const MUTED_TEXT = "#767676"; // Dusty Gray (used for secondary/muted text)

// --- Original Logic Preservation ---

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const project = await ProjectsController.getProjectBySlug(slug);
    if (!project) {
      return {
        title: "Projet non trouvé | Fondation Assalam",
        description: "Le projet demandé n'existe pas.",
      };
    }

    return {
      title: `${project.title} | Fondation Assalam`,
      description:
        project.excerpt || "Découvrez nos projets d'impact social au Maroc",
    };
  } catch (error) {
    return {
      title: `Projet | Fondation Assalam`,
      description: "Découvrez nos projets d'impact social au Maroc",
    };
  }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;

  const project = await ProjectsController.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectInfo = [
    {
      type: "date",
      label: "Date de lancement",
      value: project?.start_date
        ? new Date(project.start_date).toLocaleDateString("fr-FR")
        : "N/A",
      icon: CalendarDays,
    }, // Enhanced & Fixed Content
    {
      type: "location",
      label: "Localisation",
      value: project?.location || "N/A",
      icon: MapPin,
    }, // Fixed Content
    {
      type: "people",
      label: "Vies impactées",
      value: project?.people_helped ? `${project.people_helped}+` : "N/A",
      icon: Users,
    }, // Enhanced & Fixed Content
    {
      type: "status",
      label: "Étape actuelle",
      value: project?.status || "Actif",
      icon: Award,
    }, // Enhanced & Fixed Content
  ];

  return (
    // Main background fix
    <main className="min-h-screen" style={{ backgroundColor: BACKGROUND }}>
      {/* 1. Hero Section (Styled with constants) */}
      <UnifiedHero
        title={project.title}
        subtitle={project.excerpt}
        overlayColor="rgba(100, 149, 237, 0.6)" // Blue overlay for individual projects
        images={[
          project.image || "/projects/foundation1.jpg",
          ...(project.project_images
            ?.slice(0, 3)
            .map((img) => img.image_url.replace(/^"|"$/g, "")) || [
            "/projects/foundation2.jpg",
            "/projects/foundation3.jpg",
          ]),
        ]}
      />

      <Container className="pb-20">
        {/* 2. Project Info Cards (Styled with constants) */}
        <section className="mb-16 -mt-20 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectInfo.map((item, index) => (
              <StyledProjectInfoCard
                key={item.type}
                label={item.label}
                value={item.value}
                icon={item.icon}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* 3. Main Content & Sidebar Grid */}
        <section className="grid md:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-12">
            {/* Dynamic Content Rendering using Content Builder */}
            <ProjectContentSection
              title="Le Récit de notre Action"
              className="scroll-reveal"
            >
              <div className={`text-lg space-y-8`} style={{ color: DARK_TEXT }}>
                {project.content && project.content.length > 0 ? (
                  project.content.slice(0, 1).map((block, index) => (
                    <ContentBlock
                      key={block.id || index}
                      block={block}
                      index={index}
                      contentTypes={[]} // Not needed for display-only mode
                      updateContentBlock={() => {}} // Not needed for display-only mode
                      removeContentBlock={() => {}} // Not needed for display-only mode
                      handleDragStart={() => {}} // Not needed for display-only mode
                      handleDragOver={() => {}} // Not needed for display-only mode
                      handleDrop={() => {}} // Not needed for display-only mode
                    />
                  ))
                ) : (
                  <p style={{ color: MUTED_TEXT }}>
                    Aucun contenu détaillé n'est disponible pour ce projet.
                  </p>
                )}
              </div>
              {/* Goals Block - Subtle Background with Accent List Markers (Content Card Style) */}
              {project.goals && project.goals.length > 0 && (
                <div
                  className={`mt-8 p-6 rounded-xl border shadow-inner scroll-reveal`}
                  // FIX: Replaced border-gray-100 with PRIMARY_LIGHT
                  style={{
                    backgroundColor: `${PRIMARY_LIGHT}80`,
                    borderColor: PRIMARY_LIGHT,
                  }}
                >
                  {/* FIX: Replaced border-gray-100 with PRIMARY_LIGHT */}
                  <h3
                    className={`text-xl font-bold mb-4 border-b pb-2`}
                    style={{ color: ACCENT, borderColor: PRIMARY_LIGHT }}
                  >
                    <Target className="inline h-5 w-5 mr-2 -mt-1" />
                    L'Horizon de l'Espoir (Nos Objectifs){" "}
                    {/* Enhanced Content */}
                  </h3>
                  <ul className="space-y-3">
                    {project.goals.map((goal, index) => (
                      <li
                        key={index}
                        className="flex items-start"
                        style={{ color: MUTED_TEXT }}
                      >
                        {/* Accent Colored Marker */}
                        <div
                          className={`text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-4 text-sm font-bold shadow-md`}
                          style={{ backgroundColor: ACCENT }}
                        >
                          {index + 1}
                        </div>
                        <p className="leading-relaxed">{goal}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ProjectContentSection>

            {/* Gallery Section */}
            <ProjectGalleryClient
              projectId={project.id}
              projectTitle={project.title}
              className="mt-12"
            />

            {/* Additional content blocks rendered as display-only */}
            {project.content &&
              project.content.length > 1 &&
              project.content.slice(1).map(
                (
                  block,
                  index, // Skip first block as it's already rendered above
                ) => (
                  <ContentBlock
                    key={block.id || `block-${index}`}
                    block={block}
                    index={index}
                    contentTypes={[]} // Not needed for display-only mode
                    updateContentBlock={() => {}} // Not needed for display-only mode
                    removeContentBlock={() => {}} // Not needed for display-only mode
                    handleDragStart={() => {}} // Not needed for display-only mode
                    handleDragOver={() => {}} // Not needed for display-only mode
                    handleDrop={() => {}} // Not needed for display-only mode
                  />
                ),
              )}
          </div>

          {/* Sidebar */}
          <ProjectSidebar
            projectTitle={project.title}
            slug={slug}
            targetAudience={
              project.content
                ?.filter((b) => b.type === "programme")
                ?.map((b) => b.content?.duration) || ["Communautés rurales"]
            } // Fixed Content
            facilities={
              project.content
                ?.filter((b) => b.type === "map")
                ?.map((b) => b.content?.address) || [
                "École construite",
                "Centre de santé",
              ]
            } // Fixed Content
          />
        </section>
      </Container>
    </main>
  );
}
