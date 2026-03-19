import type { GateType } from "@/types/circuit";

const GATE_TYPES: GateType[] = ["AND", "OR", "NOT", "XOR", "NAND", "NOR"];

interface GateNodeProps {
  type: GateType;
  result: boolean;
  onChangeType: (type: GateType) => void;
}

const GateSVG = ({ type, color }: { type: GateType; color: string }) => {
  const sw = 1.8;
  const svgs: Record<string, JSX.Element> = {
    AND: (
      <svg viewBox="0 0 50 40" className="w-10 h-7">
        <path d="M8 4 H25 A17 17 0 0 1 25 36 H8 Z" fill="none" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="14" x2="8" y2="14" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="26" x2="8" y2="26" stroke={color} strokeWidth={sw} />
        <line x1="40" y1="20" x2="50" y2="20" stroke={color} strokeWidth={sw} />
      </svg>
    ),
    OR: (
      <svg viewBox="0 0 50 40" className="w-10 h-7">
        <path d="M8 4 Q22 4 35 20 Q22 36 8 36 Q18 20 8 4 Z" fill="none" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="14" x2="11" y2="14" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="26" x2="11" y2="26" stroke={color} strokeWidth={sw} />
        <line x1="35" y1="20" x2="50" y2="20" stroke={color} strokeWidth={sw} />
      </svg>
    ),
    NOT: (
      <svg viewBox="0 0 50 40" className="w-10 h-7">
        <polygon points="8,4 36,20 8,36" fill="none" stroke={color} strokeWidth={sw} />
        <circle cx="40" cy="20" r="3.5" fill="none" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="20" x2="8" y2="20" stroke={color} strokeWidth={sw} />
        <line x1="43.5" y1="20" x2="50" y2="20" stroke={color} strokeWidth={sw} />
      </svg>
    ),
    XOR: (
      <svg viewBox="0 0 50 40" className="w-10 h-7">
        <path d="M12 4 Q26 4 38 20 Q26 36 12 36 Q22 20 12 4 Z" fill="none" stroke={color} strokeWidth={sw} />
        <path d="M6 4 Q16 20 6 36" fill="none" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="14" x2="14" y2="14" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="26" x2="14" y2="26" stroke={color} strokeWidth={sw} />
        <line x1="38" y1="20" x2="50" y2="20" stroke={color} strokeWidth={sw} />
      </svg>
    ),
    NAND: (
      <svg viewBox="0 0 50 40" className="w-10 h-7">
        <path d="M8 4 H22 A17 17 0 0 1 22 36 H8 Z" fill="none" stroke={color} strokeWidth={sw} />
        <circle cx="40" cy="20" r="3.5" fill="none" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="14" x2="8" y2="14" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="26" x2="8" y2="26" stroke={color} strokeWidth={sw} />
        <line x1="43.5" y1="20" x2="50" y2="20" stroke={color} strokeWidth={sw} />
      </svg>
    ),
    NOR: (
      <svg viewBox="0 0 50 40" className="w-10 h-7">
        <path d="M8 4 Q22 4 32 20 Q22 36 8 36 Q18 20 8 4 Z" fill="none" stroke={color} strokeWidth={sw} />
        <circle cx="36" cy="20" r="3.5" fill="none" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="14" x2="11" y2="14" stroke={color} strokeWidth={sw} />
        <line x1="0" y1="26" x2="11" y2="26" stroke={color} strokeWidth={sw} />
        <line x1="39.5" y1="20" x2="50" y2="20" stroke={color} strokeWidth={sw} />
      </svg>
    ),
  };
  return svgs[type] || svgs.AND;
};

const GateNode = ({ type, result, onChangeType }: GateNodeProps) => {
  const color = result ? "hsl(142 72% 50%)" : "hsl(215 15% 35%)";

  return (
    <div
      className={`
        relative w-[140px] h-[70px] rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 signal-transition
        ${result
          ? "border-neon-cyan/50 bg-neon-cyan/5 glow-cyan"
          : "border-border bg-card hover:border-muted-foreground/30"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <GateSVG type={type} color={color} />
        <span
          className={`font-mono text-xl font-bold signal-transition ${result ? "text-neon-green animate-pulse-glow" : "text-signal-low"}`}
        >
          {result ? "1" : "0"}
        </span>
      </div>
      <select
        value={type}
        onChange={(e) => { e.stopPropagation(); onChangeType(e.target.value as GateType); }}
        onMouseDown={(e) => e.stopPropagation()}
        className="font-mono text-[10px] bg-transparent border border-border rounded px-1.5 py-0.5 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:border-primary"
      >
        {GATE_TYPES.map((g) => (
          <option key={g} value={g} className="bg-card">
            {g}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GateNode;
