import React from 'react';
import { Concept, RoadmapItem } from '@/lib/api';
import { CheckCircle2, Lock, MapPin, PlayCircle } from 'lucide-react';

interface KnowledgeMapProps {
  concepts: Concept[];
  roadmap?: RoadmapItem[];
  onConceptSelect?: (concept: Concept, index: number) => void;
  activeIndex?: number;
}

export default function KnowledgeMap({ concepts, roadmap, onConceptSelect, activeIndex = 0 }: KnowledgeMapProps) {
  return (
    <div className="relative pl-6 py-4">
      {/* Vertical Line */}
      <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {concepts.map((concept, index) => {
          const isMastered = roadmap?.find(r => r.concept_name === concept.name)?.status === 'mastered';
          const isActive = index === activeIndex;
          const isLocked = !isMastered && index > activeIndex;

          let Icon = Lock;
          let iconColor = 'text-gray-400';
          let bgColor = 'bg-gray-100';
          let borderColor = 'border-gray-200';

          if (isMastered) {
            Icon = CheckCircle2;
            iconColor = 'text-green-500';
            bgColor = 'bg-green-50';
            borderColor = 'border-green-200';
          } else if (isActive) {
            Icon = PlayCircle;
            iconColor = 'text-blue-500';
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-300';
          }

          return (
            <div 
              key={index} 
              className={`relative flex items-start gap-4 ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:opacity-90 transition-opacity'}`}
              onClick={() => !isLocked && onConceptSelect && onConceptSelect(concept, index)}
            >
              {/* Node Icon */}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${bgColor} border-2 ${borderColor}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>

              {/* Node Content */}
              <div className={`flex-1 p-4 rounded-xl border ${isActive ? 'border-blue-200 bg-white shadow-sm' : 'border-gray-100 bg-white/50'} transition-all`}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {concept.name}
                  </h4>
                  {isMastered && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Mastered</span>}
                  {isActive && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Current</span>}
                </div>
                
                {isActive && (
                  <p className="text-xs text-gray-500 mt-2 font-sans line-clamp-2">
                    {concept.explanation_en}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        
        {concepts.length === 0 && (
          <div className="text-center p-8 border border-dashed border-gray-200 rounded-2xl">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No concepts mapped yet. Upload a document to generate your roadmap.</p>
          </div>
        )}
      </div>
    </div>
  );
}
