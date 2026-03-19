import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CircuitNode, Wire, GateType } from "@/types/circuit";

interface CircuitTruthTableProps {
  nodes: CircuitNode[];
  wires: Wire[];
  nodeValues: Record<string, boolean>;
}

function evaluateGate(type: GateType, inputs: boolean[]): boolean {
  if (inputs.length === 0) return false;
  if (type === "NOT") return !inputs[0];
  if (type === "AND") return inputs.every(Boolean);
  if (type === "OR") return inputs.some(Boolean);
  if (type === "XOR") return inputs.filter(Boolean).length % 2 === 1;
  if (type === "NAND") return !inputs.every(Boolean);
  if (type === "NOR") return !inputs.some(Boolean);
  return false;
}

function resolveNode(
  nodeId: string,
  nodesMap: Map<string, CircuitNode>,
  wires: Wire[],
  inputValues: Record<string, boolean>
): boolean {
  const node = nodesMap.get(nodeId);
  if (!node) return false;
  if (node.type === "input") return inputValues[node.id] ?? false;
  if (node.type === "gate") {
    const gateType = (node.data as any).type as GateType;
    const inputWires = wires.filter((w) => w.toId === node.id).sort((a, b) => a.toPort - b.toPort);
    const inputs = inputWires.map((w) => resolveNode(w.fromId, nodesMap, wires, inputValues));
    return evaluateGate(gateType, inputs);
  }
  if (node.type === "output") {
    const outputWire = wires.find((w) => w.toId === node.id);
    if (outputWire) return resolveNode(outputWire.fromId, nodesMap, wires, inputValues);
    return false;
  }
  return false;
}

const CircuitTruthTable = ({ nodes, wires, nodeValues }: CircuitTruthTableProps) => {
  const inputNodes = nodes.filter((n) => n.type === "input");
  const gateNodes = nodes.filter((n) => n.type === "gate");
  const outputNodes = nodes.filter((n) => n.type === "output");

  const nodesMap = useMemo(() => {
    const map = new Map<string, CircuitNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const truthTable = useMemo(() => {
    if (inputNodes.length === 0) return [];
    const rowCount = Math.pow(2, inputNodes.length);
    const rows: { inputs: boolean[]; gates: boolean[]; outputs: boolean[] }[] = [];

    for (let i = 0; i < rowCount; i++) {
      const inputValues: Record<string, boolean> = {};
      const inputBools: boolean[] = [];
      inputNodes.forEach((inp, idx) => {
        const val = Boolean((i >> (inputNodes.length - 1 - idx)) & 1);
        inputValues[inp.id] = val;
        inputBools.push(val);
      });

      const gateBools = gateNodes.map((g) => resolveNode(g.id, nodesMap, wires, inputValues));
      const outputBools = outputNodes.map((o) => resolveNode(o.id, nodesMap, wires, inputValues));

      rows.push({ inputs: inputBools, gates: gateBools, outputs: outputBools });
    }
    return rows;
  }, [inputNodes, gateNodes, outputNodes, nodesMap, wires]);

  // Find the current row matching actual input values
  const currentRowIdx = useMemo(() => {
    let idx = 0;
    inputNodes.forEach((inp, i) => {
      if (nodeValues[inp.id]) idx |= 1 << (inputNodes.length - 1 - i);
    });
    return idx;
  }, [inputNodes, nodeValues]);

  if (inputNodes.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground font-mono text-xs">
        Adicione inputs ao circuito para ver a tabela verdade.
      </div>
    );
  }

  // Limit table to 6 inputs max (64 rows)
  if (inputNodes.length > 6) {
    return (
      <div className="p-4 text-center text-muted-foreground font-mono text-xs">
        Tabela verdade disponível para até 6 inputs ({inputNodes.length} inputs no circuito).
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-mono text-sm font-bold text-foreground tracking-tight">
          Tabela Verdade
        </h2>
        <p className="font-mono text-[10px] text-muted-foreground mt-1">
          {inputNodes.length} inputs · {gateNodes.length} gates · {outputNodes.length} outputs · {truthTable.length} combinações
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                {inputNodes.map((inp) => (
                  <TableHead
                    key={inp.id}
                    className="h-8 px-2 text-center font-mono text-[11px] font-bold text-primary"
                  >
                    {(inp.data as any).label}
                  </TableHead>
                ))}
                {gateNodes.map((g) => (
                  <TableHead
                    key={g.id}
                    className="h-8 px-2 text-center font-mono text-[11px] font-bold text-accent"
                  >
                    {(g.data as any).type}
                  </TableHead>
                ))}
                {outputNodes.map((o) => (
                  <TableHead
                    key={o.id}
                    className="h-8 px-2 text-center font-mono text-[11px] font-bold text-foreground"
                  >
                    {(o.data as any).label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {truthTable.map((row, rowIdx) => {
                const isCurrentRow = rowIdx === currentRowIdx;
                return (
                  <TableRow
                    key={rowIdx}
                    className={`border-border/50 ${isCurrentRow ? "bg-primary/10 border-primary/30" : "hover:bg-muted/30"}`}
                  >
                    {row.inputs.map((val, i) => (
                      <TableCell
                        key={`i${i}`}
                        className={`p-1.5 text-center font-mono text-xs ${val ? "text-accent font-bold" : "text-muted-foreground"}`}
                      >
                        {val ? "1" : "0"}
                      </TableCell>
                    ))}
                    {row.gates.map((val, i) => (
                      <TableCell
                        key={`g${i}`}
                        className={`p-1.5 text-center font-mono text-xs ${val ? "text-accent font-bold" : "text-muted-foreground"}`}
                      >
                        {val ? "1" : "0"}
                      </TableCell>
                    ))}
                    {row.outputs.map((val, i) => (
                      <TableCell
                        key={`o${i}`}
                        className={`p-1.5 text-center font-mono text-xs font-bold ${val ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {val ? "1" : "0"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CircuitTruthTable;
