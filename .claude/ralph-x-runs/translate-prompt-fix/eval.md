## Iteration Result
- Status: FAIL
- Awkward count: 36/50 (note: file contains 50 samples, not 100 as stated in task)
- Pass condition: ≤5 awkward
- Breakdown: oneLinerEn issues: 36, keyFindingsEn issues: 2, howToApplyEn issues: 0

---

## Awkward Examples

### oneLinerEn — Two-sentence editorial trailer (26 cases)

**[2603.23448]** — two_sentences
> "Code review agents are evaluated with executable tests instead of text similarity, revealing a significant gap between AI (Claude Code 32.1%, combined 41.5%) and human performance (100%). The study highlights the need for improved contextual understanding in automated code review."
- Why: Editorial second sentence adds no new info.

**[hn_47450142]** — two_sentences
> "...replacement of 76 GitHub Actions tags with malware. The incident underscores the critical risk of even security tools becoming attack vectors."
- Why: "X underscores the Y" = canonical editorial trailer.

**[reddit_MachineLearning_1s1uvfr]** — two_sentences
> "VizPy achieves 97% expert-level quality...without requiring domain-specific training data. This breakthrough demonstrates the potential for LLMs to acquire domain expertise solely through prompt engineering."
- Why: "This breakthrough demonstrates..." = textbook editorial add-on.

**[hn_47393908]** — two_sentences
> "Simon Willison defines...clarifying the evolving role of developers. This guide explores the practicalities of this approach, emphasizing iterative improvement and human oversight."
- Why: Second sentence is meta-description of the guide, not a finding.

**[reddit_ChatGPT_1s0eoqi]** — two_sentences
> "AI output improves dramatically when fed messy, detailed context chunks rather than refined bullet points. This practical tip unlocks better results by prioritizing raw information over polished prompts."
- Why: Pure editorial restatement of sentence 1.

**[hn_47388676]** — two_sentences
> "Sebastian Raschka compiles a gallery...enabling a side-by-side comparison of model designs. This resource offers a comprehensive overview for those seeking to understand the nuances of LLM architecture."
- Why: Second sentence is filler.

**[hn_44875848]** — this_noun_opener + two_sentences
> "This experiment details training a GPT-style transformer on a MacBook Pro in just 5 minutes...The results, backed by empirical data, demonstrate what truly matters within the constraints of local hardware."
- Why: "This experiment details" = banned opener; second sentence is editorial.

**[hn_47552562]** — two_sentences
> "CERN is deploying...representing an extreme 'hardware-first' inference approach. This demonstrates a radical optimization for low-latency data processing in high-energy physics."
- Why: "This demonstrates" = classic banned trailer.

**[hn_45595403]** — two_sentences
> "Anthropic launches Claude Haiku 4.5...delivering Sonnet 4-level coding performance at 1/3 the cost and over 2x the speed. The release offers a cost-effective option for developers needing agent coding and real-time responses."
- Why: Second sentence is editorial summary.

**[hn_47404796]** — two_sentences
> "Mistral open-sources Leanstral, an AI agent dedicated to Lean 4, under the Apache 2.0 license. It achieves comparable or superior performance to Claude Sonnet at 1/15th the cost."
- Why: Two sentences; key metric in second should be folded into first.

**[de28e4cbee455fba136072a0f922c49698b0fb58]** — this_noun_opener + two_sentences
> "This RAG-based scientific literature synthesis model searches 45 million open-access papers and appends citations. It offers a powerful solution for researchers..."
- Why: "This RAG-based..." opener + editorial second sentence.

**[hn_47633855]** — two_sentences
> "Anthropic researcher Nicholas Carlini discovered multiple security vulnerabilities...undetected for 23 years, using Claude Code. This demonstrates AI's potential to fundamentally change traditional security research."
- Why: Editorial "This demonstrates..." appended to an otherwise solid one-liner.

**[hn_46580326]** — a_an_meta_opener + two_sentences
> "A developer details a successful self-hosting experience using a $379 mini PC...The combination dramatically lowers the barrier to entry..."
- Why: "A developer details" = author meta; second sentence is editorial.

**[hn_47477339]** — name_is_a_type + two_sentences
> "Revise is an AI-powered word processor that lets users choose between OpenAI, Anthropic, and xAI models...Its key differentiator is tight integration with AI agents..."
- Why: "X is an [type] that" = product-definition opener; two sentences.

**[hn_46137514]** — two_sentences
> "A vulnerability in legal AI SaaS Filevine exposed over 100,000 confidential files...due to an unauthenticated API endpoint returning a Box administrator token. The issue was responsibly disclosed after researchers gained access to sensitive data."
- Why: Two sentences; second is process info that could be folded in.

**[hn_47780971]** — two_sentences
> "Saffron Health's open-source Libretto toolkit provides AI coding agents with a live browser and token-efficient CLI...enabling robust browser automation scripts. It addresses the fragility of traditional browser automation."
- Why: Second sentence is a vague editorial contrast.

**[hn_44653072]** — two_sentences
> "Alibaba's Qwen team has released Qwen3-Coder...achieving performance on par with Claude Sonnet 4 and enabling local execution. Its accessibility is generating significant interest."
- Why: "Its accessibility is generating significant interest" = vague editorial.

**[hn_47441499]** — a_an_meta_opener + two_sentences
> "A maintainer discovered 50-70% of pull requests to their open-source repository were generated by AI bots...This experiment highlights the growing problem of bot PRs..."
- Why: "A maintainer discovered" = author meta; second sentence is editorial.

**[hn_46449643]** — two_sentences
> "Simon Willison's annual review comprehensively covers the key shifts...reasoning models, agents, vibe coding, and MCP. The report highlights a surge in practical agent applications and the growing influence of Chinese open-weight models."
- Why: Second sentence is editorial expansion.

**[2602.16836]** — two_sentences
> "An 8B model, smaller than GPT-5, surpasses all commercial LLMs in insurance claim processing accuracy, achieving 92% with LoRA fine-tuning alone. This demonstrates the power of efficient fine-tuning for domain-specific tasks."
- Why: "This demonstrates the power of..." = textbook editorial trailer.

**[2504.09246]** — a_an_meta_opener + two_sentences
> "A technique reduces compile errors in TypeScript code generation by over 50%...enforcing type system rules token by token. This approach significantly improves code quality and developer productivity."
- Why: "A technique" = vague; second sentence is editorial.

**[hn_44840728]** — a_an_meta_opener + two_sentences
> "A Hacker News discussion explains why running GPT-4 locally is impossible...The thread reveals the massive scale required to serve billions of users."
- Why: "A Hacker News discussion explains" = meta-describing the content; two sentences.

**[hn_47106686]** — a_an_meta_opener + two_sentences
> "A workflow emphasizing research, planning, annotation, and execution dramatically improves AI coding tool output quality...Practical experience demonstrates this approach minimizes token waste..."
- Why: "A workflow emphasizing" = meta-describing content type; two sentences.

**[hn_47792525]** — this_noun_opener + two_sentences
> "This educational project implements a single-layer Transformer with 1,216 parameters in HyperTalk...It demonstrates that the core mathematics of modern LLMs functions identically on hardware from 30 years ago."
- Why: "This educational project" = banned opener; second sentence editorial.

**[hn_46700594]** — two_sentences
> "Anthropic open-sourced a performance optimization challenge...after Claude Opus 4.5 matched peak human performance within a two-hour limit. The company has now turned it into an open challenge: can humans beat Claude Opus 4.5 with unlimited time?"
- Why: Second sentence adds rhetorical expansion; should be folded into first.

**[hn_47626598]** — two_sentences + name_is_a_type
> "ctx is an Agentic Development Environment (ADE) tool that allows you to run multiple coding agents...safely merging parallel task results. It addresses workflow fragmentation and security concerns..."
- Why: "X is an [type] that" opener; editorial second sentence.

### oneLinerEn — Vague A/An meta opener, single sentence (8 cases)

**[2601.22027]** — this_noun_opener
> "This benchmark evaluates whether LLM agents can admit they 'don't know' in in-car voice assistant scenarios..."
- Why: "This benchmark evaluates" = banned "This [noun]" opener.

**[2602.06384]** — a_an_meta_opener
> "A new benchmark measures how well LLMs adhere to Markdown, and proposes improving format compliance through SFT followed by GRPO fine-tuning."
- Why: "A new benchmark measures" = meta-describing what the paper IS.

**[2601.11004]** — a_an_meta_opener
> "A new study demonstrates that fine-tuning with 2K data corrects the issue of LLMs becoming overconfident when presented with incorrect search results in RAG systems."
- Why: "A new study demonstrates" = classic vague content-meta opener.

**[2509.03057]** — a_an_meta_opener
> "A new method allows models to dynamically determine adapter placement, achieving full fine-tuning-level performance with fewer parameters than LoRA."
- Why: "A new method allows" = meta-describing the content type.

**[a3f8e6f802a0a0004ded5258e349cb8a981aca9f]** — a_an_meta_opener
> "A survey paper summarizes the current state and limitations of LLM-based code generation technologies."
- Why: "A survey paper summarizes" = pure content-type meta-description.

**[2602.05279]** — a_an_meta_opener
> "A new framework accelerates incident recovery by 30% over GPT-o3 and Gemini 2.5 Pro, statistically guaranteeing against LLM hallucinations during security incident response."
- Why: "A new framework" = vague content meta.

**[2603.18004]** — a_an_meta_opener
> "A lightweight token pruning module reduces visual tokens by 50% in video AI models with only a 0.7% performance loss."
- Why: Starts with "A [descriptor noun]" — borderline (result is concrete), but "A lightweight [adj]" still matches banned A/An descriptor pattern.

**[2201.11903]** — researchers_opener
> "Research demonstrates a dramatic performance boost in math, commonsense, and symbolic reasoning for LLMs by simply showing them example 'thought processes'."
- Why: "Research demonstrates" = "Researchers/Research" banned opener.

### oneLinerEn — "[Name] is a [type]" (2 additional single-sentence cases)

**[hn_47460525]** — name_is_a_type
> "OpenCode is an open-source AI coding agent connecting to 75+ LLM providers, and seamlessly integrates with existing GitHub Copilot or ChatGPT Plus subscriptions."
- Why: "X is a [type]" = product-definition opener.

**[2604.13849]** — name_is_a_type
> "MCPThreatHive is an open-source threat intelligence platform that automatically collects, classifies, and visualizes security threats targeting AI agents built on the Model Context Protocol (MCP)."
- Why: "X is a [type] that" = product-definition opener.

### keyFindingsEn issues (2 cases)

**[hn_45595403]** keyFindingsEn[4]:
> "This is Anthropic's first small reasoning model, demonstrating significantly improved alignment performance over Haiku 3.5, according to its system card."
- Why: "This is" opener in a key finding.

**[2201.11903]** keyFindingsEn[5]:
> "This is achieved through prompting alone – a single model can handle diverse reasoning tasks without task-specific training."
- Why: "This is achieved" = passive construction; the finding feels like a dangling afterthought.

---

## Good Examples

**[2602.08234]** (CLEAN):
> "LLM agents automatically extract reusable skills from experience, and a skill library evolves alongside the agent's policy during RL training, boosting performance by over 15.3% compared to traditional memory-based methods."

**[2604.13006]** (CLEAN):
> "A single phrase like \"do not use commas\" shrinks LLM responses by up to 48%."

**[2510.04618]** (CLEAN):
> "Turn system prompts into 'living playbooks' that automatically improve with experience, rather than discarding them after a single use."

**[hn_46178347]** (CLEAN):
> "Oxide, a systems software company, published a document outlining principles for internal LLM usage, prioritizing values like responsibility, rigor, empathy, and teamwork over simply 'using LLMs quickly and extensively'."

**[2603.19092]** (CLEAN):
> "A vulnerability allows complete reversal of VLM safety judgments by simply drawing a single red circle on an image."

**[hn_47536712]** (CLEAN):
> "Reco saved $500K annually by rewriting a Node.js-based JSONata evaluation pipeline in Go using Claude AI, sparking debate in the HN community over delayed action and the omission of existing Go libraries."

**[hn_47561496]** (CLEAN):
> "lat.md tackles the limitations of single-file documentation like AGENTS.md by managing codebase design decisions and domain knowledge as a graph of interconnected Markdown files, enabling AI agents to quickly grasp context without extensive code searching."

**[2601.17566]** (CLEAN):
> "A subtle prompt tweak can trigger a hidden cost-bomb attack, causing AI agents to needlessly call tools dozens of times."

---

## Retrospective

### Which fields still have the most issues
- **oneLinerEn**: 36/50 (72%) awkward. Two-sentence editorial trailers dominate (26/36 cases). A/An vague meta openers: 8 cases. "[Name] is a [type]": 4 cases.
- **keyFindingsEn**: 2 isolated "This is" cases — not systemic.
- **howToApplyEn**: Clean across all 50 — fully solved.

### Root cause
Post-processing detector regex from iter 16 is too narrow. It catches `. This [demonstrates|highlights]` style trailers but misses:
- `. The [noun] [verb]` ("The release offers...", "The report highlights...", "The study highlights...")
- `. Its [noun]` ("Its accessibility is...")
- `. [Named entity] has/is...`
- Any second sentence after first period

A/An meta openers and "[Name] is a [type]" patterns are not addressed by post-processing at all.

### What the prompt should fix next iteration
1. **Simplest deterministic fix**: in post-processing, apply `re.search(r'\.\s+[A-Z]', text.rstrip('.'))` to catch ALL two-sentence cases — not just specific trailer starters. This would catch 26/36 awkward cases in one rule.
2. **Add A/An meta opener detection**: `re.match(r'^(A|An)\s+(new|comprehensive|novel|survey|workflow|technique|framework|method|study|benchmark|researcher|developer|maintainer|lightweight|Hacker)', text)` → trigger rewrite.
3. **Add "[Name] is a [type]" detection**: `re.match(r'^[A-Z]\w+ is an?', text)` → trigger rewrite.
4. These 3 rules together would theoretically cover all 36 awkward cases deterministically.

### What worked well
- keyFindingsEn and howToApplyEn are fully solved.
- Named-actor openers (Anthropic, Oxide, CERN, Reco, lat.md) consistently produce clean one-liners.
- 14/50 (28%) samples are fully clean — target quality is achievable.
