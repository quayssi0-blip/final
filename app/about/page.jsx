import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  BarChart,
  Users,
  Zap,
  Compass,
  CheckCircle,
  Award,
  Clock,
  Lightbulb,
  Wrench,
} from "lucide-react";

// Import extracted components
import Container from "@/components/Container/Container.jsx";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero.jsx";
import SectionWithBackground from "@/components/SectionWithBackground/SectionWithBackground.jsx";
import ImageTextSectionAbout from "@/components/ImageTextSection/ImageTextSectionAbout.jsx";
import StatsCard from "@/components/StatsCard/StatsCard.jsx";
import MissionVisionCard from "@/components/MissionVisionCard/MissionVisionCard.jsx";
import ValueCard from "@/components/ValueCard/ValueCard.jsx";
import PartnershipCard from "@/components/PartnershipCard/PartnershipCard.jsx";
import TeamMemberCard from "@/components/TeamMemberCard/TeamMemberCard.jsx";
import {
  TimelineAbout,
  TimelineItemAbout,
  TimelineTimeAbout,
  TimelineTitleAbout,
  TimelineDescriptionAbout,
} from "@/components/Timeline/TimelineAbout.jsx";

// --- Design System Configuration (Minimalist Light Blue) ---
// Note: Using constants for colors and inline styles to avoid Tailwind JIT issues
const ACCENT = "#6495ED"; // CTimelineornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

const partnershipsData = [
  {
    name: "Centre Himaya",
    logo: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/markaz_himaya.png",
    description:
      "Centre spécialisé dans l'accompagnement des femmes et familles en difficulté.",
  },
  {
    name: "l'Initiative Nationale pour le Développement Humain",
    logo: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/mobadara.jpeg",
    description:
      "Programme gouvernemental pour le développement humain et social au Maroc.",
  },
  {
    name: "Direction Provinciale Anfa",
    logo: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/niyabat_anfa.jpg",
    description:
      "Direction provinciale chargée du développement social dans la province d'Anfa.",
  },
  {
    name: "Entraide Nationale",
    logo: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/ta3awon_lwatani.png",
    description:
      "Partenaire pour la certification officielle des diplômes de formation professionnelle (Couture et Pâtisserie).",
  },
];

export default function AboutUs() {
  const impactStats = [
    {
      title: "Sections Opérationnelles",
      description:
        "Notre réseau national compte plus de 36 sections engagées dans les communautés locales à travers le Royaume.",
      value: "36+",
    },
    {
      title: "Bénéficiaires du programme Kafala",
      description:
        "Enfants et orphelins bénéficiant d'un soutien éducatif, social et médical complet pour s'épanouir.",
      value: "6,000+",
    },
    {
      title: "Personnes touchées chaque année",
      description:
        "Familles vulnérables, femmes et étudiants impactés positivement par nos projets d'autonomisation.",
      value: "10,000+",
    },
  ];

  const values = [
    {
      title: "Solidarité",
      description:
        "Nous sommes unis par un esprit d'entraide profonde pour soutenir les plus démunis et avancer ensemble, dans la compassion.",
      borderColor: "blue",
    },
    {
      title: "Autonomisation",
      description:
        "Notre action vise à donner aux femmes et aux jeunes les moyens de devenir acteurs de leur propre avenir (Empowerment).",
      borderColor: "green",
    },
    {
      title: "Dignité",
      description:
        "Assurer le respect de chaque individu, en offrant une assistance qui préserve l'honneur et l'estime de soi.",
      borderColor: "blue",
    },
    {
      title: "Éducation",
      description:
        "Clé de l'émancipation, nous la soutenons de l'enfance (Rihana) à l'insertion professionnelle (Imtiaz).",
      borderColor: "green",
    },
    {
      title: "Compassion",
      description:
        "Une approche humaine et chaleureuse guide toutes nos interactions et décisions envers les communautés.",
      borderColor: "blue",
    },
    {
      title: "Durabilité",
      description:
        "Nos projets sont conçus pour avoir un impact positif durable sur les communautés et l'environnement marocain.",
      borderColor: "green",
    },
  ];

  return (
    // Main background set with inline style
    <div style={{ backgroundColor: BACKGROUND }}>
      {/* Header Section */}
      <UnifiedHero
        title="À Propos de Nous"
        subtitle="Découvrez l'histoire, la mission d'espoir et les valeurs de solidarité de la Fondation Assalam, créée en 1992."
      />

      <Container className="py-16 px-6 space-y-16">
        {/* Notre Histoire */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <ImageTextSectionAbout
            title="Notre Histoire"
            content={
              <>
                <p className="mb-4">
                  Fondée en **1992** au Maroc, la Fondation Assalam est née
                  d'une volonté profonde de **solidarité** et d'**entraide**.
                  Nos premières initiatives locales visaient à améliorer les
                  conditions de vie des familles les plus vulnérables. L'ONG a
                  rapidement pris de l'ampleur en s'appuyant sur l'engagement de
                  bénévoles.
                </p>
                <p>
                  Aujourd'hui, avec plus de **36 sections** à travers le
                  Royaume, nous nous engageons dans l'autonomisation des femmes,
                  l'éducation des enfants, et le soutien aux étudiants
                  brillants, transformant chaque défi en une opportunité de
                  dignité et d'autonomie.
                </p>
              </>
            }
            imageSrc="https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/projects/Nadi/DSC07549.JPG"
            imageAlt="Histoire de la fondation Assalam"
            layout="image-left"
          />
        </div>

        {/* Timeline Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl border border-white/50">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-blue-600">
                Les Étapes de Notre Engagement
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
                Découvrez les étapes clés qui ont marqué le parcours de la
                Fondation Assalam pour le Développement Social.
              </p>
            </div>

            <TimelineAbout>
              <TimelineItemAbout index={0} icon="Users" position="left">
                <TimelineTimeAbout>1992</TimelineTimeAbout>
                <TimelineTitleAbout>
                  Création de la Fondation Assalam au Maroc.
                </TimelineTitleAbout>
                <TimelineDescriptionAbout>
                  Lancement de l'organisation caritative nationale marocaine,
                  reposant sur le volontariat et la solidarité.
                </TimelineDescriptionAbout>
              </TimelineItemAbout>

              <TimelineItemAbout index={1} icon="BarChart" position="right">
                <TimelineTimeAbout>2010</TimelineTimeAbout>
                <TimelineTitleAbout>Expansion Nationale</TimelineTitleAbout>
                <TimelineDescriptionAbout>
                  La Fondation étend sa présence avec de nouvelles sections pour
                  couvrir davantage de régions vulnérables du Royaume.
                </TimelineDescriptionAbout>
              </TimelineItemAbout>

              <TimelineItemAbout index={2} icon="Lightbulb" position="left">
                <TimelineTimeAbout>2018</TimelineTimeAbout>
                <TimelineTitleAbout>
                  Lancement des Programmes d'Autonomisation des Femmes
                </TimelineTitleAbout>
                <TimelineDescriptionAbout>
                  Inauguration de centres comme Fataer Al Baraka et Nadi Assalam
                  pour l'autonomie économique durable.
                </TimelineDescriptionAbout>
              </TimelineItemAbout>

              <TimelineItemAbout index={3} icon="Wrench" position="right">
                <TimelineTimeAbout>2025</TimelineTimeAbout>
                <TimelineTitleAbout>
                  Transition Numérique & Lancement de la Nouvelle Plateforme
                </TimelineTitleAbout>
                <TimelineDescriptionAbout>
                  Lancement de la nouvelle plateforme web Next.js pour optimiser
                  la transparence et l'impact social.
                </TimelineDescriptionAbout>
              </TimelineItemAbout>
            </TimelineAbout>
          </div>
        </div>

        {/* Notre Mission et Vision */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 rounded-xl shadow-lg">
          <Container className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">
              Notre Mission et Vision
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <MissionVisionCard
                type="mission"
                title="Notre Mission"
                description="Notre mission est d'améliorer les conditions de vie des individus et des familles vulnérables au Maroc. Nous agissons pour leur **bien-être, leur dignité** et leur **autonomie** à travers des initiatives d'éducation, de solidarité et d'**autonomisation économique**."
              />

              <MissionVisionCard
                type="vision"
                title="Notre Vision"
                description="Nous aspirons à un Maroc où chaque citoyen, en particulier les **femmes et les enfants**, peut vivre avec **dignité, autonomie et espoir**. Nous croyons en un développement inclusif, durable et centré sur l'être humain."
              />
            </div>
          </Container>
        </div>

        {/* Impact Section */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">
              Notre Impact et Notre Rayonnement
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
              Grâce à votre soutien constant et l'engagement de nos bénévoles,
              nous avons pu transformer des vies et bâtir un avenir meilleur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-6">
            {impactStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
              />
            ))}
          </div>
        </div>

        {/* Nos Valeurs */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <Container>
            <h2 className="text-3xl font-bold mb-10 text-center text-blue-600">
              Nos Valeurs Fondatrices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  title={value.title}
                  description={value.description}
                  borderColor={value.borderColor}
                />
              ))}
            </div>
          </Container>
        </div>

        {/* Partnerships Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl border border-white/50">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-blue-600">
                Nos Partenaires de Confiance
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
                Nous collaborons avec des fondations et organisations engagées
                pour maximiser notre impact social et éducatif.
              </p>
            </div>

            <div className="grid max-w-6xl grid-cols-1 px-20 mx-auto mt-12 text-center sm:px-0 sm:grid-cols-2 md:mt-20 gap-x-8 md:grid-cols-4 gap-y-12 lg:gap-x-16 xl:gap-x-20">
              {partnershipsData.map((partner, index) => (
                <PartnershipCard
                  key={index}
                  name={partner.name}
                  logo={partner.logo}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notre Équipe */}
        <div className="bg-blue-50 py-16 rounded-xl">
          <Container>
            <h2 className="text-3xl font-bold mb-10 text-center text-blue-600">
              Notre Équipe Dévouée
            </h2>

            <div className="grid max-w-6xl grid-cols-1 px-20 mx-auto mt-12 text-center sm:px-0 sm:grid-cols-2 md:mt-20 gap-x-8 md:grid-cols-4 gap-y-12 lg:gap-x-16 xl:gap-x-20">
              <TeamMemberCard
                name="Mme. Fatema Zahra Alami"
                role="Présidente de la Fondation"
                imageSrc={`/placeholder.svg?height=300&width=300`}
                imageAlt="Mme. Fatema Zahra Alami - Présidente de la Fondation"
                linkedin="#"
                email="fatema.alami@fondation-assalam.ma"
                phone="+212-XXX-XXX-XXX"
              />

              <TeamMemberCard
                name="M. Youssef El Mansouri"
                role="Directeur Général"
                imageSrc={`/placeholder.svg?height=300&width=300`}
                imageAlt="M. Youssef El Mansouri - Directeur Général"
                linkedin="#"
                email="youssef.elmansouri@fondation-assalam.ma"
                phone="+212-XXX-XXX-XXX"
              />

              <TeamMemberCard
                name="Mme. Samira El Fassi"
                role="Chef des Opérations Sociales"
                imageSrc={`/placeholder.svg?height=300&width=300`}
                imageAlt="Mme. Samira El Fassi - Chef des Opérations Sociales"
                linkedin="#"
                email="samira.elfassi@fondation-assalam.ma"
                phone="+212-XXX-XXX-XXX"
              />

              <TeamMemberCard
                name="M. Karim Bennani"
                role="Chef de la Transformation Numérique"
                imageSrc={`/placeholder.svg?height=300&width=300`}
                imageAlt="M. Karim Bennani - Chef de la Transformation Numérique"
                linkedin="#"
                email="karim.bennani@fondation-assalam.ma"
                phone="+212-XXX-XXX-XXX"
              />
            </div>

            {/* Decorative separator */}
            <div className="mt-16">
              <svg
                className="w-auto h-4 mx-auto text-gray-300"
                viewBox="0 0 172 16"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 11 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 46 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 81 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 116 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 151 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 18 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 53 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 88 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 123 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 158 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 25 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 60 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 95 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 130 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 165 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 32 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 67 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 102 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.9447 137 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 172 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 39 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 74 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 109 1)"
                />
                <line
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform="matrix(-0.5547 0.83205 0.83205 0.5547 144 1)"
                />
              </svg>
            </div>
          </Container>
        </div>
      </Container>
    </div>
  );
}
