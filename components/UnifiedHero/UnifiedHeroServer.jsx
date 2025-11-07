import UnifiedHero from "../UnifiedHero";

/**
 * Static component for the UnifiedHero (no server-side data fetching)
 */
export default function UnifiedHeroServer({ title, subtitle }) {
  // Mock images for static rendering
  const mockImages = [
    "/placeholder-hero1.jpg",
    "/placeholder-hero2.jpg",
    "/placeholder-hero3.jpg",
  ];

  // Pass props to the client component with mock images
  return <UnifiedHero title={title} subtitle={subtitle} images={mockImages} />;
}
