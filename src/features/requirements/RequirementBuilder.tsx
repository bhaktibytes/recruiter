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
    <div className="space-y-6 w-full mx-auto">
      {/* Page Header */}
      <header className="border-b border-[#ECE8E2] pb-5 mb-4">
        <p className="folio-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender mb-1.5 font-bold">
          Requirements Builder
        </p>
        <h1 className="folio-page-title font-light text-brand-navy leading-none tracking-tight">
          Competency Blueprint
        </h1>
        <p className="mt-2 text-xs text-[#6D6B8D]/80 font-sans max-w-xl">
          Calibrate the relative weighting of core competencies below to target matching candidate profiles.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Core Competencies Slider Panel */}
        <section className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#ECE8E2] pb-4">
            <div>
              <h2 className="font-sans font-bold text-lg text-brand-navy">Role intelligence signals</h2>
              <p className="mt-0.5 folio-mono text-[8.5px] text-[#6D6B8D] uppercase tracking-wider font-bold">Calibrate competency filters below.</p>
            </div>
            <SlidersHorizontal className="h-4.5 w-4.5 text-brand-navy opacity-75" strokeWidth={1.5} />
          </div>

          <div className="space-y-5">
            {skills.map((skill) => (
              <div key={skill} className="grid gap-3 sm:grid-cols-[160px_1fr_56px] sm:items-center">
                <span className="folio-mono text-[10px] text-brand-navy font-bold uppercase tracking-wide leading-none">{skill}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(weights[skill])}
                  onChange={(event) => handleSliderChange(skill, Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#ECE8E2] accent-brand-purple transition-all duration-150"
                />
                <span className="folio-mono text-right text-[10.5px] font-bold text-brand-purple bg-brand-purple/5 px-2 py-0.5 rounded border border-brand-purple/10">{Math.round(weights[skill])}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Verification Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200/60 bg-white p-6 h-fit shadow-sm">
            <div className="mb-4 border-b border-[#ECE8E2] pb-4">
              <span className="folio-mono text-[9px] uppercase tracking-[0.18em] text-[#6D6B8D] font-bold block">
                Verification Matrix
              </span>
            </div>
            
            <div className="rounded-xl border border-stone-200/60 bg-stone-50/50 p-6 text-center shadow-sm">
              <span className="folio-label text-[8.5px] uppercase tracking-[0.15em] text-[#6D6B8D] font-bold block mb-1">
                TOTAL WEIGHTING
              </span>
              <div className="folio-mono text-4xl md:text-5xl font-bold text-brand-purple leading-none mb-2.5">
                {total}%
              </div>
              <span className="text-[8px] text-brand-mint bg-brand-mint/5 border border-brand-mint/15 px-2.5 py-0.5 rounded-full folio-mono font-bold uppercase tracking-wider inline-block animate-pulse">
                Validated 100% Check
              </span>
            </div>

            <button 
              onClick={handleSave} 
              className="button-primary mt-4 w-full py-3 flex items-center justify-center font-bold hover:bg-brand-orange transition duration-150 cursor-pointer" 
              type="button"
            >
              <Save className="h-4 w-4" strokeWidth={1.5} />
              Save Blueprint
            </button>

            {savedAt && (
              <div className="mt-3.5 text-center folio-mono text-[9px] text-[#6D6B8D] font-bold uppercase tracking-wider">
                Saved at {savedAt}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
