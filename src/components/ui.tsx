import { useEffect, useState, type ReactNode } from 'react';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Section({ title, right, children, defaultOpen = true }: { title: string; right?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-[#21262d]">
      <button className="w-full flex items-center justify-between px-4 py-3 text-left" onClick={() => setOpen(!open)}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</span>
        <span className="flex items-center gap-2">
          {right}
          <span className={cx('text-slate-500 transition-transform text-xs', open && 'rotate-180')}>▾</span>
        </span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = 'ghost',
  disabled,
  className,
  title,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'subtle';
  disabled?: boolean;
  className?: string;
  title?: string;
  type?: 'button' | 'submit';
}) {
  const v = {
    primary: 'bg-[#00ae42] hover:bg-[#00c24a] text-white border-[#00ae42] shadow-[0_0_0_1px_rgba(0,174,66,.3)]',
    ghost: 'bg-[#161b22] hover:bg-[#1f2630] text-slate-200 border-[#30363d] hover:border-[#4b5563]',
    subtle: 'bg-transparent hover:bg-[#1f2630] text-slate-300 border-transparent',
    danger: 'bg-[#2a1215] hover:bg-[#3a171b] text-red-300 border-[#5c1d24]',
  }[variant];
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cx('h-10 px-3.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2', v, className)}
    >
      {children}
    </button>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none py-0.5">
      <span className="text-sm text-slate-300">
        {label}
        {hint && <span className="block text-[11px] text-slate-500">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx('relative w-10 h-6 rounded-full transition-colors shrink-0', checked ? 'bg-[#00ae42]' : 'bg-[#30363d]')}
      >
        <span className={cx('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform', checked && 'translate-x-4')} />
      </button>
    </label>
  );
}

/** Zahlenfeld mit Komma-Unterstützung; übernimmt den Wert bei gültiger Eingabe. */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  unit,
  className,
  placeholder,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
  placeholder?: string;
}) {
  const [txt, setTxt] = useState(value === undefined ? '' : String(value).replace('.', ','));
  useEffect(() => {
    if (value === undefined) return;
    const parsed = parseFloat(txt.replace(',', '.'));
    if (parsed !== value) setTxt(String(Math.round(value * 1000) / 1000).replace('.', ','));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const commit = (t: string) => {
    if (t.trim() === '') return onChange(undefined);
    let v = parseFloat(t.replace(',', '.'));
    if (!Number.isFinite(v)) return;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    onChange(v);
  };
  return (
    <div className={cx('relative', className)}>
      <input
        inputMode="decimal"
        value={txt}
        placeholder={placeholder}
        onChange={(e) => {
          setTxt(e.target.value);
          const v = parseFloat(e.target.value.replace(',', '.'));
          if (Number.isFinite(v) && (min === undefined || v >= min) && (max === undefined || v <= max)) onChange(v);
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const v = (value ?? 0) + (e.key === 'ArrowUp' ? step : -step) * (e.shiftKey ? 10 : 1);
            commit(String(Math.round(v * 1000) / 1000));
          }
        }}
        className="w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none pl-2.5 pr-9 text-sm text-slate-100 tabular-nums"
      />
      {unit && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 pointer-events-none">{unit}</span>}
    </div>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-[13px] text-slate-300 truncate" title={hint}>
          {label}
        </span>
        <NumberInput value={value} onChange={(v) => v !== undefined && onChange(v)} min={min} max={max} step={step} unit={unit} className="w-28 shrink-0" />
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="fw-range w-full" />
      {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
    </div>
  );
}

export function Stat({ label, value, tone = 'neutral' }: { label: string; value: ReactNode; tone?: 'ok' | 'warn' | 'bad' | 'neutral' }) {
  const t = { ok: 'text-[#3ddc84]', warn: 'text-amber-300', bad: 'text-red-400', neutral: 'text-slate-100' }[tone];
  return (
    <div className="rounded-lg bg-[#0d1117] border border-[#21262d] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={cx('text-sm font-semibold tabular-nums', t)}>{value}</div>
    </div>
  );
}

export function useMedia(q: string): boolean {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : true));
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setM(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
}
