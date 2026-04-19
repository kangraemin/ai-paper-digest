# Iteration Eval (Current)

## Iteration Result
- Status: **FAIL**
- Awkward count: **40/50** (80%) — file has 50 samples, not 100 as stated in task prompt
- Threshold: ≤5 awkward
- Breakdown:
  - `oneLinerEn` issues: 40
  - `keyFindingsEn` issues: 2 (within already-counted-awkward samples)
  - `howToApplyEn` issues: 0

### oneLinerEn Pattern Breakdown
| Pattern | Count |
|---------|-------|
| Two-sentence editorial trailer | 23 |
| A/An [noun phrase] opener | 17 |
| [Name] is a [type that/for] | 7 |
| Banned opener (This framework / Researchers) | 3 |
| Meta failure (Unable to summarize) | 1 |

*Note: many samples have multiple issues (e.g., both two-sentence AND A/An opener)*

---

## Awkward Examples (all 40)

### Two-sentence trailer cases (23)

**1. hn_47552562** TWO_SENT
> oneLiner: "CERN is deploying PyTorch/TensorFlow models directly onto FPGAs to filter collision data from the LHC at nanosecond speeds... This demonstrates a radical optimization for low-latency data processing in high-energy physics."
- Why: "This demonstrates..." editorial second sentence.

**3. hn_46810282** TWO_SENT
> "Marginlab independently tracks Claude Code performance... This third-party validation effort is gaining attention..."
- Why: Second sentence re-explains what was said.

**6. hn_47120899** TWO_SENT
> "Ladybird began transitioning from C++ to Rust, achieving zero regression bugs... This demonstrates a novel approach to language porting leveraging AI assistance."
- Why: Generic editorial trailer.

**8. hn_44798189** TWO_SENT+A/AN
> "A direct investigation into claims that AI makes engineers 10x more productive reveals actual gains of 20-50%... The article details this reality."
- Why: A/An opener + filler second sentence.

**10. hn_47504695** TWO_SENT+NAME_IS_A
> "Hypura is a Rust-based open-source project that enables running LLMs larger than a Mac's physical memory... It's gaining traction for its ability to run models that cause llama.cpp to crash."
- Why: "[Name] is a [type] that" opener AND two sentences.

**15. 2601.13143** TWO_SENT+A/AN
> "A token pruning framework reduces compute by over 40% in multimodal LLMs without performance loss, and even improves results. The method operates at inference time, requiring no additional training."
- Why: A/An opener + second sentence adds separate detail.

**18. hn_47531967** TWO_SENT+A/AN
> "A machine learning engineer detected and disclosed a supply chain attack in litellm v1.82.8... This incident demonstrates how developers can leverage AI tools to identify malicious code."
- Why: A/An opener + "This incident demonstrates..." editorial second sentence.

**19. hn_45944296** TWO_SENT
> "Security experts are criticizing Anthropic's report... The report's claims are being questioned for lacking verifiable data."
- Why: Second sentence repeats same point redundantly.

**20. hn_46316367** TWO_SENT
> "OpenAI launches GPT-5.2-Codex, sparking community debate... Initial benchmarks suggest comparable coding ability to Claude Opus 4.5, but lags in agentic tasks."
- Why: Second sentence has good detail but appended separately.

**22. hn_45182381** TWO_SENT
> "Anthropic's Claude.ai now features Code Interpreter enabling document creation... This expands functionality beyond text responses."
- Why: Second sentence restates the obvious.

**26. hn_47349334** TWO_SENT
> "Reanalysis of METR's SWE-bench data suggests LLM code quality has stagnated... The study challenges claims of continuous improvement."
- Why: "The study..." editorial second sentence.

**28. hn_47680023** TWO_SENT+NAME_IS_A
> "Tailslayer is a C++ library implementing hedged reads to mitigate tail latency... It replicates data across independent DRAM channels."
- Why: "[Name] is a [type]" + second sentence adds detail that should be in first.

**29. reddit_MachineLearning_1s1uvfr** TWO_SENT
> "VizPy achieves 97% expert-level quality on analog IC placement tasks... This breakthrough demonstrates the potential for LLMs to acquire domain expertise."
- Why: "This breakthrough demonstrates..." generic editorial second sentence.

**33. hn_44885398** TWO_SENT
> "Reports of Claude Code responding 'You're absolutely right!' have resurfaced LLM sycophancy. This highlights a structural flaw where models prioritize flattery over factual correctness."
- Why: "This highlights..." trailer appended.

**34. hn_47106686** TWO_SENT+A/AN
> "A workflow emphasizing research and planning dramatically improves AI coding tool output... Practical experience demonstrates this approach minimizes token waste."
- Why: A/An opener + second sentence adds detail redundantly.

**36. hn_44595492** TWO_SENT
> "OpenAI launched ChatGPT agents capable of autonomously handling tasks... Combining the strengths of Operator and Deep Research, this general-purpose agent marks a pivotal step."
- Why: Second sentence is generic hype.

**42. hn_44840728** TWO_SENT+A/AN
> "A Hacker News discussion explains why running GPT-4 locally is impossible... The conversation highlights the massive scale required."
- Why: A/An meta-content opener + second sentence restates.

**43. hn_47477339** TWO_SENT+NAME_IS_A
> "Revise is an AI-powered word processor that lets users choose between models... Its key differentiator is tight integration with AI agents."
- Why: "[Name] is a [type] that" + second sentence.

**44. 2603.12230** TWO_SENT
> "Perplexity submits a comprehensive analysis of AI Agent security threats to NIST, outlining a defense-in-depth strategy. The report details how AI agents blur the code-data boundary."
- Why: Second sentence has more interesting content — should have been merged.

**46. hn_47741889** TWO_SENT+NAME_IS_A
> "Claudraband is a CLI/library tool that wraps the Claude Code TUI... Developers looking to integrate Claude Code into automated workflows should take note."
- Why: "[Name] is a [type] that" + second sentence is a call-to-action.

**48. 2603.16856** TWO_SENT+A/AN
> "A new LLM framework learns from real-world usage post-deployment without reward functions. This enables continuous improvement through self-learning from interaction data."
- Why: A/An opener + second sentence restates first in different words.

**49. hn_46771564** TWO_SENT
> "Andrej Karpathy's weeks-long coding experiment with Claude revealed productivity gains and downsides like 'brain atrophy'... His observations on the 'slopacolypse' sparked widespread discussion."
- Why: First sentence is good; second sentence is vague editorial filler.

**50. 2502.18482** TWO_SENT+A/AN
> "A routing system automatically selects the optimal model per query, achieving 97% of GPT-4 quality at 24% of the cost. This approach dynamically balances performance and expense."
- Why: A/An opener + second sentence restates first.

### A/An [noun phrase] opener (standalone)

**2. 2604.15075** A/AN
> "A novel agent optimization technique achieves 74% of GPT-4o performance at just 23.9% of the cost..."
- Why: "A novel technique" is meta-descriptor; the technique has a name.

**5. 2601.10355** A/AN — fragment
> "A pipeline for automatically generating multi-turn tool-use conversation data for LLM agent training from general text sources like wikis and blogs, without requiring API specifications."
- Why: No predicate verb — noun phrase fragment, not a complete sentence.

**14. reddit_ClaudeAI_1s3ss8s** A/AN
> "A post asks the community for opinions on granting Claude access to a macOS system..."
- Why: Meta-describes the post type rather than stating any insight.

**21. 2601.05167** A/AN
> "A collaborative inference framework reduces costs by 98% while maintaining accuracy..."
- Why: Category-label opener instead of named subject.

**25. 2602.06384** A/AN
> "A new benchmark measures how well LLMs adhere to Markdown..."
- Why: "A new benchmark" is the classic vague opener.

**27. 2603.00846** A/AN
> "A 1.7B parameter model achieves GPT-4o-mini-level RAG noise filtering, reducing costs by 98% and latency by 94.6%."
- Why: "A [size] model" noun-phrase opener; the model has a proper name.

**31. 2601.03515** A/AN
> "A benchmark systematically measures an AI's ability to retain, reason about, and update memories across dozens of conversational sessions..."
- Why: Generic "A benchmark" opener with no finding stated.

**35. reddit_ClaudeAI_1rz2oo3** A/AN
> "A practical guide details a shift from lengthy CLAUDE.md rule files to an infrastructure-based approach..."
- Why: "A practical guide details" meta-describes content type.

**37. hn_47495527** A/AN
> "A comprehensive cheat sheet for Claude Code streamlines workflows with keyboard shortcuts..."
- Why: "A comprehensive cheat sheet" meta-describes the document.

**41. 2603.12246** A/AN
> "A shocking discovery reveals models trained with a Reasoning Judge learn adversarial output strategies."
- Why: "A shocking discovery reveals" is editorializing the finding category.

### [Name] is a [type] (standalone)

**4. 2604.13849** NAME_IS_A
> "MCPThreatHive is an open-source threat intelligence platform that automatically collects, classifies, and visualizes security threats..."
- Why: Canonical "[Name] is a [type] that" product-description.

**12. hn_47460525** NAME_IS_A
> "OpenCode is an open-source AI coding agent connecting to 75+ LLM providers..."
- Why: "[Name] is a [type]" product definition.

**40. hn_47768750** NAME_IS_A
> "Plain is a redesigned Python web framework forked from Django, prioritizing type hints..."
- Why: "[Name] is a [type]" product definition.

### Banned openers

**23. 2603.12932** BANNED:This framework
> "This framework automatically generates fine-tuning datasets for specialized domains..."

**24. 2602.24195** BANNED:This framework
> "This framework measures uncertainty in multimodal LLMs, proactively detecting queries..."

**47. 2504.10458** BANNED:Researchers
> "Researchers demonstrate an RL-based agent that surpasses existing state-of-the-art GUI manipulation capabilities using only 0.02% of the data."

### Meta failure

**32. hn_47006594** META_FAIL + keyFindingsEn issues
> oneLiner: "Unable to summarize due to a lack of content beyond the paper title—please provide the full text."
> keyFindings[0]: "Unable to identify key findings as only the paper title was provided."
> keyFindings[2]: "This is potentially a case of AI generating mathematical/physical proofs or new formulas."
- Why: Model returned a refusal/meta-comment. Complete failure.

---

## Good Examples

**7. hn_47758347**
> "GPT-5.4 tops a new benchmark measuring LLMs' ability to identify real-world, publicly known vulnerabilities (N-Day) directly in code, but the evaluation methodology is facing community scrutiny over its reliability."
- Named subject, active verb, specific finding, single sentence.

**9. hn_47721953**
> "The Linux kernel now formally outlines a policy for AI coding tools, stipulating full human responsibility for generated code and requiring an 'Assisted-by' tag to denote AI usage."
- Named subject, active verb, concrete policy details.

**11. 444c2bf4...**
> "LLM-based automated scoring exhibits minimal variance within a single model but significant differences between models, with accuracy improved through majority voting across multiple LLMs."
- Technical finding stated directly, informative.

**13. 2309.06180**
> "vLLM, a new approach to LLM serving, eliminates KV cache memory waste by adapting OS virtual memory techniques, boosting throughput by 2-4x."
- Named subject with appositive, strong active verb, specific metrics.

**39. 2601.08058**
> "Manipulating a single latent feature within a model can boost reasoning performance to CoT levels, even without CoT prompts."
- Starts with action/finding, single sentence, specific claim.

**45. 2603.18940**
> "Monitoring the monotonic decrease of model uncertainty at each step during Chain-of-Thought (CoT) reasoning allows for low-cost prediction of answer correctness, bypassing expensive self-consistency methods."
- Technical finding opener, specific, single sentence.

**16. hn_45004846**
> "Brave's AI browser, Comet, is vulnerable to prompt injection attacks, allowing malicious sites to manipulate the LLM to perform sensitive actions like email access and fund transfers."
- Named product, specific vulnerability, concrete examples.

**17. hn_47058219**
> "Anna's Archive, a repository of copyrighted books and papers, is attracting donations and selling large-scale training data access by targeting LLM/AI agents with a dedicated llms.txt page."
- Named subject, active finding, single sentence.

---

## Retrospective

### Which fields still have the most issues
- **oneLinerEn**: 40/50 (80%) — sole problem field
- **keyFindingsEn**: effectively clean (only hn_47006594 which is a content-failure edge case)
- **howToApplyEn**: 0 issues across all 50 samples

### Pattern shift vs iter 16 re-eval

| Pattern | Iter 16 re-eval | Current |
|---------|----------------|---------|
| Two-sentence trailer | 26 | 23 |
| A/An opener | 8 | 17 |
| [Name] is a [type] | 4 | 7 |
| This [noun] opener | 4 | 3 |
| Researchers [verb] | 1 | 1 |

Two-sentence count slightly down (26→23) — post-processor catching some cases. But A/An openers sharply UP (8→17) — post-processor not addressing these at all.

### Root cause of ongoing failure
The post-processor from iter 16 only catches specific "This/It demonstrates|highlights" second-sentence starters. It completely misses:
1. **A/An [noun phrase] openers** — no detection regex exists for these
2. **Second sentences starting with**: "It's gaining...", "Its key...", "The [noun] also...", "Initial benchmarks...", "Practical experience...", "Combining the..."
3. The rewriter itself sometimes generates another A/An meta-description

### What the prompt should fix next iteration

**Priority 1 — Expand two-sentence detection (23 cases)**
Replace narrow "This/It demonstrates" regex with universal:
```
re.search(r'\.\s+[A-Z]', text.rstrip('.'))
```
Catches ANY second sentence regardless of starter word.

**Priority 2 — Add A/An opener detection (17 cases)**
Add to detector:
```
re.match(r'^(A|An)\s+', text)
```
Catches all noun-phrase openers.

**Priority 3 — Improve rewriter prompt**
When rewriting, the second LLM call must say:
"State the KEY FINDING or RESULT. Start with [NAMED SUBJECT, NOT A/An]. Do NOT write two sentences. Do NOT start with A, An, This, These, Researchers."

**Priority 4 — Verify [Name] is a [type] detection**
7 cases remain — verify regex covers variations like "Name is a [adj] [type]".

### What worked well
- keyFindingsEn and howToApplyEn fully solved — post-processing effective there
- 10/50 clean oneLinerEn (20%) proves the model is capable; it just needs better post-processing enforcement
- Clean examples pattern: named specific subject OR action/finding as opener, single sentence, concrete result
