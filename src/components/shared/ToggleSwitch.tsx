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
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
          checked
            ? "bg-violet-600"
            : "bg-zinc-200 dark:bg-zinc-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </button>
      <div className="leading-tight">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {label}
        </span>
        {sublabel && (
          <span className="ml-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {sublabel}
          </span>
        )}
      </div>
    </label>
  );
}
