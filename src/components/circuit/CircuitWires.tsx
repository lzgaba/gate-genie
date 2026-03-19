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
}

const CircuitWires = ({ nodes, wires, nodeValues }: CircuitWiresProps) => {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
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

        const totalInputPorts = wires.filter((w) => w.toId === wire.toId).length;
        const from = getOutputPort(fromNode);
        const to = getInputPort(toNode, wire.toPort, Math.max(totalInputPorts, 2));
        const active = nodeValues[wire.fromId] ?? false;

        const midX = (from.x + to.x) / 2;

        return (
          <g key={wire.id}>
            {/* Background wire */}
            <path
              d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
              fill="none"
              stroke={active ? "hsl(142 72% 50%)" : "hsl(215 25% 18%)"}
              strokeWidth={active ? 3 : 2}
              strokeLinecap="round"
              filter={active ? "url(#glow-wire)" : undefined}
              className="transition-all duration-300"
            />
            {/* Animated pulse on active wires */}
            {active && (
              <circle r="4" fill="hsl(142 72% 50%)">
                <animateMotion
                  dur="1.5s"
                  repeatCount="indefinite"
                  path={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                />
              </circle>
            )}
            {/* Port dots */}
            <circle cx={from.x} cy={from.y} r="4" fill={active ? "hsl(142 72% 50%)" : "hsl(215 25% 25%)"} className="transition-all duration-300" />
            <circle cx={to.x} cy={to.y} r="4" fill={active ? "hsl(142 72% 50%)" : "hsl(215 25% 25%)"} className="transition-all duration-300" />
          </g>
        );
      })}
    </svg>
  );
};

export default CircuitWires;
