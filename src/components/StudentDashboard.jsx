import React from 'react';
import { 
  Smile, Award, HeartHandshake, TrendingUp, Sparkles, Clock, 
  BookOpen, Waves, ShieldCheck, CheckCircle2, Star, Flame
} from 'lucide-react';

export default function StudentDashboard() {
  const kpis = [
    { title: 'Student Retention Rate', value: '99.4%', change: '+21.4% vs Nat. Avg', color: 'var(--accent-emerald)', icon: Award },
    { title: 'Student Happiness Index', value: '99.8%', change: 'Highest Nationwide', color: 'var(--accent-cyan)', icon: Smile },
    { title: 'Average Campus GPA', value: '3.86 / 4.0', change: '+0.42 Dean Honors', color: 'var(--accent-teal)', icon: TrendingUp },
    { title: 'Commute Stress Index', value: '0.0%', change: 'Zero Walking Sweat', color: 'var(--accent-amber)', icon: HeartHandshake },
  ];

  const timetable = [
    { time: '09:00 AM - 10:30 AM', title: 'Quantum Mechanics & Field Theory', location: 'Lecture Hall L4', icon: BookOpen, tag: 'Academic' },
    { time: '10:45 AM - 11:00 AM', title: 'Raft Transit to Labs', location: 'Dorm Dock -> Research Dock', icon: Waves, tag: 'Dry Commute' },
    { time: '11:00 AM - 01:00 PM', title: 'Fluid Dynamics & FEA Simulation Lab', location: 'Research Lab R2', icon: BookOpen, tag: 'Academic' },
    { time: '01:00 PM - 02:00 PM', title: 'Gourmet Lunch & Smoothies', location: 'Student Center Quad', icon: Star, tag: 'Social' },
    { time: '02:00 PM - 04:00 PM', title: 'Organic Chemistry Midterm Exam', location: 'Lecture Hall L1', icon: BookOpen, tag: 'Exam' },
    { time: '04:15 PM - 06:00 PM', title: 'VERTICAL DROP SLIDES & WAVE POOL', location: 'Biodome Waterpark Paradise', icon: Flame, tag: 'DECOMPRESS!', highlight: true },
    { time: '06:30 PM - 08:30 PM', title: 'Sunset Floating Study Lounge', location: 'Heated Hydrotherapy Pools (88°F)', icon: Waves, tag: 'Relax & Study' },
  ];

  const testimonials = [
    { name: 'Alex Rivera (\'27)', major: 'Mechanical Engineering', text: 'Finishing a 2-hour thermodynamics exam and being inside a wave pool by 4:15 PM is an unmatched feeling. Best decision of my life.' },
    { name: 'Sophia Chen (\'26)', major: 'Bioinformatics & Physics', text: 'I do all my paper readings while floating on the commuter raft in a dry deck. I haven\'t walked to class in 6 months.' },
    { name: 'Marcus Vance (\'28)', major: 'Pre-Med & Neurobiology', text: 'Even during a sub-zero January blizzard outside, the glass dome is 84°F and tropical. Student retention is literally 100% in our dorm.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles style={{ color: 'var(--accent-cyan)' }} size={28} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Student Life & Retention Analytics</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Work hard, chill hard. Real-time campus satisfaction metrics and student daily schedule walkthrough.
          </p>
        </div>

        <span className="badge badge-cyan">
          <Star size={14} /> #1 Campus Quality of Life in the World
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>{k.title.toUpperCase()}</span>
                <Icon size={20} style={{ color: k.color }} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: k.color }}>
                {k.value}
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                {k.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timetable & Testimonials Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* Daily Schedule Timeline */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--accent-teal)' }} /> A Day in the Life of an Aquademia Student
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {timetable.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: item.highlight ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(0, 255, 210, 0.15) 100%)' : 'rgba(255,255,255,0.03)',
                  border: item.highlight ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: '700', width: '130px' }}>
                    {item.time}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: item.highlight ? '#ffffff' : 'var(--text-primary)' }}>
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.location}</span>
                  </div>
                </div>

                <span className={`badge ${item.highlight ? 'badge-amber' : 'badge-cyan'}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Reviews & Testimonials */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            STUDENT REVIEWS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{t.text}"
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-teal)' }}>
                  {t.name} • <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>{t.major}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
