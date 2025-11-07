import React from "react";

const TestimonialCard = ({ name, role, quote }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <blockquote className="text-gray-700 mb-4 italic">"{quote}"</blockquote>
      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
