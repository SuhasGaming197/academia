import React, { useState } from 'react';
import { 
  Navigation, Anchor, Footprints, Clock, Flame, Coffee, Laptop, 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Volume2
} from 'lucide-react';

export default function LazyCommutePlanner() {
  const [origin, setOrigin] = useState('dorm-d2');
  const [destination, setDestination] = useState('lecture-hall-l4');
  const [raftDeckSetup, setRaftDeckSetup] = useState('laptop'); // 'laptop' | 'coffee' | 'reading'

  const locations = [
    { id: 'dorm-d1', name: 'Dormitory D1 (West Tower)', zone: 'Residential' },
    { id: 'dorm-d2', name: 'Dormitory D2 (Canal Suites)', zone: 'Residential' },
    { id: 'dorm-d3', name: 'Dormitory D3 (East Quad)', zone: 'Residential' },
    { id: 'library', name: 'Grand Academic Library', zone: 'Academic' },
    { id: 'lecture-hall-l4', name: 'Lecture Hall L4 (Quantum Physics)', zone: 'Academic' },
    { id: 'research-labs', name: 'Research Labs (R1-R4)', zone: 'Academic' },
    { id: 'student-ctr', name: 'Student Center & Cafeteria', zone: 'Social' },
    { id: 'waterpark-entrance', name: 'Waterpark Paradise Entrance & Lockers', zone: 'Waterpark' },
    { id: 'wave-pool', name: 'Wave Pool & Beach Dock', zone: 'Waterpark' },
    { id: 'slide-tower', name: 'Vertical Drop Slide Tower Dock', zone: 'Waterpark' },
  ];

  // Calculate distance matrix approximation
  const distMinutesRaft = 4.2;
  const distMinutesWalk = 8.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Anchor style={{ color: 'var(--accent-teal)' }} size={28} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>The "Lazy Commute" Route Planner</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Dry commuter raft transit system on slow-moving scenic canal. Zero swimming gear needed—just drop your backpack and float to class.
          </p>
        </div>

        <span className="badge badge-emerald">
          <ShieldCheck size={14} /> 100% Dry Guarantee • No Swimmers Allowed in Transit Loop
        </span>
      </div>

      {/* Origin -> Destination Selector Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
          
          {/* Origin Dropdown */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              DEPARTURE POINT (ORIGIN)
            </label>
            <select 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(6, 14, 28, 0.9)', color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: '600'
              }}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.zone})</option>
              ))}
            </select>
          </div>

          {/* Arrow Divider */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px' }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '12px', borderRadius: '50%', border: '1px solid var(--border-glow)' }}>
              <ArrowRight size={20} style={{ color: 'var(--accent-cyan)' }} />
            </div>
          </div>

          {/* Destination Dropdown */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              ARRIVAL POINT (DESTINATION)
            </label>
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(6, 14, 28, 0.9)', color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: '600'
              }}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.zone})</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Comparison Grid: Dry Raft Float vs Standard Walk */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Dry Commuter Raft Option (Recommended) */}
        <div className="glass-panel" style={{ padding: '24px', borderColor: 'var(--accent-teal)', background: 'rgba(0, 255, 210, 0.04)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Anchor size={20} style={{ color: 'var(--accent-teal)' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-teal)' }}>Dry Commuter Raft (Recommended)</h3>
            </div>
            <span className="badge badge-emerald">Vibe Level: 100%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FLOAT TIME</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', marginTop: '2px' }}>
                {distMinutesRaft} mins
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PHYSICAL EFFORT</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                0 Cal (Rest)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Dry carpet floor for laptops, backpacks & textbook reading</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Covered canopy protects from rain/snow during transit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>High-speed campus Wi-Fi & USB charging ports onboard</span>
            </div>
          </div>
        </div>

        {/* Standard Walking Option */}
        <div className="glass-panel" style={{ padding: '24px', opacity: 0.75, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Footprints size={20} style={{ color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Standard Foot Commute</h3>
            </div>
            <span className="badge badge-amber">Effort Required</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WALKING TIME</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>
                {distMinutesWalk} mins
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CALORIES BURNED</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginTop: '2px' }}>
                48 Cal
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Walking requires carrying heavy backpacks across outdoor sidewalks. Not recommended when you could be effortlessly floating in a dry raft enjoying iced coffee.
          </p>
        </div>

      </div>

      {/* Interactive Commuter Raft Deck Experience Mockup */}
      <div className="glass-panel" style={{ padding: '24px', background: '#050c18' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={18} style={{ color: 'var(--accent-amber)' }} /> Onboard Raft Experience Preview
          </h3>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn-secondary ${raftDeckSetup === 'laptop' ? 'btn-primary' : ''}`}
              onClick={() => setRaftDeckSetup('laptop')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Laptop size={14} /> Scroll / Study Laptop
            </button>
            <button 
              className={`btn-secondary ${raftDeckSetup === 'coffee' ? 'btn-primary' : ''}`}
              onClick={() => setRaftDeckSetup('coffee')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Coffee size={14} /> Sip Coffee & Relax
            </button>
          </div>
        </div>

        {/* Graphic Raft Deck Simulator */}
        <div style={{ height: '220px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(180deg, #091a2e 0%, #030a14 100%)', border: '1px solid var(--border-glow)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Water reflection animation behind raft */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(ellipse at center, var(--accent-cyan) 0%, transparent 70%)', animation: 'pulseGlow 4s infinite' }}></div>

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
              {raftDeckSetup === 'laptop' ? '💻📱☕' : '📖🎧🌿'}
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
              Floating on Canal Current at 1.5 m/s
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', marginTop: '4px' }}>
              ETA to {locations.find(l => l.id === destination)?.name}: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>3 mins 12 secs</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
