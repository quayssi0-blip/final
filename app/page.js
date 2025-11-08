"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Regular imports for lightweight components
import Container from "@/components/Container/Container.jsx";
import SectionHeader from "@/components/SectionHeader/SectionHeader.jsx";
import ContentGrid from "@/components/ContentGrid/ContentGrid.jsx";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero.jsx";
import TestimonialCard from "@/components/TestimonialCard/TestimonialCard.jsx";
import ContentCard from "@/components/ContentCard/ContentCard.jsx";
import StatsCard from "@/components/StatsCard/StatsCard.jsx";

import ImageTextSection from "@/components/ImageTextSection/ImageTextSection.jsx";
import TimelineSection from "@/components/TimelineSection/TimelineSection";

// Custom hooks
import { useProjects } from "@/hooks/useProjects.js";
import { useBlogs } from "@/hooks/useBlogs.js";

// Design System Configuration
const DESIGN_SYSTEM = {
  spacing: {
    sectionPadding: "py-16 px-6",
  },
  typography: {
    h2: "text-2xl font-bold",
    body: "text-base",
  },
};

// Color constants (matching the design system)
const ACCENT_COLOR = "#6495ED"; // Cornflower Blue
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const ImageText = [
  "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/projects/Centre/IDC08872.JPG",
  "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/projects/Nadi/DSC07611.JPG",
  "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/projects/Kafala/Rentree%20scolaire/DSC06503.JPG",
];

/**
 * Enhanced Home page component with blueprint design system
 * @returns {JSX.Element} Enhanced home page
 */
export default function Home() {
  // Use custom hooks for data fetching
  const {
    projects: allProjects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects();
  const {
    blogs: allBlogs,
    isLoading: blogsLoading,
    isError: blogsError,
  } = useBlogs();

  // Transform projects data for ContentCard component
  const projects =
    allProjects?.slice(0, 3).map((project) => ({
      title: project.title,
      excerpt: project.excerpt,
      image: project.image || "/placeholder-project.jpg",
      link: `/projects/${project.slug}`,
    })) || [];

  // Transform blogs data for ContentCard component
  const blogs =
    allBlogs?.slice(0, 3).map((blog) => ({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      image: blog.image || "/placeholder-blog.jpg",
      slug: blog.slug,
      category: blog.category,
      createdAt: new Date(blog.created_at).toISOString().split("T")[0],
    })) || [];
  return (
    // FIX: Replace bg-background with inline style
    <div style={{ backgroundColor: "#FAFAFA" }}>
      {/* Hero Section - Blueprint pattern with primary-light background */}
      <UnifiedHero
        title="Assalam - Ensemble pour un avenir meilleur"
        subtitle="Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc."
      />

      <Container className="py-16 px-6 space-y-16">
        {/* Main Stats Section */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl border border-white/50 shadow-inner">
            <SectionHeader
              title="Nos Chiffres Clés"
              subtitle="L'impact mesuré de nos actions sur la société marocaine"
              titleClassName="text-blue-600"
              subtitleClassName="text-gray-600"
            />

            <div className="mt-16">
              <ContentGrid
                items={[
                  {
                    value: "6+",
                    title: "Projets Actifs",
                    description: "Initiatives actives à travers le Maroc",
                  },
                  {
                    value: "1000+",
                    title: "Bénéficiaires Aidés",
                    description: "Vies transformées par nos actions",
                  },
                  {
                    value: "98%",
                    title: "Taux de Satisfaction",
                    description: "Satisfaction de nos bénéficiaires",
                  },
                ]}
                columns={{ default: 1, md: 3 }}
                renderItem={(stat, index) => (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <StatsCard
                      value={stat.value}
                      title={stat.title}
                      description={stat.description}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white py-16 shadow-inner">
          <Container>
            <SectionHeader
              title="Nos Projets Principaux"
              subtitle="Découvrez nos initiatives principales qui transforment des vies à travers le Maroc"
              titleClassName="text-blue-600"
              subtitleClassName="text-gray-600"
            />

            <div className="mt-12">
              <ContentGrid
                items={projects}
                columns={{ default: 1, md: 2, lg: 3 }}
                renderItem={(project, index) => (
                  <ContentCard
                    key={project.id}
                    title={project.title}
                    excerpt={project.excerpt}
                    image={project.image}
                    link={project.link}
                    index={index}
                  />
                )}
              />
            </div>

            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                Voir tous les projets <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </Container>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 rounded-xl shadow-lg shadow-inner-2xl">
          <Container className="text-center">
            <ImageTextSection
              title="Pourquoi Nous Choisir"
              subtitle="Fondée en 1992, notre action s'ancre dans une **expertise locale** et une **transparence totale**. Nous créons des changements durables en investissant dans la **dignité** et l'**autonomie**."
              imageSrc={ImageText}
              imageAlt="Centre Himaya - Notre engagement pour la communauté"
              imagePosition="right"
              features={[
                "Une expérience de plus de **30 ans** au service de la solidarité nationale.",
                "Expertise locale et connaissance approfondie des besoins marocains.",
                "**Transparence totale** dans l'utilisation des fonds (valeur clé).",
                "Approche collaborative avec les communautés locales.",
                "Impact mesurable et suivi rigoureux des résultats.",
              ]}
              buttonText="En Savoir Plus sur notre Mission"
              buttonHref="/about"
            />
          </Container>
        </div>

        {/* Testimonials Section */}
        <div className="bg-blue-50 py-16 rounded-xl shadow-inner-2xl">
          <Container>
            <SectionHeader
              title="Témoignages de l'Impact"
              subtitle="Leurs mots, notre preuve : l'effet réel de la solidarité sur les vies"
              titleClassName="text-blue-600"
              subtitleClassName="text-gray-600"
            />

            <ContentGrid
              items={[
                {
                  name: "Amina El Mansouri",
                  role: "Bénéficiaire du projet Rayhana",
                  quote:
                    "Le projet **Rayhana** a été un tournant. J'ai retrouvé ma **dignité** et l'**autonomie** nécessaire pour bâtir un avenir stable pour mes enfants. C'est plus qu'une aide, c'est une nouvelle vie pleine d'espoir.",
                },
                {
                  name: "Karim Benali",
                  role: "Bénéficiaire du projet Imtiaz",
                  quote:
                    "**Imtiaz** a illuminé mon parcours. Il m'a permis de me concentrer sur mes études et de transformer la précarité en **opportunité**. Ce parrainage est la preuve que la **solidarité** peut changer un destin.",
                },
              ]}
              columns={{ default: 1, md: 2 }}
              renderItem={(testimonial) => (
                <TestimonialCard
                  key={testimonial.name}
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                />
              )}
            />
          </Container>
        </div>

        {/* Process Timeline Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 rounded-xl shadow-lg shadow-inner-2xl">
          <Container>
            <SectionHeader
              title="Notre Processus Simple"
              subtitle="Une approche claire et efficace pour réaliser nos projets"
              titleClassName="text-blue-600"
              subtitleClassName="text-gray-600"
            />

            <div className="mt-12">
              <TimelineSection />
            </div>
          </Container>
        </div>

        {/* Blog Section */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <Container>
            <SectionHeader
              title="Actualités & Blog"
              subtitle="Restez informé de nos dernières activités et nouvelles"
              titleClassName="text-blue-600"
              subtitleClassName="text-gray-600"
            />

            <ContentGrid
              items={blogs}
              columns={{ default: 1, md: 2, lg: 3 }}
              renderItem={(blog, index) => (
                <ContentCard
                  key={blog.id}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  image={blog.image}
                  link={`/blogs/${blog.slug}`}
                  category={blog.category}
                  date={blog.createdAt}
                  index={index}
                />
              )}
            />

            <div className="text-center mt-12">
              <Link
                href="/blogs"
                className="inline-flex items-center px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                Voir tous les articles <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </Container>
        </div>
      </Container>

      {/* CTA Section */}
      <section className="text-center bg-blue-600 text-white p-12 rounded-lg shadow-lg">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Devenez le Pilier de l'Espoir
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez notre mission de solidarité et créez un impact durable.
            Chaque don, chaque heure de bénévolat est un investissement direct
            dans la **dignité** et l'**autonomie** des communautés vulnérables
            au Maroc. Votre action crée un impact **durable**.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact?type=donation"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Faire un Don
            </Link>
            <Link
              href="/contact?type=volunteer"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Devenir Bénévole
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
