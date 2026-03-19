import { useState } from "react";
import { Plus, Cpu, Cable, Trash2, Zap, CircleDot } from "lucide-react";
import { useCircuit } from "@/hooks/useCircuit";
import DraggableNode from "./DraggableNode";
import InputNode from "./InputNode";
import GateNode from "./GateNode";
import OutputNode from "./OutputNode";
import CircuitWires from "./CircuitWires";
import type { GateType } from "@/types/circuit";

const NODE_WIDTH = 140;
const NODE_HEIGHT = 70;

const CircuitCanvas = () => {
  const {
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
  } = useCircuit();

  const inputCount = nodes.filter((n) => n.type === "input").length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm flex-wrap">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Cpu size={16} className="text-primary" />
        </div>
        <h1 className="font-mono text-sm font-bold tracking-tight text-foreground mr-4">
          Circuit Editor
        </h1>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={addInput}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-xs font-mono text-foreground signal-transition"
          >
            <Plus size={12} />
            Input
          </button>
          <button
            onClick={() => addGate("AND")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-xs font-mono text-foreground signal-transition"
          >
            <Zap size={12} />
            Gate
          </button>
          <button
            onClick={addOutput}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-xs font-mono text-foreground signal-transition"
          >
            <CircleDot size={12} />
            Output
          </button>
        </div>

        {connecting && (
          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono text-xs text-primary animate-pulse">
              <Cable size={12} className="inline mr-1" />
              Clique em uma porta de entrada para conectar...
            </span>
            <button
              onClick={cancelConnection}
              className="px-2 py-1 rounded border border-destructive/50 text-destructive text-xs font-mono hover:bg-destructive/10 signal-transition"
            >
              Cancelar
            </button>
          </div>
        )}

        {!connecting && (
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            Clique ● saída → ● entrada para conectar
          </span>
        )}
      </div>

      {/* Canvas */}
      <div
        className="relative flex-1 overflow-auto bg-background"
        style={{ minHeight: 600 }}
        onClick={() => { if (connecting) cancelConnection(); }}
      >
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" style={{ zIndex: 0 }}>
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <CircuitWires
          nodes={nodes}
          wires={wires}
          nodeValues={nodeValues}
          onRemoveWire={removeWire}
        />

        {/* Port overlays for connection interaction */}
        {nodes.map((node) => {
          const isSource = node.type === "input" || node.type === "gate";
          const isTarget = node.type === "gate" || node.type === "output";

          return (
            <div key={`ports-${node.id}`}>
              {/* Output port (right side) */}
              {isSource && (
                <button
                  className={`absolute w-5 h-5 rounded-full border-2 z-30 signal-transition
                    ${connecting
                      ? "border-muted-foreground/30 bg-muted/50 cursor-not-allowed"
                      : "border-primary/60 bg-primary/20 hover:bg-primary/40 hover:scale-125 cursor-pointer"
                    }
                  `}
                  style={{
                    left: node.position.x + NODE_WIDTH - 10,
                    top: node.position.y + NODE_HEIGHT / 2 - 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!connecting) startConnection(node.id);
                  }}
                  title="Clique para iniciar conexão"
                />
              )}

              {/* Input ports (left side) */}
              {isTarget && connecting && (
                <>
                  {[0, 1].map((portIdx) => {
                    // For output nodes, only 1 port
                    if (node.type === "output" && portIdx > 0) return null;
                    const totalPorts = node.type === "output" ? 1 : 2;
                    const spacing = NODE_HEIGHT / (totalPorts + 1);
                    return (
                      <button
                        key={portIdx}
                        className="absolute w-5 h-5 rounded-full border-2 border-accent/60 bg-accent/20 hover:bg-accent/50 hover:scale-150 cursor-pointer z-30 signal-transition animate-pulse"
                        style={{
                          left: node.position.x - 10,
                          top: node.position.y + spacing * (portIdx + 1) - 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          finishConnection(node.id, portIdx);
                        }}
                        title={`Conectar à porta ${portIdx}`}
                      />
                    );
                  })}
                </>
              )}
            </div>
          );
        })}

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
                onRemove={() => removeNode(node.id)}
                canRemove={inputCount > 1}
              />
            )}
            {node.type === "gate" && (
              <GateNode
                type={(node.data as any).type as GateType}
                result={nodeValues[node.id] ?? false}
                onChangeType={(t) => changeGateType(node.id, t)}
                onRemove={() => removeNode(node.id)}
              />
            )}
            {node.type === "output" && (
              <OutputNode
                label={(node.data as any).label}
                value={nodeValues[node.id] ?? false}
                onRemove={() => removeNode(node.id)}
              />
            )}
          </DraggableNode>
        ))}
      </div>
    </div>
  );
};

export default CircuitCanvas;
