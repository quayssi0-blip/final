"use client";

import React from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";

// --- Blueprint Design System Constants (Extracted from foundation-blueprint.html) ---
const PRIMARY_COLOR = "#B0E0E6"; // Powder Blue
const ACCENT_COLOR = "#6495ED"; // Cornflower Blue
const TEXT_COLOR = "#333333"; // Dark Gray
const SECONDARY_COLOR = "#606060";

// Enhanced Blueprint Keyframes and Styles (for Next.js)
const BlueprintAnimationStyles = () => (
  <style jsx global>{`
      /* Blueprint FadeIn Animation */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse-once {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }

      /* Blueprint Card Lift Effect */
      .card-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card-lift:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(100, 149, 237, 0.15);
      }

      /* Blueprint Timeline Styling */
      .timeline-line {
        background-color: ${PRIMARY_COLOR};
      }

      .timeline-dot {
        background-color: ${ACCENT_COLOR};
        box-shadow: 0 0 0 4px ${PRIMARY_COLOR};
      }

      /* Blueprint Scroll Reveal */
      .scroll-reveal {
        opacity: 0;
      }

      .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
      }

      .animate-pulse-once {
        animation: pulse-once 2s ease-out forwards;
      }

      /* Staggered Animation for Timeline Items */
      @keyframes slide-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-timeline-stagger {
        animation: slide-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      }
    `}</style>
);

// --- Main Components ---

/**
 * Timeline - Container for the chronological events with blueprint styling.
 * Uses responsive horizontal layout with primary line and accent dots.
 */
export const Timeline = ({ children }) => (
  <div className="relative flex justify-between items-start pt-8 overflow-hidden">
    <BlueprintAnimationStyles />
    {children}
  </div>
);

/**
 * TimelineItem - Individual event with blueprint styling and scroll reveal.
 * @param {ReactNode} children - Content to display
 * @param {number} index - Index for staggered animation delay
 * @param {React.Component} icon - Lucide icon component
 */
export const TimelineItem = ({ children, index, icon: Icon }) => (
  <div
    className="TimelineItem w-1/4 text-center animate-fade-in"
    style={{
      animationDelay: `${index * 0.2}s`,
      zIndex: index,
    }}
  >
    {/* Enhanced Timeline Dot with Animation */}
    <div
      className="w-6 h-6 rounded-full mx-auto mb-6 relative z-10 shadow-lg animate-pulse-once"
      style={{
        backgroundColor: ACCENT_COLOR,
        boxShadow: `0 0 0 4px rgba(176, 224, 230, 0.3)`,
        animation: `pulse-once 2s ease-out ${index * 0.2 + 0.5}s both`,
      }}
    ></div>

    {Icon && (
      <div className="flex justify-center mb-4">
        <div
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-fade-in"
          style={{
            animationDelay: `${index * 0.2 + 0.3}s`,
            border: `2px solid ${PRIMARY_COLOR}40`,
          }}
        >
          <Icon size={28} style={{ color: ACCENT_COLOR }} />
        </div>
      </div>
    )}

    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.2 + 0.6}s` }}
    >
      {children}
    </div>
  </div>
);

/**
 * TimelineCard - The main content wrapper, styled as a card.
 */
export const TimelineCard = ({ children }) => (
  <div
    className="p-5 bg-white rounded-xl shadow-lg border-l-4 border-b-2 hover:shadow-xl transition-shadow duration-300"
    style={{ borderColor: ACCENT_COLOR }}
  >
    {children}
  </div>
);

/**
 * TimelineMarker - Visual point on the vertical line.
 */
export const TimelineMarker = () => (
  <span
    className="absolute flex items-center justify-center -left-[0.95rem] w-6 h-6 rounded-full ring-4 ring-white shadow-md z-10 animate-pulse-once"
    style={{ backgroundColor: ACCENT_COLOR }}
    aria-hidden="true"
  >
    <ChevronRight className="w-4 h-4 text-white" />
  </span>
);

/**
 * TimelineTime - Displays the Date/Year of the event.
 * @param {string} date - The event date/year.
 * @param {string} [time] - Optional event time.
 * @param {ReactNode} [children] - Alternative content when no date provided.
 */
export const TimelineTime = ({ date, time, children }) => (
  <div className="flex items-center space-x-4 mb-2">
    <TimelineMarker />

    <div className="flex items-center space-x-1 text-sm font-semibold p-1 px-3 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
      <Calendar className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
      <span style={{ color: SECONDARY_COLOR }}>{date || children}</span>
    </div>

    {time && (
      <div className="flex items-center space-x-1 text-sm p-1 px-3 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
        <Clock className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
        <span style={{ color: SECONDARY_COLOR }}>{time}</span>
      </div>
    )}
  </div>
);

/**
 * TimelineTitle - Title of the event with blueprint styling.
 */
export const TimelineTitle = ({ children }) => (
  <h4
    className="TimelineTitle font-bold text-lg mb-2"
    style={{ color: TEXT_COLOR }}
  >
    {children}
  </h4>
);

/**
 * TimelineDescription - Description/Body of the event with blueprint styling.
 */
export const TimelineDescription = ({ children }) => (
  <p
    className="TimelineDescription text-sm text-gray-600"
    style={{ color: SECONDARY_COLOR }}
  >
    {children}
  </p>
);

// --- Enhanced Blueprint Timeline Usage ---
/*
Enhanced Timeline with blueprint design system:

<Timeline>
    <TimelineItem icon={Search} index={0}>
        <TimelineTitle>Évaluation des Besoins</TimelineTitle>
        <TimelineDescription>Analyse approfondie des besoins...</TimelineDescription>
    </TimelineItem>
    <TimelineItem icon={Lightbulb} index={1}>
        <TimelineTitle>Conception du Projet</TimelineTitle>
        <TimelineDescription>Développement d'une stratégie...</TimelineDescription>
    </TimelineItem>
    <TimelineItem icon={Wrench} index={2}>
        <TimelineTitle>Mise en Œuvre</TimelineTitle>
        <TimelineDescription>Exécution rigoureuse...</TimelineDescription>
    </TimelineItem>
    <TimelineItem icon={BarChart} index={3}>
        <TimelineTitle>Évaluation & Impact</TimelineTitle>
        <TimelineDescription>Mesure de l'impact...</TimelineDescription>
    </TimelineItem>
</Timeline>
*/
