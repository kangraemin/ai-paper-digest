## Iteration Result
- Status: FAIL
- Awkward count: 32/50
- Breakdown: one_liner issues: 32, key_findings issues: 1 (2603.19008), how_to_apply issues: 0

---

## Awkward Examples

### A/An opener (14 cases)

[072e262f] one_liner: "An agent built on o4-mini automatically generates SQL practice problems..." - "An agent" is generic, use "o4-mini" as subject
[2604.02230] one_liner: "A novel trace inversion technique reconstructs the actual question..." - use technique name (TRACE INVERSION) as subject
[hn_47401734] one_liner: "A study demonstrates that while introducing Cursor AI boosts short-term development speed..." - vague "A study demonstrates"
[hn_47561496] one_liner: "A tool for managing design decisions and domain knowledge..." - pure content-type descriptor
[hn_47480900] one_liner: "A solo developer built automated tests..." - the banned "A developer shares" pattern
[hn_47709130] one_liner: "A project demonstrating Google Gemini's SynthID watermark detection..." - meta-descriptor
[2502.14302] one_liner: "A new medical hallucination detection benchmark (10,000 samples) reveals..." - meta-describes artifact type
[2601.21744] one_liner: "A decoding technique leveraging an LLM's inherent past-token prediction reduces repetition..." - generic category
[2208.09727] one_liner: "A 58-person study demonstrates that using LLM code assistants does not increase security..." - "A study demonstrates"
[2603.13017] one_liner: "A conversation compression technique reduces dialogue with AI coding agents by 11x..." - generic category
[2602.02343] one_liner: "A unified equation for fine-tuning, LoRA, and Activation Steering reveals..." - meta-descriptor
[2603.19008] one_liner: "A training-free RAG technique that searches using three target queries..." - "A [type] that" construction
[2502.13260] one_liner: "A technique that automatically removes unnecessary steps in CoT reasoning..." - "A [type] that" construction
[2602.08234] one_liner: "An LLM agent's skill library automatically extracts reusable skills..." - starts with "An"

### Two-sentence editorial trailer (12 cases)

[reddit_MachineLearning_1rxnfc5]: "...through ZenMux integration. The model proves its utility beyond benchmark numbers..." - filler second sentence
[hn_47651540]: "...MoE architecture. This setup bypasses API costs..." - "This setup" banned opener
[hn_47383059]: "...outperforms standard RL methods. The approach achieves a 11.3% mean@16 accuracy..." - number belongs in first sentence
[f53f31b8]: "...outperform GPT-4 alone. The new MAC framework achieves higher accuracy..." - redundant explanation
[9a0f3ca6]: "...boosting LLM response accuracy. This technique learns to match queries..." - "This technique" banned opener
[2604.03135]: "...enabling large-scale refactor. The process leveraged a multi-agent system..." - editorial filler
[hn_47225130]: "...sending sensitive user data. The practice raises serious privacy concerns..." - restates obvious implication
[reddit_ChatGPT_1sbux6t]: "...tokens by 60%. This simple prompt engineering technique significantly cuts down..." - restatement + banned opener
[hn_47441499]: "...50-70% of PRs are AI bots. This highlights a growing challenge..." - "This highlights" banned trailer
[hn_47548243]: "...starting April 24th. The change impacts free, pro, and pro+ Copilot users..." - belongs in key findings
[2401.14196]: "...matches CodeLlama-34B with a 6.7B model. The new series boasts strong performance..." - generic filler
[hn_46771564]: "...cognitive atrophy...and a growing divide. He shared these observations and structural shifts." - pure meta-filler

### This/The opener (3 cases)

[hn_47649742]: "This open-source library enables training a 1.3B parameter coding agent model..." - This [noun] pattern
[hn_47477339]: "This AI word processor offers a choice of OpenAI, Anthropic, and xAI models..." - This [noun] pattern
[2503.06709]: "The Delusion phenomenon where LLMs confidently output incorrect answers is far harder to detect..." - The [noun] opener

### Researchers opener (3 cases)

[2603.12963]: "Researchers have released Long-form RewardBench..." - banned from iter 1
[hn_47348275]: "Researchers demonstrate a novel architecture capable of executing programs directly within Transformer weights..." - same
[3b74126353]: "Research directly compares the DeepSeek model... The study provides a benchmark..." - both patterns combined

### keyFindingsEn issue (1 case)

[2603.19008] keyFindingsEn[5]: "This is a training-free approach, implementable with prompts alone without model..." - "This is a [type]" pattern

---

## Good Examples

[2504.07986]: "SEAL corrects unnecessary re-examination and backtracking habits in inference models like DeepSeek-R1 by manipulating the latent space, boosting accuracy and reducing token usage." - Named subject + active verb + result
[hn_47513475]: "Google Research's PolarQuant + QJL algorithms achieve up to 8x faster attention on H100 GPUs by compressing KV caches to 3 bits, with zero accuracy loss." - Named entity + specific numbers
[2503.05179]: "System prompt optimization reduces tokens by 84% compared to Chain-of-Thought while maintaining near-identical accuracy." - Technique name + quantitative result
[hn_47797665]: "Google's Android CLI and Android Skills reduce LLM token usage by 70% and triple task speed in AI agent-driven Android development." - Named entity + concrete numbers
[2302.01318]: "LLM inference speeds up to 25x by having a smaller draft model pre-predict tokens and a larger model validate them in batches." - Result-first with mechanism
[hn_47679258]: "Claude Mythos Preview achieved a breakthrough 93.9% on SWE-bench Verified, outperforming competitors, but simultaneously exhibited risky behaviors..." - Named subject + benchmark + nuanced insight
[hn_47400261]: "Apideck's CLI-based agent interface resolves context bloat exceeding 55,000 tokens from MCP tool definitions, reducing token consumption to approximately 80 tokens." - Named entity + dramatic numbers
[2603.12109]: "Reinforcement learning-trained LLM agents overcome self-locking phenomena with simple directional signal injection, achieving up to a 60% performance boost." - Technique + specific quantitative boost
[hn_46098838]: "Claude Code's effectiveness hinges on a well-maintained CLAUDE.md file, which acts as a persistent knowledge base for the agent, but Anthropic's design intentionally allows the model to ignore it..." - Named subject + nuanced finding
[2503.15129]: "cRLHF leverages Bayesian aggregation of code line evaluations from multiple annotators to enhance LLM code generation quality without requiring a separate Reward Model." - Named technique + mechanism

---

## Retrospective

### Which fields still have the most issues
- oneLinerEn: 32/50 (64%) - overwhelmingly the problem field
- keyFindingsEn: 1/50 (2%) - essentially solved
- howToApplyEn: 0/50 (0%) - fully solved

### Pattern breakdown (this iteration)
Pattern | Count | % of awkward
A/An noun phrase opener | 14 | 44%
Two-sentence editorial trailer | 12 | 38%
This/The opener | 3 | 9%
Researchers opener | 3 | 9%

### Root cause
Named-entity papers (Google, SEAL, DeepSeek, Apideck, etc.) produce clean one-liners 100% of the time. Academic papers without a named product default to "A [technique]..." because the model has no named entity to anchor the sentence. Post-processor truncation is not universal - many two-sentence variants escape detection.

### What the prompt/post-processor should fix next iteration
1. Universal two-sentence truncation (highest priority): text.split('. ')[0] + '.' - take only first sentence, no regex needed
2. Universal A/An detection: ^(A|An)\s+ regex - covers all 14 A/An cases
3. Add This/The/Researchers to same detector
4. Rewriter constraint: "Your first word MUST be a named concept, product, or strong verb. NEVER start with A, An, The, This, Researchers, or Research."
5. Academic paper fallback: Extract named technique (TRACE INVERSION, SoT, etc.) from content and use as subject

### What worked well
- keyFindingsEn and howToApplyEn are fully effective - no changes needed
- Named-entity subjects produce clean one-liners 100% of the time
- Success formula: [Named subject] + [active verb] + [specific result]
