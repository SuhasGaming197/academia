import React, { useState } from 'react';
import { 
  Sun, CloudRain, Snowflake, Thermometer, ShieldCheck, Zap, 
  Wind, Droplets, Eye, Sliders, Activity, Flame
} from 'lucide-react';

export default function ClimateControl() {
  const [weatherPreset, setWeatherPreset] = useState('blizzard'); // 'summer' | 'rain' | 'blizzard' | 'heatwave'
  const [domeOpenPercent, setDomeOpenPercent] = useState(0); // 0% = Fully sealed dome, 100% = Open roof
  const [poolTargetTemp, setPoolTargetTemp] = useState(84); // °F

  // Weather Preset data configurations
  const presets = {
    summer: {
      name: 'Sunny Summer Day',
      icon: Sun,
      color: 'var(--accent-amber)',
      outdoorTemp: 88,
      outdoorHumidity: 45,
      windSpeed: 8,
      suggestedDomeOpen: 100,
      desc: 'Retractable dome fully retracted for open-air sunshine and natural ocean breeze.'
    },
    rain: {
      name: 'Autumn Downpour',
      icon: CloudRain,
      color: 'var(--accent-cyan)',
      outdoorTemp: 52,
      outdoorHumidity: 88,
      windSpeed: 24,
      suggestedDomeOpen: 15,
      desc: 'Dome roof partially closed to protect students while preserving ambient sky light.'
    },
    blizzard: {
      name: 'Sub-Zero Winter Blizzard',
      icon: Snowflake,
      color: 'var(--accent-teal)',
      outdoorTemp: 14,
      outdoorHumidity: 70,
      windSpeed: 42,
      suggestedDomeOpen: 0,
      desc: 'Dome 100% sealed. Double-pane insulated glass locks in geothermal heat for 84°F tropical summer inside.'
    },
    heatwave: {
      name: 'Extreme Heatwave',
      icon: Flame,
      color: 'var(--accent-rose)',
      outdoorTemp: 104,
      outdoorHumidity: 30,
      windSpeed: 5,
      suggestedDomeOpen: 60,
      desc: 'Electrochromic smart tinting activated on glass dome with evaporative cooling mists.'
    }
  };

  const currentPreset = presets[weatherPreset];

  // Calculated Telemetry metrics
  const indoorTemp = domeOpenPercent > 50 
    ? Math.round(currentPreset.outdoorTemp * 0.7 + 22) 
    : 76; // Stabilized climate control inside

  const heatPumpLoad = Math.round(Math.abs(indoorTemp - currentPreset.outdoorTemp) * 14.5 + (poolTargetTemp - 70) * 8);
  const solarGain = Math.round(100 - domeOpenPercent * 0.6);

  const applyPreset = (key) => {
    setWeatherPreset(key);
    setDomeOpenPercent(presets[key].suggestedDomeOpen);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Thermometer style={{ color: 'var(--accent-amber)' }} size={28} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>365-Day Climate & Biodome Control System</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Automated geothermal water heating and retractable geodesic glass dome enclosure engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BIODOME STATUS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className={`badge ${domeOpenPercent === 0 ? 'badge-emerald' : 'badge-amber'}`}>
                <ShieldCheck size={12} /> {domeOpenPercent === 0 ? 'Fully Sealed & Heated' : `Roof Open ${domeOpenPercent}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Weather Selector Cards */}
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '600' }}>
          SELECT OUTDOOR WEATHER SCENARIO
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {Object.keys(presets).map(key => {
            const p = presets[key];
            const Icon = p.icon;
            const isSelected = weatherPreset === key;
            return (
              <div 
                key={key} 
                className="glass-panel" 
                onClick={() => applyPreset(key)}
                style={{
                  padding: '16px', cursor: 'pointer',
                  borderColor: isSelected ? p.color : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(14, 28, 48, 0.95)' : 'var(--bg-card)',
                  boxShadow: isSelected ? `0 0 20px ${p.color}25` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon size={24} style={{ color: p.color }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '700', color: p.color }}>
                    {p.outdoorTemp}°F
                  </span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700', marginTop: '10px' }}>{p.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dome Visualization & Interactive Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* Retractable Dome Graphic Visualizer */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#050c18', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: 'var(--accent-cyan)' }} /> Geodesic Dome Structural Cross-Section
          </h3>

          {/* SVG Dome Render */}
          <div style={{ width: '100%', height: '280px', position: 'relative' }}>
            <svg viewBox="0 0 600 240" style={{ width: '100%', height: '100%' }}>
              
              {/* Ground & Waterpark Pool */}
              <rect x="0" y="190" width="600" height="50" fill="#041226" />
              {/* Wave Pool Water */}
              <path d="M 60 190 Q 150 180 240 190 T 420 190 T 540 190 L 540 230 L 60 230 Z" fill="rgba(0, 240, 255, 0.4)" />
              <text x="300" y="215" textAnchor="middle" fill="var(--accent-cyan)" fontSize="12" fontWeight="700">HEATED TROPICAL WATERPARK POOL (84°F)</text>

              {/* Outside Weather Particles Graphic */}
              {weatherPreset === 'blizzard' && (
                <g>
                  <circle cx="80" cy="50" r="2" fill="#fff" opacity="0.8" />
                  <circle cx="140" cy="80" r="3" fill="#fff" opacity="0.9" />
                  <circle cx="480" cy="40" r="2" fill="#fff" opacity="0.8" />
                  <circle cx="520" cy="90" r="2.5" fill="#fff" opacity="0.7" />
                  <text x="100" y="40" fill="var(--accent-teal)" fontSize="11" fontWeight="600">OUTSIDE: 14°F BLIZZARD</text>
                </g>
              )}

              {/* Glass Dome Structure Arcs */}
              {/* Fixed Base Supports */}
              <path d="M 50 190 Q 300 20 550 190" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
              
              {/* Retractable Left Shell */}
              <path 
                d={`M 50 190 Q ${300 - domeOpenPercent * 1.5} ${20 + domeOpenPercent * 0.8} ${300 - domeOpenPercent * 1.8} 190`} 
                fill="rgba(0, 240, 255, 0.08)" 
                stroke="var(--accent-cyan)" 
                strokeWidth="3" 
              />

              {/* Retractable Right Shell */}
              <path 
                d={`M 550 190 Q ${300 + domeOpenPercent * 1.5} ${20 + domeOpenPercent * 0.8} ${300 + domeOpenPercent * 1.8} 190`} 
                fill="rgba(0, 240, 255, 0.08)" 
                stroke="var(--accent-cyan)" 
                strokeWidth="3" 
              />

              {/* Internal Tropical Air Glow */}
              <circle cx="300" cy="140" r="80" fill="rgba(0, 255, 210, 0.05)" />
              <text x="300" y="145" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800">
                INSIDE: {indoorTemp}°F TROPICAL
              </text>
            </svg>
          </div>

          {/* Dome Retraction Slider */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Dome Roof Opening Angle:</span>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                {domeOpenPercent}% {domeOpenPercent === 0 ? '(Fully Closed Dome)' : domeOpenPercent === 100 ? '(Fully Open Roof)' : '(Partial)'}
              </span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={domeOpenPercent} 
              onChange={(e) => setDomeOpenPercent(parseInt(e.target.value))} 
            />
          </div>

        </div>

        {/* Live Telemetry Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ENVIRONMENT TELEMETRY</span>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Thermometer size={16} style={{ color: 'var(--accent-amber)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Outdoor Temp</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-amber)' }}>{currentPreset.outdoorTemp}°F</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={16} style={{ color: 'var(--accent-teal)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Indoor Dome Air</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-teal)' }}>{indoorTemp}°F</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplets size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Water Pool Heat Target</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{poolTargetTemp}°F</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} style={{ color: 'var(--accent-purple)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Geothermal Pump Power</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-purple)' }}>{heatPumpLoad} kW</span>
              </div>

            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0, 255, 210, 0.05)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-teal)', marginBottom: '6px' }}>
              365-Day Guarantee
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Even during extreme zero-degree snowstorms, the geothermal plant pulls heat from 1,200m subterranean wells, keeping wave pools at a comfortable 84°F all year round.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
