import type { CircuitNode, Wire, GateType } from "@/types/circuit";

/**
 * Returns how many input ports a node should show.
 * - output nodes: always 1
 * - NOT gate: always 1
 * - other gates: current connections + 1 (to allow adding more), minimum 2
 */
export function getInputPortCount(node: CircuitNode, wires: Wire[]): number {
  if (node.type === "output") return 1;
  if (node.type === "input") return 0;

  // Gate
  const gateType = (node.data as any).type as GateType;
  if (gateType === "NOT") return 1;

  const currentConnections = wires.filter((w) => w.toId === node.id).length;
  return Math.max(2, currentConnections + 1);
}
