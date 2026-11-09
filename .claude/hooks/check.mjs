// PostToolUse 검사: .ts/.tsx 파일을 고친 뒤 타입 검사를 돌리고, 오류만 Claude에게 돌려준다
// 아직 Next.js 프로젝트가 없으면(package.json·tsconfig 없음) 조용히 넘어간다
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const file = String(input.tool_input?.file_path || "");

if (!/\.(ts|tsx)$/.test(file) || !existsSync("package.json") || !existsSync("tsconfig.json")) {
  process.exit(0);
}

try {
  execSync("npx --no-install tsc --noEmit --pretty false", { stdio: "pipe", timeout: 90000 });
  process.exit(0);
} catch (e) {
  const out = String(e.stdout || e.stderr || "").split("\n").filter(Boolean).slice(0, 20).join("\n");
  process.stderr.write(`타입 오류가 있습니다. 고친 뒤 계속하세요:\n${out}\n`);
  process.exit(2);
}
