export type GateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR";

export interface Position {
  x: number;
  y: number;
}

export interface CircuitInput {
  id: string;
  label: string;
  value: boolean;
  position: Position;
}

export interface CircuitGate {
  id: string;
  type: GateType;
  position: Position;
  inputIds: string[]; // IDs of connected inputs or other gates
}

export interface CircuitOutput {
  id: string;
  label: string;
  position: Position;
  sourceId: string | null; // gate or input ID
}

export interface Wire {
  id: string;
  fromId: string;
  fromPort: "output";
  toId: string;
  toPort: number; // input port index
}

export interface CircuitNode {
  id: string;
  type: "input" | "gate" | "output";
  position: Position;
  data: CircuitInput | CircuitGate | CircuitOutput;
}
