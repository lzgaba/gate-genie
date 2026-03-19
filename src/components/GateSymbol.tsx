interface GateSymbolProps {
  type: "AND" | "OR" | "NOT" | "XOR";
  result: boolean;
}

const GateSymbol = ({ type, result }: GateSymbolProps) => {
  const color = result ? "hsl(142 72% 50%)" : "hsl(215 15% 35%)";
  const strokeWidth = 2;

  const gates: Record<string, JSX.Element> = {
    AND: (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <path
          d="M10 5 H40 A30 30 0 0 1 40 55 H10 Z"
          fill="none" stroke={color} strokeWidth={strokeWidth}
        />
        <line x1="0" y1="20" x2="10" y2="20" stroke={color} strokeWidth={strokeWidth} />
        <line x1="0" y1="40" x2="10" y2="40" stroke={color} strokeWidth={strokeWidth} />
        <line x1="65" y1="30" x2="80" y2="30" stroke={color} strokeWidth={strokeWidth} />
      </svg>
    ),
    OR: (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <path
          d="M10 5 Q30 5 50 30 Q30 55 10 55 Q25 30 10 5 Z"
          fill="none" stroke={color} strokeWidth={strokeWidth}
        />
        <line x1="0" y1="20" x2="15" y2="20" stroke={color} strokeWidth={strokeWidth} />
        <line x1="0" y1="40" x2="15" y2="40" stroke={color} strokeWidth={strokeWidth} />
        <line x1="50" y1="30" x2="80" y2="30" stroke={color} strokeWidth={strokeWidth} />
      </svg>
    ),
    NOT: (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <polygon
          points="10,5 55,30 10,55"
          fill="none" stroke={color} strokeWidth={strokeWidth}
        />
        <circle cx="60" cy="30" r="5" fill="none" stroke={color} strokeWidth={strokeWidth} />
        <line x1="0" y1="30" x2="10" y2="30" stroke={color} strokeWidth={strokeWidth} />
        <line x1="65" y1="30" x2="80" y2="30" stroke={color} strokeWidth={strokeWidth} />
      </svg>
    ),
    XOR: (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <path
          d="M15 5 Q35 5 55 30 Q35 55 15 55 Q30 30 15 5 Z"
          fill="none" stroke={color} strokeWidth={strokeWidth}
        />
        <path
          d="M8 5 Q23 30 8 55"
          fill="none" stroke={color} strokeWidth={strokeWidth}
        />
        <line x1="0" y1="20" x2="18" y2="20" stroke={color} strokeWidth={strokeWidth} />
        <line x1="0" y1="40" x2="18" y2="40" stroke={color} strokeWidth={strokeWidth} />
        <line x1="55" y1="30" x2="80" y2="30" stroke={color} strokeWidth={strokeWidth} />
      </svg>
    ),
  };

  return (
    <div className="w-20 h-14 md:w-24 md:h-16">
      {gates[type]}
    </div>
  );
};

export default GateSymbol;
