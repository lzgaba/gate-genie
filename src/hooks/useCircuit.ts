import { useState, useCallback, useMemo } from "react";
import type { CircuitNode, Wire, GateType, Position } from "@/types/circuit";

let idCounter = 100;
const uid = () => `node_${++idCounter}`;

const DEFAULT_INPUTS: CircuitNode[] = [
  {
    id: "in_A",
    type: "input",
    position: { x: 60, y: 120 },
    data: { id: "in_A", label: "A", value: false, position: { x: 60, y: 120 } },
  },
  {
    id: "in_B",
    type: "input",
    position: { x: 60, y: 280 },
    data: { id: "in_B", label: "B", value: false, position: { x: 60, y: 280 } },
  },
];

const DEFAULT_GATE: CircuitNode = {
  id: "gate_1",
  type: "gate",
  position: { x: 350, y: 180 },
  data: { id: "gate_1", type: "AND" as GateType, position: { x: 350, y: 180 }, inputIds: [] },
};

const DEFAULT_OUTPUT: CircuitNode = {
  id: "out_1",
  type: "output",
  position: { x: 600, y: 200 },
  data: { id: "out_1", label: "OUT", position: { x: 600, y: 200 }, sourceId: null },
};

export function useCircuit() {
  const [nodes, setNodes] = useState<CircuitNode[]>([
    ...DEFAULT_INPUTS,
    DEFAULT_GATE,
    DEFAULT_OUTPUT,
  ]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [connecting, setConnecting] = useState<{ fromId: string } | null>(null);

  const toggleInput = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id && n.type === "input"
          ? { ...n, data: { ...n.data, value: !(n.data as any).value } }
          : n
      )
    );
  }, []);

  const addInput = useCallback(() => {
    const inputNodes = nodes.filter((n) => n.type === "input");
    const label = String.fromCharCode(65 + inputNodes.length);
    const y = 120 + inputNodes.length * 100;
    const id = uid();
    const newNode: CircuitNode = {
      id,
      type: "input",
      position: { x: 60, y },
      data: { id, label, value: false, position: { x: 60, y } },
    };
    setNodes((prev) => [...prev, newNode]);
  }, [nodes]);

  const addGate = useCallback((type: GateType = "AND") => {
    const gateNodes = nodes.filter((n) => n.type === "gate");
    const y = 150 + gateNodes.length * 120;
    const id = uid();
    const newNode: CircuitNode = {
      id,
      type: "gate",
      position: { x: 350, y },
      data: { id, type, position: { x: 350, y }, inputIds: [] },
    };
    setNodes((prev) => [...prev, newNode]);
  }, [nodes]);

  const addOutput = useCallback(() => {
    const outputNodes = nodes.filter((n) => n.type === "output");
    const y = 150 + outputNodes.length * 120;
    const id = uid();
    const label = `OUT ${outputNodes.length + 1}`;
    const newNode: CircuitNode = {
      id,
      type: "output",
      position: { x: 600, y },
      data: { id, label, position: { x: 600, y }, sourceId: null },
    };
    setNodes((prev) => [...prev, newNode]);
  }, [nodes]);

  const removeNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setWires((prev) => prev.filter((w) => w.fromId !== id && w.toId !== id));
  }, []);

  const changeGateType = useCallback((gateId: string, type: GateType) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === gateId && n.type === "gate"
          ? { ...n, data: { ...n.data, type } }
          : n
      )
    );
  }, []);

  const moveNode = useCallback((id: string, position: Position) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, position } : n))
    );
  }, []);

  // Connection flow: click output port to start, click input port to finish
  const startConnection = useCallback((fromId: string) => {
    setConnecting({ fromId });
  }, []);

  const finishConnection = useCallback((toId: string, toPort: number) => {
    if (!connecting) return;
    if (connecting.fromId === toId) {
      setConnecting(null);
      return;
    }
    // Don't allow duplicate wires
    setWires((prev) => {
      const exists = prev.some(
        (w) => w.fromId === connecting.fromId && w.toId === toId && w.toPort === toPort
      );
      if (exists) return prev;
      // Remove existing wire to same port
      const filtered = prev.filter(
        (w) => !(w.toId === toId && w.toPort === toPort)
      );
      return [
        ...filtered,
        { id: uid(), fromId: connecting.fromId, fromPort: "output" as const, toId, toPort },
      ];
    });
    setConnecting(null);
  }, [connecting]);

  const cancelConnection = useCallback(() => {
    setConnecting(null);
  }, []);

  const removeWire = useCallback((wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  }, []);

  // Compute output values
  const nodeValues = useMemo(() => {
    const values: Record<string, boolean> = {};

    nodes.forEach((n) => {
      if (n.type === "input") {
        values[n.id] = (n.data as any).value;
      }
    });

    nodes.forEach((n) => {
      if (n.type === "gate") {
        const gateData = n.data as any;
        const inputWires = wires
          .filter((w) => w.toId === n.id)
          .sort((a, b) => a.toPort - b.toPort);
        const inputs = inputWires.map((w) => values[w.fromId] ?? false);

        const gateType = gateData.type as GateType;
        let result = false;

        if (inputs.length === 0) {
          result = false;
        } else if (gateType === "NOT") {
          result = !inputs[0];
        } else if (gateType === "AND") {
          result = inputs.every(Boolean);
        } else if (gateType === "OR") {
          result = inputs.some(Boolean);
        } else if (gateType === "XOR") {
          result = inputs.filter(Boolean).length % 2 === 1;
        } else if (gateType === "NAND") {
          result = !inputs.every(Boolean);
        } else if (gateType === "NOR") {
          result = !inputs.some(Boolean);
        }

        values[n.id] = result;
      }
    });

    nodes.forEach((n) => {
      if (n.type === "output") {
        const outputWires = wires.filter((w) => w.toId === n.id);
        if (outputWires.length > 0) {
          values[n.id] = values[outputWires[0].fromId] ?? false;
        } else {
          values[n.id] = false;
        }
      }
    });

    return values;
  }, [nodes, wires]);

  return {
    nodes,
    wires,
    nodeValues,
    connecting,
    toggleInput,
    addInput,
    addGate,
    addOutput,
    removeNode,
    changeGateType,
    moveNode,
    startConnection,
    finishConnection,
    cancelConnection,
    removeWire,
  };
}
