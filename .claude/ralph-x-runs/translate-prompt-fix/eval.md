# Eval: translate-prompt-fix — Iteration 12

## Iteration Result
- Status: **FAIL**
- Samples in file: 50 (task prompt says 100, but samples.json contains 50 entries)
- Awkward count: **43/50** (86%)
- Threshold: ≤5
- Breakdown: oneLinerEn issues: 43, keyFindingsEn issues: 0, howToApplyEn issues: 0

---

## Awkward Examples

### "A/An [noun phrase]..." openers (19 cases)

**2601.17814** — "A routing system that automatically selects..."
**hn_46988596** — "A new analysis demonstrates that..."
**hn_47257394** — "An essay dissecting..." (noun phrase, no main verb)
**hn_47543139** — "A detailed guide to the structure..." (noun phrase, not a sentence)
**hn_47571495** — "A mathematical blog post reveals... It demonstrates..." (also two sentences)
**2604.09443** — "A benchmark demonstrates... The research highlights..." (also two sentences)
**2603.15566** — "A protocol for embedding..." (noun phrase only)
**2601.11004** — "A new study demonstrates..."
**2602.16836** — "An 8B model, smaller than GPT-5... This demonstrates..." (also two sentences)
**2603.12165** — "A reverse data selection technique identifies..." (anonymous subject)
**2602.12318** — "A methodology for automatically identifying..." (noun phrase only)
**reddit_ClaudeAI_1sad9rb** — "A post detailing how users with ADHD..." (meta-describing content)
**2502.11903** — "A new benchmark measures the short-term memory..."
**reddit_ClaudeAI_1s3hh29** — "A post detailing how sending short greetings..."
**hn_47388646** — "A candid thread on Hacker News reveals..." (meta-describing content)
**reddit_ClaudeAI_1s00ajb** — "A PhD student shares..." (reporting on person not finding)
**hn_45163362** — "A practical case of porting..." (noun phrase only)
**2603.12133** — "Research reveals..." (vague, no concrete subject)
**c067664a** — "Research analyzes how GPT-3..." (vague anonymous subject)

---

### Two-sentence one_liners (12 cases)

**de28e4cbee** — "This RAG-based scientific literature synthesis model... The multi-agent collaboration..."
**hn_45116688** — "Zed editor now natively runs... This is significant as it aims to..."
**2604.06091** — "Experiments demonstrate... The study reveals..."
**f53f31b8** — "Multiple AI agents debating... The multi-agent collaboration..."
**hn_47349334** — "Reanalysis of METR's SWE-bench data... The study challenges..."
**2603.19235** — "Researchers introduce VEGA-3D... The approach leverages..."
**hn_47678844** — "Marimo-pair is an open-source tool that... This enables..."
**hn_45944296** — "Security researchers are criticizing... The report's claims..."
**hn_44875848** — "This experiment details... The results demonstrate..."
**hn_47273854** — "Anthropic and Mozilla collaborated... This demonstrates the potential..."
**hn_47780971** — "Saffron Health's open-source Libretto toolkit... It addresses..."
**hn_47548243** — "GitHub will automatically leverage... Users should promptly verify..."

---

### "This [noun]..." openers (5 cases)

**2503.15129** — "This cRLHF framework boosts..."
**2601.01885** — "This framework trains LLM agents... The approach achieves..."
**hn_44875848** — "This experiment details..." (also two-sentence)
**de28e4cbee** — "This RAG-based..." (also two-sentence)
**2601.03743** — "A deep research system... was built using..." (passive voice)

---

### Other openers (9 cases)

**2601.08490** — "Researchers identified nine prompt patterns..."
**2603.19235** — "Researchers introduce VEGA-3D..." (also two-sentence)
**2604.01052** — "VibeGuard is a pre-publish security scanner that prevents..." ([Name] is a [type] that)
**hn_47678844** — "Marimo-pair is an open-source tool that..." (also two-sentence)
**2601.03743** — "A deep research system... was built using..." (passive)
**hn_44746621** — "Developer productivity shifts and practical patterns are revealed..." (passive)
**reddit_ClaudeAI_1sdmohb** — "...this article details..." (meta-reference)
**hn_47582482** — "Ollama now leverages... The integration..." (two sentences)
**reddit_ChatGPT_1rz0fjz** — "Noren addresses the issue... The service is now available..." (two sentences)

---

## Good Examples (7 clean)

**hn_47649117** — named subject + active verb + concrete finding
> "Developers using unique emails per service discovered that when Cloudflare's catch-all routing was compromised, the entire email-as-identity model collapsed."

**hn_47536712** — named product + quantified result
> "Reco saved $500K annually by automating SaaS license reclamation, reclaiming 300+ seats from unused accounts in enterprise environments."

**2203.13474** — named product + benchmark number
> "Salesforce's CODEGEN open-source model fine-tuned on multi-turn conversations sees over a 10% improvement in program synthesis benchmarks."

**hn_47689174** — named product + capability claim with scale
> "MegaTrain enables full-precision training of 120B parameter models on consumer GPUs by offloading optimizer states to CPU memory."

**2305.09781** — named product + quantified speedup
> "SpecInfer accelerates LLM inference up to 3.5x using tree-based speculative decoding with multiple small draft models."

**2603.17639** — named product + active verb + purpose
> "VeriGrey automates prompt injection testing for AI agents using adversarial scenarios derived from real attack patterns."

**2502.16002** — named product + specific problem eliminated
> "KVLink eliminates redundant re-encoding of documents in RAG by reusing cached KV states across separate document retrievals."

---

## Retrospective

### Which fields still have the most issues
- **oneLinerEn**: 43/50 (86%) — the only problem field, worse than iter 11 (38/50)
- **keyFindingsEn**: 0 issues — fully solved
- **howToApplyEn**: 0 issues — fully solved

### Trend comparison
| Iteration | Awkward | Rate |
|-----------|---------|------|
| Iter 9    | 33/50   | 66%  |
| Iter 10   | 36/50   | 72%  |
| Iter 11   | 38/50   | 76%  |
| Iter 12   | 43/50   | 86%  |

**Rate is increasing, not decreasing.** Additional prompt constraints are actively making results worse — cognitive overload causes Gemma to default to safest template (A/An [noun]).

### What should change next iteration
After 12 iterations (all FAIL), prompt-only constraint engineering has definitively failed.

**Required: Post-processing rewrite pass (no more prompt iterations)**
1. Deterministic detector: count periods ≥2 (two-sentence), check banned starters (This/A/An/Researchers/[Name] is a), check for editorial trailer `. This [demonstrates|highlights]`
2. Rewrite flagged outputs using Claude Haiku: `[NAMED SUBJECT or KEY FINDING] [STRONG ACTIVE VERB] [CONCRETE MEASURABLE RESULT]`
3. The 7 clean examples confirm the pattern works — post-hoc enforcement is the only path forward.

**No further prompt constraint iterations are warranted.**
