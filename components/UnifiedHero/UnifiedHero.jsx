"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

// --- Sub-Components (Concise & Grouped) ---

// 1. Animated Background Pattern
const BackgroundPattern = () => (
  <div className="absolute inset-0 opacity-15" aria-hidden="true">
    {[20, 50, 80, 45, 70, 95].map((top, i) => (
      <div
        key={i}
        className={`absolute bg-white rounded-full animate-pulse-slow`}
        style={{
          top: `${top}%`,
          left: `${i * 15}%`,
          width: `${10 + i * 2}px`,
          height: `${10 + i * 2}px`,
          animationDelay: `${i * 0.5}s`,
          filter: "blur(1px)",
        }}
      />
    ))}
  </div>
);

// 2. Decorative Icons - Removed as requested

// 3. Scroll Indicator
const ScrollIndicator = () => (
  <div
    className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-80 animate-bounce transition-opacity duration-500"
    aria-hidden="true"
  >
    <ChevronDown className="w-6 h-6 text-white" />
  </div>
);

// 4. Background Image Slideshow
const BackgroundSlideshow = ({ images, currentIndex }) => {
  if (!images || images.length === 0) return null;

  console.log(
    "BackgroundSlideshow images:",
    images,
    "currentIndex:",
    currentIndex,
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => {
        // Clean image URL if it has quotes
        const cleanImage =
          typeof image === "string" ? image.replace(/^"|"$/g, "") : image;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <Image
              src={cleanImage}
              alt=""
              fill
              priority={index === 0} // Priority load first image
              quality={90} // Updated to match next.config.js default
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
            />
          </div>
        );
      })}
      {/* Overlay for better text readability with custom or default blue background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(176, 224, 230, 0.7), rgba(100, 149, 237, 0.7))",
        }}
      />
    </div>
  );
};

// --- Main Component ---

/**
 * UnifiedHero Component
 * Enhanced hero section with background image slideshow based on AboutHeader design.
 * Features automatic image transitions, gradient overlay, staggered text animations, decorative icons, and scroll indicator.
 * If no images are provided, randomly selects up to 10 project images for slideshow.
 *
 * @param {string} title - The main heading text
 * @param {string} subtitle - The subtitle text
 * @param {string[]} [images] - Array of background image URLs for slideshow
 * @param {string} [overlayColor] - Custom overlay color (e.g., "rgba(100, 149, 237, 0.7)")
 * @returns {JSX.Element} The rendered hero component
 */
const UnifiedHero = ({ title, subtitle, images = [], overlayColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { projects, isLoading } = useProjects();

  // Add prop validation and default values
  const safeTitle = title || "Assalam - Ensemble pour un avenir meilleur";
  const safeSubtitle =
    subtitle ||
    "Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc.";
  const words = safeTitle.split(" ");

  // Generate random images from projects if none provided - memoized to avoid regeneration
  const randomImages = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    // Collect all project images
    const allImages = [];
    projects.forEach((project) => {
      if (project.project_images && project.project_images.length > 0) {
        project.project_images.forEach((img) => {
          if (img.image_url) {
            const cleanUrl = img.image_url.replace(/^"|"$/g, "");
            if (
              cleanUrl &&
              (cleanUrl.startsWith("http") || cleanUrl.startsWith("/"))
            ) {
              allImages.push(cleanUrl);
            }
          }
        });
      }
      // Also include main project image
      if (project.image) {
        const cleanUrl = project.image.replace(/^"|"$/g, "");
        if (
          cleanUrl &&
          (cleanUrl.startsWith("http") || cleanUrl.startsWith("/"))
        ) {
          allImages.push(cleanUrl);
        }
      }
    });

    // Shuffle and take up to 10 random images
    const shuffled = allImages.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [projects]); // Only recalculate when projects change

  // Determine which images to use
  const displayImages = images && images.length > 0 ? images : randomImages;
  console.log("UnifiedHero displayImages:", displayImages);

  // Optimized preloading: preload next image only
  useEffect(() => {
    if (displayImages && displayImages.length > 1) {
      const nextIndex = (currentIndex + 1) % displayImages.length;
      const nextImage = displayImages[nextIndex];

      // Only preload the next image to reduce initial load
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = nextImage;
      document.head.appendChild(link);

      // Clean up after some time
      setTimeout(() => {
        document.head.removeChild(link);
      }, 5000);
    }
  }, [displayImages, currentIndex]);

  // Automatic slideshow transitions
  useEffect(() => {
    if (displayImages && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1,
        );
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [displayImages]);

  const hasImages = displayImages && displayImages.length > 0;

  return (
    <header
      className="relative h-screen overflow-hidden shadow-2xl bg-blue-50"
      style={{
        background: hasImages
          ? undefined // Use background images
          : "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 50%, #6495ED 100%)",
        minHeight: "100vh",
      }}
      role="banner"
    >
      {/* Background Slideshow or Gradient */}
      {hasImages ? (
        <BackgroundSlideshow
          images={displayImages}
          currentIndex={currentIndex}
        />
      ) : null}

      {/* Custom Keyframes for Staggered Animation - Moved to globals.css */}

      {/* 1. Animated Background */}
      <BackgroundPattern />

      {/* 2. Main Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center justify-center h-full">
        {/* Main Title (Enhanced Staggered Reveal) */}
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight text-white"
          aria-label={safeTitle}
        >
          {words.map((word, index) => (
            <span
              key={index}
              className={`mx-1 inline-block transition-transform duration-300 hover:scale-105 ${
                index % 2 === 0 ? "text-white drop-shadow-lg" : "text-blue-900"
              }`}
              style={{
                // Apply the staggered animation using the custom keyframe
                animation: `stagger-fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + index * 0.1}s both`,
                textShadow:
                  index % 2 === 0 ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle (Simplified and Inlined) */}
        <div className="max-w-3xl mx-auto">
          <p
            className="text-lg md:text-xl text-blue-900 font-medium leading-relaxed opacity-0"
            style={{ animation: "stagger-fade-in 0.8s ease-out 1.2s forwards" }}
          >
            {safeSubtitle}
          </p>

          {/* Decorative separator line */}
          <div
            className="w-16 h-1 mt-6 bg-white mx-auto rounded-full shadow-md opacity-0"
            style={{ animation: "stagger-fade-in 0.8s ease-out 1.4s forwards" }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 3. Scroll Indicator */}
      <ScrollIndicator />
    </header>
  );
};

export default UnifiedHero;
