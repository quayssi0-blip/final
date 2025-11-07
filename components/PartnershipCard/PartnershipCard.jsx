"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, Building2, Users, Target } from "lucide-react";

const PartnershipCard = ({ name, logo, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative w-full h-64 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Flip Card Container */}
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Front of Card - Image */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-lg backface-hidden overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Background with subtle overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-50 opacity-20"></div>

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-6">
            {logo ? (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  style={{ objectFit: "contain" }}
                  className="p-4"
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-xl bg-gray-100 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Building2 size={50} style={{ color: "#9CA3AF" }} />
              </div>
            )}
          </div>
        </div>

        {/* Back of Card - Title */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl shadow-lg backface-hidden overflow-hidden rotate-y-180"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #6495ED 0%, #4169E1 100%)",
            }}
          ></div>

          {/* Content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <h3
              className="text-xl font-bold text-white mb-4 leading-tight"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipCard;
