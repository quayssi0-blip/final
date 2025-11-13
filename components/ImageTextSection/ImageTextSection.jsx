import React from "react";
import Image from "next/image";

const ImageTextSection = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  features,
  buttonText,
  buttonHref,
  imagePosition = "right",
}) => (
  <section className="relative h-full py-12 px-6 overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30">
    {/* Enhanced background pattern with better visual hierarchy */}
    <div className="absolute inset-0 opacity-10 rounded-lg overflow-hidden pointer-events-none">
      <div className="absolute top-8 left-12 w-40 h-40 rounded-full border-2 border-blue-300/50 bg-blue-100/10"></div>
      <div className="absolute bottom-16 right-16 w-32 h-32 rounded-full border-2 border-indigo-300/50 bg-indigo-100/10"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full border-2 border-purple-300/50 bg-purple-100/10"></div>
      <div className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full border-2 border-cyan-300/50 bg-cyan-100/10"></div>
    </div>

    <div className="max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Text Content - Left Side */}
        <div className="space-y-6 order-1 text-left">
          {/* Section Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: "#6495ED" }}
            >
              POUR L'AUTONOMIE ET LA DIGNITÉ
            </span>
          </div>

          {/* Main Title */}
          <div className="relative">
            <h2 className="text-2xl lg:text-4xl font-bold leading-tight text-blue-700 relative z-10">
              {title}
            </h2>
            <div className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </div>

          {/* Subtitle */}
          <div
            className="text-sm leading-relaxed"
            style={{ color: "#666666" }}
          >
            {subtitle}
          </div>

          {/* Features List */}
          {features && features.length > 0 && (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 bg-green-600 w-2 h-2 rounded-full mt-3"></div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#555555" }}
                  >
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href={buttonHref}
              className="inline-flex items-center px-8 py-4 rounded-full font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {buttonText}
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Image Section - Right Side */}
        <div className="order-2 flex justify-center lg:justify-end">
          {imageSrc ? (
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105">
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-indigo-600/30 z-10 hover:from-blue-700/40 hover:via-purple-700/30 hover:to-indigo-700/40 transition-all duration-500"></div>

                <Image
                  src={imageSrc}
                  alt={imageAlt || "Image"}
                  width={600}
                  height={400}
                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  className="transition-transform duration-700 hover:scale-110"
                />

                {/* Enhanced Border with Glow Effect */}
                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none shadow-inner"></div>

                {/* Subtle Inner Shadow */}
                <div className="absolute inset-0 shadow-inner rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          ) : (
            <div className="w-full h-80 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-500 shadow-lg">
              Image Placeholder
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default ImageTextSection;
