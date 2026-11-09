// PreToolUse 가드: 배포·실사용 DB·위험 명령을 막는다 (exit 2 = 차단, 이유는 stderr로 Claude에게 전달)
// Windows·맥 모두 동작하도록 node로 작성
import { readFileSync } from "node:fs";

const PROD_REF = "yvghpijolflndtyagmjk";
const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const tool = input.tool_name || "";
const ti = input.tool_input || {};
const text = [ti.command, ti.file_path, ti.content, ti.new_string, ti.url]
  .filter(Boolean)
  .join("\n");

const rules = [
  [/\bvercel\b[^\n]*(--prod\b|\bdeploy\b|\bpromote\b)/i, "배포는 상석이 직접 합니다."],
  [/\bsupabase\b[^\n]*\b(db\s+(push|reset)|migration\s+up)\b/i, "DB 변경 명령은 상석 승인 후 직접 실행합니다."],
  [new RegExp(PROD_REF), "실사용 Supabase 프로젝트는 Claude가 접근하지 않습니다."],
  [/service_role|sb_secret_/i, "secret 키는 코드·명령에 넣지 않습니다."],
  [/\bgit\s+push\b[^\n]*(--force|-f\b)/i, "강제 푸시는 금지입니다."],
  [/\brm\s+-[a-z]*r[a-z]*f?\s+(\/|~|\.\.)/i, "프로젝트 밖 삭제는 금지입니다."],
  [/api\.notion\.com[^\n]*(PATCH|POST|DELETE)|(PATCH|POST|DELETE)[^\n]*api\.notion\.com/i, "노션 원본은 읽기만 합니다."],
];

// CLAUDE.md와 이 파일 자체는 규칙 문구를 담고 있으므로 편집 허용
const path = String(ti.file_path || "");
const selfEdit = /CLAUDE\.md$|\.claude[\/\\]hooks[\/\\]guard\.mjs$/.test(path);

if (!selfEdit) {
  for (const [re, why] of rules) {
    if (re.test(text)) {
      process.stderr.write(`차단됨 (${tool}): ${why}\n`);
      process.exit(2);
    }
  }
}
process.exit(0);
