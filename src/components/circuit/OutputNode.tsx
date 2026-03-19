import { CircleDot } from "lucide-react";

interface OutputNodeProps {
  label: string;
  value: boolean;
}

const OutputNode = ({ label, value }: OutputNodeProps) => {
  return (
    <div
      className={`
        w-[140px] h-[70px] rounded-lg border-2 flex items-center gap-3 px-3 signal-transition
        ${value
          ? "border-neon-cyan/60 bg-neon-cyan/10 glow-cyan"
          : "border-border bg-card"
        }
      `}
    >
      <CircleDot
        size={22}
        className={`signal-transition shrink-0 ${value ? "text-neon-green animate-pulse-glow" : "text-muted-foreground"}`}
      />
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          {label}
        </span>
        <span
          className={`font-mono text-2xl font-bold signal-transition ${value ? "text-neon-green" : "text-muted-foreground"}`}
        >
          {value ? "1" : "0"}
        </span>
      </div>
    </div>
  );
};

export default OutputNode;
