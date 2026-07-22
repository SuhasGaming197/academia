import React, { useState } from 'react';
import CampusMap from './components/CampusMap';
import ClimateControl from './components/ClimateControl';
import LazyCommutePlanner from './components/LazyCommutePlanner';
import DomeFEASimulator from './components/DomeFEASimulator';
import FluidDynamicsSim from './components/FluidDynamicsSim';
import StudentDashboard from './components/StudentDashboard';

import { 
  Building2, Waves, Thermometer, Anchor, Cpu, Award, 
  Sparkles, Sun, Snowflake, ShieldCheck, Navigation, Volume2, VolumeX
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'climate' | 'commute' | 'fea' | 'fluid' | 'student'
  const [selectedNode, setSelectedNode] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const tabs = [
    { id: 'map', label: 'Master Campus Map', icon: Building2 },
    { id: 'climate', label: '365-Day Climate Dome', icon: Thermometer },
    { id: 'commute', label: '"Lazy Commute" Transit', icon: Anchor },
    { id: 'fea', label: 'Dome FEA Stress Test', icon: Cpu },
    { id: 'fluid', label: 'Canal Hydrodynamics', icon: Waves },
    { id: 'student', label: 'Student Life & KPIs', icon: Award },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo & Institution Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)', padding: '10px', borderRadius: 'var(--radius-md)', display: 'flex', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' }}>
              <Waves size={26} style={{ color: '#030811' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }} className="glow-text">
                  AQUADEMIA
                </h1>
                <span className="badge badge-cyan">INSTITUTE OF HYDRO-ENGINEERING</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Elite Academic Institution & 365-Day Biodome Waterpark Campus
              </p>
            </div>
          </div>

          {/* Top Telemetry Ticker & Audio Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', background: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--accent-emerald)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-emerald)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Biodome Dome:</span>
                <span style={{ fontWeight: '700', color: '#fff' }}>Heated 84°F</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Commuter Stream:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>1.5 m/s</span>
              </div>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '36px', height: '36px', color: soundEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={soundEnabled ? 'Ambient Water Audio Active' : 'Enable Ambient Sound'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Navigation Tabs Bar */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="glass-panel"
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'map' && <CampusMap selectedNode={selectedNode} setSelectedNode={setSelectedNode} weatherMode="normal" />}
        {activeTab === 'climate' && <ClimateControl />}
        {activeTab === 'commute' && <LazyCommutePlanner />}
        {activeTab === 'fea' && <DomeFEASimulator />}
        {activeTab === 'fluid' && <FluidDynamicsSim />}
        {activeTab === 'student' && <StudentDashboard />}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(4, 9, 17, 0.95)', padding: '20px 32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>AQUADEMIA CAMPUS & WATERPARK PLATFORM</strong> • Engineered with React, FEA Hydrodynamics & 365-Day Climate Controls
          </div>
          <div>
            Student Retention Rate: <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>99.4%</span> | Waterpark Pool Temp: <span style={{ color: 'var(--accent-teal)', fontWeight: '700' }}>84°F</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
