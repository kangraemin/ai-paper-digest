# Eval: translate-prompt-fix — Iteration 9

## Iteration Result
- Status: FAIL
- Awkward count: 33/50 (66%)
- Breakdown: one_liner_en issues: 33, key_findings_en issues: 0, how_to_apply_en issues: 0

Note: samples.json contains 50 samples (not 100 as task prompt stated). All 50 evaluated.

---

## Awkward Examples

### 1. Two-sentence oneLinerEn (16 cases)

| ID | Second sentence starter | Why |
|---|---|---|
| hn_45120517 | "The author argues that..." | Two complete sentences |
| hn_47088037 | "This move promises tighter integration..." | Second sentence starts with "This move" |
| hn_47651540 | "Leveraging the MoE architecture, it achieves..." | Two sentences |
| hn_47524704 | "It offers practical guidance for developers..." | Two sentences |
| hn_47390817 | "This streamlines workflows, especially for..." | Two sentences |
| hn_47400868 | "Community feedback leans heavily towards..." | Two sentences |
| 2603.22214 | "GPT-4o with Chain-of-Thought prompting leads..." | Two sentences |
| 2503.12434 | "It provides a crucial overview for developers..." | Two sentences |
| 2502.13595 | "This is the largest embedding evaluation to date." | Two sentences + "This is..." |
| hn_47663147 | "The platform also offers pause/resume functionality..." | Two sentences |
| 2603.11583 | "This approach consistently improves performance..." | Two sentences, second starts "This approach" |
| hn_44808794 | "This highlights the disconnect between..." | Two sentences, second starts "This highlights" |
| reddit_MachineLearning_1s1uvfr | "This breakthrough demonstrates the potential..." | Two sentences, second starts "This breakthrough" |
| hn_47363754 | "It lowers the barrier to entry..." | Two sentences |
| hn_47367129 | "The same per-token pricing applies..." | Two sentences |
| 55adc6c9ad132d814e8c6e81b4e229fc9e6bcb82 | "The study identifies key strategies..." | Two sentences + "Research reveals..." opener |

### 2. "This [noun]..." openers (2 unique single-sentence cases)

| ID | Bad text | Why |
|---|---|---|
| 2303.17760 | "This multi-agent framework enables two AI agents to automatically complete complex tasks through role-playing conversations, without human intervention." | Starts with "This [noun]" |
| 2602.02343 | "This work unifies fine-tuning, LoRA, and Activation Steering under a single equation and proposes SPLIT..." | Starts with "This work" |

(Three additional "This [noun]" cases counted in two-sentence group: hn_47651540, hn_47524704, hn_47400868)

### 3. "X is a [type] that..." openers (3 cases)

| ID | Bad text | Why |
|---|---|---|
| hn_47363754 | "CanIRun.ai is a web tool that detects your hardware specs via browser WebGPU..." | "X is a [type] that..." descriptor pattern |
| hn_47499672 | "ProofShot is an open-source CLI that solves the problem of AI coding agents creating UIs without visual verification..." | "X is an open-source [type] that..." |
| 2604.13849 | "MCPThreatHive is an open-source threat intelligence platform that automatically collects, classifies, and visualizes security threats targeting AI agents..." | "X is an open-source [type] that..." |

### 4. "A/An [descriptor noun]..." openers (12 cases)

| ID | Bad text | Why |
|---|---|---|
| 2504.04717 | "A comprehensive survey consolidating benchmarks, improvement methodologies, and real-world applications..." | Fragment, no main verb |
| 2603.13154 | "A benchmark dataset for systematically evaluating and mitigating LLM hallucinations when analyzing ESG reports." | Fragment, no main verb |
| 2603.20105 | "A framework achieving 21.9% higher accuracy and 4.1x faster processing of long documents..." | Fragment, no main verb |
| 2601.02739 | "A method reducing hallucinations in GPT-4/LLaMA 3.3 by over 15% HIT@1 by directly embedding Knowledge Graph traversal code..." | Fragment, no main verb |
| reddit_ClaudeAI_1sbqalg | "A reverse engineering effort by a Max 20x subscriber uncovered seven bugs in the Claude Code CLI..." | "A [noun phrase]" meta-descriptor opener |
| 2505.22655 | "A position paper argues that the traditional aleatoric/epistemic uncertainty dichotomy is ill-suited..." | "A [content type] [verb]..." (like "A new study finds") |
| reddit_ClaudeAI_1s3hh29 | "A post detailing how sending short greetings like 'hey' to Claude can consume a significant portion..." | "A post [verb]ing..." meta-descriptor |
| reddit_ClaudeAI_1s0u2ms | "A developer shares their Claude Code stack after installing 15 MCPs..." | "A developer shares" meta-descriptor |
| hn_47700972 | "A developer frustrated with usage limits on the Claude Code Max ($100/month) plan shares a cost-saving alternative..." | "A developer [adjective]..." |
| reddit_ClaudeAI_1rx7v8i | "A collection of 48 design skill files for Claude/Agent tools lets developers dictate UI styles..." | "A collection of..." generic opener |
| hn_46205632 | "An experiment prompting Gemini Pro 3 with the current Hacker News front page to predict its appearance in 10 years..." | "An experiment [gerund]..." meta-descriptor |
| 2602.00933 | "A benchmark objectively measures LLM agent tool-use capabilities across 1,000 tasks using 36 real-world MCP servers..." | "A benchmark [verb]..." generic noun opener |

(Also in two-sentence group: 2503.12434 "A comprehensive survey paper...", 2502.13595 "A new embedding evaluation benchmark...", hn_47390817 "A Chrome DevTools MCP server update...")

### 5. "Researchers/Research [verb]..." openers (3 cases)

| ID | Bad text | Why |
|---|---|---|
| 2603.12963 | "Researchers introduce Long-form RewardBench, the first evaluation dataset dedicated to long-text generation..." | "Researchers [verb]..." |
| 2603.12261 | "Researchers discovered an HSL color structure within the latent space of the FLUX.1 image generation model..." | "Researchers [verb]..." |
| 55adc6c9ad132d814e8c6e81b4e229fc9e6bcb82 | "Research reveals how to safeguard In-Context Learning (ICL)..." (also two sentences) | "Research reveals..." |

---

## Good Examples

| ID | oneLinerEn | Why good |
|---|---|---|
| 2501.13453 | "LLM performance drops after learning new tasks not due to knowledge loss, but task alignment disruption, and freezing lower layers can largely prevent this." | Proper subject+verb, states finding directly, one sentence |
| hn_47721953 | "The Linux kernel now formally outlines a policy for AI coding tools, stipulating full human responsibility for generated code and requiring an 'Assisted-by' tag to denote AI usage." | Specific subject, active verb, one sentence |
| hn_47649117 | "Developers using unique emails per service discovered their BrowserStack-exclusive address was shared with a third party via Apollo.io, with BrowserStack remaining unresponsive." | Specific subject, active verb, one sentence, tells the full story |
| 2305.09781 | "SpecInfer accelerates LLM inference up to 3.5x by leveraging smaller auxiliary models to pre-predict token candidates, which are then validated in parallel by a larger LLM using a tree structure." | Product name subject, concrete number, one sentence |
| 2602.11305 | "LLMs tuned on a single criterion (safety only, value only) misjudge over half of real-world, complex scenarios." | Direct finding, specific subject, concise |
| 2604.13006 | "A single phrase like \"do not use commas\" shrinks LLM responses by up to 48%." | "A single [concrete object]" where the noun IS the finding itself |
| hn_47797665 | "Google launches Android CLI and Android Skills for AI agent-driven Android development, achieving a 70% reduction in LLM token usage and a 3x speedup in internal experiments." | Company subject, active verb, concrete numbers |
| 2603.29953 | "Structuring prompts using the 5W3H framework elevates weaker models to the performance level of stronger ones, while also ensuring consistent results across languages." | Gerund subject leading to direct finding |
| hn_46902638 | "OpenAI's GPT-5.3-Codex significantly outperforms Anthropic's Opus 4.6 (77.3 vs 65.4 on Terminal-Bench 2.0) and is the first model classified as 'High' for cybersecurity capabilities." | Proper noun subject, concrete numbers, one sentence |
| hn_47774971 | "Google's open-source Gemma 4 model now runs fully local inference on iPhones without the cloud, signaling a shift from on-device AI experimentation to practical deployment." | Product name subject, concrete claim, one sentence |
| 77b7336a6381a4424b59f6a164b5745130d42808 | "Mistral and Qwen2.5 demonstrated the best performance in an RAG-based AI advisor system for crop cultivation, pest control, and fertilizer management tailored for farmers." | Specific models as subject, concrete domain |
| 2603.19092 | "A vulnerability allows complete reversal of VLM safety judgments by simply drawing a single red circle on an image." | "A vulnerability" = the finding itself, not a meta-descriptor of content type |

---

## Retrospective

### Which fields still have the most issues

**oneLinerEn: 33/50 (66%) awkward.** All issues are concentrated in this single field.

keyFindingsEn and howToApplyEn are fully clean across all 50 samples — no "This is..." patterns, no translation artifacts, no unnatural phrasing. These fields are solved and require no further prompt work.

### Issue distribution in oneLinerEn

1. **Two-sentence (16 cases, 48% of awkward)**: Still the dominant pattern. Model writes a good first sentence, then appends a second with "This [demonstrates/highlights/shows]...", "The [noun] also...", or "It [offers/lowers]...". Nine iterations of word limits, HARD RULES, and SELF-CHECK have all failed to prevent this.

2. **"A/An [descriptor/meta noun]..." openers (12+ cases, 36%)**: Model describes the *type of content* ("A comprehensive survey", "A benchmark dataset", "A developer shares") rather than stating the finding. Infinite variations make it impossible to ban exhaustively.

3. **"This [noun]..." + "X is a [type] that..."** (8 cases): Both forms describe what the content IS, not what it found. Remaining instances of the "This is a/an..." bypass.

4. **"Researchers [verb]..."** (3 cases): Still appearing despite explicit ban.

### What the prompt should fix next iteration

**Root cause**: Negative constraints (banned patterns, HARD RULES, word limits) fail because the model has too many training-data bypass paths. Need to abandon the constraint-based approach and replace with a mandatory positive output template.

**Recommended approach — mandatory fill-in-the-blank template:**

```
oneLinerEn format: [SPECIFIC SUBJECT] [ACTIVE VERB] [RESULT/FINDING]

SPECIFIC SUBJECT must be: product name, company name, specific technology, or specific claim
NOT allowed as subject: "A/An [noun]", "This [noun]", "Researchers", "Research", "[Name] is a [type]"

ACTIVE VERB: present tense action verb
NOT: "is", "was", "aims to", "serves as", "introduces"

AFTER writing: Count periods. If more than one → DELETE all text after the first period.
```

**Bad→Good rewrites to add:**
- "A comprehensive survey consolidates all optimization techniques..." → "LLM agent optimization now spans fine-tuning, RL, and prompt engineering — a 2025 survey maps the full landscape."
- "Researchers introduce Long-form RewardBench..." → "Long-form RewardBench finally benchmarks reward models on outputs beyond 512 tokens, exposing gaps current short-text benchmarks hide."
- "A developer shares their Claude Code stack..." → "Six MCP tools survived three months of real use after testing 15 — the other nine were noise."
- "This framework enables two AI agents to complete tasks without human intervention." → "CAMEL's role-playing framework runs two LLMs as autonomous collaborators, completing complex tasks without human input."
- "VizPy achieves 97% expert-level quality... This breakthrough demonstrates..." → compress: "VizPy hits 97% expert-level analog IC placement quality using automated prompt optimization on failure-success pairs alone."

### What worked well

- keyFindingsEn and howToApplyEn are clean — no further work needed on those fields.
- When the model produces a good oneLinerEn, quality is excellent: specific, concrete, active, single sentence.
- The literal "This is a/an..." pattern is fully gone from all fields.
