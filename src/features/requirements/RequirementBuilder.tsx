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
    <div className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
      <section className="panel p-5">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black">Hiring requirement blueprint</h2>
            <p className="mt-1 text-sm text-stone-500">Tune role intelligence signals while keeping the total at 100%.</p>
          </div>
          <SlidersHorizontal className="h-5 w-5 text-emerald-700" />
        </div>

        <div className="space-y-5">
          {skills.map((skill) => (
            <label key={skill} className="grid gap-3 sm:grid-cols-[190px_1fr_56px] sm:items-center">
              <span className="text-sm font-bold text-stone-700">{skill}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(weights[skill])}
                onChange={(event) => handleSliderChange(skill, Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-700"
              />
              <span className="text-right text-sm font-black text-stone-700">{Math.round(weights[skill])}%</span>
            </label>
          ))}
        </div>
      </section>

      <aside className="panel h-fit p-5">
        <h2 className="text-lg font-black">Verification</h2>
        <div className="mt-5 rounded-lg bg-emerald-50 p-5 text-center">
          <div className="text-sm font-bold text-emerald-800">Total weighting</div>
          <div className="mt-2 text-5xl font-black text-emerald-900">{total}%</div>
        </div>
        <button onClick={handleSave} className="button-primary mt-5 w-full" type="button">
          <Save className="h-4 w-4" />
          Save blueprint
        </button>
        {savedAt && <div className="mt-3 text-center text-sm font-semibold text-stone-500">Saved at {savedAt}</div>}
      </aside>
    </div>
  );
}
