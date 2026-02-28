export function BlobHappy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path
        d="M60 10c28 0 48 18 50 42s-14 48-42 54S14 96 10 68 32 10 60 10z"
        fill="currentColor"
      />
      <circle cx="44" cy="50" r="5" fill="#1A0A14" />
      <circle cx="76" cy="50" r="5" fill="#1A0A14" />
      <path
        d="M42 70c4 8 16 12 26 8 4-2 7-5 8-8"
        stroke="#1A0A14"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="46" cy="48" r="2" fill="white" />
      <circle cx="78" cy="48" r="2" fill="white" />
    </svg>
  );
}

export function BlobStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <path
        d="M40 5l8 22h24l-19 14 7 23-20-15-20 15 7-23L8 27h24z"
        fill="currentColor"
      />
      <circle cx="34" cy="36" r="3" fill="#1A0A14" />
      <circle cx="46" cy="36" r="3" fill="#1A0A14" />
      <path
        d="M34 44c2 4 8 5 12 2"
        stroke="#1A0A14"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BlobNote({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <ellipse cx="50" cy="55" rx="42" ry="38" fill="currentColor" />
      <circle cx="38" cy="50" r="4" fill="#1A0A14" />
      <circle cx="62" cy="50" r="4" fill="#1A0A14" />
      <path
        d="M40 64c4 6 12 7 18 3"
        stroke="#1A0A14"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Music note on head */}
      <path
        d="M62 20v-12M62 8c4-1 8 1 8 5s-4 6-8 5"
        stroke="#1A0A14"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="62" cy="20" r="4" fill="#1A0A14" />
      <circle cx="40" cy="48" r="1.5" fill="white" />
      <circle cx="64" cy="48" r="1.5" fill="white" />
    </svg>
  );
}

export function BlobWink({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        d="M50 8c26 0 44 18 44 42s-18 42-44 42S6 76 6 50 24 8 50 8z"
        fill="currentColor"
      />
      <circle cx="36" cy="46" r="4.5" fill="#1A0A14" />
      <path
        d="M58 46c2-3 8-3 10 0"
        stroke="#1A0A14"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M36 62c5 7 16 8 22 3"
        stroke="#1A0A14"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="38" cy="44" r="1.5" fill="white" />
    </svg>
  );
}
