import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Placeholder */}
      <div className="h-[40vh] bg-gray-100 animate-pulse" />

      {/* Projects Grid Loading */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card Skeletons */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg h-80 animate-pulse"
              />
            ))}
          </div>
        </div>
        <LoadingSpinner />
      </div>
    </div>
  );
}
