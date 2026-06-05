/** Frees ports 3000 and 3001 before starting the dev server (Windows-friendly). */
import { execSync } from "child_process";

const ports = [3000, 3001];
const killed = new Set();

for (const port of ports) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    for (const line of out.split("\n")) {
      if (!line.includes("LISTENING")) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (!pid || pid === "0" || killed.has(pid)) continue;
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        killed.add(pid);
        console.log(`Freed port ${port} (PID ${pid})`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* port not in use */
  }
}

if (killed.size === 0) console.log("Ports 3000 and 3001 are free.");
