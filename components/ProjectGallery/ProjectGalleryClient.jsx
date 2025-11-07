"use client";

import React from "react";
import Image from "next/image";
import { useProjectImages } from "@/hooks/useProjectImages";

const ProjectGalleryClient = ({ projectId, projectTitle, className = "" }) => {
  const { projectImages, isLoading, isError } = useProjectImages(projectId);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className} scroll-reveal`}>
        <h3
          className="text-2xl font-bold mb-6 pl-3 border-l-4 border-opacity-70"
          style={{ color: "#333333", borderColor: "#6495EDB3" }}
        >
          Images de l'Impact
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md bg-gray-200 flex items-center justify-center animate-pulse"
            >
              <span className="text-gray-500 text-sm">Chargement...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`space-y-4 ${className} scroll-reveal`}>
        <h3
          className="text-2xl font-bold mb-6 pl-3 border-l-4 border-opacity-70"
          style={{ color: "#333333", borderColor: "#6495EDB3" }}
        >
          Images de l'Impact
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-600">Erreur lors du chargement des images.</p>
        </div>
      </div>
    );
  }

  // Filter out invalid images and get up to 6 images
  const validImages = projectImages
    ? projectImages
        .map((img) => {
          // Remove surrounding quotes if they exist
          const url = img.image_url ? img.image_url.replace(/^"|"$/g, "") : "";
          return url;
        })
        .filter(
          (url) =>
            url &&
            typeof url === "string" &&
            url.trim() !== "" &&
            (url.startsWith("http") || url.startsWith("/")),
        )
        .slice(0, 6)
    : [];

  return (
    <div className={`space-y-4 ${className} scroll-reveal`}>
      <h3
        className="text-2xl font-bold mb-6 pl-3 border-l-4 border-opacity-70"
        style={{ color: "#333333", borderColor: "#6495EDB3" }}
      >
        Images de l'Impact
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {validImages.length > 0
          ? validImages.map((imageSrc, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md group transition duration-300 hover:scale-[1.02] hover:shadow-xl scroll-reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Image
                  src={imageSrc}
                  alt={`${projectTitle} photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6495ED1A" }}
                ></div>
              </div>
            ))
          : Array.from({ length: Math.min(6, 3) }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md bg-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-500 text-sm">
                  Image non disponible
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ProjectGalleryClient;
