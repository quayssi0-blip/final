"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Calendar, User, Tag, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";

// Sub-Components (inspired from UnifiedHero)

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

// 2. Scroll Indicator
const ScrollIndicator = () => (
  <div
    className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-80 animate-bounce transition-opacity duration-500"
    aria-hidden="true"
  >
    <ChevronDown className="w-6 h-6 text-white" />
  </div>
);

// 3. Background Image Slideshow
const BackgroundSlideshow = ({ images, currentIndex }) => {
  if (!images || images.length === 0) return null;

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
              priority={index === 0}
              quality={90}
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
      {/* Overlay for better text readability */}
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

// Main Component
const BlogHero = ({
  title,
  excerpt,
  image,
  author,
  category,
  date,
  tags,
  onBackUrl = "/blogs"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { projects, isLoading } = useProjects();

  // Generate random images from projects if no specific image provided
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
  }, [projects]);

  // Determine which images to use
  const displayImages = image ? [image] : randomImages;

  // Optimized preloading
  useEffect(() => {
    if (displayImages && displayImages.length > 1) {
      const nextIndex = (currentIndex + 1) % displayImages.length;
      const nextImage = displayImages[nextIndex];

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = nextImage;
      document.head.appendChild(link);

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
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [displayImages]);

  const hasImages = displayImages && displayImages.length > 0;

  return (
    <header
      className="relative h-screen overflow-hidden shadow-2xl bg-blue-50"
      style={{
        background: hasImages
          ? undefined
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

      {/* Animated Background Pattern */}
      <BackgroundPattern />

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 text-center">
        
        {/* Navigation */}
        <div
          className="mb-8 opacity-0"
          style={{ animation: "stagger-fade-in 0.8s ease-out 0.5s forwards" }}
        >
          <Link
            href={onBackUrl}
            className="inline-flex items-center gap-2 text-white hover:text-blue-200 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux articles
          </Link>
        </div>

        {/* Catégorie */}
        {category && (
          <div
            className="mb-6 opacity-0"
            style={{ animation: "stagger-fade-in 0.8s ease-out 0.8s forwards" }}
          >
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}

        {/* Titre (Enhanced Staggered Reveal like UnifiedHero) */}
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight text-white"
          aria-label={title}
        >
          {title.split(" ").map((word, index) => (
            <span
              key={index}
              className={`mx-1 inline-block transition-transform duration-300 hover:scale-105 ${
                index % 2 === 0 ? "text-white drop-shadow-lg" : "text-blue-900"
              }`}
              style={{
                animation: `stagger-fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + index * 0.1}s both`,
                textShadow:
                  index % 2 === 0 ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Excerpt (Simplified and Inlined) */}
        {excerpt && (
          <div className="max-w-3xl mx-auto">
            <p
              className="text-lg md:text-xl text-blue-900 font-medium leading-relaxed opacity-0"
              style={{ animation: "stagger-fade-in 0.8s ease-out 1.2s forwards" }}
            >
              {excerpt}
            </p>

            {/* Decorative separator line */}
            <div
              className="w-16 h-1 mt-6 bg-white mx-auto rounded-full shadow-md opacity-0"
              style={{ animation: "stagger-fade-in 0.8s ease-out 1.4s forwards" }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Métadonnées */}
        <div
          className="flex items-center justify-center gap-6 text-white mb-8 opacity-0"
          style={{ animation: "stagger-fade-in 0.8s ease-out 1.6s forwards" }}
        >
          {date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          
          {author && (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{author.name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div
            className="flex flex-wrap justify-center gap-2 opacity-0"
            style={{ animation: "stagger-fade-in 0.8s ease-out 1.8s forwards" }}
          >
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm"
                style={{
                  animation: `stagger-fade-in 0.8s ease-out ${2.0 + index * 0.1}s forwards`,
                }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </header>
  );
};

export default BlogHero;