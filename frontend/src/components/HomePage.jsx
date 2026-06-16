import React from 'react';

const GC_BLUE = '#1a73e8';
const TEXT_PRIMARY = '#202124';
const TEXT_SECONDARY = '#5f6368';
const BORDER = '#dadce0';
const SURFACE = '#ffffff';
const BG_SUBTLE = '#f8f9fa';

// Shared card style — used everywhere so all cards are on-theme
const cardStyle = {
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '20px 24px',
};

const sectionHeaderStyle = {
  fontSize: 16,
  fontWeight: 500,
  color: TEXT_PRIMARY,
  marginBottom: 4,
  fontFamily: "'Google Sans', Roboto, sans-serif",
};

const sectionSubStyle = {
  fontSize: 13,
  color: TEXT_SECONDARY,
  marginBottom: 20,
  fontFamily: 'Roboto, sans-serif',
};

// Navigation quick-links at the top — the GC console "What do you want to do?" pattern
const QUICK_LINKS = [
  { icon: 'palette',        label: 'Themes Library',              desc: 'Create and manage visual themes' },
  { icon: 'apps',           label: 'App Playground',              desc: 'Generate apps from a prompt' },
  { icon: 'bar_chart',      label: 'Charts: Standard',            desc: 'Bar, line, scatter charts' },
  { icon: 'tune',           label: 'Inputs & Controls',           desc: 'Forms, selects, toggles' },
  { icon: 'table_chart',    label: 'Tables & Data Grids',         desc: 'Data table patterns' },
  { icon: 'auto_awesome',   label: 'Gemini Chat',                 desc: 'Chat UI components' },
];

// System overview rows — plain table-like layout like GC resource lists
const PLATFORM_LAYERS = [
  {
    icon: 'foundation',
    name: 'Foundation',
    desc: 'Visual specs, design tokens, color, typography, and spacing rules compiled into Skill Files for LLM consumption.',
    items: ['Color tokens', 'Typography scale', 'Spacing system', 'Dark mode specs'],
  },
  {
    icon: 'account_tree',
    name: 'Architecture',
    desc: 'Router and Orchestrator logic that maps user intent to component skills and injects the right context into each AI prompt.',
    items: ['Orchestrator', 'Router', 'Prompt injection', 'Skill selection'],
  },
  {
    icon: 'widgets',
    name: 'Components',
    desc: 'UI catalog covering forms, tables, buttons, KPI cards, navigation, feedback states, and interactive patterns.',
    items: ['Forms & inputs', 'Data tables', 'Navigation', 'Feedback & status'],
  },
  {
    icon: 'analytics',
    name: 'Visualizations',
    desc: 'ECharts-based chart skills covering standard charts, time series, distributions, maps, and specialized geometries.',
    items: ['Standard charts', 'Time & trends', 'Maps & geodata', 'Proportions'],
  },
];

export default function HomePage({ onNavigate }) {
  const nav = (section) => onNavigate && onNavigate(section);

  return (
    <div style={{ maxWidth: 960, display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Page header ── */}
      <div>
        <h1 style={{
          fontSize: 24, fontWeight: 400, color: TEXT_PRIMARY, margin: '0 0 4px',
          fontFamily: "'Google Sans', Roboto, sans-serif",
        }}>
          Hyperskills Design System
        </h1>
        <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
          A UI specification system that compiles design tokens into Skill Files for AI-powered app generation.
        </p>
      </div>

      {/* ── Quick navigation ── */}
      <section>
        <div style={sectionHeaderStyle}>Get started</div>
        <div style={sectionSubStyle}>Navigate directly to a section of the design system.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden', background: BORDER }}>
          {QUICK_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => nav(link.label)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '16px 18px', background: SURFACE,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background .12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = BG_SUBTLE}
              onMouseLeave={e => e.currentTarget.style.background = SURFACE}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: GC_BLUE, flexShrink: 0, marginTop: 1 }}>
                {link.icon}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: GC_BLUE, fontFamily: "'Google Sans', Roboto, sans-serif", marginBottom: 2 }}>
                  {link.label}
                </div>
                <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: 'Roboto, sans-serif' }}>
                  {link.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Platform layers ── */}
      <section>
        <div style={sectionHeaderStyle}>Platform overview</div>
        <div style={sectionSubStyle}>How intelligence is organized across the system.</div>
        <div style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          {PLATFORM_LAYERS.map((layer, i) => (
            <div
              key={layer.name}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '18px 24px',
                borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
                background: SURFACE,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#5f6368', flexShrink: 0, marginTop: 1 }}>
                {layer.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY, fontFamily: "'Google Sans', Roboto, sans-serif", marginBottom: 4 }}>
                  {layer.name}
                </div>
                <div style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: 'Roboto, sans-serif', lineHeight: 1.5, marginBottom: 8 }}>
                  {layer.desc}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {layer.items.map(item => (
                    <span key={item} style={{
                      fontSize: 11, color: '#3c4043',
                      background: BG_SUBTLE, border: `1px solid ${BORDER}`,
                      borderRadius: 4, padding: '2px 8px',
                      fontFamily: 'Roboto, sans-serif',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The lifecycle ── */}
      <section>
        <div style={sectionHeaderStyle}>How it works</div>
        <div style={sectionSubStyle}>From design tokens to a running application in four steps.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { step: '1', icon: 'edit_note',       label: 'Skill Authoring',   desc: 'Visual editors compile brand rules into structured Skill Files (.md).' },
            { step: '2', icon: 'account_tree',    label: 'Context Reasoning', desc: 'The Router injects relevant skills into the AI prompt based on intent.' },
            { step: '3', icon: 'code',            label: 'Generative Build',  desc: 'Gemini generates React JSX mapped to your data schemas and visual rules.' },
            { step: '4', icon: 'visibility',      label: 'Multimodal QA',     desc: 'Gemini Vision critiques alignment, responsiveness, and spec adherence.' },
          ].map(({ step, icon, label, desc }) => (
            <div key={step} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#e8f0fe', color: GC_BLUE,
                  fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontFamily: 'Roboto, sans-serif',
                }}>{step}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#5f6368' }}>{icon}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY, fontFamily: "'Google Sans', Roboto, sans-serif", marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: 'Roboto, sans-serif', lineHeight: 1.55 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── App Playground CTA — plain card, no gradient ── */}
      <section>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: GC_BLUE, flexShrink: 0, marginTop: 2 }}>
              apps
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY, fontFamily: "'Google Sans', Roboto, sans-serif", marginBottom: 4 }}>
                App Playground
              </div>
              <div style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: 'Roboto, sans-serif', lineHeight: 1.5 }}>
                Provide a prompt and watch as the AI reasons through your Skill Files and generates a fully functional React application.
              </div>
            </div>
          </div>
          <button
            onClick={() => nav('App Playground')}
            style={{
              flexShrink: 0, height: 36, padding: '0 20px',
              background: GC_BLUE, color: '#fff',
              border: 'none', borderRadius: 4, cursor: 'pointer',
              fontSize: 14, fontWeight: 500, fontFamily: "'Google Sans', Roboto, sans-serif",
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1557b0'}
            onMouseLeave={e => e.currentTarget.style.background = GC_BLUE}
          >
            Open playground
          </button>
        </div>
      </section>

    </div>
  );
}
