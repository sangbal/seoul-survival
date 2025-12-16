import fs from "node:fs";
import vm from "node:vm";

/**
 * Extracts the `const UPGRADES = { ... }` object literal from seoulsurvival/src/main.js,
 * evaluates it (functions are not executed), and writes a markdown table.
 *
 * Run:
 *   node tools/extractUpgrades.mjs
 */

const SOURCE_PATH = "seoulsurvival/src/main.js";
const OUTPUT_PATH = "upgrade_report.md";

const s = fs.readFileSync(SOURCE_PATH, "utf8");
const marker = "const UPGRADES = {";
const start = s.indexOf(marker);
if (start < 0) {
  throw new Error("UPGRADES marker not found in " + SOURCE_PATH);
}

// Scan starting at the first '{' of the object literal.
let i = start + marker.length - 1; // points at '{'
let depth = 0;
let out = "";

let state = "code"; // 'code' | 'str'
let quote = "";
let esc = false;
let lineComment = false;
let blockComment = false;

for (let k = i; k < s.length; k++) {
  const c = s[k];
  const n = s[k + 1];
  out += c;

  if (state === "code") {
    if (lineComment) {
      if (c === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (c === "*" && n === "/") {
        out += n;
        k++;
        blockComment = false;
      }
      continue;
    }

    if (c === "/" && n === "/") {
      lineComment = true;
      continue;
    }
    if (c === "/" && n === "*") {
      blockComment = true;
      continue;
    }

    if (c === "'" || c === '"' || c === "`") {
      state = "str";
      quote = c;
      esc = false;
      continue;
    }

    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) break; // end of UPGRADES object
    }
  } else if (state === "str") {
    if (esc) {
      esc = false;
      continue;
    }
    if (c === "\\") {
      esc = true;
      continue;
    }
    // Note: template string ${...} is not handled specially here; braces inside
    // strings are treated as plain text, which is what we want for depth counting.
    if (c === quote) {
      state = "code";
      quote = "";
    }
  }
}

// Evaluate only the object literal; functions are created but not executed.
const expr = "(" + out + ")";
let upgrades;
try {
  upgrades = vm.runInNewContext(expr, {});
} catch (e) {
  console.error("Failed to evaluate extracted UPGRADES object.");
  throw e;
}

const rows = Object.entries(upgrades).map(([id, u]) => ({
  category: u?.category ?? "",
  id,
  name: u?.name ?? "",
  desc: u?.desc ?? "",
  cost: u?.cost,
  unlock: u?.unlockCondition ? String(u.unlockCondition) : "",
}));

const CATEGORY_LABELS = {
  labor: "노동",
  deposit: "예금",
  savings: "적금",
  bond: "국내주식",
  usStock: "미국주식",
  crypto: "코인",
  villa: "빌라",
  officetel: "오피스텔",
  apartment: "아파트",
  shop: "상가",
  building: "빌딩",
  global: "전역",
};

// NOTE: careerLevel index mapping based on current game design.
const CAREER_NAMES = ["알바", "계약직", "사원", "대리", "과장", "차장", "부장", "상무", "전무", "CEO"];

const oneLine = (t) => String(t).replace(/\s+/g, " ").trim();
const escPipe = (t) => String(t).replaceAll("|", "\\|");

const humanKrw = (n) => {
  if (typeof n !== "number" || !Number.isFinite(n)) return String(n ?? "");
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}조`;
  if (abs >= 1e8) return `${(n / 1e8).toFixed(1)}억`.replace(/\.0억$/, "억");
  if (abs >= 1e4) return `${(n / 1e4).toFixed(1)}만`.replace(/\.0만$/, "만");
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}천`.replace(/\.0천$/, "천");
  return `${n}`;
};

const fmtCost = (x) => {
  if (typeof x !== "number") return String(x ?? "");
  return `${x.toLocaleString("ko-KR")} (${humanKrw(x)})`;
};

const toKoreanCondition = (condRaw) => {
  const cond = oneLine(condRaw)
    .replace(/^\(\)\s*=>\s*/, "")
    .trim();

  if (!cond) return "";

  const parts = cond.split(/\s*&&\s*/g).map((p) => p.trim()).filter(Boolean);
  const rendered = parts.map((p) => {
    let m;
    if ((m = p.match(/^totalClicks\s*>=\s*(\d+)$/))) return `누적 클릭 ${Number(m[1]).toLocaleString("ko-KR")} 이상`;
    if ((m = p.match(/^careerLevel\s*>=\s*(\d+)$/))) {
      const idx = Number(m[1]);
      const name = CAREER_NAMES[idx] ?? `레벨 ${idx}`;
      return `직급 ${name} 이상(커리어 레벨 ${idx}+)`;
    }
    if ((m = p.match(/^(deposits|savings|bonds|usStocks|cryptos|villas|officetels|apartments|shops|buildings)\s*>=\s*(\d+)$/))) {
      const key = m[1];
      const n = Number(m[2]).toLocaleString("ko-KR");
      const map = {
        deposits: "예금",
        savings: "적금",
        bonds: "국내주식",
        usStocks: "미국주식",
        cryptos: "코인",
        villas: "빌라",
        officetels: "오피스텔",
        apartments: "아파트",
        shops: "상가",
        buildings: "빌딩",
      };
      return `${map[key] ?? key} 보유 ${n}개 이상`;
    }
    if ((m = p.match(/^getTotalProperties\(\)\s*>=\s*(\d+)$/))) return `부동산 총 보유 ${Number(m[1]).toLocaleString("ko-KR")}채 이상`;

    // Fallback: show raw (single-line)
    return oneLine(p);
  });

  return rendered.join(" + ");
};

// Preferred category order for readability.
const CATEGORY_ORDER = [
  "labor",
  "deposit",
  "savings",
  "bond",
  "usStock",
  "crypto",
  "villa",
  "officetel",
  "apartment",
  "shop",
  "building",
  "global",
];

const orderIndex = new Map(CATEGORY_ORDER.map((c, idx) => [c, idx]));

rows.sort((a, b) => {
  const ai = orderIndex.has(a.category) ? orderIndex.get(a.category) : 999;
  const bi = orderIndex.has(b.category) ? orderIndex.get(b.category) : 999;
  if (ai !== bi) return ai - bi;
  // within category, sort by unlock condition "threshold-ish", then by id
  return String(a.id).localeCompare(String(b.id));
});

let md = "";
md += `# 업그레이드 목록 (보기좋게 정리)\n\n`;
md += `- 소스: \`${SOURCE_PATH}\`\n`;
md += `- 생성: ${new Date().toISOString()}\n`;
md += `- 표기: 금액은 \`콤마 표기 (억/만 단위)\`, 해금조건은 한국어로 변환\n\n`;

const byCategory = new Map();
for (const r of rows) {
  const key = r.category || "etc";
  if (!byCategory.has(key)) byCategory.set(key, []);
  byCategory.get(key).push(r);
}

const categories = [...byCategory.keys()].sort((a, b) => {
  const ai = orderIndex.has(a) ? orderIndex.get(a) : 999;
  const bi = orderIndex.has(b) ? orderIndex.get(b) : 999;
  return ai - bi || String(a).localeCompare(String(b));
});

for (const cat of categories) {
  const label = CATEGORY_LABELS[cat] ?? cat;
  md += `## ${label}\n\n`;
  md += `|이름|효과|해금조건|금액|ID|\n`;
  md += `|---|---|---|---:|---|\n`;
  for (const r of byCategory.get(cat)) {
    md += `|${escPipe(r.name)}|${escPipe(r.desc)}|${escPipe(toKoreanCondition(r.unlock))}|${escPipe(fmtCost(r.cost))}|${escPipe(r.id)}|\n`;
  }
  md += `\n`;
}

fs.writeFileSync(OUTPUT_PATH, md, "utf8");
console.log(`Wrote ${OUTPUT_PATH} with ${rows.length} upgrades (pretty)`);


