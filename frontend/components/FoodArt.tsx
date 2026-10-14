"use client";

type ArtKind = "burger" | "chicken" | "fries" | "beverage" | "dessert" | "breakfast";

/**
 * Pick a food illustration that matches the product's category.
 * The storefront never relies on AEM assets during development, so every
 * menu item gets a fast, local, accessible illustration.
 */
export function artForCategory(slug: string): ArtKind {
  if (slug === "chicken") return "chicken";
  if (slug === "sides") return "fries";
  if (slug === "beverages") return "beverage";
  if (slug === "desserts") return "dessert";
  if (slug === "breakfast") return "breakfast";
  return "burger";
}

/**
 * The golden arches (the McDonald's "M") as two overlapping golden arches.
 * Use them as the brand mark or the quick-view hero art.
 */
export function GoldenArches({ className, stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 84" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 80 V44 C14 26 24 16 36 16 C48 16 60 26 60 44 V80" stroke={stroke} strokeWidth={13} strokeLinecap="round" />
      <path d="M70 80 V44 C70 26 80 16 90 16 C100 16 110 26 110 44 V80" stroke={stroke} strokeWidth={13} strokeLinecap="round" />
      <rect x={58.5} y={68.5} width={22} height={11} rx={3} fill={stroke} opacity={0.85} />
    </svg>
  );
}

export function Burger({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <ellipse cx={60} cy={80} rx={44} ry={10} fill="#d9b88a" />
        <path d="M22 62 h76 a8 8 0 0 1 -8 10 H30 a8 8 0 0 1 -8 -10 Z" fill="#F0B04A" />
        <rect x={20} y={50} width={80} height={11} rx={5} fill="#7A4A24" />
        <path d="M18 46 L22 40 C22 37 25 35 28 35 H92 C95 35 98 37 98 40 L102 46 Z" fill="#F2D9A0" />
        <path d="M24 36 C28 34 34 33 40 33 H80 C86 33 92 34 96 36" stroke="#2E8B57" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M24 41 C30 40 38 38 44 38 H76 C82 38 90 40 96 41" stroke="#E8A33D" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M30 46 C33 44 39 43 46 43 H74 C81 43 87 44 90 46" stroke="#2E8B57" strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx={60} cy={28} r={22} fill="#E8A33D" />
        <path d="M44 22 C44 16 50 14 56 14 C62 14 68 16 68 22" stroke="#8F1420" strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={60} cy={105} r={18} fill="#7A4A24" />
        <rect x={46} y={80} width={28} height={10} rx={3} fill="#F0B04A" opacity={0.9} />
        <rect x={47.5} y={66} width={4} height={14} rx={2} fill="#E8A33D" opacity={0.85} />
        <rect x={58.5} y={66} width={4} height={14} rx={2} fill="#E8A33D" opacity={0.85} />
      </g>
    </svg>
  );
}

export function Chicken({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <ellipse cx={26} cy={44} rx={20} ry={26} fill="#F0B04A" />
        <path d="M26 22 C26 16 30 12 36 12" stroke="#8F1420" strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={36} cy={10} r={4} fill="#8F1420" />
        <rect x={18} y={40} width={16} height={34} rx={5} fill="#F0B04A" />
        <rect x={16} y={36} width={20} height={12} rx={4} fill="#E8A33D" opacity={0.9} />
        <path d="M16 36 L20 40 L24 36" fill="#8F1420" opacity={0.7} />
        <ellipse cx={94} cy={40} rx={20} ry={26} fill="#F0B04A" />
        <path d="M94 20 C94 14 98 10 104 10" stroke="#8F1420" strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={104} cy={8} r={4} fill="#8F1420" />
        <rect x={86} y={38} width={16} height={30} rx={5} fill="#F0B04A" />
        <rect x={84} y={34} width={20} height={10} rx={4} fill="#E8A33D" opacity={0.9} />
        <rect x={84} y={34} width={6} height={10} rx={2} fill="#6B3A1F" opacity={0.9} />
        <rect x={98} y={34} width={6} height={10} rx={2} fill="#6B3A1F" opacity={0.9} />
        <path d="M84 34 L88 38 L92 34" fill="#8F1420" opacity={0.7} />
      </g>
    </svg>
  );
}

export function Fries({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <path d="M28 72 L88 72 L92 66 L32 66 Z" fill="#C62828" />
        <path d="M34 80 L82 80 L86 74 L30 74 Z" fill="#D32F2F" />
        <g>
          <rect x={38} y={20} width={6} height={26} rx={2} fill="#F0B04A" />
          <rect x={52} y={16} width={6} height={26} rx={2} fill="#F0B04A" />
          <rect x={66} y={22} width={6} height={22} rx={2} fill="#F0B04A" />
          <rect x={80} y={18} width={6} height={26} rx={2} fill="#F0B04A" />
          <g>
            <rect x={36} y={16} width={8} height={4} rx={2} transform="rotate(-18 36 16)" fill="#FFC72C" />
            <rect x={32} y={16} width={8} height={4} rx={2} transform="rotate(-18 32 16)" fill="#FFC72C" />
            <rect x={50} y={12} width={8} height={4} rx={2} transform="rotate(-18 50 12)" fill="#FFC72C" />
            <rect x={46} y={12} width={8} height={4} rx={2} transform="rotate(-18 46 12)" fill="#FFC72C" />
            <rect x={64} y={16} width={8} height={4} rx={2} transform="rotate(-18 64 16)" fill="#FFC72C" />
            <rect x={60} y={16} width={8} height={4} rx={2} transform="rotate(-18 60 16)" fill="#FFC72C" />
            <rect x={78} y={12} width={8} height={4} rx={2} transform="rotate(-18 78 12)" fill="#FFC72C" />
            <rect x={74} y={12} width={8} height={4} rx={2} transform="rotate(-18 74 12)" fill="#FFC72C" />
          </g>
        </g>
        <text x={60} y={46} textAnchor="middle" fontSize={18} fontWeight={800} fill="#8F1420" fontFamily="ui-sans-serif, system-ui, sans-serif">DIPS</text>
      </g>
    </svg>
  );
}

export function Beverage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <rect x={36} y={12} width={48} height={66} rx={4} fill="#1B2A41" />
        <rect x={36} y={12} width={48} height={12} rx={4} fill="#1B2A41" />
        <rect x={36} y={12} width={48} height={12} rx={4} fill="#3A506B" />
        <path d="M40 12 L40 0 L80 0 L80 12" fill="#3A506B" />
        <rect x={44} y={78} width={32} height={8} rx={2} fill="#1B2A41" />
        <rect x={48} y={82} width={24} height={6} rx={2} fill="#3A506B" />
        <rect x={36} y={14} width={16} height={6} rx={2} fill="#F0B04A" opacity={0.9} />
        <rect x={56} y={10} width={8} height={22} rx={2} fill="#F0B04A" opacity={0.7} transform="rotate(-10 56 10)" />
        <rect x={56} y={10} width={8} height={22} rx={2} fill="#F0B04A" opacity={0.7} transform="rotate(10 56 10)" />
        <circle cx={44} cy={86} r={2.5} fill="#FFD54F" />
        <circle cx={88} cy={76} r={3} fill="#FFD54F" />
        <circle cx={70} cy={66} r={2.5} fill="#FFD54F" />
        <circle cx={50} cy={78} r={3} fill="#FFD54F" />
      </g>
    </svg>
  );
}

export function Dessert({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <rect x={30} y={22} width={60} height={56} rx={6} fill="#F5F0E6" />
        <rect x={30} y={22} width={60} height={12} rx={6} fill="#F5F0E6" />
        <path d="M30 22 L30 64 L90 64 L90 22" fill="#F5F0E6" />
        <path d="M36 28 C40 22 50 16 64 16 C78 16 88 22 92 28" stroke="#C0392B" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M40 34 C44 28 56 20 70 20 C84 20 94 28 98 34" stroke="#5DADE2" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d="M44 42 C48 36 62 26 78 24 C92 22 100 32 102 42" stroke="#E67E22" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
        <circle cx={60} cy={40} r={9} fill="#F5F0E6" stroke="#C0392B" strokeWidth={3} />
        <path d="M60 34 C60 32 58 30 56 30 C52 30 50 33 50 36 L50 40 C50 42 52 44 54 44 C56 44 58 42 58 40" stroke="#C0392B" strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Breakfast({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <ellipse cx={28} cy={58} rx={32} ry={10} fill="#E8A33D" />
        <ellipse cx={92} cy={58} rx={32} ry={10} fill="#E8A33D" />
        <path d="M28 48 C28 44 34 42 40 42 H80 C86 42 92 44 92 48" stroke="#8F1420" strokeWidth={2} fill="none" />
        <rect x={20} y={52} width="8" height="14" rx="3" fill="#8F1420" transform="rotate(-12 20 52)" />
        <rect x="92" y="52" width="8" height="14" rx="3" fill="#8F1420" transform="rotate(12 92 52)" />
        <rect x={26} y={56} width={40} height={8} rx={2} fill="#F0B04A" />
        <rect x={70} y={56} width={24} height={8} rx={2} fill="#F0B04A" />
        <rect x={16} y={60} width={8} height="12" rx="2" fill="#FFD54F" opacity={0.85} transform="rotate(-10 16 60)" />
        <rect x="96" y="60" width="8" height="12" rx="2" fill="#FFD54F" opacity={0.85} transform="rotate(10 96 60)" />
        <path d="M60 60 L60 57" stroke="#8F1420" strokeWidth={3} strokeLinecap="round" />
        <circle cx={60} cy="48" r={10} fill="#F0B04A" />
        <path d="M52 44 C52 42 56 38 60 38 C64 38 68 42 68 44" stroke="#8F1420" strokeWidth={3} fill="none" strokeLinecap="round" />
        <rect x={52} y={66} width={16} height="5" rx="2" fill="#7A4A24" />
        <rect x={52} y={52} width={16} height="6" rx="2" fill="#F0B04A" />
        <rect x="92" y="46" width="12" height="8" rx="2" fill="#7A4A24" />
        <circle cx={28} cy="30" r={6} fill="#F0B04A" />
        <circle cx={92} cy="30" r={6} fill="#F0B04A" />
      </g>
    </svg>
  );
}
