"use client";

import Container from "@/components/Container/Container";
import ContentCard from "@/components/ContentCard/ContentCard";
import ContentGrid from "@/components/ContentGrid/ContentGrid";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero";

// Custom hooks
import { useProjects } from "@/hooks/useProjects.js";

export default function ProjectsPage() {
  // Use custom hook for data fetching
  const { projects: allProjects, isLoading, isError } = useProjects();

  // Transform projects data for ContentCard component
  const projects =
    allProjects?.map((project) => {
      // Debug logging for each project
      console.log("Processing project:", {
        title: project.title,
        image: project.image,
        projectImagesCount: project.project_images?.length || 0,
        projectImages: project.project_images
      });

      return {
        title: project.title,
        excerpt: project.excerpt,
        image: project.image || "/placeholder-project.jpg",
        link: `/projects/${project.slug}`,
      };
    }) || [];

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <UnifiedHero
        title="Nos Projets"
        subtitle="Découvrez nos initiatives qui transforment des vies à travers le Maroc."
      />

      <Container className="py-16 px-6 space-y-16">
        {/* Main Projects Section */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl  border border-white/50">
            <SectionHeader
              title="Nos Projets Principaux"
              subtitle="Découvrez nos initiatives qui transforment des vies à travers le Maroc"
              size="small"
              centered={true}
              titleClassName="text-blue-600"
              subtitleClassName="text-gray-600"
            />

            <div className="mt-16">
              <ContentGrid
                items={projects}
                columns={{ default: 1, md: 2, lg: 3 }}
                renderItem={(project, index) => (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ContentCard
                      title={project.title}
                      excerpt={project.excerpt}
                      image={project.image}
                      link={project.link}
                      index={index}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Community Impact Section */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">
                  Impact Communautaire
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Nos projets ne se limitent pas à fournir des ressources, mais
                  visent également à renforcer les communautés locales. Grâce à
                  des initiatives collaboratives, nous créons des opportunités
                  durables pour les générations futures.
                </p>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Image placeholder</span>
              </div>
            </div>
          </Container>
        </div>

        {/* Transforming Lives Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 rounded-xl shadow-lg">
          <Container className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600 hover:text-blue-700 transition-colors duration-300">
              Transformer des Vies, Construire des Avenirs
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Nos initiatives majeures pour un développement durable et inclusif
              au Maroc
            </p>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-600">
                  Forage de Puits : L'Eau, Source de Vie
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Objectif : Briser la barrière de l'inaccessibilité à l'eau
                  potable dans les zones rurales isolées.
                </p>
                <ul className="text-gray-700 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Études géologiques approfondies pour localiser les nappes
                    phréatiques.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Construction de puits équipés de systèmes de pompage
                    modernes.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Formation des habitants pour assurer l'entretien et la
                    pérennité des installations.
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  Construction d'Écoles : L'Éducation, un Droit pour Tous
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Objectif : Offrir aux enfants des zones rurales un accès à une
                  éducation de qualité.
                </p>
                <ul className="text-gray-700 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Écoles primaires modernes, équipées en matériel pédagogique
                    adapté.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Programmes de sensibilisation pour encourager la
                    scolarisation,
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    en particulier des filles.
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-green-600">Puits forés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  25+
                </div>
                <div className="text-blue-600">Écoles construites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  10,000+
                </div>
                <div className="text-green-600">Enfants scolarisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">15</div>
                <div className="text-blue-600">Communautés rurales</div>
              </div>
            </div>
          </Container>
        </div>

        {/* Self-Sufficient Village Section */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">
                  Un Village Autosuffisant
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Le premier village orange au Maroc est un modèle innovant de
                  développement communautaire. Avec des infrastructures modernes
                  et des centres éducatifs, ce projet vise à autonomiser les
                  habitants des zones rurales.
                </p>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center md:order-1">
                <span className="text-gray-500">Image placeholder</span>
              </div>
            </div>
          </Container>
        </div>

        {/* Call to Action Section */}
        <section className="text-center bg-blue-600 text-white p-12 rounded-lg shadow-lg">
          <Container>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Rejoignez-Nous dans Cette Aventure Humanitaire
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Ensemble, nous pouvons transformer des vies, renforcer des
              communautés et apporter de l'espoir là où il est le plus
              nécessaire.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/contact?type=volunteer"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Devenir Bénévole
              </a>
            </div>
          </Container>
        </section>
      </Container>
    </div>
  );
}
