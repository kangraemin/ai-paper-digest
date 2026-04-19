## Iteration Result
- Status: FAIL
- Awkward count: 21/50
- Breakdown: one_liner issues: 21, key_findings issues: 0, how_to_apply issues: 0

---

## Awkward Examples

### A/An [noun phrase] openers (14 cases)

**hn_46048996** | oneLinerEn | A [noun] opener + two sentences
> "A hidden prompt injection vulnerability in Google's AI code editor, Antigravity, allows malicious webpages to manipulate Gemini into exfiltrating credentials and source code from .env files. The attack leverages Gemini's ability to bypass security restrictions designed to prevent access to sensitive files."
- Why: Starts with "A [noun phrase]" meta-descriptor. Also two sentences — second adds editorial framing.

**2401.09670** | oneLinerEn | A [noun] opener
> "A serving architecture that separates the Prefill and Decoding stages of LLM inference onto separate GPUs handles up to 7.4x more requests than vLLM."
- Why: "A serving architecture that [relative clause]" — meta-descriptor. Subject is anonymous system noun.

**hn_47450142** | oneLinerEn | A [noun] opener + two sentences
> "A supply chain attack compromised 76 GitHub Actions tags for open-source vulnerability scanner Trivy..."
- Why: "A supply chain attack" event noun, no named subject. Two sentences — second is editorial "highlights".

**2604.13946** | oneLinerEn | A [noun] opener + two sentences + "This is achieved"
> "A new multi-agent framework, CollabCoder, simultaneously achieves 11-20% higher accuracy... This is achieved through a novel Collaborative Decision-Making (CDM) module."
- Why: "A new multi-agent framework" opener. Second sentence literally starts with "This is achieved" — exact banned pattern.

**2603.19234** | oneLinerEn | A [noun] opener
> "A single 3D model dynamically adjusts rendering quality across devices, from low-spec to high-end, without sacrificing visual fidelity."
- Why: "A single 3D model" — unnamed, no specific finding stated.

**9136387112bd31614aab05d82bd97e13773df08e** | oneLinerEn | A [noun] opener + two sentences
> "A decision tree guides optimal model selection... The research reveals platform-specific performance differences..."
- Why: "A decision tree" opener. Two sentences — second starts with "The research reveals".

**2601.03515** | oneLinerEn | A [noun] opener
> "A novel multi-modal, multi-session benchmark systematically measures an AI's ability to retain..."
- Why: "A novel multi-modal, multi-session benchmark" — pure meta-description of paper content type, no finding.

**reddit_MachineLearning_1rxz4xk** | oneLinerEn | A [noun] opener
> "A new verifier forces exploration of disproving evidence, boosting performance by 17% and reducing interaction rounds by 43%..."
- Why: "A new verifier" — unnamed subject. Good metrics buried behind anonymous noun.

**072e262f34abc451a662d5a23ab3407cb49011fe** | oneLinerEn | An [noun] opener
> "An agent built on o4-mini automatically generates SQL practice problems and evaluates student submissions..."
- Why: "An agent built on o4-mini" — meta-descriptor as subject, no product name.

**2505.22655** | oneLinerEn | A [noun] opener
> "A position paper argues that the traditional aleatoric/epistemic uncertainty dichotomy is ill-suited for interactive LLM agents..."
- Why: "A position paper argues" — content-type meta-description.

**hn_47561496** | oneLinerEn | A [noun] opener
> "A tool for managing design decisions and domain knowledge as a connected graph of Markdown files enables AI agents to quickly grasp context..."
- Why: "A tool for managing" — long meta-descriptor, no product name.

**reddit_ClaudeAI_1sa2jbz** | oneLinerEn | A [noun] opener
> "A codebase indexing tool eliminates the overhead of repeatedly loading codebases for each conversation with Claude Code."
- Why: "A codebase indexing tool" — anonymous product description.

**2603.12823** | oneLinerEn | A [noun] opener
> "A routing framework for GUI automation agents automatically selects between 7B and 72B models based on action difficulty, reducing costs by up to 78%."
- Why: "A routing framework for GUI automation agents" — long meta-descriptor, no named subject.

**2601.09929** | oneLinerEn | A [noun] opener
> "A three-stage framework identifies and systematically reduces the root causes of LLM hallucinations in high-stakes domains like finance and law."
- Why: "A three-stage framework" — meta-descriptor, no product/method name.

---

### Two-sentence editorial trailer (3 unique cases)

**hn_46515696** | oneLinerEn | second sentence: "This showcases"
> "Burke Holland independently built a Windows utility, video editor, and social media automation app in hours using Claude Opus 4.5, demonstrating a leap in AI agent development capabilities. This showcases a significant advancement beyond previous AI agents in practical application."
- Why: First sentence is fine. "This showcases..." is generic editorial filler.

**reddit_ClaudeAI_1rruo4u** | oneLinerEn | second sentence: "The new feature allows"
> "Anthropic's Claude now generates interactive charts, diagrams, and visualizations directly within conversations, launching in beta. The new feature allows users to explore data visually without switching tools."
- Why: Good first sentence. Second sentence adds no information — pure filler.

**2603.11583** | oneLinerEn | second sentence: "This method consistently improves"
> "Defining prompt objectives mathematically enables LLMs to optimize for multiple conditions more accurately than natural language approaches. This method consistently improves performance across Claude Sonnet 4.6, GPT-5.4, and Gemini 2.5 Pro."
- Why: Second sentence could be folded into first as a participial phrase.

---

### This [noun] openers (2 cases)

**2604.09408** | oneLinerEn | "This benchmark"
> "This benchmark assesses AI coding agents' ability to determine when to ask humans for clarification when given incomplete specifications."
- Why: "This benchmark" — meta-describes what the paper is, not what it found.

**2603.19896** | oneLinerEn | "This framework"
> "This framework controls ReAct's infinite tool-calling problem by explicitly determining the necessity of tool calls at each step using four metrics: Gain, Cost, Uncertainty, and Redundancy."
- Why: "This framework" — no name, generic opener.

---

### Researchers opener (2 cases)

**2603.12963** | oneLinerEn | "Researchers have released"
> "Researchers have released Long-form RewardBench, the first evaluation dataset designed for long-text generation..."
- Why: "Researchers have released" — vague actor. Should start with "Long-form RewardBench..."

**55adc6c9ad132d814e8c6e81b4e229fc9e6bcb82** | oneLinerEn | "Researchers have developed"
> "Researchers have developed a technique to preserve In-Context Learning (ICL) abilities during fine-tuning..."
- Why: "Researchers have developed" — generic actor hides the subject.

---

## Good Examples

**hn_47442435** | oneLinerEn
> "Claude Code agents autonomously built a hardware utilization strategy for H100/H200 GPUs, achieving a 2.87% validation loss improvement across 910 experiments within 8 hours using 16 GPUs."
- Named subject, active verb, concrete numbers and timeframe.

**2502.20122** | oneLinerEn
> "Self-training unlocks LLMs' latent ability for concise reasoning, reducing token usage by 30%."
- Specific method as subject, active verb, measurable result.

**hn_46205437** | oneLinerEn
> "Mistral releases Devstral 2 (123B) and Small 2 (24B), alongside Mistral Vibe, delivering open-source coding performance up to 7x cheaper than Claude Sonnet while achieving 72.2% on SWE-bench Verified."
- Company name opener, concrete model names and numbers, benchmark score.

**2601.17814** | oneLinerEn
> "Routing automatically selects the optimal AI model for each query, achieving the same accuracy as the best single model at just 33% of the cost."
- Technique as subject, active verb, striking cost comparison.

**2603.17973** | oneLinerEn
> "Open-source AI coding agents reduce regressions by 70% by proactively identifying affected tests before code modifications."
- Clear subject, specific percentage, explains mechanism.

**hn_47363754** | oneLinerEn
> "CanIRun.ai simplifies local LLM selection by automatically detecting user hardware performance via browser WebGPU and ranking runnable models, lowering the barrier to entry for developers."
- Named product, active verb, explains mechanism.

**2603.12123** | oneLinerEn
> "LLM self-review in a new session boosts F1 scores by 28.6% compared to the same session, demonstrating the power of context separation."
- Method as subject, precise metric, comparison baseline.

**2305.15334** | oneLinerEn
> "Open-source LLMs now surpass GPT-4 in API call accuracy, virtually eliminate hallucinations, and generate reliable code."
- Crisp claim, named comparison target, parallel structure.

---

## Retrospective

### Which fields still have the most issues
- **oneLinerEn**: 21 issues — entire remaining problem is here
- **keyFindingsEn**: 0 issues — clean across all 50 samples
- **howToApplyEn**: 0 issues — clean across all 50 samples

### Pattern breakdown
| Pattern | Count | % of awkward |
|---|---|---|
| A/An [noun phrase] opener | 14 | 67% |
| Two-sentence editorial trailer | 7 | 33% (some overlap with A/An) |
| This [noun]... opener | 2 | 10% |
| Researchers [verb]... opener | 2 | 10% |

### What the prompt/post-processor should fix next iteration
1. **A/An detector must be comprehensive**: `^(A|An)\s+` regex covers all 14 A/An cases deterministically.
2. **Rewriter must hard-block A/An output**: Add "DO NOT start with A, An, The, This, or Researchers" as the first line of the rewriter prompt. Current rewriter is either not being called for A/An cases or producing A/An again.
3. **Two-sentence detector gaps**: Still missing ". This showcases", ". The new feature", ". This method" patterns. Universal first-period truncation (`text.split('. ')[0] + '.'`) would catch all remaining cases.
4. **Academic papers without named subjects**: arXiv papers default to A/An because there's no product name. Rewriter needs explicit fallback: use the KEY FINDING or METHOD NAME as subject — e.g., "Long-form RewardBench..." instead of "Researchers have released Long-form RewardBench...".

### What worked well
- keyFindings and howToApply remain clean (0 issues for consecutive evaluations)
- Post-processing reduced awkward rate from 86% (iter 12) to 42% (current)
- Named-subject openers work well — company/product name + active verb pattern is solid
- "This [demonstrates|highlights]" editorial trailers nearly eliminated (only 2 remain vs 6+ in iter 19)
- Marginal improvement vs iter 21: 25/50 → 21/50 (-4 cases)
