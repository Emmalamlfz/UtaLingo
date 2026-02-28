"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  testId?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  sublabel,
  testId,
}: ToggleSwitchProps) {
  return (
    <label
      className="flex cursor-pointer items-center gap-3 select-none"
      data-testid={testId}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        data-testid={testId ? `${testId}-btn` : undefined}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lemon focus-visible:ring-offset-2 ${
          checked
            ? "bg-lemon shadow-md shadow-lemon/30"
            : "bg-white/20"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
            checked
              ? "translate-x-6 bg-dark"
              : "translate-x-1 bg-white/60"
          }`}
        />
      </button>
      <div className="leading-tight">
        <span className="text-sm font-extrabold text-white">
          {label}
        </span>
        {sublabel && (
          <span className="ml-1.5 text-[11px] font-bold text-white/40">
            {sublabel}
          </span>
        )}
      </div>
    </label>
  );
}
