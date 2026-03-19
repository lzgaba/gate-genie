import { CheckCircle2, XCircle } from "lucide-react";

interface TruthTableTestProps {
  a: boolean;
  b: boolean;
  andResult: boolean;
  orResult: boolean;
  notResult: boolean;
  xorResult: boolean;
}

const TruthTableTest = ({ a, b, andResult, orResult, notResult, xorResult }: TruthTableTestProps) => {
  const aNum = a ? 1 : 0;
  const bNum = b ? 1 : 0;

  const expectedAnd = aNum & bNum;
  const expectedOr = aNum | bNum;
  const expectedNot = aNum ? 0 : 1;
  const expectedXor = aNum ^ bNum;

  const tests = [
    { gate: "AND", expected: expectedAnd, actual: andResult ? 1 : 0 },
    { gate: "OR", expected: expectedOr, actual: orResult ? 1 : 0 },
    { gate: "NOT A", expected: expectedNot, actual: notResult ? 1 : 0 },
    { gate: "XOR", expected: expectedXor, actual: xorResult ? 1 : 0 },
  ];

  const allPass = tests.every((t) => t.expected === t.actual);

  return (
    <div className="rounded-lg border-2 border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-lg font-bold tracking-wider text-foreground">
          Auto-Teste
        </h3>
        <div className={`flex items-center gap-1.5 font-mono text-xs ${allPass ? "text-neon-green" : "text-destructive"}`}>
          {allPass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {allPass ? "PASS" : "FAIL"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs">
              <th className="text-left py-1 pr-3">Porta</th>
              <th className="text-center py-1 px-2">A</th>
              <th className="text-center py-1 px-2">B</th>
              <th className="text-center py-1 px-2">Esperado</th>
              <th className="text-center py-1 px-2">Saída</th>
              <th className="text-center py-1 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => {
              const pass = t.expected === t.actual;
              return (
                <tr key={t.gate} className="border-t border-border/50">
                  <td className="py-2 pr-3 text-foreground">{t.gate}</td>
                  <td className="text-center py-2 px-2">{aNum}</td>
                  <td className="text-center py-2 px-2">
                    {t.gate === "NOT A" ? "—" : bNum}
                  </td>
                  <td className="text-center py-2 px-2">{t.expected}</td>
                  <td className={`text-center py-2 px-2 ${pass ? "text-neon-green" : "text-destructive"}`}>
                    {t.actual}
                  </td>
                  <td className="text-center py-2 px-2">
                    {pass ? (
                      <CheckCircle2 size={14} className="inline text-neon-green" />
                    ) : (
                      <XCircle size={14} className="inline text-destructive" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TruthTableTest;
