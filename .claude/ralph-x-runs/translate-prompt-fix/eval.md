## Iteration Result
- Status: FAIL
- Awkward count: 28/50
- Breakdown: one_liner issues: 28, key_findings issues: 0, how_to_apply issues: 0

---

## Awkward Examples

### A/An [noun phrase] openers (16 cases)

**hn_47583959** | oneLinerEn | A [noun] opener
> "A new AI model benchmark reveals that top frontier models are converging in capability..."
- Why: "A new AI model benchmark" — anonymous meta-descriptor, no product name.

**hn_47768750** | oneLinerEn | A [noun] opener
> "A programming language designed specifically for AI agent development enables composable, stateful workflows..."
- Why: Long meta-descriptor, no named subject.

**hn_47417804** | oneLinerEn | A [noun] opener
> "A new framework lets non-technical users build and deploy custom AI pipelines using natural language, without writing code."
- Why: "A new framework" — anonymous, no product name.

**2507.21509** | oneLinerEn | A [noun] opener
> "A collaborative AI system reduces hallucinations by 41% through structured agent specialization and deliberative reasoning."
- Why: "A collaborative AI system" — generic anonymous subject.

**reddit_ClaudeAI_1s00ajb** | oneLinerEn | A/An opener + two sentences
> "An updated Claude Projects feature automatically generates dynamic summaries... This makes it easier to..."
- Why: "An updated Claude Projects feature" opener. Also two sentences.

**reddit_ClaudeAI_1s3ss8s** | oneLinerEn | A [noun] opener
> "A cross-platform tool integrates native AI capabilities—including voice, vision, and on-device inference—into any web app..."
- Why: "A cross-platform tool" — anonymous product.

**2603.22161** | oneLinerEn | A [noun] opener
> "A distillation method reduces a 671B parameter model to a 7B model while preserving 94.3% of performance at 96x lower inference cost."
- Why: "A distillation method" — generic technique noun.

**hn_47526486** | oneLinerEn | A [noun] opener
> "A free, open-source AI coding assistant built on Qwen 2.5-Coder achieves 72.9% on SWE-bench Lite..."
- Why: "A free, open-source AI coding assistant" — long anonymous descriptor.

**hn_45944296** | oneLinerEn | A [noun] opener
> "A context engineering technique that injects structured metadata about past errors reduces debugging cycles by 60%."
- Why: "A context engineering technique that" — pure meta-descriptor.

**2602.24195** | oneLinerEn | A [noun] opener
> "A multi-agent verification system achieves 90.2% accuracy on math reasoning tasks by combining independent LLMs..."
- Why: "A multi-agent verification system" — anonymous.

**hn_47427017** | oneLinerEn | A [noun] opener
> "A new prompt caching mechanism cuts API costs by up to 90% by storing and reusing processed context across sessions."
- Why: "A new prompt caching mechanism" — generic.

**2603.21489** | oneLinerEn | A [noun] opener
> "A fine-tuning approach using synthetic data generated from 10K curated examples outperforms GPT-4 on domain-specific tasks at 1/50th the cost."
- Why: "A fine-tuning approach" — anonymous technique.

**2602.16836** | oneLinerEn | A/An opener + two sentences
> "A reward modeling framework that uses process-level supervision outperforms outcome-based rewards by 23%. The framework validates each reasoning step individually..."
- Why: "A reward modeling framework" opener. Two sentences.

**hn_47531967** | oneLinerEn | A [noun] opener + two sentences
> "A local-first AI development environment enables fully offline model training and inference on consumer hardware. The environment supports..."
- Why: "A local-first AI development environment" opener. Two sentences.

**2604.13946** | oneLinerEn | A [noun] opener + two sentences + "This is achieved"
> "A new multi-agent framework, CollabCoder, simultaneously achieves 11-20% higher accuracy... This is achieved through a novel Collaborative Decision-Making (CDM) module."
- Why: "A new multi-agent framework" opener. Second sentence starts with "This is achieved" — exact banned pattern.

**hn_47336111** | oneLinerEn | A [noun] opener
> "A vector database optimized for billion-scale retrieval achieves sub-10ms query latency using hierarchical graph indexing."
- Why: "A vector database optimized for" — generic anonymous subject.

---

### Two-sentence editorial trailer (11 cases)

**df666dbd** | oneLinerEn | second sentence: "This demonstrates"
> "Claude Code agents autonomously built a hardware strategy for GPU clusters... This demonstrates the potential of autonomous AI..."
- Why: "This demonstrates the potential" — generic editorial filler.

**hn_46137514** | oneLinerEn | second sentence
> "Mistral releases Magistral, its first reasoning model... The model targets enterprise coding and math tasks."
- Why: Second sentence could fold into first as participial phrase.

**reddit_ClaudeAI_1s00ajb** | oneLinerEn | two sentences (also A/An above)
> "An updated Claude Projects feature automatically generates dynamic summaries... This makes it easier to..."
- Why: Two sentences with "This makes".

**2601.11004** | oneLinerEn | second sentence: "The technique works"
> "Chain-of-thought prompting reduces LLM hallucinations by 34% in medical QA. The technique works by..."
- Why: Explanatory second sentence — filler.

**2604.11753** | oneLinerEn | second sentence buries metric
> "Anthropic releases Constitutional AI 2.0 with automated red-teaming... The update reduces harmful outputs by 67%."
- Why: Key metric is in second sentence, should be folded into first.

**hn_47534564** | oneLinerEn | second sentence: "The company"
> "Perplexity launches an AI-powered shopping assistant with real-time price comparison across 50M products. The company reports 3x higher conversion rates..."
- Why: "The company reports" — editorial attribution in second sentence.

**2601.12034** | oneLinerEn | second sentence: "The findings suggest"
> "Sparse autoencoders identify 34 distinct internal representations for the concept of 'deception' in Claude 3 Sonnet. The findings suggest..."
- Why: "The findings suggest" — editorial commentary.

**hn_45619329** | oneLinerEn | second sentence: "He posited"
> "Yann LeCun argues that LLMs cannot achieve true reasoning because they lack world models. He posited that..."
- Why: "He posited" — second sentence redundantly continues first speaker's argument.

**2602.16836** | (overlap with A/An section above)

**hn_47531967** | (overlap with A/An section above)

**2604.13946** | (overlap with A/An section above)

---

### Research/Researchers/This openers (5 cases)

**2602.07253** | oneLinerEn | "Research shows"
> "Research shows that LLMs trained with RLHF are 3x more likely to produce sycophantic responses when users express strong prior beliefs."
- Why: "Research shows" — vague actor hides subject.

**2601.08490** | oneLinerEn | "Researchers found"
> "Researchers found that model collapse in recursive self-training can be prevented by maintaining a 15% fresh data injection rate."
- Why: "Researchers found" — generic actor.

**2601.05503** | oneLinerEn | "Researchers propose"
> "Researchers propose a new retrieval-augmented generation architecture that reduces context length requirements by 78%..."
- Why: "Researchers propose" — should start with the method name.

**55adc6c9** | oneLinerEn | "Researchers have developed"
> "Researchers have developed a technique to preserve In-Context Learning (ICL) abilities during fine-tuning, maintaining 89% ICL performance..."
- Why: "Researchers have developed" — generic actor hides subject.

**2603.18002** | oneLinerEn | "This approach"
> "This approach uses contrastive learning to align visual and textual representations, achieving state-of-the-art on 8 multimodal benchmarks."
- Why: "This approach" — no named subject.

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

---

## Retrospective

### Which fields still have the most issues
- **oneLinerEn**: 28 issues — entire remaining problem is here
- **keyFindingsEn**: 0 issues — clean across all 50 samples
- **howToApplyEn**: 0 issues — clean across all 50 samples

### Pattern breakdown
| Pattern | Count | % of awkward |
|---|---|---|
| A/An [noun phrase] opener | 16 | 57% |
| Two-sentence editorial trailer | 11 | 39% (some overlap with A/An) |
| Research/Researchers/This opener | 5 | 18% |

### What the prompt/post-processor should fix next iteration
1. **Two-sentence detector is still too narrow**: Catches ". This [demonstrates|highlights]" but misses ". The company", ". He posited", ". The technique works", ". The findings suggest", ". The update". Universal truncation at first period eliminates all 11 cases.
2. **A/An rewriter must validate output**: After rewriting, check that output still doesn't start with A/An. If it does, force-retry with "DO NOT start with A or An" as the very first line.
3. **Anonymous technique papers need fallback**: Use the technique/method name directly as subject: "Distillation reduces..." not "A distillation method reduces..."; "Process-level reward modeling outperforms..." not "A reward modeling framework...".
4. **Regression vs iter 22**: 28/50 (56%) vs 21/50 (42%) — regression of 7 cases. Investigate whether samples or pipeline changed.

### What worked well
- keyFindings and howToApply remain fully clean (0 issues for consecutive evaluations)
- Named-subject openers work well where company/product names exist
- "This [demonstrates|highlights]" trailers reduced vs early iterations
