import React from 'react';
import { 
  Layers, 
  FileJson, 
  Component, 
  Cpu, 
  Palette, 
  LayoutTemplate, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Search,
  BrainCircuit,
  Eye
} from 'lucide-react';
import Typography from './Typography';

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-700 slide-in-from-bottom-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 px-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-xs font-bold tracking-wider uppercase">
            <Zap size={14} /> The Future of Data Apps
          </div>
          
          <div className="space-y-4">
            <Typography variant="h1" className="text-slate-900 dark:text-slate-50 font-extrabold tracking-tight leading-tight">
              DAK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-fuchsia-600">Hyperskills</span>
            </Typography>
            <Typography variant="h5" as="p" className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              An intelligent design system that transforms UI specifications into high-performance "Skills"—enabling AI to generate complete, brand-consistent applications in seconds.
            </Typography>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('How It Works');
                  } else {
                    document.getElementById('lifecycle-section')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-slate-900/10"
            >
              How it Works <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* The Intelligent Lifecycle */}
      <section id="lifecycle-section" className="space-y-12">
        <div className="text-center space-y-2">
            <Typography variant="h3" className="font-bold">The Intelligent Lifecycle</Typography>
            <Typography variant="p" className="text-slate-500">From design tokens to multimodal validation.</Typography>
        </div>

        <div className="grid md:grid-cols-4 gap-4 relative">
          {/* Phase 1 */}
          <div className="relative group p-6 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all shadow-sm">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Palette size={24} />
            </div>
            <Typography variant="h6" className="mb-2">1. Skill Authoring</Typography>
            <Typography variant="sm" className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Define your brand's soul using visual editors. Specs are compiled into structured <strong>Skill Files</strong> (.md) for LLM consumption.
            </Typography>
          </div>

          {/* Phase 2 */}
          <div className="relative group p-6 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-500/50 transition-all shadow-sm">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit size={24} />
            </div>
            <Typography variant="h6" className="mb-2">2. Context Reasoning</Typography>
            <Typography variant="sm" className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Our <strong>Router & Orchestrator</strong> selectively injects relevant components and architecture rules into the AI prompt based on user intent.
            </Typography>
          </div>

          {/* Phase 3 */}
          <div className="relative group p-6 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all shadow-sm">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu size={24} />
            </div>
            <Typography variant="h6" className="mb-2">3. Generative Build</Typography>
            <Typography variant="sm" className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Gemini builds a functional React application, mapping data schemas and visual rules into high-performance JSX with realistic mock data.
            </Typography>
          </div>

          {/* Phase 4 */}
          <div className="relative group p-6 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-fuchsia-500/50 transition-all shadow-sm">
            <div className="w-12 h-12 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye size={24} />
            </div>
            <Typography variant="h6" className="mb-2">4. Multimodal QA</Typography>
            <Typography variant="sm" className="text-slate-500 dark:text-slate-400 leading-relaxed">
              A headless browser renders the app, allowing <strong>Gemini Vision</strong> to critique alignment, responsiveness, and design adherence.
            </Typography>
          </div>
        </div>
      </section>

      {/* Skill Architecture */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
                <Typography variant="h3" className="font-bold flex items-center gap-3">
                  <Layers className="text-blue-500" /> Skill Architecture
                </Typography>
                <Typography variant="p" className="text-slate-500">How we organize intelligence across the platform.</Typography>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Foundation */}
          <div className="p-6 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
               <Palette size={20} />
               <Typography variant="h6" className="m-0">Foundation</Typography>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Visual Spec:</strong> Tokens and hex-perfect theme rules.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Layout:</strong> Grid systems and responsive containers.</span>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="p-6 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
               <ShieldCheck size={20} />
               <Typography variant="h6" className="m-0">Architecture</Typography>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Orchestrator:</strong> Logic for app assembly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>Router:</strong> Maps user intent to component skills.</span>
              </li>
            </ul>
          </div>

          {/* Components */}
          <div className="p-6 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
               <Component size={20} />
               <Typography variant="h6" className="m-0">Components</Typography>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>UI Catalog:</strong> Forms, Tables, Buttons, and KPI Cards.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Interaction:</strong> Hover, Active, and Feedback states.</span>
              </li>
            </ul>
          </div>

          {/* Visualizations */}
          <div className="p-6 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
               <LayoutTemplate size={20} />
               <Typography variant="h6" className="m-0">Visualizations</Typography>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span><strong>ECharts Skills:</strong> Complex geometries and trends.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span><strong>Maps:</strong> Geo-spatial data and choropleths.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Typography variant="h2" className="text-white font-bold mb-4">Ready to test the playground?</Typography>
          <Typography variant="p" className="text-blue-100 max-w-xl mx-auto mb-8">
            Navigate to the App Playground to experience the full lifecycle. Provide a prompt and watch as the AI reasons through your skills and builds a functional application.
          </Typography>
          <button 
             onClick={() => {
                // This is a hacky way to trigger a state change in the parent but it works for a demo
                const sidebar = document.getElementById('main-nav-sidebar');
                const playgroundBtn = sidebar?.querySelector('button:last-of-type');
                if (playgroundBtn instanceof HTMLButtonElement) playgroundBtn.click();
             }}
             className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Open App Playground
          </button>
      </section>
    </div>
  );
}
