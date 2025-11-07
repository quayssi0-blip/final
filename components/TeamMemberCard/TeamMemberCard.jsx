"use client";

import React, { useState } from "react";
import Image from "next/image";

const TeamMemberCard = ({
  name,
  role,
  imageSrc,
  imageAlt,
  linkedin,
  email,
  phone,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden text-center animate-fade-in"
      style={{
        borderBottom: `4px solid #6495ED`,
        animation: `fadeIn 0.8s ease-out forwards`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-blue-200 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-blue-200 rounded-full"></div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
          style={{ objectFit: "cover" }}
          className="grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <h4
          className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-blue-600"
          style={{ color: "#333333" }}
        >
          {name}
        </h4>
        <p
          className="text-sm font-medium leading-relaxed transition-colors duration-300"
          style={{ color: isHovered ? "#6495ED" : "#666666" }}
        >
          {role}
        </p>

        {/* Decorative line */}
        <div
          className={`w-12 h-0.5 mx-auto mt-4 transition-all duration-500 ${isHovered ? "bg-blue-500 w-16" : "bg-gray-300"}`}
        ></div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
