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
  <section className="relative h-full py-16 px-6 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-blue-200"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full border border-blue-200"></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full border border-blue-200"></div>
    </div>

    <div className="max-w-7xl mx-auto relative">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Text Content - Left Side */}
        <div className="space-y-8 order-1 text-left">
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
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-blue-600">
              {title}
            </h2>
          </div>

          {/* Subtitle */}
          <div
            className="text-base leading-relaxed"
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
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              style={{ backgroundColor: "#6495ED" }}
            >
              {buttonText}
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
            <div className="relative w-full mr-4 max-w-md h-160 rounded-2xl overflow-hidden">
              {/* Top image - slightly right */}
              <div className="absolute top-0 right-4 w-3/4 h-5/12 rounded-lg overflow-hidden shadow-lg z-10">
                <Image
                  src={imageSrc[0]}
                  alt={imageAlt || "Image"}
                  fill
                  key={0}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* Middle image - left */}
              <div className="absolute top-1/3 left-0 w-3/4 h-5/12 rounded-lg overflow-hidden shadow-lg z-20">
                <Image
                  src={imageSrc[1]}
                  alt={imageAlt || "Image"}
                  fill
                  key={1}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* Bottom image - right */}
              <div className="absolute top-7/12 right-2 w-3/4 h-5/12 rounded-lg overflow-hidden shadow-lg z-30">
                <Image
                  src={imageSrc[2]}
                  alt={imageAlt || "Image"}
                  fill
                  key={2}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full w-3/4 h-80 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-500">
              Image Placeholder
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default ImageTextSection;
