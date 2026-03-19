import type { CircuitNode, Wire } from "@/types/circuit";

const NODE_WIDTH = 140;
const NODE_HEIGHT = 70;

function getOutputPort(node: CircuitNode): { x: number; y: number } {
  return {
    x: node.position.x + NODE_WIDTH,
    y: node.position.y + NODE_HEIGHT / 2,
  };
}

function getInputPort(
  node: CircuitNode,
  portIndex: number,
  totalPorts: number
): { x: number; y: number } {
  const spacing = NODE_HEIGHT / (totalPorts + 1);
  return {
    x: node.position.x,
    y: node.position.y + spacing * (portIndex + 1),
  };
}

interface CircuitWiresProps {
  nodes: CircuitNode[];
  wires: Wire[];
  nodeValues: Record<string, boolean>;
  onRemoveWire: (wireId: string) => void;
}

const CircuitWires = ({ nodes, wires, nodeValues, onRemoveWire }: CircuitWiresProps) => {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1, pointerEvents: "none" }}>
      <defs>
        <filter id="glow-wire">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {wires.map((wire) => {
        const fromNode = nodeMap[wire.fromId];
        const toNode = nodeMap[wire.toId];
        if (!fromNode || !toNode) return null;

        const totalInputPorts = toNode.type === "output" ? 1 : 2;
        const from = getOutputPort(fromNode);
        const to = getInputPort(toNode, wire.toPort, totalInputPorts);
        const active = nodeValues[wire.fromId] ?? false;

        const midX = (from.x + to.x) / 2;
        const pathD = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

        return (
          <g key={wire.id}>
            {/* Clickable invisible wider path for removal */}
            <path
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth={14}
              strokeLinecap="round"
              className="cursor-pointer"
              style={{ pointerEvents: "stroke" }}
              onClick={() => onRemoveWire(wire.id)}
            >
              <title>Clique para remover conexão</title>
            </path>
            {/* Visible wire */}
            <path
              d={pathD}
              fill="none"
              stroke={active ? "hsl(142 72% 50%)" : "hsl(215 25% 18%)"}
              strokeWidth={active ? 3 : 2}
              strokeLinecap="round"
              filter={active ? "url(#glow-wire)" : undefined}
              className="transition-all duration-300"
              style={{ pointerEvents: "none" }}
            />
            {active && (
              <circle r="4" fill="hsl(142 72% 50%)" style={{ pointerEvents: "none" }}>
                <animateMotion dur="1.5s" repeatCount="indefinite" path={pathD} />
              </circle>
            )}
            <circle cx={from.x} cy={from.y} r="4" fill={active ? "hsl(142 72% 50%)" : "hsl(215 25% 25%)"} className="transition-all duration-300" style={{ pointerEvents: "none" }} />
            <circle cx={to.x} cy={to.y} r="4" fill={active ? "hsl(142 72% 50%)" : "hsl(215 25% 25%)"} className="transition-all duration-300" style={{ pointerEvents: "none" }} />
          </g>
        );
      })}
    </svg>
  );
};

export default CircuitWires;
