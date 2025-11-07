"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * Image Modal Component for displaying full-size images with navigation
 */
const ImageModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious,
  projectTitle,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const cleanUrl =
    currentImage && typeof currentImage === "string"
      ? currentImage.replace(/^"|"$/g, "")
      : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200"
        aria-label="Fermer"
      >
        <X size={24} />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200"
            aria-label="Image précédente"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200"
            aria-label="Image suivante"
          >
            ›
          </button>
        </>
      )}

      {/* Main image */}
      <div
        className="relative max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {cleanUrl ? (
          <Image
            src={cleanUrl}
            alt={`${projectTitle} - Image ${currentIndex + 1}`}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "90vh" }}
          />
        ) : (
          <div className="flex items-center justify-center w-96 h-96 bg-gray-800 rounded-lg">
            <span className="text-white">Image non disponible</span>
          </div>
        )}
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageModal;
