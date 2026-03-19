import { Power } from "lucide-react";

interface InputSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const InputSwitch = ({ label, value, onChange }: InputSwitchProps) => {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        group relative flex flex-col items-center gap-3 p-6 rounded-lg border-2 
        signal-transition cursor-pointer select-none
        ${value
          ? "border-neon-green bg-neon-green/5 glow-green"
          : "border-muted bg-secondary hover:border-muted-foreground"
        }
      `}
    >
      <span className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
        Input {label}
      </span>
      <div
        className={`
          w-16 h-16 rounded-full flex items-center justify-center signal-transition
          ${value
            ? "bg-neon-green/20 text-neon-green"
            : "bg-muted text-muted-foreground"
          }
        `}
      >
        <Power size={28} className={`signal-transition ${value ? "opacity-100" : "opacity-40"}`} />
      </div>
      <div className="flex items-center gap-2">
        <span className={`
          font-mono text-3xl font-bold signal-transition
          ${value ? "text-neon-green" : "text-muted-foreground"}
        `}>
          {value ? "1" : "0"}
        </span>
        <span className={`
          text-xs font-mono signal-transition
          ${value ? "text-neon-green/70" : "text-muted-foreground/70"}
        `}>
          {value ? "HIGH" : "LOW"}
        </span>
      </div>
    </button>
  );
};

export default InputSwitch;
