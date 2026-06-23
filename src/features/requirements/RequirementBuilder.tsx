import { useMemo, useState } from 'react';
import { Save, SlidersHorizontal } from 'lucide-react';

const skills = ['Creativity', 'Problem Solving', 'Communication', 'Execution', 'Leadership', 'Innovation', 'Reasoning', 'Team Collaboration'];

export default function RequirementBuilder() {
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(skills.map((skill) => [skill, 100 / skills.length])),
  );
  const [savedAt, setSavedAt] = useState('');

  const total = useMemo(() => Math.round(Object.values(weights).reduce((sum, weight) => sum + weight, 0)), [weights]);

  const handleSliderChange = (changedSkill: string, newValue: number) => {
    setWeights((current) => {
      const oldValue = current[changedSkill];
      const difference = newValue - oldValue;
      const otherSkills = skills.filter((skill) => skill !== changedSkill);
      const adjustment = difference / otherSkills.length;
      const next = { ...current, [changedSkill]: newValue };

      otherSkills.forEach((skill) => {
        next[skill] = Math.max(0, next[skill] - adjustment);
      });

      const nextTotal = Object.values(next).reduce((sum, weight) => sum + weight, 0);
      next[otherSkills[otherSkills.length - 1]] += 100 - nextTotal;
      return next;
    });
  };

  const handleSave = () => {
    localStorage.setItem('recruiter_app_requirement_blueprint', JSON.stringify(weights));
    setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <div className="space-y-12 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-8 mb-8">
        <p className="folio-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender mb-2 font-bold">
          Requirements Builder
        </p>
        <h1 className="folio-heading text-4xl md:text-5xl font-light text-brand-navy leading-tight tracking-tight">
          Competency Blueprint
        </h1>
        <p className="mt-4 text-[#6D6B8D] font-sans text-base max-w-2xl leading-relaxed">
          Calibrate the intelligence filters of your candidate evaluation search. Adjust the relative weighting of core competencies below to target matching profiles.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Core Competencies Slider Panel */}
        <section className="rounded-2xl border border-[#ECE8E2] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="mb-8 flex items-start justify-between gap-4 border-b border-[#ECE8E2] pb-5">
            <div>
              <h2 className="font-sans font-bold text-xl text-brand-navy">Role intelligence signals</h2>
              <p className="mt-1 folio-mono text-[9px] text-[#6D6B8D] uppercase tracking-wider font-bold">Calibrate competency filters below.</p>
            </div>
            <SlidersHorizontal className="h-5 w-5 text-brand-navy opacity-75" strokeWidth={1.5} />
          </div>

          <div className="space-y-7">
            {skills.map((skill) => (
              <div key={skill} className="grid gap-4 sm:grid-cols-[180px_1fr_64px] sm:items-center">
                <span className="folio-mono text-xs text-brand-navy font-bold uppercase tracking-wide leading-none">{skill}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(weights[skill])}
                  onChange={(event) => handleSliderChange(skill, Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#ECE8E2] accent-brand-purple hover:accent-brand-orange transition-all duration-150"
                />
                <span className="folio-mono text-right text-xs font-bold text-brand-purple bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">{Math.round(weights[skill])}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Verification Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#ECE8E2] bg-white p-8 h-fit shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="mb-6 border-b border-[#ECE8E2] pb-5">
              <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold block">
                Verification
              </span>
            </div>
            
            <div className="rounded-xl border border-[#ECE8E2] bg-stone-50/50 p-8 text-center">
              <span className="folio-label text-[9px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold block mb-2">
                TOTAL WEIGHTING
              </span>
              <div className="folio-mono text-5xl md:text-6xl font-bold text-brand-purple leading-none mb-3">
                {total}%
              </div>
              <span className="text-[10px] text-brand-mint bg-brand-mint/5 border border-brand-mint/15 px-3 py-1 rounded-full folio-mono font-bold uppercase tracking-wider inline-block">
                Validated
              </span>
            </div>

            <button 
              onClick={handleSave} 
              className="button-primary mt-6 w-full py-3.5 flex items-center justify-center font-bold hover:bg-[#FF6B35] transition duration-150 cursor-pointer" 
              type="button"
            >
              <Save className="h-4 w-4" strokeWidth={1.5} />
              Save blueprint
            </button>

            {savedAt && (
              <div className="mt-4 text-center folio-mono text-[10px] text-[#6D6B8D] font-bold uppercase tracking-wider">
                Saved at {savedAt}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
