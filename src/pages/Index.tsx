import { useState } from "react";
import { Cpu, Zap } from "lucide-react";
import InputSwitch from "@/components/InputSwitch";
import LogicGateCard from "@/components/LogicGateCard";
import TruthTableTest from "@/components/TruthTableTest";

const Index = () => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  const andResult = a && b;
  const orResult = a || b;
  const notResult = !a;
  const xorResult = a !== b;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
            <Cpu size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">
              Logic Gate Simulator
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Circuitos Lógicos Interativos
            </p>
          </div>
          <Zap size={14} className="ml-auto text-primary animate-pulse-glow" />
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Input Controls */}
        <section>
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">
            Entradas
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <InputSwitch label="A" value={a} onChange={setA} />
            <InputSwitch label="B" value={b} onChange={setB} />
          </div>
        </section>

        {/* Logic Gates */}
        <section>
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">
            Portas Lógicas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LogicGateCard
              name="AND"
              expression="A · B"
              inputs={`${a ? 1 : 0} · ${b ? 1 : 0}`}
              result={andResult}
            />
            <LogicGateCard
              name="OR"
              expression="A + B"
              inputs={`${a ? 1 : 0} + ${b ? 1 : 0}`}
              result={orResult}
            />
            <LogicGateCard
              name="NOT"
              expression="¬A"
              inputs={`¬${a ? 1 : 0}`}
              result={notResult}
            />
            <LogicGateCard
              name="XOR"
              expression="A ⊕ B"
              inputs={`${a ? 1 : 0} ⊕ ${b ? 1 : 0}`}
              result={xorResult}
            />
          </div>
        </section>

        {/* Truth Table Auto-Test */}
        <section>
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">
            Validação
          </h2>
          <TruthTableTest
            a={a}
            b={b}
            andResult={andResult}
            orResult={orResult}
            notResult={notResult}
            xorResult={xorResult}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
