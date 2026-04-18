# Eval: translate-prompt-fix — Iteration 10

## Iteration Result
- Status: **FAIL**
- Samples in file: 50 (task prompt says 100, but samples.json contains 50 entries)
- Awkward count: **36/50** (72%)
- Threshold: <=5 awkward
- Breakdown:
  - oneLinerEn issues: 35 samples
  - keyFindingsEn issues: 1 additional sample (2401.14196 sentence fragment)
  - howToApplyEn issues: 0

---

## Awkward Examples

### Two-sentence oneLinerEn (16 samples)
- reddit_ClaudeAI_1s1ipep: "A practical breakdown of scaling Claude Code... The author details how to build infrastructure..." -> editorial second sentence
- 2603.25697: "An autonomous software evolution framework where LLM agents discover bugs... This approach achieves zero regression bugs..." -> This approach trailer
- reddit_ClaudeAI_1rxswkv: "A community post asks Claude users... The author seeks real-world recommendations..." -> second sentence
- hn_47685945: "Railway reduced production frontend build times... Teams deploying frequently will immediately feel the impact..." -> editorial second sentence
- 2604.03173: "Up to 13% of cited URLs... This dramatically improves the reliability..." -> This dramatically improves trailer
- 2604.09408: "A new benchmark measures... The study reveals a significant drop..." -> second sentence
- hn_44595492: "OpenAI launched ChatGPT agents... Combining the strengths of Operator and Deep Research, this general-purpose agent marks a pivotal step..." -> editorial second sentence
- 2505.11792: "Reinforcement learning with LLMs... This approach directly leverages solver results as rewards..." -> This approach directly leverages trailer (exact banned pattern)
- hn_47394022: "A developer who has been successfully maintaining... The post details how to reduce defect rates..." -> second sentence
- 2603.19896: "This framework explicitly evaluates... It offers a controllable agent approach for improved efficiency." -> second sentence
- 2604.07223: "A new benchmark, TRACESAFE-BENCH, systematically measures... The study finds guardrail performance is strongly correlated..." -> second sentence
- reddit_ClaudeAI_1rruo4u: "Anthropic Claude now generates interactive charts... The new feature aims to make data exploration more intuitive..." -> aims to + second sentence
- hn_46700594: "Anthropic has open-sourced a performance optimization challenge... The company now challenges the community..." -> second sentence
- 2504.17674: "A new analysis demonstrates... The research highlights critical trade-offs..." -> second sentence
- hn_44705445: "A shift in AI interface design is needed... This article challenges fundamental assumptions..." -> second sentence
- hn_47582877: "A critical bug in Claude Code caching mechanism can inflate API costs... Reports indicate significant cost overruns..." -> second sentence

### This/Researchers openers (6 samples)
- 2501.07278: "This survey comprehensively details methodologies for enabling LLM agents..."
- 2602.24195: "This framework measures uncertainty in multimodal LLMs..."
- 2403.02691: "This research presents the first benchmark evaluating attacks..."
- 2505.14631: "This research demonstrates a method for training LLMs..."
- ce6ab5ae: "Researchers demonstrate a method for automatically identifying true causal relationships..."
- 2603.19896: (also two sentences) "This framework explicitly evaluates..."

### A/An descriptor noun openers (15 samples)
- 2601.00497: "STELLAR is a testing framework that automatically uncovers bugs..." -> X is a type that
- hn_47480900: "A solo developer solved automated testing gaps..." -> A actor
- 2502.20122: "A self-training method awakens LLMs inherent ability..." -> A method
- reddit_ChatGPT_1s2jb1j: "A post details a ChatGPT prompt that identifies..." -> A content type that
- 2602.12318: "A methodology for automatically identifying..." -> noun phrase, no predicate verb
- 2507.21509: "An automated pipeline extracts undesirable LLM traits..." -> An noun
- 2603.20105: "A framework achieving 21.9% higher accuracy..." -> noun phrase, no finite predicate
- 2604.07223: (also two sentences) "A new benchmark, TRACESAFE-BENCH..." -> A new noun
- 2504.17674: (also two sentences) "A new analysis demonstrates..." -> A new noun
- hn_47690415: "A new study analyzing the writing styles of 178 AI models..." -> A new study
- reddit_ChatGPT_1sbkr23: "A months-long conversation with ChatGPT led to..." -> A noun phrase
- reddit_ClaudeAI_1s1ipep: (also two sentences) "A practical breakdown of scaling Claude Code..." -> noun phrase, no predicate
- 2603.25697: (also two sentences) "An autonomous software evolution framework where LLM agents..." -> An noun where
- hn_47394022: (also two sentences) "A developer who has been successfully maintaining..." -> A actor who

### Other issues (3 samples)
- hn_44746621: "Developer productivity shifts and practical patterns are revealed..." -> passive voice, no agent
- 2501.12948: "Achieved OpenAI o1-level reasoning capabilities..." -> missing subject (Korean subject-drop artifact)
- 2503.05659: "The first comprehensive survey systematically organizing..." -> sentence fragment, no finite verb

### keyFindingsEn issues (1 sample)
- 2401.14196: keyFinding item 1 is a sentence fragment with no predicate verb - "A series of open-source code models ranging from 1.3B to 33B parameters, trained on 2 trillion tokens across 87 programming languages, and licensed for both research and commercial use." Missing copula is.

---

## Good Examples

1. 2603.11873 (AdaFuse): "AdaFuse accelerates inference for MoE and LoRA models by 2.4x through a custom CUDA kernel that fuses adapters across all layers in a single pass." - Subject + active verb + specific number.
2. 2604.12986 (Parallax): "Prompt guardrails are useless if an Agent is compromised - a security architecture paradigm that completely separates reasoning and execution at the OS process level." - Punchy finding-first, one sentence.
3. hn_47774971 (Gemma 4): "Google open-source Gemma 4 model now runs fully local inference on iPhones without cloud connectivity, signaling a shift from on-device AI experimentation to practical deployment." - Company + product + active verb + result.
4. 2603.17639 (VeriGrey): "VeriGrey automates prompt injection testing for LLM agents, discovering 33% more vulnerabilities than black-box fuzzing by leveraging a grey-box approach." - Product name + active verb + specific result.
5. 2603.19118 (SC+VC): "Combining Verbalized Confidence and Self-Consistency with just two samples outperforms using eight samples with a single method when measuring uncertainty in inference models." - Gerund subject + active verb + specific finding.
6. f1f249d4 (Abstract screening): "Automating abstract screening with six LLMs achieved higher accuracy than human researchers and reduced workload by up to 99%." - Active gerund + specific result + number.
7. reddit_ChatGPT_1s8zocq (image prompts): "Specifying camera models and settings dramatically increases the realism and unsettling quality of AI-generated images." - Short, direct, concrete.
8. 2602.04750 (stance detection): "Adding user profiles crafted from their past posts boosted political leaning classification accuracy by up to 38.5 percentage points." - Gerund + active verb + precise number.

---

## Retrospective

### Which fields still have the most issues
- oneLinerEn: 35/50 samples (70%) - ONLY field with systematic problems
- keyFindingsEn: 1 isolated sentence-fragment issue
- howToApplyEn: 0 issues - completely solved

### Issue pattern breakdown for oneLinerEn
| Pattern | Count |
|---|---|
| Two-sentence editorial trailer | 16 |
| A/An descriptor noun opener | 15 |
| This/Researchers verb opener | 6 |
| Other (passive, fragment, missing subject) | 3 |

### Root cause analysis
After 10 iterations of constraint-based prompting (HARD RULES, SELF-CHECK, word limits, BANNED PATTERNS, templates), the two dominant bad patterns persist at ~70%. The constraint-accumulation approach has reached a dead end. The model CAN produce correct output (14/50 = 28% clean), proving this is a generation-bias problem, not a capability gap.

### What the prompt should fix next iteration
Three options ranked by reliability:

Option A (Post-processing rewrite pass): After Gemma generates oneLinerEn, run a second LLM call that counts periods and rewrites if it detects >= 2 periods, banned openers, or noun-phrase-without-predicate. Does NOT depend on Gemma following instructions.

Option B (Template enforcement): Replace the entire oneLinerEn section with a strict fill-in template:
[NAMED SUBJECT - product/company/concept, NOT A study, Research, This paper] [ACTIVE VERB] [SPECIFIC RESULT].

Option C (Few-shot only): Remove ALL rules text. Replace with 10+ Bad to Good rewrite examples. Let examples do the work instead of rules.

Recommendation: Option A is most reliable because it enforces constraints structurally after generation rather than hoping the model follows rules during generation.
