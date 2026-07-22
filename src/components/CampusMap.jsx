import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Waves, Compass, Navigation, Eye, Sun, ShieldAlert,
  Thermometer, Users, Sparkles, Anchor, Info, ArrowUpRight, Zap
} from 'lucide-react';

export default function CampusMap({ selectedNode, setSelectedNode, weatherMode }) {
  const [activeView, setActiveView] = useState('blueprint'); // 'blueprint' | 'heat' | '3d-perspective'
  const [boatSpeed, setBoatSpeed] = useState(1.5); // m/s
  const [raftCount, setRaftCount] = useState(5);
  const [filterZone, setFilterZone] = useState('all'); // 'all' | 'academic' | 'waterpark' | 'transit'

  // Canvas ref for animating raft positions along the track
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Buildings data mapping exact layout
  const zones = {
    academic: [
      { id: 'lecture-halls', name: 'Lecture Halls (L1-L6)', code: 'L1-L6', x: 120, y: 150, width: 140, height: 80, desc: 'High-tech smart auditoriums with real-time stream sync and raft-side docking access.', capacity: '2,400 students', temp: '72°F' },
      { id: 'research-labs', name: 'Research Labs (R1-R4)', code: 'R1-R4', x: 300, y: 150, width: 110, height: 80, desc: 'Advanced FEA structural engineering and hydrodynamics research facilities.', capacity: '450 researchers', temp: '70°F' },
      { id: 'library', name: 'Grand Academic Library', code: 'LIB', x: 120, y: 260, width: 140, height: 75, desc: 'Multi-story silent study hall with panoramic glass view facing the waterpark biodome.', capacity: '1,200 students', temp: '71°F' },
      { id: 'student-center', name: 'Student Center', code: 'STU-CTR', x: 300, y: 270, width: 110, height: 110, desc: 'Central dining, social lounges, raft ticket office, and smoothie bars.', capacity: '1,800 students', temp: '73°F' },
      { id: 'dormitories', name: 'Dormitories (D1, D2, D3)', code: 'D1-D3', x: 120, y: 360, width: 140, height: 75, desc: 'Resort-style student suites with direct elevator access to the Water Transit Canal Dock.', capacity: '3,200 residents', temp: '72°F' },
      { id: 'faculty-housing', name: 'Faculty Housing', code: 'FAC-HSG', x: 300, y: 410, width: 110, height: 60, desc: 'Quiet residential villas with private small-boat canal access.', capacity: '350 faculty', temp: '72°F' },
      { id: 'admin', name: 'Administration Building', code: 'ADM', x: 120, y: 460, width: 140, height: 60, desc: 'Campus operations, dean offices, and safety control headquarters.', capacity: '150 staff', temp: '71°F' },
      { id: 'energy-ctr', name: 'Plant & Geothermal Energy Center', code: 'PWR-CTR', x: 300, y: 490, width: 110, height: 40, desc: 'Zero-emission geothermal heating system powering 365-day heated waterpark pools.', capacity: 'Automated', temp: '85°F system' },
    ],
    transit: [
      { id: 'dock-dorm1', name: 'Dorm 1 & 2 Canal Dock', x: 450, y: 180, desc: 'Commuter raft boarding point for residential towers D1-D3.', queueTime: '0 min (Continuous rafts)' },
      { id: 'dock-library', name: 'Library & Tech Dock', x: 450, y: 270, desc: 'Express dock for quiet study halls and research labs R1-R4.', queueTime: '0 min' },
      { id: 'dock-lecture', name: 'Lecture Halls Dock', x: 450, y: 350, desc: 'Main academic exchange terminal with 6 covered loading bays.', queueTime: '1 min peak' },
      { id: 'dock-student-ctr', name: 'Student Center Dock', x: 450, y: 430, desc: 'Central hub for dining halls, social quad, and campus store.', queueTime: '0 min' },
      { id: 'dock-waterpark', name: 'Waterpark Paradise Portal Dock', x: 580, y: 490, desc: 'Transit terminal directly connected to dry lockers and biodome entry.', queueTime: '0 min' },
    ],
    waterpark: [
      { id: 'wave-pool', name: 'Giant Wave Pool', x: 610, y: 280, r: 50, depth: '3.5m', desc: 'Resort-grade 6-foot wave generator with heated 84°F tropical water year-round.', waterTemp: '84°F' },
      { id: 'surf-simulator', name: 'FlowRider Surf Simulator', x: 620, y: 180, r: 25, depth: '0.5m', desc: 'Continuous deep-water sheet wave for bodyboarding and surfing practice after exams.', waterTemp: '82°F' },
      { id: 'slide-tower', name: 'Vertical Drop Slide Tower (S1-S4)', x: 680, y: 150, r: 22, depth: '2.0m landing', desc: 'High-speed 70-degree vertical trapdoor slide for maximum adrenaline decompression.', waterTemp: '84°F' },
      { id: 'resort-beach', name: 'Resort Beach Area', x: 740, y: 220, r: 35, depth: '0m - 0.5m', desc: 'Real white sand indoor beach with palm trees under the climate-controlled glass dome.', waterTemp: '85°F' },
      { id: 'leisure-pools', name: 'Leisure & Hydrotherapy Pools', x: 720, y: 340, r: 40, depth: '1.5m', desc: 'Heated massage jets, lazy whirlpools, and floating study lounges.', waterTemp: '88°F' },
      { id: 'lazy-river-park', name: 'Park Internal Lazy River', x: 780, y: 270, r: 45, depth: '1.2m', desc: 'Scenic inner-park winding river circuit passing underneath tropical waterfalls.', waterTemp: '85°F' },
      { id: 'dry-lockers', name: 'Dry Lockers & Entrance', x: 800, y: 390, r: 30, desc: 'Digital passcode lockers for laptops, phones, and backpacks right before pool entry.', capacity: '4,000 lockers' },
    ]
  };

  // Canal Track Path points (Loop surrounding the campus center)
  const canalPath = [
    { x: 450, y: 100 },
    { x: 700, y: 100 },
    { x: 840, y: 180 },
    { x: 850, y: 400 },
    { x: 780, y: 520 },
    { x: 450, y: 520 },
    { x: 440, y: 300 },
    { x: 450, y: 100 }
  ];

  // Animated Raft simulation loop on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let progressOffsets = Array.from({ length: raftCount }, (_, i) => i / raftCount);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Canal Track outline
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      canalPath.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Inner water flow pulse line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 210, 0.8)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.lineDashOffset = -Date.now() / 30;
      canalPath.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.setLineDash([]); // reset line dash

      // Animate Rafts along canal path
      progressOffsets = progressOffsets.map(offset => (offset + (boatSpeed * 0.0005)) % 1);

      progressOffsets.forEach((offset, idx) => {
        // Calculate point along track
        const totalSegs = canalPath.length - 1;
        const targetSeg = offset * totalSegs;
        const segIdx = Math.floor(targetSeg);
        const segProgress = targetSeg - segIdx;
        const p1 = canalPath[segIdx];
        const p2 = canalPath[segIdx + 1] || canalPath[0];

        const rx = p1.x + (p2.x - p1.x) * segProgress;
        const ry = p1.y + (p2.y - p1.y) * segProgress;

        // Draw Raft Body (Dry Commuter Raft)
        ctx.save();
        ctx.translate(rx, ry);
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        ctx.rotate(angle);

        // Raft Hull
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(-12, -7, 24, 14, 6);
        ctx.fill();

        // Canopy/Roof
        ctx.fillStyle = 'rgba(0, 200, 255, 0.6)';
        ctx.fillRect(-8, -5, 16, 10);

        // Student passenger indicator dot
        ctx.fillStyle = '#00ffd2';
        ctx.beginPath();
        ctx.arc(-2, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [boatSpeed, raftCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Blueprint Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass style={{ color: 'var(--accent-cyan)' }} size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Master Blueprint & Commuter Loop</h2>
            <span className="badge badge-cyan">Scale: 1:500m</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
            Interactive vector site plan. Left: Academic Zone | Center: Dry Water Canal | Right: 365-Day Biodome Waterpark
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* View Modes */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => setActiveView('blueprint')} 
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: activeView === 'blueprint' ? 'var(--accent-cyan)' : 'transparent',
                color: activeView === 'blueprint' ? '#030811' : 'var(--text-secondary)'
              }}
            >
              Architectural Blueprint
            </button>
            <button 
              onClick={() => setActiveView('heat')} 
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: activeView === 'heat' ? 'var(--accent-amber)' : 'transparent',
                color: activeView === 'heat' ? '#030811' : 'var(--text-secondary)'
              }}
            >
              Activity & Heatmap
            </button>
          </div>

          {/* Boat Speed Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <Anchor size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Canal Stream:</span>
            <input 
              type="range" min="0.5" max="3.5" step="0.5" 
              value={boatSpeed} 
              onChange={(e) => setBoatSpeed(parseFloat(e.target.value))} 
              style={{ width: '80px' }} 
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{boatSpeed} m/s</span>
          </div>

        </div>
      </div>

      {/* Main Map Interactive Canvas & Overlay Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 340px' : '1fr', gap: '20px' }}>
        
        {/* SVG & Canvas Blueprint Container */}
        <div className="glass-panel" style={{ position: 'relative', width: '100%', minHeight: '620px', overflow: 'hidden', background: '#050c18' }}>
          
          {/* Grid Background */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Dynamic Animated Canvas for Canal Track & Floating Rafts */}
          <canvas 
            ref={canvasRef} 
            width={960} 
            height={600} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          />

          {/* Interactive Vector Overlay for Buildings & Attractions */}
          <svg viewBox="0 0 960 600" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
            
            {/* --- ZONING LABELS & BOUNDARIES --- */}
            
            {/* Site Perimeter */}
            <rect x="20" y="20" width="920" height="560" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="6,6" />
            <text x="35" y="45" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="var(--font-mono)" letterSpacing="1">ACADEMIC & PARADISE SITE PERIMETER</text>

            {/* Academic Zone Group (Left) */}
            <g>
              <rect x="40" y="70" width="390" height="490" fill="rgba(0, 136, 255, 0.03)" stroke="rgba(0, 136, 255, 0.2)" strokeWidth="1" rx="12" />
              <text x="55" y="95" fill="var(--accent-blue)" fontSize="14" fontWeight="700" letterSpacing="1">ACADEMIC ZONE (Campus Side)</text>
              <text x="55" y="112" fill="var(--text-muted)" fontSize="11">Lectures, Labs, Dormitories & Faculty</text>
            </g>

            {/* Biodome & Waterpark Zone Group (Right) */}
            <g>
              {/* Outer Geodesic Dome Circle */}
              <circle cx="710" cy="300" r="230" fill={activeView === 'heat' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0, 240, 255, 0.04)'} stroke="rgba(0, 240, 255, 0.5)" strokeWidth="2" strokeDasharray="10 5" />
              <circle cx="710" cy="300" r="222" fill="none" stroke="rgba(0, 255, 210, 0.2)" strokeWidth="1" />
              
              <text x="610" y="95" fill="var(--accent-teal)" fontSize="14" fontWeight="700" letterSpacing="1">BIODOME & WATERPARK ZONE</text>
              <text x="635" y="112" fill="var(--accent-amber)" fontSize="11">Retractable Glass Dome • Open 365 Days</text>
            </g>

            {/* --- ACADEMIC BUILDINGS (Interactive Rects) --- */}
            {zones.academic.map(b => {
              const isSelected = selectedNode?.id === b.id;
              return (
                <g 
                  key={b.id} 
                  onClick={() => setSelectedNode(b)} 
                  style={{ cursor: 'pointer' }}
                >
                  <rect 
                    x={b.x} y={b.y} width={b.width} height={b.height} 
                    rx="8" 
                    fill={isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(14, 25, 42, 0.85)'}
                    stroke={isSelected ? 'var(--accent-cyan)' : 'rgba(0, 136, 255, 0.4)'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  {/* Building Label */}
                  <text x={b.x + 12} y={b.y + 24} fill="#ffffff" fontSize="11" fontWeight="700">{b.code}</text>
                  <text x={b.x + 12} y={b.y + 42} fill="var(--text-secondary)" fontSize="10">{b.name.split(' (')[0]}</text>
                </g>
              );
            })}

            {/* --- WATERPARK ATTRACTIONS (Interactive Circles/Shapes) --- */}
            {zones.waterpark.map(w => {
              const isSelected = selectedNode?.id === w.id;
              return (
                <g 
                  key={w.id} 
                  onClick={() => setSelectedNode(w)} 
                  style={{ cursor: 'pointer' }}
                >
                  <circle 
                    cx={w.x} cy={w.y} r={w.r} 
                    fill={isSelected ? 'rgba(0, 255, 210, 0.35)' : 'rgba(0, 240, 255, 0.12)'}
                    stroke={isSelected ? 'var(--accent-teal)' : 'rgba(0, 255, 210, 0.5)'}
                    strokeWidth={isSelected ? '3' : '1.5'}
                  />
                  <text x={w.x} y={w.y - 4} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">{w.name.split(' (')[0]}</text>
                  {w.depth && (
                    <text x={w.x} y={w.y + 12} textAnchor="middle" fill="var(--accent-cyan)" fontSize="9" fontFamily="var(--font-mono)">{w.depth}</text>
                  )}
                </g>
              );
            })}

            {/* --- CANAL DOCK STATIONS (Interactive Icons) --- */}
            {zones.transit.map(d => {
              const isSelected = selectedNode?.id === d.id;
              return (
                <g 
                  key={d.id} 
                  onClick={() => setSelectedNode(d)} 
                  style={{ cursor: 'pointer' }}
                >
                  <rect 
                    x={d.x - 14} y={d.y - 14} width="28" height="28" rx="6"
                    fill={isSelected ? 'var(--accent-cyan)' : 'rgba(6, 18, 36, 0.9)'}
                    stroke="var(--accent-teal)" strokeWidth="2"
                  />
                  <text x={d.x} y={d.y + 4} textAnchor="middle" fill={isSelected ? '#000' : 'var(--accent-teal)'} fontSize="11" fontWeight="800">⚓</text>
                  <text x={d.x - 30} y={d.y - 18} fill="var(--text-secondary)" fontSize="9" fontWeight="600">{d.name.split(' Dock')[0]}</text>
                </g>
              );
            })}

            {/* North Indicator */}
            <g transform="translate(900, 520)">
              <circle cx="0" cy="0" r="18" fill="rgba(0,0,0,0.6)" stroke="var(--border-subtle)" />
              <path d="M 0 -10 L 5 4 L 0 1 L -5 4 Z" fill="var(--accent-cyan)" />
              <text x="0" y="14" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="700">N</text>
            </g>

          </svg>

          {/* Map Legend Overlay */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(6, 11, 19, 0.85)', backdropFilter: 'blur(10px)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '20px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: 'rgba(14, 25, 42, 0.85)', border: '1.5px solid rgba(0, 136, 255, 0.6)', borderRadius: '3px' }}></span>
              <span>Academic Facility</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: 'rgba(0, 240, 255, 0.2)', border: '1.5px solid var(--accent-teal)', borderRadius: '50%' }}></span>
              <span>Waterpark Attraction</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: 'rgba(0, 240, 255, 0.8)', borderRadius: '3px' }}></span>
              <span>Covered Dry Canal Track</span>
            </div>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-cyan">{selectedNode.code || 'ZONE NODE'}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '6px' }}>{selectedNode.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              {selectedNode.desc}
            </p>

            <hr style={{ borderColor: 'var(--border-subtle)' }} />

            {/* Spec Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedNode.capacity && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Capacity / Footprint:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedNode.capacity}</span>
                </div>
              )}
              {selectedNode.temp && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ambient Air Temp:</span>
                  <span style={{ fontWeight: '600', color: 'var(--accent-amber)' }}>{selectedNode.temp}</span>
                </div>
              )}
              {selectedNode.waterTemp && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Water Heating (365d):</span>
                  <span style={{ fontWeight: '600', color: 'var(--accent-teal)' }}>{selectedNode.waterTemp}</span>
                </div>
              )}
              {selectedNode.depth && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Max Depth:</span>
                  <span style={{ fontWeight: '600', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{selectedNode.depth}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => alert(`Navigating commuter raft to ${selectedNode.name}...`)}
              >
                <Navigation size={16} /> Route Raft Here
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
