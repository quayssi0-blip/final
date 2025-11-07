"use client";

import { Search, Lightbulb, Wrench, BarChart } from "lucide-react";
import {
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
} from "@/components/Timeline/Timeline.jsx";

const ACCENT_COLOR = "#6495ED"; // Cornflower Blue

export default function TimelineSection() {
  return (
    <>
      {/* Mobile Timeline - Vertical Stack */}
      <div className="md:hidden">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Search size={24} style={{ color: ACCENT_COLOR }} />
              </div>
            </div>
            <div>
              <TimelineTitle>1. Évaluation des Besoins</TimelineTitle>
              <TimelineDescription>
                Analyse approfondie des besoins réels de la communauté cible
                pour identifier les problématiques majeures.
              </TimelineDescription>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Lightbulb size={24} style={{ color: ACCENT_COLOR }} />
              </div>
            </div>
            <div>
              <TimelineTitle>2. Conception du Projet</TimelineTitle>
              <TimelineDescription>
                Développement d'une stratégie adaptée et durable avec
                l'expertise locale et les partenaires concernés.
              </TimelineDescription>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Wrench size={24} style={{ color: ACCENT_COLOR }} />
              </div>
            </div>
            <div>
              <TimelineTitle>3. Mise en Œuvre</TimelineTitle>
              <TimelineDescription>
                Exécution rigoureuse et transparente sur le terrain avec suivi
                continu des progrès.
              </TimelineDescription>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                <BarChart size={24} style={{ color: ACCENT_COLOR }} />
              </div>
            </div>
            <div>
              <TimelineTitle>4. Évaluation & Impact</TimelineTitle>
              <TimelineDescription>
                Mesure de l'impact effectif et ajustements stratégiques pour une
                optimisation continue.
              </TimelineDescription>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Timeline - Horizontal Blueprint Layout */}
      <div className="hidden md:block">
        <Timeline>
          <TimelineItem icon={Search} index={0}>
            <TimelineTitle>1. Évaluation des Besoins</TimelineTitle>
            <TimelineDescription>
              Analyse approfondie des besoins réels de la communauté cible pour
              identifier les problématiques majeures.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem icon={Lightbulb} index={1}>
            <TimelineTitle>2. Conception du Projet</TimelineTitle>
            <TimelineDescription>
              Développement d'une stratégie adaptée et durable avec l'expertise
              locale et les partenaires concernés.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem icon={Wrench} index={2}>
            <TimelineTitle>3. Mise en Œuvre</TimelineTitle>
            <TimelineDescription>
              Exécution rigoureuse et transparente sur le terrain avec suivi
              continu des progrès.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem icon={BarChart} index={3}>
            <TimelineTitle>4. Évaluation & Impact</TimelineTitle>
            <TimelineDescription>
              Mesure de l'impact effectif et ajustements stratégiques pour une
              optimisation continue.
            </TimelineDescription>
          </TimelineItem>
        </Timeline>
      </div>
    </>
  );
}
