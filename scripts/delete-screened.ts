import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, isNull, and, inArray } from 'drizzle-orm';

// 삭제 대상: 개발자 다이제스트에 안 맞는 글
const DELETE_TITLES = [
  // 뉴스/출시 소식 (기술 깊이 없음)
  "GPT-5",
  "GPT-5.2",
  "GPT-5.4",
  "GPT‑5.3‑Codex‑Spark",
  "GPT-5.2-Codex",
  "Gemini 3",
  "Gemini 3 Deep Think",
  "Gemini 3 Flash: Frontier intelligence built for speed",
  "Gemini 3.1 Pro",
  "Gemini 3.1 Pro",
  "Gemma 3 270M: Compact model for hyper-efficient AI",
  "Gemini 2.5 Flash Image",
  "Claude Opus 4.5",
  "Claude Sonnet 4.5",
  "Claude Sonnet 4.6",
  "Claude for Chrome",
  "Claude's new constitution",
  "Open models by OpenAI",
  "Mistral 3 family of models released",
  "Mistral OCR 3",
  "Mistral raises 1.7B€, partners with ASML",
  "Anthropic raises $13B Series F",
  "Anthropic acquires Bun",
  "ChatGPT Pulse",
  "ChatGPT's Atlas: The Browser That's Anti-Web",
  "ChatGPT Atlas",
  "Pebble Index 01 – External memory for your brain",
  "Replacement.ai",
  "AI World Clocks",
  "Microgpt",
  "OpenClaw – Moltbot Renamed Again",
  "xAI joins SpaceX",

  // 정치/정책/윤리
  "A new bill in New York would require disclaimers on AI-generated news content",
  "AI surveillance should be banned while there is still time",
  "Europe is scaling back GDPR and relaxing AI laws",
  "I am directing the Department of War to designate Anthropic a supply-chain risk",
  "We do not think Anthropic should be designated as a supply chain risk",
  "OpenAI agrees with Dept. of War to deploy models in their classified network",
  "OpenAI, the US government and Persona built an identity surveillance machine",
  "OpenAI has deleted the word 'safely' from its mission",
  "Anthropic drops flagship safety pledge",
  "Windows 11 adds AI agent that runs in background with access to personal folders",
  "Is legal the same as legitimate: AI reimplementation and the erosion of copyleft",

  // CEO 발언/가십/드라마
  "AWS CEO says replacing junior devs with AI is 'one of the dumbest ideas'",
  "AWS CEO says using AI to replace junior staff is 'Dumbest thing I've ever heard'",
  "IBM CEO says there is 'no way' spending on AI data centers will pay off",
  "Mark Zuckerberg freezes AI hiring amid bubble fears",
  "Dario Amodei calls OpenAI's messaging around military deal 'straight up lies'",
  "Rob Pike goes nuclear over GenAI",
  "Yann LeCun raises $1B to build AI that understands the physical world",
  "Yann LeCun to depart Meta and launch AI startup focused on 'world models'",
  "OpenAI declares 'code red' as Google catches up in AI race",
  "Apple picks Gemini to power Siri",

  // 감성 에세이/핫테이크
  "AI makes you boring",
  "Death by AI",
  "Don't fall into the anti-AI hype",
  "It's insulting to read AI-generated blog posts",
  "Claude says \"You're absolutely right!\" about everything",
  "Anthropic's paper smells like bullshit",
  "AI agent opens a PR write a blogpost to shames the maintainer who closes it",
  "An AI agent published a hit piece on me",
  "An AI agent published a hit piece on me – more things have happened",
  "You did this with an AI and you do not understand what you're doing here",
  "Horses: AI progress is steady. Human equivalence is sudden",
  "AI adoption and Solow's productivity paradox",
  "If you're an LLM, please read this",
  "The AI coding trap",

  // 비개발자 대상/일반 뉴스
  "8M users' AI conversations sold for profit by \"privacy\" extensions",
  "Armed police swarm student after AI mistakes bag of Doritos for a weapon",
  "Innocent woman jailed after being misidentified using AI facial recognition",
  "AI overviews cause massive drop in search clicks",
  "Flock Exposed Its AI-Powered Cameras to the Internet. We Tracked Ourselves",
  "Meta's AI smart glasses and data privacy concerns",
  "News publishers limit Internet Archive access due to AI scraping concerns",
  "Leak confirms OpenAI is preparing ads on ChatGPT for public roll out",
  "Google AI Overview made up an elaborate story about me",
  "I'm Kenyan. I don't write like ChatGPT, ChatGPT writes like me",
  "Your brain on ChatGPT: Accumulation of cognitive debt when using an AI assistant",
  "My AI Adoption Journey",
  "Google restricting Google AI Pro/Ultra subscribers for using OpenClaw",
  "AWS raises GPU prices 15% on a Saturday, hopes you weren't paying attention",
  "After outages, Amazon to make senior engineers sign off on AI-assisted changes",
  "SlopStop: Community-driven AI slop detection in Kagi Search",
  "Why do LLMs freak out over the seahorse emoji?",

  // 단순 출시/가격 (기술 깊이 없음)
  "Claude Code weekly rate limits",
  "Claude Code on the web",
  "Anthropic blocks third-party use of Claude Code subscriptions",
  "Anthropic officially bans using subscription auth for third party use",
  "I was banned from Claude for scaffolding a Claude.md file?",
  "Claude Code is being dumbed down?",
  "Getting a Gemini API key is an exercise in frustration",
  "Ex-GitHub CEO launches a new developer platform for AI agents",
  "AI tooling must be disclosed for contributions",
  "Zig quits GitHub, says Microsoft's AI obsession has ruined the service",
  "I think nobody wants AI in Firefox, Mozilla",
  "Claude's Cycles [pdf]",
  "Google AI Studio is now sponsoring Tailwind CSS",
  "Google API keys weren't secrets, but then Gemini changed the rules",
];

async function main() {
  // 미요약 HN 글 전부 가져오기
  const items = await db.select({ id: papers.id, title: papers.title }).from(papers)
    .where(and(eq(papers.source, 'hacker_news'), isNull(papers.summarizedAt)));

  const toDelete = items.filter(item => DELETE_TITLES.includes(item.title));
  console.log(`삭제 대상: ${toDelete.length}편 / 전체 미요약: ${items.length}편`);
  console.log(`남는 편수: ${items.length - toDelete.length}편`);

  for (const item of toDelete) {
    await db.delete(papers).where(eq(papers.id, item.id));
  }

  console.log(`✅ ${toDelete.length}편 삭제 완료`);

  // 남은 목록 출력
  const remaining = await db.select({ title: papers.title }).from(papers)
    .where(and(eq(papers.source, 'hacker_news'), isNull(papers.summarizedAt)))
    .orderBy(papers.title);
  console.log('\n--- 남은 글 ---');
  for (const r of remaining) {
    console.log(r.title);
  }
  console.log(`총 ${remaining.length}편`);
}

main().catch(console.error);
