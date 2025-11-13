"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal/ImageModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { preloadCriticalImages } from "@/lib/preloadUtils";

/**
 * Replacement for ProjectGallery, simple image grid with hover effect and modal.
 */
const ProjectGallery = ({ images, projectTitle, className = "" }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  });

  // Memoize cleaned and validated images to prevent unnecessary re-processing
  const processedImages = useMemo(() => {
    console.log("ProjectGallery processing images:", {
      inputImages: images,
      inputLength: images?.length || 0
    });

    if (!Array.isArray(images)) {
      console.warn("ProjectGallery: images prop is not an array", images);
      return [];
    }

    const result = images
      .map((imageSrc, index) => {
        if (!imageSrc || typeof imageSrc !== "string") {
          console.warn(`ProjectGallery: invalid image source at index ${index}:`, imageSrc);
          return null;
        }
        const cleanUrl = imageSrc.replace(/^"|"$/g, "");
        const isValid = cleanUrl && (cleanUrl.startsWith("http") || cleanUrl.startsWith("/"));
        console.log(`ProjectGallery: processing image ${index}:`, {
          original: imageSrc,
          cleaned: cleanUrl,
          valid: isValid
        });
        return isValid ? cleanUrl : null;
      })
      .filter(Boolean);

    console.log("ProjectGallery: final processed images:", result);
    return result;
  }, [images]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle image load completion
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  // Handle image load errors
  const handleImageError = (index) => {
    setImageErrors((prev) => new Set([...prev, index]));
  };

  // Preload critical images when component mounts and becomes visible
  useEffect(() => {
    if (hasIntersected && processedImages.length > 0) {
      // Preload first 3 images immediately
      const criticalImages = processedImages.slice(0, 3);
      preloadCriticalImages(criticalImages);
    }
  }, [hasIntersected, processedImages]);

  // Check if all images are loaded
  useEffect(() => {
    const totalValidImages = processedImages.length;
    const loadedCount = loadedImages.size;
    const errorCount = imageErrors.size;

    if (loadedCount + errorCount >= totalValidImages && totalValidImages > 0) {
      setIsLoading(false);
    }
  }, [loadedImages, imageErrors, processedImages.length]);

  return (
    <>
      <div ref={ref} className={`space-y-4 ${className} scroll-reveal`}>
        <h3
          className="text-2xl font-bold mb-6 pl-3 border-l-4 border-opacity-70"
          style={{ color: "#333333", borderColor: "#6495EDB3" }} // B3 is 70% opacity
        >
          Images de l'Impact
        </h3>
        {isLoading && hasIntersected && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 transition-opacity duration-500 ${hasIntersected ? "opacity-100" : "opacity-0"}`}
        >
          {processedImages.map((imageSrc, index) => {
            const hasError = imageErrors.has(index);
            const isLoaded = loadedImages.has(index);

            if (hasError) {
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-md bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-gray-500 text-sm">
                    Image non disponible
                  </span>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`relative aspect-square rounded-xl overflow-hidden shadow-md group transition duration-300 hover:scale-[1.02] hover:shadow-xl scroll-reveal cursor-pointer ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transition: "opacity 0.5s ease-in-out",
                }}
                onClick={() => openModal(index)}
              >
                <Image
                  src={imageSrc}
                  alt={`${projectTitle} photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  quality={80}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  style={{ objectFit: "cover" }}
                  className="transition duration-300 group-hover:scale-105"
                  priority={index < 3} // First 3 images eager, rest lazy
                  loading={index < 3 ? "eager" : "lazy"}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
                {/* Use inline style for hover overlay background color */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6495ED1A" }} // 1A is 10% opacity
                ></div>
              </div>
            );
          })}
        </div>

        <ImageModal
          isOpen={modalOpen}
          onClose={closeModal}
          images={processedImages}
          currentIndex={currentImageIndex}
          onNext={nextImage}
          onPrevious={previousImage}
          projectTitle={projectTitle}
        />
      </div>
    </>
  );
};

export default ProjectGallery;
