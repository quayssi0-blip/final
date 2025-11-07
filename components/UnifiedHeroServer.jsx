import React from "react";

const UnifiedHeroServer = ({ title, subtitle }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default UnifiedHeroServer;
