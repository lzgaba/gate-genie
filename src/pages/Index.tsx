import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import CircuitCanvas from "@/components/circuit/CircuitCanvas";
import CircuitTruthTable from "@/components/circuit/CircuitTruthTable";
import { useCircuit } from "@/hooks/useCircuit";

const Index = () => {
  const circuit = useCircuit();

  return (
    <div className="h-screen bg-background flex flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70} minSize={40}>
          <CircuitCanvas circuit={circuit} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <CircuitTruthTable
            nodes={circuit.nodes}
            wires={circuit.wires}
            nodeValues={circuit.nodeValues}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
