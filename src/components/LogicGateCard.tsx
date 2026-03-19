import GateSymbol from "./GateSymbol";

interface LogicGateCardProps {
  name: string;
  expression: string;
  inputs: string;
  result: boolean;
}

const LogicGateCard = ({ name, expression, inputs, result }: LogicGateCardProps) => {
  return (
    <div
      className={`
        relative rounded-lg border-2 p-5 signal-transition
        ${result
          ? "border-neon-cyan/50 bg-neon-cyan/5 glow-cyan"
          : "border-border bg-card hover:border-muted-foreground/50"
        }
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-lg font-bold tracking-wider text-foreground">
          {name}
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {expression}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <GateSymbol type={name as "AND" | "OR" | "NOT" | "XOR"} result={result} />

        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-muted-foreground">{inputs}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">OUT</span>
            <span
              className={`
                font-mono text-2xl font-bold signal-transition
                ${result ? "text-neon-green animate-pulse-glow" : "text-signal-low"}
              `}
            >
              {result ? "1" : "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicGateCard;
