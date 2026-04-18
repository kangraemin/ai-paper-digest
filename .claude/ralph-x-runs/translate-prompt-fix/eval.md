# Eval: translate-prompt-fix — Iteration 11

## Iteration Result
- Status: **FAIL**
- Samples in file: 50 (task prompt says 100, but samples.json contains 50 entries)
- Awkward count: **38/50** (76%)
- Threshold: ≤5
- Breakdown: one_liner_en issues: 38, key_findings_en issues: 0, how_to_apply_en issues: 0

---

## Awkward Examples

### Two-sentence one_liners (14 cases)

**2203.06566** | one_liner_en | two sentences + "Researchers unveil" opener
> "Researchers unveil a visual interface for constructing and debugging complex AI applications by connecting multiple LLM calls as a node-edge graph. The tool aims to simplify development and troubleshooting of multi-step LLM workflows."
- Why: 2 sentences; "Researchers unveil" banned opener; "aims to" in 2nd sentence.

**hn_47765374** | one_liner_en | two sentences + product definition
> "Kontext CLI is an open-source tool that securely injects short-lived tokens into AI coding agents accessing external services like GitHub, Stripe, and databases, eliminating the need to expose long-term API keys. It's gaining traction as a safer alternative to copy-pasting keys into .env files."
- Why: "[Name] is a [type] that..." opener; 2 sentences.

**hn_47675213** | one_liner_en | two sentences
> "Google open-sourced Scion, an experimental testbed for multi-agent systems, emphasizing isolation over constraints. The project is designed for experimentation, not production-level deployment."
- Why: 2 sentences.

**hn_47340079** | one_liner_en | two sentences
> "Hacker News has formalized a policy prohibiting AI-generated or edited comments, marking the first time an existing informal principle has been codified. The move underscores the community's commitment to maintaining the quality of human-to-human discourse."
- Why: 2 sentences.

**reddit_ClaudeAI_1s43b8w** | one_liner_en | two sentences
> "A Python server enabling offline operation of Claude Code by directly serving a local LLM (Qwen3) in the Anthropic Messages API format has been released. It's 7.5x faster than existing Ollama+proxy setups and keeps code entirely local."
- Why: 2 sentences; passive "has been released" in first sentence.

**hn_47582877** | one_liner_en | two sentences + "A [noun]" opener
> "A critical bug in Claude Code's caching mechanism can inflate API costs up to 10-20x, impacting developers even on $200/month plans. Users are reporting unexpectedly rapid depletion of their usage limits."
- Why: 2 sentences; "A critical bug" opener.

**hn_46515696** | one_liner_en | two sentences + "This showcases" trailer
> "Burke Holland demonstrated building multiple practical applications solo in hours using Claude Opus 4.5, arguing it represents a qualitative leap beyond existing AI agents. This showcases Opus 4.5's ability to autonomously handle complex tasks and self-correct errors."
- Why: 2 sentences; "This showcases" in 2nd sentence.

**2506.06254** | one_liner_en | "This framework" opener + two sentences
> "This framework personalizes AI agents by optimizing 'Persona' (system prompts) in real-time for each user. It dynamically adapts to individual user behavior without requiring model fine-tuning."
- Why: "This framework" opener; 2 sentences.

**270eb331f** | one_liner_en | two sentences + "A new methodology"
> "A new methodology demonstrates improved Named Entity Recognition (NER) performance by fine-tuning Large Language Models (LLMs) with LoRA+. The research achieves higher fine-tuning efficiency compared to standard LoRA."
- Why: 2 sentences; "A new methodology" opener.

**hn_47761625** | one_liner_en | two sentences + "Researchers" in 2nd
> "Building software with multiple LLM agents faces inherent limitations of distributed consensus, a challenge that won't disappear with more powerful models. Researchers are exploring choreographic languages and game theory to address this fundamental issue."
- Why: 2 sentences; "Researchers are exploring" in 2nd sentence.

**5e49bf591** | one_liner_en | two sentences + "This demonstrates" trailer
> "Delegating abstract inclusion/exclusion decisions to an LLM can complete an 83-hour task in one day for just $157. This demonstrates a significant cost and time reduction in literature review automation."
- Why: 2 sentences; "This demonstrates" in 2nd sentence.

**hn_47629485** | one_liner_en | two sentences + "This system" trailer
> "Imbue revealed the architecture behind automating end-to-end tests for their CLI tool mngr using over 100 parallel Claude agents. This system allows AI to autonomously execute, debug, and even fix tests."
- Why: 2 sentences; "This system" in 2nd sentence.

**hn_47427647** | one_liner_en | two sentences
> "Google open-sources Sashiko, an AI code review agent powered by Gemini 3.1 Pro, claiming it detects 53% of bugs missed by human reviewers. The agent is now being rolled out to all Linux kernel mailing list patch submissions."
- Why: 2 sentences.

**hn_47477339** | one_liner_en | two sentences + "[Name] is a [type] that"
> "Revise is an AI-powered word processor that lets users choose between OpenAI, Anthropic, and xAI models, offering document proofreading, editing, translation, and summarization all in one interface. Its key differentiator is tight integration with AI agents."
- Why: "[Name] is a [type] that" opener; 2 sentences.

---

### "This [noun]..." openers (7 cases)

**2503.01245** — "This survey paper comprehensively covers the limitations of LLM-based code generation..."
**2402.01680** — "This survey provides a comprehensive overview of Multi-Agent systems..."
**2602.02343** — "This work unifies fine-tuning, LoRA, and Activation Steering under a single equation..."
**2603.16862** — "This memory framework structures time-based events from conversation history..."
**2601.22027** — "This benchmark evaluates whether LLM agents can admit they don't know..."
**2603.11955** — "This LLM agent framework automatically generates realistic digital records..."
*(2506.06254 also — listed under two-sentence above)*

---

### "A/An [noun phrase]..." openers (12 cases)

**2601.07206** — "A comprehensive evaluation of 10 query-routing techniques..."
**reddit_MachineLearning_1rxz4xk** — "A novel verifier forces agents off greedy paths..."
**2504.04717** — "A comprehensive survey consolidating benchmarks..." (also a fragment — no predicate verb)
**2601.13143** — "A token pruning framework maintains or even improves performance..."
**2501.09959** — "A comprehensive paper consolidates methodologies..."
**2504.07986** — "A technique manipulates the latent space..." (vague — which technique has no name given)
**2507.21509** — "An automated pipeline extracts undesirable LLM traits..."
**hn_46205632** — "An experiment prompting Gemini Pro 3 with the current HN front page..."
**reddit_ClaudeAI_1ry9aqa** — "A curated GitHub repository details best practices..."
**2505.04016** — "A lightweight post-processing model transforms the output of any LLM..."
**hn_45130260** — "A new interactive website visualizes the entire token processing pipeline..." (explicitly banned "A new [noun]")
**2602.22787** — "A simple linear classifier on LLM hidden states achieves 0.96 F1 accuracy..."

---

### "Researchers [verb]..." + product definition + passive (4 cases)

**2604.13849** — "MCPThreatHive is an open-source threat intelligence platform that automatically collects..."
**2603.12091** — "Researchers demonstrate automated neural architecture search using an LLM..."
**ce6ab5ae636** — "Researchers demonstrate a method for automatically identifying true causal relationships..."
**hn_47460525** — "OpenCode is an open-source AI coding agent connecting to 75+ LLM providers..."

---

### Passive/vague openers (2 cases)

**2603.13036** — "Warnings emerge that 'vibe coding,' which rapidly builds websites with LLMs, could homogenize the internet..." (passive journalistic)
**hn_47690415** — "A new study analyzing the writing styles of 178 AI models across 32 dimensions reveals..." (explicitly listed banned pattern)

---

## Good Examples

**2602.01778** — states the finding directly as subject
> "LLM context compression performance is determined by data distribution, not model architecture, and the training data of the decoder dominates compression quality over the encoder."

**2503.06709** — specific concept as subject, active verb, concrete finding
> "The 'Delusion' phenomenon proves far more difficult to address than typical hallucinations and isn't easily corrected by fine-tuning or self-reflection."

**2603.29953** — gerund action opener with concrete result
> "Structuring prompts using the 5W3H framework elevates weaker models to the performance level of stronger ones, while also ensuring consistent results across languages."

**2504.20997** — direct action verb, specific comparison result
> "Directly implementing decades-old reinforcement learning algorithms (PSRL) with LLMs dramatically improves exploration efficiency compared to using LLMs for novel algorithm invention."

**2604.02155** — specific subject + counterintuitive finding with numbers
> "Function-calling agents perform best with just 32 tokens of Chain-of-Thought reasoning—using 256 tokens actually degrades performance below a no-CoT baseline."

**2502.15851** — myth-busting structure, punchy
> "The notion that system prompts override user prompts is a myth; social proof cues like 'recommended by 90% of experts' are far more effective."

**2501.13453** — counterintuitive finding, clear mechanism
> "LLM performance drops after learning new tasks not due to knowledge loss, but task alignment disruption, and freezing lower layers can largely prevent this."

**reddit_ClaudeAI_1rw1b8i** — specific behavior with concrete recommendation
> "Claude exhibits excessive agreement—a sycophancy issue—when given feedback from ChatGPT, highlighting the need for stronger pushback settings."

**reddit_ChatGPT_1sbuyeg** — narrative with concrete numbers
> "A codebase rapidly built with AI proved incomprehensible; a 70% deletion and two-week rewrite halved its size and restored full understanding."

**2509.03057** — active verb, concrete comparison
> "The model autonomously determines where and how to insert adapters, achieving full fine-tuning-level performance with fewer parameters than LoRA."

---

## Retrospective

### Which fields still have the most issues
- **one_liner_en**: 38/50 (76%) awkward — the only remaining problem field
- **key_findings_en**: 0 issues across all 50 samples — fully solved
- **how_to_apply_en**: 0 issues across all 50 samples — fully solved

### Dominant patterns by frequency
1. Two-sentence one_liner: 14/38 cases (37%) — editorial trailer appended despite word limits, HARD RULES, SELF-CHECK
2. "A/An [noun phrase]" openers: 12/38 cases (32%) — model defaults to meta-describing content type
3. "This [noun]..." openers: 7/38 cases (18%) — classic banned pattern still appearing at same rate
4. "Researchers [verb]" + product definition: 4/38 cases (11%)
5. Passive/vague others: 2/38 cases (5%)

### What worked well
- key_findings and how_to_apply are 100% clean — problem solved for those fields.
- 12/50 one_liners (24%) are correctly formatted — the model IS capable, just not consistent.
- The pattern [SPECIFIC SUBJECT][ACTIVE VERB][CONCRETE RESULT] works when the model uses it.

### What should change next iteration
After 11 iterations of constraint-based prompting (banned lists, word limits, SELF-CHECK, templates, HARD RULES), the awkward rate remains at 66-76%. Prompt-engineering within generation has reached its limit with Gemma-3-27b-it.

**Recommended next step: Post-processing rewrite pass (as proposed in iter 10)**
1. After Gemma generates oneLinerEn, run a deterministic detector:
   - Count periods → if >= 2: two-sentence, flag for rewrite
   - Check first word/phrase against banned starters: This/A/An/Researchers/The model/The system/[Name] is a
   - Check for "[X] is a [type] that/which" substring → flag
2. Feed flagged outputs to a rewrite model (Claude Haiku) with the strict template:
   [NAMED SUBJECT or KEY FINDING] [STRONG ACTIVE VERB] [CONCRETE MEASURABLE RESULT]
3. This approach decouples correctness from Gemma's instruction-following capability and is more reliable than any prompt constraint.
