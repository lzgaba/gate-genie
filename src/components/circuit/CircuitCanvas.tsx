import { Plus, Cpu } from "lucide-react";
import { useCircuit } from "@/hooks/useCircuit";
import DraggableNode from "./DraggableNode";
import InputNode from "./InputNode";
import GateNode from "./GateNode";
import OutputNode from "./OutputNode";
import CircuitWires from "./CircuitWires";
import type { GateType } from "@/types/circuit";

const CircuitCanvas = () => {
  const {
    nodes,
    wires,
    nodeValues,
    toggleInput,
    addInput,
    removeInput,
    changeGateType,
    moveNode,
  } = useCircuit();

  const inputCount = nodes.filter((n) => n.type === "input").length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Cpu size={16} className="text-primary" />
        </div>
        <h1 className="font-mono text-sm font-bold tracking-tight text-foreground">
          Circuit Editor
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={addInput}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-xs font-mono text-foreground signal-transition"
          >
            <Plus size={12} />
            Add Input
          </button>
          <span className="font-mono text-[10px] text-muted-foreground">
            {inputCount} inputs
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-auto bg-background">
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" style={{ zIndex: 0 }}>
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <CircuitWires nodes={nodes} wires={wires} nodeValues={nodeValues} />

        {nodes.map((node) => (
          <DraggableNode
            key={node.id}
            id={node.id}
            position={node.position}
            onMove={moveNode}
          >
            {node.type === "input" && (
              <InputNode
                label={(node.data as any).label}
                value={nodeValues[node.id] ?? false}
                onToggle={() => toggleInput(node.id)}
                onRemove={() => removeInput(node.id)}
                canRemove={inputCount > 1}
              />
            )}
            {node.type === "gate" && (
              <GateNode
                type={(node.data as any).type as GateType}
                result={nodeValues[node.id] ?? false}
                onChangeType={(t) => changeGateType(node.id, t)}
              />
            )}
            {node.type === "output" && (
              <OutputNode
                label={(node.data as any).label}
                value={nodeValues[node.id] ?? false}
              />
            )}
          </DraggableNode>
        ))}
      </div>
    </div>
  );
};

export default CircuitCanvas;
