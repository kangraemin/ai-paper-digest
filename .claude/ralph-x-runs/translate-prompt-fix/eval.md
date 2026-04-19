## Iteration Result (Iter 19)
- Status: FAIL
- Awkward count: 27/50
- Breakdown: oneLinerEn: 27, keyFindingsEn: 0, howToApplyEn: 0

---

## Awkward Examples

### Two-sentence oneLinerEn — 12 cases

1. hn_47721953 — ending: "...This represents a milestone in AI governance within open-source development."
   Why: Editorial second sentence opener

2. 270eb331f — ending: "...This eliminates the need for complex prompt engineering or fine-tuning..."
   Why: Appended elaboration sentence

3. hn_47501426 — ending: "...The feature integrates directly into the PR workflow..."
   Why: Second sentence detail

4. hn_47404796 — ending: "...Structured outputs are now available for all GPT-4o variants at no additional cost."
   Why: Second sentence scope detail

5. hn_47675213 — ending: "...The model supports 128K context and is available for commercial use..."
   Why: Appended spec sentence

6. 2604.11753 — ending: "...The approach requires no additional training and is compatible with any instruction-tuned LLM."
   Why: Editorial elaboration second sentence

7. reddit_ClaudeAI_1rw1b8i — ending: "...The difference is most pronounced in fiction requiring sustained emotional tone."
   Why: Expository second sentence

8. hn_47427017 — "An open-source benchmark tool automates the reproducible evaluation of Claude Code... The tool provides standardized metrics..."
   Why: A/An opener + appended second sentence

9. hn_47417804 — "An open-source tool automates the entire process of converting legacy codebases... The tool supports automatic test generation..."
   Why: A/An opener + appended second sentence

10. reddit_ClaudeAI_1s1ipep — "A Reddit user shares a workflow... The approach involves breaking tasks into phases..."
    Why: A/An opener + appended second sentence

11. hn_44705445 — "A new research approach... It demonstrates that intentionally including synthetic data..."
    Why: Fragment + It-demonstrates second sentence

12. 2603.18228 — ending: "...It enables training of billion-parameter models on consumer hardware..."
    Why: Appended benefit sentence

### A/An [noun phrase] openers — 13 cases

13. 2603.11991 — "A new sparse attention mechanism based on Fourier filtering selectively attends..."
14. hn_47768750 — "A new programming language co-designed with LLMs features deterministic semantics..."
15. 2603.13154 — "A new model architecture solving the fundamental trade-off..." (fragment)
16. 2603.16664 — "A novel prompting technique that boosts model performance..."
17. 2601.02179 — "A new benchmark for testing spatial reasoning reveals..."
18. 2602.06384 — "A new framework for generating diverse, high-quality training datasets..."
19. 2604.11790 — "A new tree-structured reasoning framework for LLMs dynamically allocates..."
20. 2603.13224 — "A framework using RL to teach LLMs to retrieve and reason..."
21. 2602.15850 — "A new paradigm for training LLMs on multi-turn feedback..."
22. hn_47690415 — "A new study analyzing the writing styles of 178 AI models..."
23. 2602.01711 — "A new inference-time scaling method that routes queries to specialized expert sub-networks..."
24. 2603.12120 — "An automated pipeline for generating synthetic training data from unlabeled images..."
25. 2603.14891 — "A lightweight post-training method that injects structured reasoning patterns..."

### "This [noun]..." openers — 1 case

26. 2603.11955 — "This framework automatically decomposes complex coding tasks into dependency-ordered subtasks..."

### "Researchers [verb]..." openers — 1 case

27. 2501.12948 — "Researchers show that applying sparse autoencoders to intermediate transformer layers..."

---

## Good Examples

1. hn_47442435: "Giving Claude Code access to 16 GPUs resulted in 910 experiments run in 8 hours, improving validation loss by 2.87%..."
2. 2603.27771: "Multi-agent systems powered by LLMs spontaneously replicate detrimental human societal patterns like collusion, groupthink, and role failure, even without explicit instructions."
3. 2503.01840: "Speculative Decoding boosts LLM inference speeds up to 6.5x by improving the draft model architecture."
4. 2603.18953: "Gradually injecting and then removing few-shot examples during early RL training enables models to internalize reasoning patterns independently."
5. hn_47513475: "Google Research achieves zero accuracy loss with 3-bit KV cache compression using a two-stage vector compression algorithm..."
6. reddit_ChatGPT_1s8zocq: "Specifying camera models and settings dramatically increases the realism and unsettling quality of AI-generated images."
7. hn_47401042: "Voygr launches infrastructure for place data freshness, addressing stale data issues for AI agents..."
8. 444c2bf: "LLM-based automated scoring exhibits minimal variance within a single model but significant differences between models..."

---

## Retrospective

### Pattern breakdown (27 awkward total)
- Two-sentence oneLinerEn: 12 cases (44.4%) — UP from 7 in iter 18
- A/An [noun phrase] opener: 13 cases (48.1%) — DOWN from 15 in iter 18
- "This [noun]..." opener: 1 case (3.7%) — DOWN from 3
- "Researchers [verb]..." opener: 1 case (3.7%) — DOWN from 2
- keyFindingsEn: 0 issues
- howToApplyEn: 0 issues

### Comparison with iter 18
Same total (27/50) but pattern shifted:
- Two-sentence increased (7→12): detector missing ". The [noun]", ". It enables", ". This move" patterns
- A/An slightly improved (15→13): rewriter constraint partially working
- This/Researchers openers improved (5→2)

### Root cause analysis
1. Two-sentence detector incomplete: misses ". The [noun]", ". It enables", ". The model", ". The approach" starters
2. A/An rewriter not fully constrained: model still produces A/An after rewrite
3. Post-rewrite single-sentence validation missing

### Fix priorities for iter 20
1. Expand two-sentence detector: catch ". The ", ". It ", ". This " as second sentence starters
2. Harden rewriter first-word constraint: "First word MUST be tech name, model, org, or number. Forbidden: A, An, The, This, These, Researchers, Research"
3. Post-rewrite sentence count check: truncate at first period if >1 sentence
4. Add positive template examples in rewriter prompt
