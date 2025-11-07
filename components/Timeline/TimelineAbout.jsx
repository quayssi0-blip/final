"use client";

import React from "react";
import { Calendar } from "lucide-react";

// --- Blueprint Design System Constants ---
const PRIMARY_COLOR = "#B0E0E6"; // Powder Blue
const ACCENT_COLOR = "#6495ED"; // Cornflower Blue
const TEXT_COLOR = "#333333"; // Dark Gray
const SECONDARY_COLOR = "#606060";

// --- Enhanced Blueprint Animations and Styles ---
const BlueprintAnimationStyles = () => (
  <style jsx global>{`
      // --- Keyframe Animations ---

      // Fade in with a subtle upward movement
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      // Pulse animation for highlighting elements on load
      @keyframes pulse-highlight {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      // --- Animation Utility Classes ---

      // Apply the fadeIn animation
      .animate-fade-in {
        animation: fadeIn 0.7s ease-out forwards;
      }

      // Apply the pulse animation
      .animate-pulse-highlight {
        animation: pulse-highlight 0.8s ease-in-out;
      }

      // --- Card Hover Effect ---

      // Smooth transition for the card lift effect
      .card-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      // Elevate the card on hover for a tactile feel
      .card-lift:hover {
        transform: translateY(-8px);
        box-shadow: 0 18px 35px rgba(100, 149, 237, 0.12);
      }
    `}</style>
);

// --- Main Timeline Container ---

/**
 * TimelineAbout - A container for the timeline, managing the layout and the connecting line.
 * It displays a curved line on desktops and a straight vertical line on mobile.
 */
export const TimelineAbout = ({ children }) => (
  <div className="relative max-w-6xl px-4 mx-auto mt-12 lg:mt-20">
    <BlueprintAnimationStyles />

    {/* Curved Dotted Line for Desktop */}
    <div className="absolute inset-x-0 hidden top-8 md:block">
      <img
        className="w-full"
        src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
        alt="Timeline connector"
        style={{ filter: "hue-rotate(200deg) brightness(0.8)" }}
      />
    </div>

    {/* Vertical Line for Mobile */}
    <div
      className="absolute w-px h-full transform -translate-x-1/2 bg-gray-200 left-1/2 md:hidden"
      style={{ top: "2rem", bottom: "2rem" }}
    ></div>

    {/* Grid layout for timeline items */}
    <div className="relative grid grid-cols-1 gap-y-16 md:grid-cols-4 md:gap-x-12">
      {children}
    </div>
  </div>
);

// --- Timeline Item Components ---

/**
 * TimelineItemAbout - Represents a single event or step in the timeline.
 * Each item contains a step number, a title, a date, and a description.
 */
export const TimelineItemAbout = ({ children, index }) => {
  const stepNumber = index + 1;

  return (
    <div
      className="relative text-center animate-fade-in group"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Step Number Circle */}
      <div
        className="flex items-center justify-center w-16 h-16 mx-auto mb-8 bg-white border-2 rounded-full shadow-lg animate-pulse-highlight"
        style={{
          borderColor: `${ACCENT_COLOR}40`,
          animationDelay: `${index * 0.15 + 0.2}s`,
        }}
      >
        <span
          className="text-2xl font-semibold"
          style={{ color: ACCENT_COLOR }}
        >
          {stepNumber}
        </span>
      </div>

      {/* Content Card */}
      <div className="p-6 transition-colors bg-white rounded-lg card-lift">
        {children}
      </div>
    </div>
  );
};

/**
 * TimelineTimeAbout - Displays the date or year for a timeline item.
 * Styled as a prominent badge for easy visibility.
 */
export const TimelineTimeAbout = ({ children }) => (
  <div className="flex justify-center mb-5">
    <div
      className="flex items-center px-4 py-2 space-x-2 text-sm font-semibold rounded-full bg-blue-50"
      style={{ border: `1px solid ${ACCENT_COLOR}30` }}
    >
      <Calendar className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
      <span style={{ color: ACCENT_COLOR }}>{children}</span>
    </div>
  </div>
);

/**
 * TimelineTitleAbout - The main heading for a timeline item.
 */
export const TimelineTitleAbout = ({ children }) => (
  <h3 className="text-xl font-semibold" style={{ color: TEXT_COLOR }}>
    {children}
  </h3>
);

/**
 * TimelineDescriptionAbout - A brief description of the timeline event.
 */
export const TimelineDescriptionAbout = ({ children }) => (
  <p className="mt-3 text-base" style={{ color: SECONDARY_COLOR }}>
    {children}
  </p>
);

// --- Usage Example ---
/*
<TimelineAbout>
  <TimelineItemAbout index={0}>
    <TimelineTimeAbout>1992</TimelineTimeAbout>
    <TimelineTitleAbout>Foundation Created</TimelineTitleAbout>
    <TimelineDescriptionAbout>
      The organization was launched with a mission to innovate and lead.
    </TimelineDescriptionAbout>
  </TimelineItemAbout>

  <TimelineItemAbout index={1}>
    <TimelineTimeAbout>2010</TimelineTimeAbout>
    <TimelineTitleAbout>National Expansion</TimelineTitleAbout>
    <TimelineDescriptionAbout>
      We extended our reach, opening new sections across the country.
    </TimelineDescriptionAbout>
  </TimelineItemAbout>

  <TimelineItemAbout index={2}>
    <TimelineTimeAbout>2018</TimelineTimeAbout>
    <TimelineTitleAbout>Digital Transformation</TimelineTitleAbout>
    <TimelineDescriptionAbout>
      A new digital platform was introduced to enhance user engagement.
    </TimelineDescriptionAbout>
  </TimelineItemAbout>

  <TimelineItemAbout index={3}>
    <TimelineTimeAbout>2024</TimelineTimeAbout>
    <TimelineTitleAbout>Global Recognition</TimelineTitleAbout>
    <TimelineDescriptionAbout>
      Received international awards for our contributions to the industry.
    </TimelineDescriptionAbout>
  </TimelineItemAbout>
</TimelineAbout>
*/
