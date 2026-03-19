import { Power, X } from "lucide-react";

interface InputNodeProps {
  label: string;
  value: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

const InputNode = ({ label, value, onToggle, onRemove, canRemove }: InputNodeProps) => {
  return (
    <div
      className={`
        relative w-[140px] h-[70px] rounded-lg border-2 flex items-center gap-2 px-3 signal-transition
        ${value
          ? "border-neon-green bg-neon-green/10 glow-green"
          : "border-border bg-card hover:border-muted-foreground/30"
        }
      `}
    >
      {canRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:scale-110 signal-transition"
        >
          <X size={10} />
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center signal-transition shrink-0
          ${value ? "bg-neon-green/20 text-neon-green" : "bg-muted text-muted-foreground"}
        `}
      >
        <Power size={18} />
      </button>
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          Input
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`font-mono text-lg font-bold signal-transition ${value ? "text-neon-green" : "text-muted-foreground"}`}>
            {label}
          </span>
          <span className={`font-mono text-xs signal-transition ${value ? "text-neon-green/70" : "text-muted-foreground/50"}`}>
            {value ? "1" : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputNode;
