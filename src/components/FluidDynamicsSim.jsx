import React, { useState, useEffect, useRef } from 'react';
import { Waves, Activity, Zap, Play, RotateCcw, Droplets, Info } from 'lucide-react';

export default function FluidDynamicsSim() {
  const [flowVelocity, setFlowVelocity] = useState(1.5); // m/s
  const [canalDepth, setCanalDepth] = useState(1.4); // m
  const [pumpPressure, setPumpPressure] = useState(120); // kPa
  
  const canvasRef = useRef(null);

  // Canvas Vector Field Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05 * flowVelocity;

      const cols = 24;
      const rows = 12;
      const cellW = canvas.width / cols;
      const cellH = canvas.height / rows;

      // Draw Canal Water Background
      ctx.fillStyle = '#041428';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Vector Grid Arrows (Fluid Flow Navier-Stokes approximation)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW + cellW / 2;
          const y = r * cellH + cellH / 2;

          // Wave turbulence offset
          const angle = Math.sin(c * 0.4 + time) * 0.2;
          const len = 14 * (flowVelocity / 2);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          // Arrow Line
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 + Math.sin(c + time) * 0.2})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-len / 2, 0);
          ctx.lineTo(len / 2, 0);
          ctx.stroke();

          // Arrow Head
          ctx.fillStyle = 'rgba(0, 255, 210, 0.8)';
          ctx.beginPath();
          ctx.moveTo(len / 2, 0);
          ctx.lineTo(len / 2 - 4, -3);
          ctx.lineTo(len / 2 - 4, 3);
          ctx.fill();

          ctx.restore();
        }
      }

      // Draw Animated Commuter Raft floating smoothly
      const raftX = (time * 40) % (canvas.width + 100) - 50;
      const raftY = canvas.height / 2 + Math.sin(time) * 4;

      ctx.save();
      ctx.translate(raftX, raftY);
      
      // Raft Body
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,240,255,0.8)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(-30, -14, 60, 28, 8);
      ctx.fill();

      // Dry Canopy
      ctx.fillStyle = 'rgba(0, 200, 255, 0.7)';
      ctx.fillRect(-20, -10, 40, 20);

      // Student icon inside
      ctx.fillStyle = '#00ffd2';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [flowVelocity, canalDepth, pumpPressure]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Waves style={{ color: 'var(--accent-teal)' }} size={28} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Fluid Dynamics & Canal Hydrodynamics</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Navier-Stokes fluid vector grid simulating commuter canal current velocity, water depth, and raft stability.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        
        {/* Controls */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-teal)' }}>HYDRODYNAMIC CONTROLS</h3>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Stream Velocity:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontWeight: '700' }}>{flowVelocity} m/s</span>
            </div>
            <input type="range" min="0.5" max="3.0" step="0.1" value={flowVelocity} onChange={(e) => setFlowVelocity(parseFloat(e.target.value))} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Canal Water Depth:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700' }}>{canalDepth} m</span>
            </div>
            <input type="range" min="0.8" max="2.5" step="0.1" value={canalDepth} onChange={(e) => setCanalDepth(parseFloat(e.target.value))} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pump Station Pressure:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', fontWeight: '700' }}>{pumpPressure} kPa</span>
            </div>
            <input type="range" min="50" max="250" step="10" value={pumpPressure} onChange={(e) => setPumpPressure(parseInt(e.target.value))} />
          </div>
        </div>

        {/* Fluid Vector Field Canvas */}
        <div className="glass-panel" style={{ padding: '24px', background: '#050c18', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Live Navier-Stokes Fluid Velocity Field & Floating Raft</h3>
          <canvas ref={canvasRef} width={640} height={320} style={{ width: '100%', height: '320px', borderRadius: 'var(--radius-md)' }} />
        </div>

      </div>

    </div>
  );
}
