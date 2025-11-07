import React from "react";

const SectionHeader = ({
  title,
  subtitle,
  className = "",
  titleClassName = "text-4xl md:text-5xl font-bold text-gray-900 mb-4",
  subtitleClassName = "text-lg text-gray-600 max-w-2xl mx-auto",
}) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-blue-600`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-700 text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
