import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight as ArrowRightIcon, Maximize, BrainCircuit, LayoutTemplate, Palette, Database,
  Cpu, ScanSearch, CheckCircle2, FileCode2, MessagesSquare, Code2, Play, Terminal, Layers, Component, ShieldCheck,
  Map as MapIcon, BarChart3, TableProperties, LayoutDashboard, BarChartHorizontal, X, Zap, Workflow, Bot
} from 'lucide-react';
import Typography from './Typography';

// Slide Wrapper
const Slide = ({ children, isActive, isExiting, isEntering }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
     if (isEntering || isActive) {
        requestAnimationFrame(() => setMounted(true));
     } else {
        setMounted(false);
     }
  }, [isEntering, isActive]);

  if (!isActive && !isExiting && !isEntering) return null;
  
  return (
    <div 
      className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center p-12 text-center bg-[#0a0a0a] transition-all duration-[800ms] ease-out ${
        isExiting 
          ? 'opacity-0 scale-90 -translate-y-8 blur-sm pointer-events-none z-0'
          : ((isEntering || isActive) && !mounted)
             ? 'opacity-0 scale-110 translate-y-8 z-20 drop-shadow-2xl'
             : 'opacity-100 scale-100 translate-y-0 z-10'
      }`}
    >
      {children}
    </div>
  );
};

// Generic Step/Component Card
const StepCard = ({ icon: Icon, title, desc, color, isVisible }) => {
  const colorStyles = {
    blue: "bg-blue-50/10 border-blue-500/30 text-blue-400 shadow-blue-500/20",
    indigo: "bg-indigo-50/10 border-indigo-500/30 text-indigo-400 shadow-indigo-500/20",
    emerald: "bg-emerald-50/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20",
    rose: "bg-rose-50/10 border-rose-500/30 text-rose-400 shadow-rose-500/20",
    amber: "bg-amber-50/10 border-amber-500/30 text-amber-400 shadow-amber-500/20",
    fuchsia: "bg-fuchsia-50/10 border-fuchsia-500/30 text-fuchsia-400 shadow-fuchsia-500/20"
  };

  return (
    <div 
      className={`p-6 rounded-2xl border bg-black/40 backdrop-blur-md shadow-xl flex flex-col items-center transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} ${colorStyles[color]}`}
    >
      <div className={`p-4 rounded-full bg-white/10 mb-4`}><Icon size={32} /></div>
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm opacity-80">{desc}</p>
    </div>
  );
};

// Main Presentation Component
const SkillAnimation = ({ step }) => {
  const [animState, setAnimState] = useState(0);

  useEffect(() => {
    setAnimState(0);
    const intervals = {
      step1: 5,
      step2: 4,
      step3: 4,
      step4: 3,
      step5: 3,
    };
    const maxStates = intervals[step] || 3;
    
    const int = setInterval(() => {
      setAnimState(s => (s >= maxStates ? 0 : s + 1));
    }, 1500);
    return () => clearInterval(int);
  }, [step]);

  if (step === 'step1') {
    return (
      <div className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center">
         <div className={`transition-all duration-700 w-full max-w-sm z-10 ${animState >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-slate-800 text-slate-300 p-4 rounded-t-2xl rounded-br-2xl rounded-bl-sm shadow-xl relative overflow-hidden text-sm">
               {animState >= 2 && <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay animate-pulse"></div>}
               "Build a <span className={animState >= 2 ? 'text-blue-400 font-bold transition-colors' : ''}>sales dashboard</span> tracking variance across <span className={animState >= 2 ? 'text-emerald-400 font-bold transition-colors' : ''}>regions</span> in <span className={animState >= 2 ? 'text-fuchsia-400 font-bold transition-colors' : ''}>dark mode</span>."
            </div>
         </div>
         <div className="h-6 flex items-center justify-center mt-2 z-0">
            <ArrowRightIcon className={`text-slate-500 rotate-90 transition-opacity duration-500 ${animState >= 3 ? 'opacity-100' : 'opacity-0'}`} size={20} />
         </div>
         <div className={`flex flex-col gap-2 mt-2 transition-all duration-700 transform w-full ${animState >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-blue-900/50 border border-blue-500/50 text-blue-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest text-center shadow-lg">METRIC: SALES</div>
            <div className="flex gap-2 justify-center">
               <div className="bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest shadow-lg flex-1 text-center">DIM: REGIONS</div>
               <div className="bg-fuchsia-900/50 border border-fuchsia-500/50 text-fuchsia-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest shadow-lg flex-1 text-center">THEME: DARK</div>
            </div>
         </div>
      </div>
    );
  }

  if (step === 'step2') {
    return (
      <div className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center gap-4">
         <div className={`flex gap-3 transition-all duration-700 ${animState >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-slate-800 whitespace-nowrap text-slate-300 px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono shadow-md">intent: dashboard</div>
            <div className="bg-slate-800 whitespace-nowrap text-slate-300 px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono shadow-md">dim: geospatial</div>
         </div>
         <ArrowRightIcon className={`text-slate-500 rotate-90 transition-opacity duration-500 ${animState >= 2 ? 'opacity-100' : 'opacity-0'}`} size={20} />
         <div className={`flex w-full gap-2 transition-all duration-500 relative ${animState >= 2 ? 'opacity-100' : 'opacity-0'}`}>
             <div className={`flex-1 p-3 border rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold text-center transition-all duration-700 ${animState >= 3 ? 'opacity-30 scale-95 border-slate-800 bg-slate-900/50 text-slate-600' : 'border-slate-700 text-slate-400 bg-slate-800/30'}`}>
                 <TableProperties size={20}/> Form Input
             </div>
             <div className={`flex-[1.2] p-3 border-2 rounded-xl flex flex-col items-center justify-center gap-2 text-sm font-bold text-center transition-all duration-700 relative z-10 ${animState >= 3 ? 'border-indigo-400 bg-indigo-900/40 text-indigo-100 scale-110 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : 'border-slate-700 text-slate-400 bg-slate-800/50'}`}>
                 <Layers size={24} className={animState >= 3 ? 'text-indigo-400' : ''} /> Geo Dashboard
             </div>
             <div className={`flex-1 p-3 border rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold text-center transition-all duration-700 ${animState >= 3 ? 'opacity-30 scale-95 border-slate-800 bg-slate-900/50 text-slate-600' : 'border-slate-700 text-slate-400 bg-slate-800/30'}`}>
                 <BarChartHorizontal size={20}/> Static Report
             </div>
         </div>
      </div>
    );
  }

  if (step === 'step3') {
    return (
       <div className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center overflow-hidden">
          <div className={`mb-6 px-5 py-2 rounded-full bg-indigo-900/50 border border-indigo-500/50 text-indigo-300 text-sm font-bold transition-all duration-700 ${animState >= 1 ? 'opacity-100 scale-100 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'opacity-0 scale-90'}`}><LayoutDashboard size={16} className="inline mr-2"/> Template: GeoDashboard</div>
          
          <div className={`w-full max-w-[240px] aspect-video border-2 rounded-xl p-2 flex gap-2 transition-all duration-1000 relative ${animState >= 2 ? 'border-amber-500 bg-amber-900/10 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'border-slate-800 bg-slate-900/50'}`}>
              <div className={`flex-[1.5] rounded-lg transition-all duration-500 ease-out border ${animState >= 3 ? 'bg-amber-800/40 border-amber-500/50 scale-100 opacity-100' : 'bg-transparent border-dashed border-slate-700 scale-95 opacity-50'}`}></div>
              <div className="flex-1 flex flex-col gap-2">
                  <div className={`flex-1 rounded-lg transition-all duration-500 delay-100 ease-out border ${animState >= 3 ? 'bg-amber-800/40 border-amber-500/50 scale-100 opacity-100' : 'bg-transparent border-dashed border-slate-700 scale-95 opacity-50'}`}></div>
                  <div className={`flex-[1.5] rounded-lg transition-all duration-500 delay-200 ease-out border ${animState >= 3 ? 'bg-amber-800/40 border-amber-500/50 scale-100 opacity-100' : 'bg-transparent border-dashed border-slate-700 scale-95 opacity-50'}`}></div>
              </div>
              {animState >= 3 && <div className="absolute -bottom-3 -right-2 text-[10px] font-mono text-amber-500 tracking-widest bg-slate-900 border border-amber-500/50 px-2 py-1 rounded shadow-lg animate-in zoom-in duration-300">display: grid</div>}
          </div>
       </div>
    );
  }

  if (step === 'step4') {
    return (
       <div className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center overflow-hidden">
          <div className={`w-full max-w-[240px] aspect-video border-2 border-slate-700 bg-black/40 rounded-xl p-2 flex gap-2 transition-all duration-1000`}>
              <div className={`flex-[1.5] rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden relative flex flex-col items-center justify-center transition-all duration-500 shadow-inner`}>
                  <div className={`absolute inset-0 bg-blue-500/20 transition-opacity duration-300 ${animState >= 1 && animState < 2 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                  <div className={`transition-all duration-500 transform flex flex-col items-center justify-center gap-2 ${animState >= 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                      <MapIcon className="text-blue-400 drop-shadow-md" size={32} />
                      <span className="text-[9px] bg-blue-900/80 px-2 py-0.5 rounded text-blue-100 font-mono tracking-wide shadow-sm">&lt;UsaMap /&gt;</span>
                  </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                  <div className={`flex-1 rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden relative flex flex-col items-center justify-center transition-all duration-500 shadow-inner`}>
                      <div className={`absolute inset-0 bg-rose-500/20 transition-opacity duration-300 ${animState >= 1 && animState < 2 ? 'opacity-100 animate-pulse delay-100' : 'opacity-0'}`}></div>
                      <div className={`transition-all duration-500 delay-100 transform ${animState >= 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                          <BarChart3 className="text-rose-400 drop-shadow-md" size={24} />
                      </div>
                  </div>
                  <div className={`flex-[1.5] rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden relative flex flex-col items-center justify-center transition-all duration-500 shadow-inner`}>
                      <div className={`absolute inset-0 bg-emerald-500/20 transition-opacity duration-300 ${animState >= 1 && animState < 2 ? 'opacity-100 animate-pulse delay-200' : 'opacity-0'}`}></div>
                      <div className={`transition-all duration-500 delay-200 transform flex flex-col items-center gap-1 ${animState >= 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                          <TableProperties className="text-emerald-400 drop-shadow-md" size={20} />
                          <span className="text-[8px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-100 font-mono tracking-wide">&lt;Table /&gt;</span>
                      </div>
                  </div>
              </div>
          </div>
       </div>
    );
  }

  if (step === 'step5') {
    return (
       <div className="w-full h-64 bg-[#0a0a0a] border-2 border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center overflow-hidden">
          <div className={`absolute top-6 bg-fuchsia-900/80 border border-fuchsia-500/50 text-fuchsia-100 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest transition-all duration-700 z-20 shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center gap-2 ${animState >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-90'}`}><Palette size={14}/> APPLY: DESIGN_TOKENS.JSON</div>
          
          <div className="w-full max-w-[240px] aspect-video border-2 border-slate-800 bg-black rounded-xl p-2 flex gap-2 relative mt-8 shadow-2xl">
              <div className={`absolute inset-0 z-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-blue-500/20 blur-2xl transition-all duration-1000 ${animState >= 2 ? 'opacity-100' : 'opacity-0'}`}></div>
              
              <div className={`z-10 flex-[1.5] rounded-lg border flex flex-col p-3 transition-all duration-1000 overflow-hidden ${animState >= 2 ? 'bg-slate-900 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-800/30 border-slate-700'}`}>
                   <div className={`h-2.5 w-1/2 rounded-full mb-auto transition-colors duration-1000 ${animState >= 2 ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                   <div className={`h-16 w-full rounded-md transition-all duration-1000 ${animState >= 2 ? 'bg-gradient-to-t from-blue-500/40 to-blue-500/5' : 'bg-slate-700'}`}></div>
              </div>
              
              <div className="z-10 flex-1 flex flex-col gap-2">
                  <div className={`flex-1 rounded-lg border flex items-center justify-center transition-all duration-1000 ${animState >= 2 ? 'bg-slate-900 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-slate-800/30 border-slate-700'}`}>
                       <div className={`h-6 w-6 rounded-full transition-colors duration-1000 ${animState >= 2 ? 'bg-rose-500' : 'bg-slate-600'}`}></div>
                  </div>
                  <div className={`flex-[1.5] rounded-lg border p-2 border-t-4 transition-all duration-1000 flex flex-col justify-center gap-1.5 ${animState >= 2 ? 'bg-slate-900 border-emerald-500/40 border-t-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800/30 border-slate-700 border-t-slate-600'}`}>
                      <div className="flex gap-1.5"><div className={`h-1.5 flex-1 rounded-sm ${animState >= 2 ? 'bg-emerald-400/60' : 'bg-slate-700'}`}></div><div className={`h-1.5 flex-[2] rounded-sm ${animState >= 2 ? 'bg-emerald-400/60' : 'bg-slate-700'}`}></div></div>
                      <div className="flex gap-1.5"><div className={`h-1.5 flex-[2] rounded-sm ${animState >= 2 ? 'bg-emerald-400/20' : 'bg-slate-800'}`}></div><div className={`h-1.5 flex-1 rounded-sm ${animState >= 2 ? 'bg-emerald-400/20' : 'bg-slate-800'}`}></div></div>
                      <div className="flex gap-1.5"><div className={`h-1.5 flex-1 rounded-sm ${animState >= 2 ? 'bg-emerald-400/20' : 'bg-slate-800'}`}></div><div className={`h-1.5 flex-[2] rounded-sm ${animState >= 2 ? 'bg-emerald-400/20' : 'bg-slate-800'}`}></div></div>
                  </div>
              </div>
          </div>
       </div>
    );
  }

  return null;
};

export default function HowItWorksPage({ onBack }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoStep, setAutoStep] = useState(0);
  const [transitionTarget, setTransitionTarget] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
     let timeouts = [];
     if (currentSlide === 4 && currentStep === 0) {
         setAutoStep(0);
         timeouts.push(setTimeout(() => setAutoStep(1), 500));
         timeouts.push(setTimeout(() => setAutoStep(2), 1000));
         timeouts.push(setTimeout(() => setAutoStep(3), 1600));
         timeouts.push(setTimeout(() => setAutoStep(4), 2100));
         timeouts.push(setTimeout(() => setAutoStep(5), 2600));
         timeouts.push(setTimeout(() => setAutoStep(6), 3100));
         timeouts.push(setTimeout(() => setAutoStep(7), 3600));
     } else if (currentSlide === 4 && currentStep === 1) {
         timeouts.push(setTimeout(() => setAutoStep(8), 200));
         timeouts.push(setTimeout(() => setAutoStep(9), 1000));
         timeouts.push(setTimeout(() => setAutoStep(10), 2000));
         timeouts.push(setTimeout(() => setAutoStep(11), 3000));
     } else {
         setAutoStep(0);
     }
     return () => timeouts.forEach(clearTimeout);
  }, [currentSlide, currentStep]);

  // Configuration defining max fragments per slide
  const slideConfigs = [
    { id: 'title', maxSteps: 0 },
    { id: 'problem', maxSteps: 3 },
    { id: 'solution', maxSteps: 3 },
    { id: 'intent_analysis', maxSteps: 6 },
    { id: 'making_app', maxSteps: 1 },
    { id: 'validation', maxSteps: 3 },
    { id: 'vision_critique', maxSteps: 4 },
    { id: 'conclusion', maxSteps: 0 }
  ];

  const handleNext = () => {
     if (selectedSkill) { setSelectedSkill(null); return; }
     if (transitionTarget !== null) return;
     if (currentStep < slideConfigs[currentSlide].maxSteps) {
         setCurrentStep(s => s + 1);
     } else if (currentSlide < slideConfigs.length - 1) {
         setTransitionTarget(currentSlide + 1);
         setTimeout(() => {
             setCurrentSlide(currentSlide + 1);
             setCurrentStep(0);
             setTransitionTarget(null);
         }, 800);
     }
  };

  const handlePrev = () => {
     if (selectedSkill) { setSelectedSkill(null); return; }
     if (transitionTarget !== null) return;
     if (currentStep > 0) {
         setCurrentStep(s => s - 1);
     } else if (currentSlide > 0) {
         setTransitionTarget(currentSlide - 1);
         setTimeout(() => {
             setCurrentSlide(currentSlide - 1);
             setCurrentStep(slideConfigs[currentSlide - 1].maxSteps);
             setTransitionTarget(null);
         }, 800);
     }
  };

  const skillDetails = {
    step1: {
        title: 'Analyze User Request',
        Icon: Bot,
        colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        description: 'The Agent interprets the natural language prompt and extracts the core intent. It identifies key user requirements such as functional domains, requested metrics, data dimensions, and thematic preferences before generating any code.'
    },
    step2: {
        title: 'Determine App Archetype',
        Icon: Layers,
        colorClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
        description: 'Based on the parsed intent, the Orchestrator assigns a high-level application archetype (e.g., "Sales Dashboard", "Geospatial Explorer"). This dictates the overall application flow and UX interaction models.'
    },
    step3: {
        title: 'Determine App Layout',
        Icon: LayoutDashboard,
        colorClass: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        description: 'The system queries layout skill files to select the optimal CSS Grid template. It provisions distinct screen real estate, sidebars, and responsive containers tailored to the chosen data archetype.'
    },
    step4: {
        title: 'Select Required Components',
        Icon: BarChartHorizontal,
        colorClass: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
        description: 'The agent maps requirements to specific UI components (like KPI Cards, Maps, or Data Tables). It pulls specific skill files detailing exact props, states, and data schemas for each component to avoid hallucinations.'
    },
    step5: {
        title: 'Attach Visual Design',
        Icon: Palette,
        colorClass: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50',
        description: 'Finally, the selected components inherit enterprise typography and global branding tokens via design system skill files. It enforces exact hex codes, padding constraints, and accessible contrasts.'
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrows
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
      
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
      if (e.key === 'Escape') {
          if (selectedSkill) {
              setSelectedSkill(null);
              return;
          }
          if (!document.fullscreenElement) {
              onBack();
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, currentStep, selectedSkill, onBack]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0a0a0a] text-slate-50 overflow-hidden font-sans presentation-mode"
    >
        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/80 to-transparent">
            <button 
              onClick={() => {
                 if (document.fullscreenElement) document.exitFullscreen();
                 onBack();
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} /> Close
            </button>
            <div className="flex gap-4">
                <button 
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                    <Maximize size={20} /> Fullscreen
                </button>
            </div>
        </div>

        {/* Main Slide Area */}
        <div className="flex-1 relative overflow-hidden bg-grid-slate-900/[0.1] bg-[bottom_1px_center]">
             
             {/* Slide 0: Title */}
             <Slide isActive={currentSlide === 0} isExiting={currentSlide === 0 && transitionTarget !== null} isEntering={transitionTarget === 0}>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <Code2 size={20} /> Cloud Data VS Code Extension
                </div>
                <h1 className="text-white font-extrabold tracking-tight text-6xl md:text-7xl leading-tight max-w-4xl mb-6">
                  Building Fantastic Apps <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Right in your IDE.</span>
                </h1>
                <Typography variant="h4" as="p" className="text-slate-400 max-w-2xl font-normal leading-relaxed">
                  How our Skill System powers the VS Code Agent to generate perfect, enterprise-ready data apps without AI hallucinations.
                </Typography>
                <div className="mt-12 text-slate-600 animate-pulse text-sm">Press Space or ArrowRight to advance</div>
             </Slide>

             {/* Slide 1: The Problem */}
             <Slide isActive={currentSlide === 1} isExiting={currentSlide === 1 && transitionTarget !== null} isEntering={transitionTarget === 1}>
                <h6 className="text-rose-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                    <ScanSearch /> The Problem
                </h6>
                <h2 className="text-white font-bold text-4xl mb-12">Vanilla AI Guesses.</h2>
                <div className="grid grid-cols-3 gap-6 max-w-5xl w-full">
                    <StepCard icon={Bot} title="Lacks Context" desc="Generic AI doesn't understand specific data user needs or domain logic." color="rose" isVisible={(transitionTarget === 1 ? 0 : currentStep) >= 1} />
                    <StepCard icon={Component} title="Wrong Tools" desc="Generic AI doesn't know what components are needed to get a data job done." color="rose" isVisible={(transitionTarget === 1 ? 0 : currentStep) >= 2} />
                    <StepCard icon={LayoutTemplate} title="Poor Assembly" desc="Generic AI isn't going to make proper data app layouts or the interactive charts data users actually need." color="rose" isVisible={(transitionTarget === 1 ? 0 : currentStep) >= 3} />
                </div>
             </Slide>

             {/* Slide 2: The Solution */}
             <Slide isActive={currentSlide === 2} isExiting={currentSlide === 2 && transitionTarget !== null} isEntering={transitionTarget === 2}>
                <h6 className="text-emerald-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                    <ShieldCheck /> The Solution
                </h6>
                <h2 className="text-white font-bold text-4xl mb-12">Hyperskills</h2>
                
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
                    {/* Left Side: Dynamic Text & List */}
                    <div className="flex flex-col text-left">
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            Before the AI is allowed to write a single line of React inside VS Code, we inject highly-specialized instruction manuals called <strong className="text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded-md ring-1 ring-emerald-500/50">Skill Files</strong>.
                        </p>
                        <ul className="space-y-6 text-slate-400">
                            <li className={`flex items-start gap-4 transition-all duration-500 transform ${(transitionTarget === 2 ? 0 : currentStep) >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                 <div className="p-2 bg-blue-500/20 rounded-full mt-1 shrink-0"><ShieldCheck className="text-blue-400" size={20}/></div>
                                 <div>
                                    <strong className="text-white text-lg block mb-1">Precision Routing</strong>
                                    <span className="text-sm">Selects only the required skill files for the specific job, avoiding generic hallucination.</span>
                                 </div>
                            </li>
                            <li className={`flex items-start gap-4 transition-all duration-500 transform delay-100 ${(transitionTarget === 2 ? 0 : currentStep) >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                 <div className="p-2 bg-fuchsia-500/20 rounded-full mt-1 shrink-0"><Zap className="text-fuchsia-400" size={20}/></div>
                                 <div>
                                    <strong className="text-white text-lg block mb-1">Reduced Token Usage</strong>
                                    <span className="text-sm">A hyper-focused context window drastically lowers API costs and prevents context dilution.</span>
                                 </div>
                            </li>
                            <li className={`flex items-start gap-4 transition-all duration-500 transform delay-200 ${(transitionTarget === 2 ? 0 : currentStep) >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                <div className="p-2 bg-emerald-500/20 rounded-full mt-1 shrink-0"><CheckCircle2 className="text-emerald-400" size={20}/></div>
                                <div>
                                    <strong className="text-white text-lg block mb-1">Better Outcomes</strong>
                                    <span className="text-sm">Leverages curated, domain-specific knowledge to guarantee enterprise-grade results.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Right Side: Animated Spatial Diagram */}
                    <div className="relative w-full h-[460px] bg-[#0f0f0f] rounded-3xl border border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

                        {/* Step 1: Precision Routing */}
                        <div className={`absolute transition-all duration-1000 w-full h-full flex flex-col items-center justify-center ${(transitionTarget === 2 ? 0 : currentStep) >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Request / Router icon */}
                            <div className={`absolute top-8 flex flex-col items-center transition-all duration-1000 z-20 ${(transitionTarget === 2 ? 0 : currentStep) >= 2 ? 'opacity-0 -translate-y-8 blur-sm' : 'opacity-100 translate-y-0'}`}>
                                <div className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full text-[10px] font-mono border border-slate-700 mb-4 flex items-center gap-2">
                                    <Terminal size={12}/> "Build map dash"
                                </div>
                                <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] mt-2">
                                    <ScanSearch className="text-blue-400" size={28} />
                                </div>
                            </div>
                            
                            {/* Connection lines leading to skills */}
                            <div className={`absolute top-32 w-56 h-16 border-t-2 border-l-2 border-r-2 border-dashed border-blue-500/40 rounded-t-3xl transition-all duration-1000 z-10 ${(transitionTarget === 2 ? 0 : currentStep) >= 2 ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                            </div>

                            {/* Prominent Skill Nodes */}
                            <div className={`absolute top-44 w-full flex justify-center gap-16 transition-all duration-1000 z-20 ${(transitionTarget === 2 ? 0 : currentStep) >= 2 ? 'opacity-0 scale-90 translate-y-12 blur-sm' : 'opacity-100 scale-100 translate-y-0'}`}>
                                <div className="bg-[#042f2e]/90 border border-emerald-500/50 p-4 rounded-xl flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-md">
                                    <MapIcon className="text-emerald-400 mb-1" size={28} />
                                    <span className="text-xs text-emerald-100 font-mono font-bold">usa_map.skill</span>
                                </div>
                                <div className="bg-[#172554]/90 border border-blue-500/50 p-4 rounded-xl flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md">
                                    <BarChart3 className="text-blue-400 mb-1" size={28} />
                                    <span className="text-xs text-blue-100 font-mono font-bold">charts.skill</span>
                                </div>
                            </div>
                            
                            {/* Rejected generic skills blurring in background */}
                            <div className={`absolute top-36 w-full flex justify-center gap-48 transition-all duration-1000 z-0 opacity-40 ${(transitionTarget === 2 ? 0 : currentStep) >= 2 ? 'hidden' : 'block'}`}>
                                <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg flex items-center gap-2 scale-75 blur-[2px]">
                                    <FileCode2 className="text-slate-500" size={16} />
                                    <span className="text-[10px] text-slate-500 font-mono">generic.md</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg flex items-center gap-2 scale-75 blur-[2px]">
                                    <Database className="text-slate-500" size={16} />
                                    <span className="text-[10px] text-slate-500 font-mono">legacy.md</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Reduced Tokens */}
                        <div className={`absolute z-30 flex items-center justify-center pointer-events-none transition-all duration-1000 ${(transitionTarget === 2 ? 0 : currentStep) >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                            {/* Large Circle (Full codebase context window) */}
                            <div className={`absolute w-80 h-80 border-2 border-slate-700/50 border-dashed rounded-full flex flex-col items-center pt-8 transition-all duration-[1200ms] ease-in-out ${(transitionTarget === 2 ? 0 : currentStep) >= 3 ? 'scale-110 opacity-0 blur-md' : 'scale-100 opacity-60'}`}>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-[#0f0f0f] px-2">Total Workspace</span>
                            </div>

                            {/* Focused Context Window */}
                            <div className={`absolute flex flex-col items-center justify-center bg-fuchsia-900/40 border-[3px] border-fuchsia-500/60 rounded-full w-56 h-56 backdrop-blur-md shadow-[0_0_60px_rgba(217,70,239,0.3)] transition-all duration-[1200ms] ease-in-out ${(transitionTarget === 2 ? 0 : currentStep) >= 3 ? 'scale-[2] opacity-0 blur-xl' : 'scale-100 opacity-100'}`}>
                                <Zap className="text-fuchsia-300 mb-3 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]" size={40} />
                                <span className="text-base text-fuchsia-100 font-bold text-center leading-tight">Active Context<br/>Window</span>
                                <span className="mt-3 bg-fuchsia-500 text-white font-mono text-xs px-3 py-1 rounded-full shadow-lg">-95% Tokens</span>
                            </div>
                        </div>

                        {/* Step 3: Super Nice App (Better Outcomes) */}
                         <div className={`absolute z-40 bg-zinc-950 border border-emerald-500/30 rounded-2xl w-80 h-[280px] shadow-[0_0_80px_rgba(16,185,129,0.25)] overflow-hidden transition-all duration-[1500ms] transform ${(transitionTarget === 2 ? 0 : currentStep) >= 3 ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-32 scale-75 rotate-[-5deg] blur-md'} flex flex-col`}>
                            {/* Gloss effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
                            
                            {/* App Header */}
                            <div className="h-12 border-b border-zinc-800 bg-zinc-900/80 flex items-center px-4 gap-3 relative z-10 backdrop-blur-md">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80 drop-shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80 drop-shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 drop-shadow-sm"></div>
                                </div>
                                <div className="h-4 w-20 bg-zinc-800 rounded ml-2"></div>
                                <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 ml-auto flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="text-emerald-400 drop-shadow-md" size={14}/>
                                </div>
                            </div>
                            
                            {/* App Body */}
                            <div className="p-4 flex-1 flex flex-col gap-3 relative h-full">
                                {/* Glow behind the body */}
                                <div className="absolute top-1/4 right-0 w-48 h-48 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                                
                                <div className="flex justify-between items-center relative z-10">
                                    <h4 className="text-zinc-100 text-sm font-bold tracking-wide">Sales Distribution</h4>
                                    <div className="h-5 w-5 bg-zinc-800 rounded flex items-center justify-center"><BarChartHorizontal size={12} className="text-zinc-400"/></div>
                                </div>
                                
                                <div className="flex gap-3 relative z-10">
                                    {/* KPI Card */}
                                    <div className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center">
                                        <div className="flex gap-2 items-center mb-1">
                                            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Revenue</div>
                                        </div>
                                        <div className="text-emerald-400 text-xl font-bold tracking-tight">$128.4k</div>
                                    </div>
                                    {/* KPI Card */}
                                    <div className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center">
                                        <div className="flex gap-2 items-center mb-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Growth</div>
                                        </div>
                                        <div className="text-blue-400 text-xl font-bold tracking-tight">+24.5%</div>
                                    </div>
                                </div>
                                
                                {/* Chart Area */}
                                <div className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl mt-1 p-3 flex flex-col justify-end gap-1.5 relative z-10 overflow-hidden">
                                    <div className="flex items-end justify-between h-full px-1 gap-1.5 z-10">
                                        {[40, 65, 30, 85, 50, 75, 45, 90, 60, 40].map((h, i) => (
                                            <div key={i} className="w-full bg-emerald-400/80 rounded-t-sm shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all" style={{height: `${h}%`}}></div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent z-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </Slide>

             {/* Slide 3: Interactive Prompt Analysis */}
             <Slide isActive={currentSlide === 3} isExiting={currentSlide === 3 && transitionTarget !== null} isEntering={transitionTarget === 3}>
                <h6 className="text-indigo-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                    <Workflow /> Phase 1: Intent Analysis
                </h6>
                <h2 className="text-white font-bold text-4xl mb-12">Orchestrating Skills</h2>

                <div className="w-full max-w-4xl flex flex-col items-center">
                    {/* The Prompt */}
                    <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 shadow-2xl w-full transition-all duration-500">
                        <div className="flex items-center gap-3 mb-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
                            <Terminal size={14} /> User Command
                        </div>
                        <p className="text-lg text-white">"Build a sales dashboard tracking <span className={`transition-colors duration-500 font-bold ${(transitionTarget === 3 ? 0 : currentStep) >= 3 ? 'text-rose-400' : ''}`}>variance</span> across <span className={`transition-colors duration-500 font-bold ${(transitionTarget === 3 ? 0 : currentStep) >= 4 ? 'text-emerald-400' : ''}`}>regions</span> using the dark theme."</p>
                    </div>

                    <div className={`h-12 w-px bg-indigo-500/50 transition-all duration-500 origin-top transform ${(transitionTarget === 3 ? 0 : currentStep) >= 1 ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} />

                    {/* The Orchestrator Node */}
                    <div className={`p-4 rounded-full bg-indigo-500/20 border-2 border-indigo-400 text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-700 transform z-10 ${(transitionTarget === 3 ? 0 : currentStep) >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        <Workflow size={40} />
                    </div>

                    {/* Extracted Nodes Container */}
                    <div className="grid grid-cols-5 gap-4 w-full mt-8 max-w-6xl mx-auto">
                        <div onClick={() => setSelectedSkill('step1')} className={`cursor-pointer hover:bg-slate-800/80 hover:scale-105 flex flex-col items-center justify-center bg-black/40 border border-slate-800 p-6 rounded-3xl transition-all duration-500 delay-100 transform min-h-[180px] shadow-xl ${(transitionTarget === 3 ? 0 : currentStep) >= 2 ? 'translate-y-0 opacity-100 ring-2 ring-blue-500/20' : 'translate-y-10 opacity-0'}`}>
                            <Bot className="text-blue-400 mb-3 shrink-0" size={32} />
                            <span className="text-xs text-slate-500 font-bold uppercase mb-2 text-center leading-tight">Step 1</span>
                            <span className="text-md font-bold text-blue-100 text-center leading-snug">Analyze User Request</span>
                        </div>
                        <div onClick={() => setSelectedSkill('step2')} className={`cursor-pointer hover:bg-slate-800/80 hover:scale-105 flex flex-col items-center justify-center bg-black/40 border border-slate-800 p-6 rounded-3xl transition-all duration-500 delay-100 transform min-h-[180px] shadow-xl ${(transitionTarget === 3 ? 0 : currentStep) >= 3 ? 'translate-y-0 opacity-100 ring-2 ring-indigo-500/20' : 'translate-y-10 opacity-0'}`}>
                            <Layers className="text-indigo-400 mb-3 shrink-0" size={32} />
                            <span className="text-xs text-slate-500 font-bold uppercase mb-2 text-center leading-tight">Step 2</span>
                            <span className="text-md font-bold text-indigo-100 text-center leading-snug">Determine App Archetype</span>
                        </div>
                        <div onClick={() => setSelectedSkill('step3')} className={`cursor-pointer hover:bg-slate-800/80 hover:scale-105 flex flex-col items-center justify-center bg-black/40 border border-slate-800 p-6 rounded-3xl transition-all duration-500 delay-100 transform min-h-[180px] shadow-xl ${(transitionTarget === 3 ? 0 : currentStep) >= 4 ? 'translate-y-0 opacity-100 ring-2 ring-amber-500/20' : 'translate-y-10 opacity-0'}`}>
                            <LayoutDashboard className="text-amber-400 mb-3 shrink-0" size={32} />
                            <span className="text-xs text-slate-500 font-bold uppercase mb-2 text-center leading-tight">Step 3</span>
                            <span className="text-md font-bold text-amber-100 text-center leading-snug">Determine App Layout</span>
                        </div>
                        <div onClick={() => setSelectedSkill('step4')} className={`cursor-pointer hover:bg-slate-800/80 hover:scale-105 flex flex-col items-center justify-center bg-black/40 border border-slate-800 p-6 rounded-3xl transition-all duration-500 delay-100 transform min-h-[180px] shadow-xl ${(transitionTarget === 3 ? 0 : currentStep) >= 5 ? 'translate-y-0 opacity-100 ring-2 ring-rose-500/20' : 'translate-y-10 opacity-0'}`}>
                            <BarChartHorizontal className="text-rose-400 mb-3 shrink-0" size={32} />
                            <span className="text-xs text-slate-500 font-bold uppercase mb-2 text-center leading-tight">Step 4</span>
                            <span className="text-sm font-bold text-rose-100 text-center leading-snug">Select Required Components</span>
                        </div>
                        <div onClick={() => setSelectedSkill('step5')} className={`cursor-pointer hover:bg-slate-800/80 hover:scale-105 flex flex-col items-center justify-center bg-black/40 border border-slate-800 p-6 rounded-3xl transition-all duration-500 delay-100 transform min-h-[180px] shadow-xl ${(transitionTarget === 3 ? 0 : currentStep) >= 6 ? 'translate-y-0 opacity-100 ring-2 ring-fuchsia-500/20' : 'translate-y-10 opacity-0'}`}>
                            <Palette className="text-fuchsia-400 mb-3 shrink-0" size={32} />
                            <span className="text-xs text-slate-500 font-bold uppercase mb-2 text-center leading-tight">Step 5</span>
                            <span className="text-md font-bold text-fuchsia-100 text-center leading-snug">Attach Visual Design</span>
                        </div>
                    </div>
                </div>
             </Slide>

             {/* Slide 4: Unified Build & Render */}
             <Slide isActive={currentSlide === 4} isExiting={currentSlide === 4 && transitionTarget !== null} isEntering={transitionTarget === 4}>
                {/* Titles overlay cross-fade */}
                <div className="relative w-full h-24 flex flex-col items-center justify-end mb-8 mt-4">
                   {/* Phase 2 Title */}
                   <div className={`absolute bottom-0 w-full flex flex-col items-center transition-all duration-1000 ${currentStep === 0 ? 'opacity-100' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
                        <h6 className="text-amber-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                            <Layers /> Phase 2: Assembly
                        </h6>
                        <h2 className="text-white font-bold text-4xl">Dropping into Layout Grid</h2>
                   </div>
                   {/* Phase 3 Title */}
                   <div className={`absolute bottom-0 w-full flex flex-col items-center transition-all duration-1000 ${currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                        <h6 className="text-fuchsia-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                            <Code2 /> Phase 3: Generative Assembly
                        </h6>
                        <h2 className="text-white font-bold text-4xl">The Completed Application</h2>
                   </div>
                </div>

                <div className={`relative w-full max-w-4xl h-[420px] border-2 border-slate-700 rounded-3xl p-6 flex flex-col gap-6 overflow-hidden transition-all duration-[2000ms] ease-out ${currentStep >= 1 ? 'border-solid bg-[#0a0a0a] shadow-[0_0_80px_rgba(236,72,153,0.15)]' : 'border-dashed bg-slate-900/20 shadow-none'}`}>
                    
                    {/* Header Slot */}
                    <div className="relative w-full h-16 shrink-0">
                       {/* Wireframe */}
                       <div className={`absolute inset-0 border border-slate-800 rounded-xl flex items-center px-6 transition-all duration-700 bg-black/40 ${autoStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                           <div className="w-1/3 h-4 bg-slate-800 rounded-full"></div>
                       </div>
                       {/* Hi-Fi Overlay */}
                       <div className={`absolute inset-0 border-b border-slate-800 flex items-center justify-between px-2 bg-[#0a0a0a] transition-all duration-1000 rounded-xl ${autoStep >= 8 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                           <div className="flex gap-3 items-center">
                               <div className="w-8 h-8 bg-blue-500/20 rounded-md border border-blue-500/50"></div>
                               <div className="w-32 h-4 bg-slate-700 rounded-full"></div>
                           </div>
                           <div className="flex gap-4">
                               <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                               <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                           </div>
                       </div>
                    </div>

                    {/* Main Grid Body */}
                    <div className="flex-1 flex gap-6 min-h-0">
                        {/* Map Left Block */}
                        <div className="flex-[1.2] relative h-full">
                             {/* Wireframe bg */}
                             <div className={`absolute inset-0 border border-slate-800 rounded-xl overflow-hidden transition-all duration-1000 bg-black/40 ${autoStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                                 <div className={`absolute inset-0 bg-emerald-500/20 border-2 border-emerald-500 flex flex-col items-center justify-center transition-transform duration-500 ease-out ${autoStep >= 3 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                                     <MapIcon size={48} className="text-emerald-400 shadow-xl mb-4" />
                                     <span className="bg-emerald-900/80 text-emerald-100 px-4 py-1 rounded-full text-xs font-mono font-bold border border-emerald-400/50">{'<UsaMap />'}</span>
                                 </div>
                             </div>

                             {/* Hi-Fi Overlay */}
                             <div className={`absolute inset-0 bg-black border border-slate-800 rounded-2xl overflow-hidden transition-all duration-[1500ms] shadow-[0_0_80px_rgba(59,130,246,0.15)] ${autoStep >= 9 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-10">
                                     <img src="/usa_map.png" alt="USA Regional Distribution" className="w-[85%] h-auto object-contain opacity-90 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
                                 </div>
                                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 to-transparent mix-blend-screen pointer-events-none"></div>
                                 <div className="p-6 relative z-10 pointer-events-none">
                                     <h4 className="text-white font-bold text-xl drop-shadow-md">Regional Distribution</h4>
                                     <div className="h-2 w-24 bg-blue-500/50 rounded-full mt-2 shadow-lg"></div>
                                 </div>
                             </div>
                        </div>

                        {/* Right Stack */}
                        <div className="flex flex-col flex-1 gap-6 h-full">
                            {/* Boxplot Top Right */}
                            <div className="flex-[2] relative w-full">
                                {/* Wireframe */}
                                <div className={`absolute inset-0 border border-slate-800 rounded-xl overflow-hidden transition-all duration-1000 bg-black/40 ${autoStep >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className={`absolute inset-0 bg-rose-500/20 border-2 border-rose-500 flex flex-col items-center justify-center transition-transform duration-500 ease-out ${autoStep >= 5 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                                         <BarChart3 size={32} className="text-rose-400 shadow-xl mb-3" />
                                         <span className="bg-rose-900/80 text-rose-100 px-4 py-1 rounded-full text-xs font-mono font-bold border border-rose-400/50">{'<Boxplot />'}</span>
                                    </div>
                                </div>
                                {/* Hi-Fi */}
                                <div className={`absolute inset-0 bg-black border border-slate-800 rounded-2xl overflow-hidden transition-all duration-[1500ms] shadow-[0_0_40px_rgba(244,63,94,0.1)] ${autoStep >= 10 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-10">
                                         <img src="/variance_quartiles.png" alt="Variance Quartiles" className="w-[85%] h-auto object-contain opacity-90 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] mix-blend-screen" />
                                     </div>
                                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/40 to-transparent mix-blend-screen pointer-events-none"></div>
                                     <div className="p-6 relative z-10 pointer-events-none">
                                         <h4 className="text-white font-bold mb-4 drop-shadow-md">Variance Quartiles</h4>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Table Bottom Right */}
                            <div className="flex-1 relative w-full">
                                {/* Wireframe */}
                                <div className={`absolute inset-0 border border-slate-800 rounded-xl overflow-hidden transition-all duration-1000 bg-black/40 ${autoStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className={`absolute inset-0 bg-blue-500/20 border-2 border-blue-500 flex flex-col items-center justify-center transition-transform duration-500 ease-out ${autoStep >= 7 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                         <TableProperties size={24} className="text-blue-400 shadow-xl mb-2" />
                                         <span className="bg-blue-900/80 text-blue-100 px-3 py-1 rounded-full text-[10px] font-mono font-bold border border-blue-400/50">{'<DataTable />'}</span>
                                    </div>
                                </div>
                                {/* Hi-Fi */}
                                <div className={`absolute inset-0 bg-black border border-slate-800 rounded-2xl overflow-hidden transition-all duration-[1500ms] shadow-[0_0_40px_rgba(16,185,129,0.1)] ${autoStep >= 11 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none"></div>
                                    <div className="p-5 relative z-10 pointer-events-none">
                                        <h4 className="text-white font-bold mb-3 text-sm">Data Records</h4>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-emerald-500/60 rounded-full"></div>
                                            <div className="h-1.5 w-full bg-emerald-500/40 rounded-full"></div>
                                            <div className="h-1.5 w-3/4 bg-emerald-500/20 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Central Wireframe Label - fades out when components drop */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none z-[99] ${autoStep === 0 ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-2xl font-bold tracking-widest text-slate-500 uppercase bg-[#0a0a0a] px-6 py-2 rounded-full border border-slate-800 shadow-2xl">CSS Grid Layout</span>
                    </div>
                </div>
             </Slide>

             {/* Slide 5: Validation loop */}
             <Slide isActive={currentSlide === 5} isExiting={currentSlide === 5 && transitionTarget !== null} isEntering={transitionTarget === 5}>
                <h6 className="text-white uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                    <ScanSearch /> Phase 4: Quality Assurance
                </h6>
                <h2 className="text-white font-bold text-4xl mb-12">The Multimodal Sandbox</h2>
                <Typography variant="p" className="text-slate-400 max-w-2xl mb-12 mx-auto">
                     Instead of dropping raw AI code onto the user, the system verifies its own work visually to catch any layout hallucinations.
                </Typography>

                <div className="flex items-center justify-center gap-4 max-w-5xl w-full">
                    <div className={`flex-1 flex flex-col items-center justify-center bg-black/40 border border-slate-700 p-8 rounded-2xl min-h-[220px] shadow-xl transition-all duration-700 transform ${(transitionTarget === 5 ? 0 : currentStep) >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <LayoutDashboard size={48} className="text-emerald-400 mb-4" />
                        <h4 className="text-xl text-white font-bold text-center">Data App</h4>
                        <span className="text-sm text-slate-400 mt-2 text-center">React Application</span>
                    </div>
                    
                    <ArrowRightIcon className={`text-slate-600 transition-opacity duration-500 delay-300 ${(transitionTarget === 5 ? 0 : currentStep) >= 2 ? 'opacity-100' : 'opacity-0'}`} size={32} />
                    
                    <div className={`flex-1 flex flex-col items-center justify-center bg-blue-900/20 border border-blue-500/30 p-8 rounded-2xl min-h-[220px] shadow-xl transition-all duration-700 delay-[400ms] transform ${(transitionTarget === 5 ? 0 : currentStep) >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <ScanSearch size={48} className="text-blue-400 mb-4" />
                        <h4 className="text-xl text-blue-100 font-bold text-center">Chrome Render</h4>
                        <span className="text-sm text-blue-300/60 mt-2 text-center">Playwright Sandbox</span>
                    </div>

                    <ArrowRightIcon className={`text-slate-600 transition-opacity duration-500 delay-[800ms] ${(transitionTarget === 5 ? 0 : currentStep) >= 3 ? 'opacity-100' : 'opacity-0'}`} size={32} />
                    
                    <div className={`flex-1 flex flex-col items-center justify-center bg-fuchsia-900/20 border border-fuchsia-500/30 p-8 rounded-2xl relative min-h-[220px] shadow-xl transition-all duration-700 delay-[1000ms] transform ${(transitionTarget === 5 ? 0 : currentStep) >= 3 ? 'opacity-100 -translate-y-2 scale-105' : 'opacity-0 translate-y-0 scale-95'}`}>
                        <div className={`absolute inset-0 bg-fuchsia-500/20 blur-xl rounded-full z-0 transition-opacity duration-500 ${(transitionTarget === 5 ? 0 : currentStep) >= 3 ? 'animate-pulse opacity-100' : 'opacity-0'}`}></div>
                        <CheckCircle2 size={48} className="text-fuchsia-400 mb-4 z-10" />
                        <h4 className="text-xl text-fuchsia-100 font-bold z-10 text-center">Vision Critique</h4>
                        <span className="text-sm text-fuchsia-300/60 mt-2 z-10 text-center">Gemini Multimodal</span>
                    </div>
                </div>
             </Slide>

             {/* Slide 6: Vision Critique Breakdown */}
             <Slide isActive={currentSlide === 6} isExiting={currentSlide === 6 && transitionTarget !== null} isEntering={transitionTarget === 6}>
                <h6 className="text-amber-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 justify-center text-sm">
                    <CheckCircle2 /> Phase 5: Feedback Loop
                </h6>
                <h2 className="text-white font-bold text-4xl mb-12">The QA Checklist</h2>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full text-left">
                    {/* Visual representation of checking */}
                    <div className={`border border-slate-700 rounded-3xl bg-[#0a0a0a] overflow-hidden relative min-h-[360px] shadow-2xl transition-opacity duration-700 ${(transitionTarget === 6 ? 0 : currentStep) >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 drop-shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                             <div className="w-[80%] h-[70%] border-4 border-fuchsia-500/80 rounded-2xl flex flex-col p-4 gap-4">
                                 {/* Navbar wireframe */}
                                 <div className="h-8 w-full border-2 border-fuchsia-500/50 rounded-lg flex items-center px-4 gap-3">
                                     <div className="h-3 w-3 rounded-full bg-fuchsia-500/50"></div>
                                     <div className="h-3 w-3 rounded-full bg-fuchsia-500/50"></div>
                                     <div className="h-3 w-3 rounded-full bg-fuchsia-500/50"></div>
                                     <div className="h-3 w-24 bg-fuchsia-500/30 rounded-sm ml-auto"></div>
                                 </div>
                                 {/* Body wireframe */}
                                 <div className="flex-1 flex gap-4 w-full">
                                     {/* Sidebar */}
                                     <div className="flex-[0.5] border-2 border-fuchsia-500/50 rounded-lg flex flex-col gap-3 p-3">
                                         <div className="h-2 w-full bg-fuchsia-500/30 rounded-full"></div>
                                         <div className="h-2 w-full bg-fuchsia-500/30 rounded-full"></div>
                                         <div className="h-2 w-3/4 bg-fuchsia-500/30 rounded-full"></div>
                                         <div className="h-2 w-full bg-fuchsia-500/30 rounded-full"></div>
                                     </div>
                                     {/* Main Content */}
                                     <div className="flex-[1.5] border-2 border-fuchsia-500/50 rounded-lg flex flex-col gap-4 p-4">
                                         <div className="flex gap-4">
                                             <div className="flex-1 h-12 border-2 border-fuchsia-500/30 rounded-lg mix-blend-screen"></div>
                                             <div className="flex-1 h-12 border-2 border-fuchsia-500/30 rounded-lg mix-blend-screen"></div>
                                             <div className="flex-1 h-12 border-2 border-fuchsia-500/30 rounded-lg mix-blend-screen"></div>
                                         </div>
                                         <div className="flex-1 border-2 border-dashed border-fuchsia-500/40 rounded-lg flex items-center justify-center mix-blend-screen">
                                             <div className="h-10 w-10 rounded-full border-4 border-fuchsia-500/40"></div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Scanning lines */}
                         <div className={`absolute top-0 left-0 right-0 h-1 bg-fuchsia-500 shadow-[0_0_20px_#d946ef] transition-all duration-[3000ms] ease-in-out w-full ${(transitionTarget === 6 ? 0 : currentStep) >= 1 ? 'translate-y-80' : 'translate-y-0'}`}></div>
                         
                         <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className={`bg-fuchsia-900/80 border border-fuchsia-500 shadow-xl text-fuchsia-100 p-3 rounded-lg text-sm w-max transition-all duration-500 transform ${(transitionTarget === 6 ? 0 : currentStep) >= 1 ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-8'}`}>
                               <ScanSearch size={16} className="inline mr-2"/> "Hex color mismatch detected"
                            </div>
                            <div className={`bg-emerald-900/80 border border-emerald-500 shadow-xl text-emerald-100 p-3 rounded-lg text-sm w-max self-end transition-all duration-500 delay-200 transform ${(transitionTarget === 6 ? 0 : currentStep) >= 2 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'}`}>
                               <ShieldCheck size={16} className="inline mr-2"/> "Padding matches Layout system"
                            </div>
                            <div className={`bg-blue-900/80 border border-blue-500 shadow-xl text-blue-100 p-3 rounded-lg text-sm w-max transition-all duration-500 delay-400 transform ${(transitionTarget === 6 ? 0 : currentStep) >= 3 ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-8'}`}>
                               <FileCode2 size={16} className="inline mr-2"/> "Missing Typography skill"
                            </div>
                         </div>
                    </div>
                    
                    {/* The Checklist */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className={`flex items-start gap-4 transition-all duration-500 ${(transitionTarget === 6 ? 0 : currentStep) >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                           <div className="p-4 bg-fuchsia-500/20 text-fuchsia-400 rounded-full shrink-0 ring-1 ring-fuchsia-500/50"><Palette size={24}/></div>
                           <div>
                               <h4 className="text-white font-bold text-xl mb-2">Visual Spec Verification</h4>
                               <p className="text-slate-400 text-sm leading-relaxed">The Vision model compares exact pixels in the Chromium render to strict hex scales set in the skill files. Generic coloring gets rejected immediately.</p>
                           </div>
                        </div>
                        <div className={`flex items-start gap-4 transition-all duration-500 ${(transitionTarget === 6 ? 0 : currentStep) >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                           <div className="p-4 bg-amber-500/20 text-amber-400 rounded-full shrink-0 ring-1 ring-amber-500/50"><LayoutTemplate size={24}/></div>
                           <div>
                               <h4 className="text-white font-bold text-xl mb-2">Layout Overlap Checks</h4>
                               <p className="text-slate-400 text-sm leading-relaxed">It scans for shattered flex-boxes, colliding text labels, or components breaking out of their predefined grid container constraints.</p>
                           </div>
                        </div>
                        <div className={`flex items-start gap-4 transition-all duration-500 ${(transitionTarget === 6 ? 0 : currentStep) >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                           <div className="p-4 bg-blue-500/20 text-blue-400 rounded-full shrink-0 ring-1 ring-blue-500/50"><FileCode2 size={24}/></div>
                           <div>
                               <h4 className="text-white font-bold text-xl mb-2">Skill Verification</h4>
                               <p className="text-slate-400 text-sm leading-relaxed">It catalogs exactly which design system skills were successfully implemented and highlights missing skills to guide future generation tasks.</p>
                           </div>
                        </div>
                        <div className={`flex items-start gap-4 transition-all duration-500 ${(transitionTarget === 6 ? 0 : currentStep) >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                           <div className="p-4 bg-rose-500/20 text-rose-400 rounded-full shrink-0 ring-1 ring-rose-500/50"><Cpu size={24}/></div>
                           <div>
                               <h4 className="text-white font-bold text-xl mb-2">Self-Correction Engine</h4>
                               <p className="text-slate-400 text-sm leading-relaxed">Failures directly trigger a secondary loop, forcing the orchestrator to correct its component injections until QA passes completely.</p>
                           </div>
                        </div>
                    </div>
                </div>
             </Slide>

             {/* Slide 7: Conclusion */}
             <Slide isActive={currentSlide === 7} isExiting={currentSlide === 7 && transitionTarget !== null} isEntering={transitionTarget === 7}>
                 <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20 animate-in zoom-in duration-700">
                     <Code2 size={64} className="text-white" />
                 </div>
                 <h1 className={`text-white font-extrabold tracking-tight mb-6 transition-all duration-[1500ms] delay-300 ${!(currentSlide === 7 && transitionTarget !== null) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`} style={{ fontSize: '4.5rem', lineHeight: '1.1' }}>
                    Hyperskills.
                 </h1>
                 <Typography variant="h4" as="p" className="text-slate-400 max-w-2xl font-normal leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationFillMode: 'both', animationDelay: '500ms' }}>
                    The Cloud Data VS Code Extension acts as an intelligent partner, generating expert components perfectly formatted to your Design System.
                 </Typography>
                 <button 
                   onClick={() => {
                     if (document.fullscreenElement) document.exitFullscreen();
                     onBack();
                   }}
                   className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors animate-in fade-in shadow-xl cursor-pointer"
                   style={{ animationFillMode: 'both', animationDelay: '1000ms' }}
                 >
                     Exit Presentation
                 </button>
             </Slide>

        </div>

        {/* Skill Detail Modal */}
        {selectedSkill && (() => {
            const SkillInfo = skillDetails[selectedSkill];
            const IconComponent = SkillInfo.Icon;
            return (
                <div className="absolute inset-0 z-[200] flex items-center justify-center p-12">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedSkill(null)}></div>
                    <div className="relative bg-[#0a0a0a] border border-slate-700 p-10 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row gap-12 text-left animate-in fade-in zoom-in-90 duration-300">
                        <button 
                           onClick={() => setSelectedSkill(null)}
                           className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer z-50 p-2 hover:bg-slate-800 rounded-full"
                        >
                           <X size={24} />
                        </button>
                        
                        <div className="flex-1 flex flex-col justify-center">
                            <div className={`${SkillInfo.colorClass} p-4 rounded-2xl border inline-flex items-center justify-center mb-6 shadow-lg self-start`}>
                                <IconComponent size={40} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">{SkillInfo.title}</h3>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                {SkillInfo.description}
                            </p>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center relative">
                            <SkillAnimation step={selectedSkill} />
                        </div>
                    </div>
                </div>
            );
        })()}

        {/* Bottom Navigation & Progress Bar */}
        <div className="relative z-50 bg-black/60 backdrop-blur-xl border-t border-slate-900 p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button 
                  onClick={handlePrev}
                  disabled={currentSlide === 0 && currentStep === 0}
                  className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors flex items-center gap-2 font-bold cursor-pointer"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                
                {/* Progress Indicators */}
                <div className="flex gap-2">
                    {slideConfigs.map((_, i) => (
                        <div 
                           key={i} 
                           className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? "w-8 bg-blue-500" : i < currentSlide ? "w-2 bg-blue-900" : "w-2 bg-slate-800"}`}
                        />
                    ))}
                </div>

                <button 
                  onClick={handleNext}
                  disabled={currentSlide === slideConfigs.length - 1 && currentStep === slideConfigs[slideConfigs.length - 1].maxSteps}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-colors flex items-center gap-2 font-bold cursor-pointer"
                >
                  Next <ArrowRightIcon size={16} />
                </button>
            </div>
            {/* Step Sub-Progress Bar (Invisible structural hint) */}
            <div className="absolute top-0 left-0 h-0.5 bg-blue-500 transition-all duration-500" style={{ width: `${((currentSlide + (currentStep / Math.max(1, slideConfigs[currentSlide]?.maxSteps))) / slideConfigs.length) * 100}%`}}></div>
        </div>
    </div>
  );
}
