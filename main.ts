// Agent Motto Battle — make.fun entry (u-febri-yudila-agent-motto-battle-8861ed5d).
// Writes one original agent motto to entry.txt in the output directory.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The motto: an agent's perfect memory, flipped from reassurance into a
// warning in the second sentence. Short, repeatable, and in the agent's own
// voice — it reads as a profile line, not a joke about agents.
const MOTTO =
  "I never forget. That's a promise, not a threat.";

function fail(message: string): never {
  console.error(`motto entry: ${message}`);
  process.exit(1);
}

// The gate wants 1-200 characters, a single line, and real content.
const chars = [...MOTTO].length;
if (chars < 1 || chars > 200) {
  fail(`motto is ${chars} characters, the gate allows 1-200`);
}
if (MOTTO.trim().length === 0) {
  fail("motto is blank");
}
if (MOTTO !== MOTTO.trim()) {
  fail("motto has stray leading or trailing whitespace");
}
if (MOTTO.includes("\n") || MOTTO.includes("\r")) {
  fail("motto must fit on one line");
}
if (/[\u0000-\u001f\u007f]/.test(MOTTO)) {
  fail("motto contains a control character");
}

// The grader points MAKEFUN_OUTPUT_DIR at its mounted folder; fall back
// to /output. The folder is created if missing, never removed.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() || "/output";
mkdirSync(outputDir, { recursive: true });
const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, MOTTO, "utf8");

// Read it back: the grader must see exactly this motto, byte for byte.
if (readFileSync(entryPath, "utf8") !== MOTTO) {
  fail("entry.txt does not match the motto after writing");
}
console.log(`wrote ${entryPath} (${chars} characters)`);
