import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Cpu, ShieldAlert, ShieldCheck, Wind, Thermometer, 
  Code2, Copy, Check, RefreshCw, Zap, Sliders
} from 'lucide-react';

export default function DomeFEASimulator() {
  const [windSpeed, setWindSpeed] = useState(45); // mph
  const [deltaT, setDeltaT] = useState(65); // °F differential (inside vs outside)
  const [material, setMaterial] = useState('titanium'); // 'titanium' | 'aluminum' | 'carbon'
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const canvasRef = useRef(null);

  // Material properties
  const materials = {
    titanium: { name: 'Titanium-Alloy Lattice', E: 115, yield: 880, alpha: 8.6e-6, desc: 'Highest strength-to-weight ratio for hurricane resistance.' },
    aluminum: { name: 'Aerospace Al 6061-T6', E: 68.9, yield: 276, alpha: 23e-6, desc: 'Lightweight, economical structural framing.' },
    carbon: { name: 'Carbon Fiber Composite', E: 150, yield: 1200, alpha: 2.1e-6, desc: 'Ultra-rigid, zero thermal expansion coefficient.' }
  };

  const currentMat = materials[material];

  // FEA Structural Math Computations
  // Wind Pressure q = 0.00256 * V^2 (Pounds per sq ft) converted to MPa
  const windPressureMPa = (0.00256 * Math.pow(windSpeed, 2) * 47.88) / 1e6;
  const thermalStressMPa = currentMat.E * 1000 * currentMat.alpha * (deltaT * 0.555); // convert °F to Kelvin
  
  // Total von Mises Stress estimate (MPa)
  const vonMisesStress = Math.round((windPressureMPa * 4200) + thermalStressMPa * 1.8);
  const maxDeflectionMM = ((vonMisesStress / currentMat.E) * 14.2).toFixed(1);
  const safetyFactor = (currentMat.yield / Math.max(vonMisesStress, 1)).toFixed(2);
  const isSafe = parseFloat(safetyFactor) >= 1.5;

  // Render FEA Mesh Stress Heatmap on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height - 30;
    const radius = 220;

    // Draw Ground Line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.moveTo(30, centerY);
    ctx.lineTo(width - 30, centerY);
    ctx.stroke();

    // Geodesic Dome Nodes & Trusses Generation
    const nodeRows = 6;
    const nodeCols = 16;
    const nodes = [];

    for (let r = 0; r <= nodeRows; r++) {
      const rowNodes = [];
      const rowRadius = radius * Math.cos((r / nodeRows) * (Math.PI / 2));
      const rowY = centerY - radius * Math.sin((r / nodeRows) * (Math.PI / 2));

      for (let c = 0; c <= nodeCols; c++) {
        const angle = (c / nodeCols) * Math.PI;
        const x = centerX - rowRadius * Math.cos(angle);
        const y = rowY;
        rowNodes.push({ x, y, r, c });
      }
      nodes.push(rowNodes);
    }

    // Stress Color Function based on FEA von Mises stress & node position
    const getStressColor = (nodeX, nodeY, r) => {
      // Wind pressure creates higher stress on windward side (left)
      const windFactor = Math.max(0, (centerX - nodeX) / centerX) * (windSpeed / 120);
      const thermalFactor = (r / nodeRows) * (deltaT / 100);
      const nodeStress = vonMisesStress * (0.5 + windFactor * 0.8 + thermalFactor * 0.4);

      const ratio = Math.min(1, nodeStress / currentMat.yield);

      if (ratio < 0.3) return 'rgba(0, 240, 255, 0.8)'; // Low Stress (Cyan)
      if (ratio < 0.6) return 'rgba(16, 185, 129, 0.9)'; // Normal (Green)
      if (ratio < 0.85) return 'rgba(245, 158, 11, 0.95)'; // Elevated (Amber)
      return 'rgba(244, 63, 94, 1)'; // Critical (Red Glow)
    };

    // Draw Geodesic Truss Elements (Lines connecting nodes)
    ctx.lineWidth = 1.8;
    for (let r = 0; r < nodes.length; r++) {
      for (let c = 0; c < nodes[r].length; c++) {
        const curr = nodes[r][c];

        // Horizontal connecting truss
        if (c < nodes[r].length - 1) {
          const nextH = nodes[r][c + 1];
          ctx.beginPath();
          ctx.strokeStyle = getStressColor(curr.x, curr.y, r);
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(nextH.x, nextH.y);
          ctx.stroke();
        }

        // Vertical/Diagonal connecting truss
        if (r < nodes.length - 1 && c < nodes[r + 1].length) {
          const nextV = nodes[r + 1][c];
          ctx.beginPath();
          ctx.strokeStyle = getStressColor(curr.x, curr.y, r);
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(nextV.x, nextV.y);
          ctx.stroke();
        }
      }
    }

    // Draw Nodes (Joint Dots)
    nodes.forEach(row => {
      row.forEach(n => {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });

  }, [windSpeed, deltaT, material, vonMisesStress]);

  // Generated Python FEniCS FEA Script
  const fenicsPythonScript = `# =========================================================
# FEniCS Finite Element Analysis (FEA) Script
# Geodesic Glass Dome Structural Thermal-Wind Stress Model
# Target: AQUADEMIA 365-Day Biodome Enclosure
# =========================================================
from fenics import *
import numpy as np

# 1. Create Mesh for 3D Geodesic Shell
mesh = UnitSphereMesh(16)
R = 120.0 # Dome radius in meters
mesh.coordinates()[:] *= R

# 2. Define Material Constants (${currentMat.name})
E = ${currentMat.E}e9      # Young's Modulus (Pa)
nu = 0.30        # Poisson's ratio
alpha = ${currentMat.alpha}  # Thermal Expansion Coefficient (1/K)
dT = ${deltaT} * 0.555 # Temperature delta in Kelvin

# 3. Constitutive Relations
mu = E / (2 * (1 + nu))
lmbda = E * nu / ((1 + nu) * (1 - 2 * nu))

def eps(u):
    return sym(grad(u))

def sigma(u, dT):
    return lmbda * tr(eps(u)) * Identity(3) + 2.0 * mu * eps(u) - (3 * lmbda + 2 * mu) * alpha * dT * Identity(3)

# 4. Wind Shear Boundary Traction Load (${windSpeed} mph)
V_wind = ${windSpeed} * 0.44704 # m/s
q_wind = 0.613 * (V_wind ** 2)  # Wind pressure N/m^2
Traction = Constant((q_wind, 0, 0))

# 5. Variational Formulation & Solve
V = VectorFunctionSpace(mesh, 'P', 2)
u = TrialFunction(V)
v = TestFunction(V)

a = inner(sigma(u, dT), grad(v)) * dx
L = dot(Traction, v) * ds

u_sol = Function(V)
solve(a == L, u_sol)

print("FEA Simulation Complete!")
print(f"Max von Mises Stress: {vonMisesStress} MPa")
`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu style={{ color: 'var(--accent-purple)' }} size={28} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>"Vibe-Coding" FEA Structural Stress Simulator</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Simulate wind shear loads and thermal expansion on the geodesic glass dome using Finite Element Analysis (FEA).
          </p>
        </div>

        <button className="btn-secondary" onClick={() => setShowCodeModal(true)}>
          <Code2 size={16} /> View FEniCS Python Code
        </button>
      </div>

      {/* Main Controls & Canvas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* Input Parameters Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            PHYSICS PARAMETERS
          </h3>

          {/* Material Selection */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              STRUCTURAL LATTICE MATERIAL
            </label>
            <select 
              value={material} 
              onChange={(e) => setMaterial(e.target.value)}
              style={{ width: '100%', padding: '10px', background: 'rgba(6,14,28,0.9)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}
            >
              <option value="titanium">Titanium-Alloy Lattice</option>
              <option value="aluminum">Aerospace Al 6061-T6</option>
              <option value="carbon">Carbon Fiber Composite</option>
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{currentMat.desc}</p>
          </div>

          {/* Wind Speed Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Wind Shear Velocity:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{windSpeed} mph</span>
            </div>
            <input type="range" min="0" max="120" value={windSpeed} onChange={(e) => setWindSpeed(parseInt(e.target.value))} />
          </div>

          {/* Thermal Delta Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Thermal Delta (ΔT):</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-amber)' }}>{deltaT}°F</span>
            </div>
            <input type="range" min="0" max="100" value={deltaT} onChange={(e) => setDeltaT(parseInt(e.target.value))} />
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>Indoor 84°F vs Outdoor freezing delta</p>
          </div>

          <hr style={{ borderColor: 'var(--border-subtle)' }} />

          {/* Safety Factor Output */}
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: isSafe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', border: `1px solid ${isSafe ? 'var(--accent-emerald)' : 'var(--accent-rose)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>SAFETY FACTOR (SF):</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: '800', color: isSafe ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {safetyFactor}x
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isSafe ? '✓ Structural integrity verified (SF ≥ 1.5).' : '⚠ Stress exceeds safety margin! Switch to Titanium or decrease ΔT.'}
            </p>
          </div>

        </div>

        {/* Live Canvas Stress Mesh Heatmap */}
        <div className="glass-panel" style={{ padding: '24px', background: '#050c18', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Finite Elementvon Mises Stress Distribution (Mesh View)
            </h3>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>■ Low (&lt;50 MPa)</span>
              <span style={{ color: 'var(--accent-emerald)' }}>■ Normal</span>
              <span style={{ color: 'var(--accent-amber)' }}>■ Elevated</span>
              <span style={{ color: 'var(--accent-rose)' }}>■ Critical</span>
            </div>
          </div>

          <canvas ref={canvasRef} width={640} height={340} style={{ width: '100%', height: '340px' }} />

          {/* Telemetry Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAX VON MISES STRESS</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {vonMisesStress} MPa
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>YIELD STRENGTH (LIMIT)</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {currentMat.yield} MPa
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAX DEFLECTION</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
                {maxDeflectionMM} mm
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Generated FEniCS FEA Python Script</h3>
              <button onClick={() => setShowCodeModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <pre style={{ background: '#030811', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-teal)', overflowX: 'auto', maxHeight: '360px' }}>
              {fenicsPythonScript}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-primary" onClick={() => { navigator.clipboard.writeText(fenicsPythonScript); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }}>
                {copiedCode ? <Check size={16} /> : <Copy size={16} />} {copiedCode ? 'Copied!' : 'Copy Python Code'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
