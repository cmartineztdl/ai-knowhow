import React, { useEffect, useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface InteractiveExerciseProps {
  block: string;
  exercise: string; // e.g., 'ex-01-token-counter'
}

export default function InteractiveExercise({ block, exercise }: InteractiveExerciseProps) {
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const basePath = useBaseUrl(`/${block}/${exercise}`);
  const tsconfigPath = useBaseUrl(`/${block}/tsconfig.json`);

  useEffect(() => {
    let mounted = true;

    async function loadFiles() {
      try {
        const exRes = await fetch(`${basePath}/src/index.ts`);
        const testRes = await fetch(`${basePath}/__tests__/index.test.ts`);
        const tsconfigRes = await fetch(tsconfigPath);

        if (!exRes.ok) throw new Error(`Failed to load ${exercise}/src/index.ts`);
        if (!testRes.ok) throw new Error(`Failed to load ${exercise}/__tests__/index.test.ts`);

        const exCode = await exRes.text();
        const testCode = await testRes.text();
        const tsconfigCode = tsconfigRes.ok ? await tsconfigRes.text() : "{}";

        if (mounted) {
          setFiles({
            "/src/index.ts": exCode,
            "/__tests__/index.test.ts": testCode,
            "/tsconfig.json": tsconfigCode,
            "/vitest.config.ts": `
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
  },
});
            `.trim(),
            "/package.json": JSON.stringify({
              name: "ai-knowhow-exercise",
              version: "1.0.0",
              type: "module",
              scripts: {
                test: "vitest run"
              },
              dependencies: {
                "dotenv": "^16.4.5"
              },
              devDependencies: {
                "vitest": "^1.0.0",
                "typescript": "^5.0.0",
                "@types/node": "^20.0.0"
              }
            }, null, 2)
          });
        }
      } catch (err: any) {
        if (mounted) setError(err.message);
      }
    }

    loadFiles();
    return () => { mounted = false; };
  }, [block, exercise]);

  if (error) {
    return <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>Error loading exercise: {error}</div>;
  }

  if (!files) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading interactive exercise environment...</div>;
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      <Sandpack
        template="node"
        theme="dark"
        files={files}
        customSetup={{
          dependencies: {
            "vitest": "^1.0.0",
            "dotenv": "^16.4.5"
          }
        }}
        options={{
          showConsoleButton: true,
          showConsole: true,
          activeFile: `/src/index.ts`,
          visibleFiles: [
            `/src/index.ts`,
            `/__tests__/index.test.ts`
          ]
        }}
      />
    </div>
  );
}
