## Iteration Result
- Status: FAIL
- Awkward count: 25/50 (50%)
- Breakdown: one_liner_en issues: 25, key_findings_en issues: 0, how_to_apply_en issues: 0

### Pattern breakdown
| Pattern | Count |
|---------|-------|
| A/An [noun phrase] opener | 14 |
| Two-sentence (editorial trailer) | 9 |
| This [noun]... opener | 3 |
| Researchers [verb]... opener | 2 |

Note: some samples have multiple patterns (e.g., A/An opener + two sentences).

---

## Awkward Examples

### A/An [noun phrase] openers (14 cases)

**hn_46103376** | one_liner_en | "A Chrome/Firefox extension, Slop Evader, blocks AI-generated content by exclusively displaying search results from before November 30, 2022, effectively eliminating 'slop' from search."
→ Starts with "A Chrome/Firefox extension" — A/An descriptor opener.

**hn_47487536** | one_liner_en | "An AI receptionist combining a RAG pipeline and Vapi voice platform eliminated thousands of dollars in monthly losses for an auto repair shop due to unanswered calls."
→ Starts with "An AI receptionist" — A/An opener.

**hn_47655408** | one_liner_en | "A mini LLM with 8.7 million parameters, trained on the Guppy fish, can be implemented from scratch in 5 minutes on a single Colab notebook, demystifying the black box of LLMs."
→ Starts with "A mini LLM" — A/An opener. "demystifying the black box of LLMs" is editorial trailer.

**reddit_MachineLearning_1rxz4xk** | one_liner_en | "A new verifier forces exploration of disconfirming paths, boosting performance by 17% and reducing interaction rounds by 43%, effectively solving agent loop issues."
→ Starts with "A new verifier" — A/An opener with vague "new" descriptor.

**hn_47499356** | one_liner_en | "An engineer details building a local LLM-powered RAG system from scratch on 1TB of internal company documents, openly sharing the challenges encountered during data preprocessing and vector indexing."
→ Starts with "An engineer" — A/An opener. Describes what the article is about, not what was learned.

**2603.13026** | one_liner_en | "A reinforcement learning-trained adversarial LLM bypasses all state-of-the-art prompt injection defenses, achieving 100% attack success rate."
→ Starts with "A reinforcement learning-trained adversarial LLM" — A/An opener.

**2603.00846** | one_liner_en | "A 1.7B parameter model achieves GPT-4o-mini level RAG noise filtering, reducing costs by 98% and latency by 94.6%."
→ Starts with "A 1.7B parameter model" — A/An opener.

**2603.21489** | one_liner_en | "A framework applying Git's branch-and-merge pattern to multi-agent collaboration improves performance by up to 26.7% compared to single agents."
→ Starts with "A framework" — A/An opener.

**2502.04498** | one_liner_en | "A 7B small LLM improves accuracy in following format instructions like JSON through a Python validation function-based dataset and progressive learning."
→ Starts with "A 7B small LLM" — A/An opener.

**2603.18004** | one_liner_en | "A lightweight token removal module reduces visual tokens in video AI models by 50%, limiting performance loss to 0.7%."
→ Starts with "A lightweight token removal module" — A/An opener.

**2502.11903** | one_liner_en | "A new benchmark measuring long-context memory decline in 20 multimodal AIs, including GPT-4o, reveals significant performance drops and offers a simple solution."
→ Starts with "A new benchmark" — A/An opener with "new" descriptor.

**reddit_ClaudeAI_1s43b8w** | one_liner_en | "A Python server serving Qwen3 on Apple Silicon Macs in the Anthropic Messages API format runs Claude Code offline, offering 7.5x faster performance than traditional Ollama+proxy setups and preventing code leakage."
→ Starts with "A Python server" — A/An opener.

**ebd1f47a** | one_liner_en | "A comprehensive report identifies the threat level and defense techniques for prompt injection, analyzing 45 papers from 2023-2025. The research reveals prompt injection isn't a bug, but a fundamental architectural vulnerability in LLMs."
→ Starts with "A comprehensive report" — A/An opener + TWO sentences.

**2604.07147** | one_liner_en | "A framework composed of VTS, Semantic Memory, and Adaptive Prompting eliminates cross-batch duplication and repetition when generating large-scale synthetic data with LLMs. This approach achieves zero collapse rate, significantly improving data diversity."
→ Starts with "A framework" — A/An opener + TWO sentences.

---

### Two-sentence editorial trailer (7 cases, not counted above)

**reddit_ClaudeAI_1sa7ju4** | one_liner_en | "Splitting AI coding agent roles into Architect, Builder, and Reviewer reduces token usage and lowers hallucination rates. This workflow addresses issues of context loss and unwanted feature additions common in complex development with tools like Claude Code and Cursor."
→ TWO sentences. "This workflow addresses..." is a classic banned second sentence.

**hn_44875848** | one_liner_en | "Researchers successfully trained a GPT-style transformer on a MacBook Pro in just 5 minutes, identifying optimal model size, dataset, and training configurations within local hardware constraints. The study empirically demonstrates the effectiveness of these factors using real-world data."
→ Researchers opener + TWO sentences. "The study empirically demonstrates..." is filler.

**2502.15851** | one_liner_en | "Research reveals system prompts don't reliably override user prompts, and social proof cues—like '90% of experts recommend'—exert a stronger influence on LLMs. This highlights the limitations of relying solely on system prompts for control."
→ TWO sentences. "This highlights the limitations of..." is a classic banned trailer.

**reddit_ClaudeAI_1s7mkn3** | one_liner_en | "Two bugs in the Claude Code standalone binary and the '--resume' option inflate API costs by 10-20x. The issues stem from string replacement logic and improper caching of conversation history."
→ TWO sentences. Second sentence adds detail that should be folded into the first.

**hn_46317098** | one_liner_en | "A Mintlify AI document platform vulnerability allowed attackers to execute malicious JavaScript on customer domains like discord.com and docs.x.com due to insufficient endpoint validation. The flaw stemmed from an open /_mintlify/* path."
→ TWO sentences. Second sentence is unnecessary elaboration.

**2603.12230** | one_liner_en | "Perplexity submitted an analysis of AI Agent security threats to NIST and a defense-in-depth strategy. The report highlights fundamental vulnerabilities stemming from the blurring of code and data boundaries, making traditional security measures insufficient."
→ TWO sentences. "The report highlights..." is editorial expansion.

**hn_45607117** | one_liner_en | "Anthropic's Claude now features Skills – automatically invoked sets of instructions, scripts, and resources – to precisely execute specific tasks. This streamlines workflows and reduces token waste by loading only relevant skills on demand."
→ TWO sentences. "This streamlines workflows..." is clichéd editorial filler.

---

### This [noun]... opener (3 cases)

**2603.18002** | one_liner_en | "This framework imbues VLMs with 3D spatial understanding and self-localization capabilities using only monocular video."
→ "This framework" — banned opener.

**2602.12430** | one_liner_en | "This survey paper provides a comprehensive analysis of Claude's Agent Skills, detailing their functionality, potential risks, and safe handling practices. Alternatively, the Claude Agent Skills survey consolidates the mechanisms, security vulnerabilities, and safety measures into a single document."
→ "This survey paper" + TWO sentences with "Alternatively..." — model leaked two alternative options into output.

**2603.12932** | one_liner_en | "This framework automatically generates fine-tuning data for specialized domains like finance, medicine, and mathematics, requiring only task definitions and eliminating the need for human intervention."
→ "This framework" — banned opener.

---

### Researchers [verb]... opener (1 additional case)

**55adc6c9** | one_liner_en | "Researchers have developed a technique to preserve In-Context Learning (ICL) abilities during fine-tuning, maintaining few-shot learning performance on new tasks post-training."
→ "Researchers have developed" — banned opener.

---

## Good Examples

**hn_47756772** | "AMD's GAIA framework enables privacy-focused, low-latency AI Agent execution on local PCs using Python/C++, but its reliance on the ROCm ecosystem hinders wider adoption."
→ Named company/product + active verb + result + honest trade-off. Perfect structure.

**hn_46108780** | "DeepSeek achieves inference performance exceeding GPT-5 and matching Gemini 3.0 Pro with its 685B parameter, MIT-licensed V3.2 model, while significantly improving inference efficiency."
→ Named subject + active verb + benchmark-grounded comparison. Excellent.

**2601.19834** | "Visual Chain-of-Thought (CoT) surpasses text-only CoT by over 26 percentage points when solving spatial and physical reasoning problems through image generation."
→ Named concept + comparative verb + specific number + specific domain.

**2603.16728** | "Chain-of-Thought (CoT) reasoning boosts accuracy but degrades a model's uncertainty estimation, leading to overconfidence even in erroneous situations."
→ Named concept + trade-off structure + clear consequence. Strong.

**2602.11305** | "LLMs tuned on a single criterion (safety only, value only) misjudge over 50% of cases in real-world, complex scenarios."
→ Specific subject + active verb + quantified result. Clean.

**2603.19127** | "Simultaneous text-audio multimodal attacks bypass safety mechanisms in voice AI models up to 10x more effectively than single-modality attacks."
→ Active verb opener, specific magnitude, comparative framing. Excellent.

**reddit_ClaudeAI_1sble09** | "Forcing concise prompts reduces output tokens by 75%, but actual cost savings remain around 3-4%."
→ Perfect: gerund opener, two specific numbers, captures the key irony in one sentence.

**2503.06709** | "The 'Delusion' phenomenon—where LLMs confidently output incorrect answers—is far harder to detect than typical hallucination and resists correction through fine-tuning or self-reflection."
→ Named concept with em-dash elaboration, strong comparative claim, no filler.

**2603.18940** | "Tracking the step-by-step reduction in model uncertainty during Chain-of-Thought (CoT) inference allows for low-cost prediction of answer correctness without self-consistency."
→ Gerund opener, contrasts with self-consistency cost.

**hn_47497757** | "GPT-5.4 Pro is the first to solve an unsolved problem (Ramsey-style hypergraph) from Epoch AI's FrontierMath, with Opus 4.6 and Gemini 3.1 Pro following suit in subsequent verification."
→ Named model + superlative claim + specific problem domain.

---

## Retrospective

### Which fields still have issues
- `oneLinerEn`: 25/50 (50%) — the only remaining problem field
- `keyFindingsEn`: 0 issues — fully solved across all 50 samples
- `howToApplyEn`: 0 issues — fully solved across all 50 samples

### Trend
| Iter | Awkward | Rate |
|------|---------|------|
| 16 re-eval | 36/50 | 72% |
| 17 | 40/50 | 80% |
| 18 | 27/50 | 54% |
| 19 | 27/50 | 54% |
| 21 | 25/50 | 50% |

Very slight improvement vs iter 19 (27 → 25). Rate remains stuck at ~50%.

### Root cause analysis
The post-processor (added iter 16) works partially — keyFindings/howToApply are clean. But two dominant failure modes remain:

1. **A/An opener rewriter loop not working** (14/25 failures = 56%): Either A/An detector regex is not triggering, or the rewriter still outputs A/An (rewriter prompt doesn't ban A/An from its own output). Need: rewriter first instruction = "DO NOT start with A, An, The, This, Researchers."

2. **Two-sentence truncation incomplete** (9/25 failures = 36%): Truncation not working for variants like ". The [noun]", ". Two [noun]", ". Alternatively". Detection regex may be right but truncation is cutting the wrong part.

3. **This [noun] detector not catching** (3/25): Should be caught by existing regex — check it's running.

4. **Rewriter outputs malformed content** (2602.12430): The source KO itself contained "또는" (or) with two alternative translations. Post-processor needs to strip "Alternatively..." prefix sentences.

### What to fix next iteration
1. Verify A/An detector: `re.match(r"^(A|An)\b", text)` — print log to confirm it's triggering
2. Rewriter prompt hardening: FIRST LINE must be "DO NOT start your output with: A, An, The, This, Researchers, Research, [Name] is a"
3. Post-rewrite re-validation: after rewrite, run detector again. If still banned opener → take first active-verb clause from the first sentence
4. Two-sentence truncation: use greedy first-period cut: `text = text.split('. ')[0] + '.'` before checking other patterns
5. Strip "Alternatively..." edge case: `re.sub(r'\s+Alternatively.*', '', text)`
