'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Heart, Info, Send, AlertCircle, RefreshCcw } from 'lucide-react';
import BodyMap from '@/components/BodyMap';

type BodyPart = 'head' | 'chest' | 'stomach' | 'arms' | 'legs';

const partDetails = {
  head: { title: 'Head & Brain Symptoms', color: 'blue', questions: ['Severe headache?', 'Dizziness?', 'Vision blur?'] },
  chest: { title: 'Chest & Heart Symptoms', color: 'cyan', questions: ['Shortness of breath?', 'Chest tight?', 'High heart rate?'] },
  stomach: { title: 'Abdominal Symptoms', color: 'indigo', questions: ['Stomach pain?', 'Nausea?', 'Bloating?'] },
  arms: { title: 'Upper Extremities', color: 'purple', questions: ['Joint pain?', 'Numbness?', 'Swelling?'] },
  legs: { title: 'Lower Extremities', color: 'violet', questions: ['Leg cramps?', 'Walking difficulty?', 'Varicose veins?'] },
};

export default function SymptomCheckerPage() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [step, setStep] = useState(0);

  const handlePartClick = (part: BodyPart) => {
    setSelectedPart(part);
    setStep(1);
  };

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row gap-12 items-start h-full">
        {/* Left Side: Instructions & Body Map */}
        <div className="w-full lg:w-1/2 space-y-8 sticky top-24">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">AI Symptom Checker</h1>
            <p className="text-muted-foreground font-medium mt-1">Select a body part to begin an interactive diagnostic session</p>
          </div>

          <div className="glass-card rounded-[3rem] p-10 border border-border relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <BodyMap onPartClick={handlePartClick} />
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Selectable</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted"></span> Hover to Focus</span>
            </div>
          </div>
        </div>

        {/* Right Side: AI Diagnostic Panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {!selectedPart ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-[3rem] border-dashed border-border"
              >
                <div className="w-20 h-20 rounded-[2.5rem] bg-muted/20 flex items-center justify-center text-4xl mb-8 animate-pulse">🤖</div>
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-4">Awaiting Selection</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">Click on any body part in the 3D map to start the MediAI diagnostic process.</p>
              </motion.div>
            ) : (
              <motion.div
                key="diagnostic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[3rem] p-10 flex flex-col min-h-[500px] border border-primary/20 shadow-2xl shadow-primary/5"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h2 className="font-black text-foreground tracking-tighter uppercase">{partDetails[selectedPart].title}</h2>
                      <p className="text-[10px] text-primary font-bold tracking-widest uppercase">MediAI Scan Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPart(null)}
                    className="p-3 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>

                {/* AI Chat-like Interface for Diagnostic Questions */}
                <div className="flex-1 space-y-6 overflow-y-auto mb-10 scrollbar-none pr-4">
                  <div className="flex justify-start">
                    <div className="bg-muted/50 text-foreground px-6 py-4 rounded-[1.5rem] rounded-tl-none border border-border text-sm font-medium">
                      I see you&apos;re experiencing issues with your {selectedPart}. Let&apos;s evaluate. Are you feeling any of these?
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {partDetails[selectedPart].questions.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{q}</span>
                          <div className="w-6 h-6 rounded-lg border border-border group-hover:bg-primary group-hover:border-primary transition-all flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex gap-4">
                  <AlertCircle className="text-primary shrink-0" size={20} />
                  <p className="text-xs text-primary font-bold leading-relaxed">
                    Note: This is an AI-assisted evaluation. For emergency cases, please call the hospital instantly via the &quot;Book Consultation&quot; button.
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <button className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Generate Diagnosis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 6 9 17l-5-5"/>
        </svg>
    );
}
