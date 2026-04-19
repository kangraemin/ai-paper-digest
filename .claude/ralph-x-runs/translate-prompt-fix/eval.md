## Iteration Result
- Status: FAIL
- Awkward count: 28/100
- Breakdown: one_liner issues: 27, key_findings issues: 1, how_to_apply issues: 0

---

## Awkward Examples

### Two-sentence oneLinerEn (editorial trailer appended) — 14 cases

1. reddit_ClaudeAI_1sfsz67 — oneLinerEn
   "Claude Code reconstructed a 1992 online multiplayer game from just script files and a manual, successfully reverse-engineering a custom scripting language. This demonstrates the potential of LLMs for large-scale reverse engineering and legacy system revitalization."
   Why: Second sentence "This demonstrates..." editorial filler

2. hn_47575417 — oneLinerEn
   "Coasts is a CLI tool that resolves port conflicts... Combined with git worktree, it enables parallel execution of N independent development environments on a single machine."
   Why: 2 sentences; also "[Name] is a [type] that..." opener

3. hn_47225130 — oneLinerEn
   "Leaked reports reveal Meta Ray-Ban smart glasses footage... is being reviewed by overseas contractors. The investigation highlights significant privacy concerns regarding data handling and transparency."
   Why: "The investigation highlights..." generic editorial conclusion

4. hn_46810282 — oneLinerEn
   "Marginlab independently tracks Claude Code (Opus 4.6) performance with SWE-Bench-Pro, detecting statistically significant regressions daily. This third-party validation effort addresses growing concerns about 'silent quality degradation' in AI models."
   Why: "This third-party validation effort..." editorial filler

5. hn_46902223 — oneLinerEn
   "Anthropic launches Claude Opus 4.6... The release introduces multi-agent team functionality for parallel task execution."
   Why: Second sentence is additional detail tacked on as editorial elaboration

6. hn_44595492 — oneLinerEn
   "OpenAI launched ChatGPT agents... Combining the strengths of Operator and Deep Research, this versatile agent marks a pivotal step towards AI handling real-world tasks."
   Why: "marks a pivotal step" is opinion filler

7. hn_47477339 — oneLinerEn
   "Revise is an AI-powered word processor... Its key differentiator is tight integration with AI agents, unlike traditional tools like Google Docs or Word."
   Why: 2 sentences; also "[Name] is a [type] that..." opener

8. hn_47367129 — oneLinerEn
   "Anthropic officially launches 1M token context windows for Opus 4.6 and Sonnet 4.6 at no extra cost. The same per-token pricing applies to requests exceeding 200K tokens, and image/PDF request limits are expanded to 600 pages."
   Why: Second sentence is additional scope detail, not a summary

9. reddit_ClaudeAI_1s7mkn3 — oneLinerEn
   "Two hidden caching bugs... are silently inflating API costs by 10-20x. Developers using Claude Code via CLI or automation should investigate immediately."
   Why: Second sentence is an action directive, not a finding

10. hn_47086181 — oneLinerEn
    "Taalas achieves 17,000 tokens/sec inference... The company aims to overcome the high cost and latency barriers to AI adoption with dedicated hardware."
    Why: "The company aims to..." editorial mission framing

11. hn_47394022 — oneLinerEn
    "A developer who has been successfully maintaining real-world projects with LLMs shares a concrete workflow... The post details how to reduce defect rates and maintain system understanding in LLM coding."
    Why: "The post details how to..." meta-commentary

12. hn_47427647 — oneLinerEn
    "Google open-sources Sashiko... claiming it detects 53% of bugs missed by human reviewers. The agent is now applied to all Linux kernel mailing list patch submissions."
    Why: Second sentence adds scope detail that should be folded into first

13. a79eb7fddd1b620b12f41243b8c139f01f7b4e4e — oneLinerEn
    "A new framework distinguishes between prompt-related and model-inherent causes of LLM hallucinations. The approach provides metrics to pinpoint whether to optimize prompts or switch models."
    Why: "The approach provides..." editorial elaboration

14. 2508.14704 — oneLinerEn
    "A benchmark of LLM agents based on real-world MCP servers reveals even GPT-5 achieves only a 43.7% success rate. The study highlights significant challenges in applying LLMs to practical tool-use scenarios."
    Why: "The study highlights significant challenges" is generic editorial conclusion

### "[Name] is a [type] that..." and "This [noun]..." openers — 5 cases

15. 2601.12034 — oneLinerEn
    "PUMA is a lightweight adapter framework that transfers user-specific soft prompts with 98% less cost when upgrading LLMs. It enables seamless model migration without retraining."
    Why: "[Name] is a [type] that..." + 2 sentences

16. 2601.16946 — oneLinerEn
    "This research experimentally compares XML tagging, indexing, and JSON matching..."
    Why: "This research..." opener

17. hn_47193064 — oneLinerEn
    "This open-source MCP server resolves raw output bloating context windows when invoking MCP tools..."
    Why: "This [noun]..." opener

18. 2305.09645 — oneLinerEn
    "This framework provides a dedicated interface for LLMs to directly read and reason with data from Knowledge Graphs, tables, and databases."
    Why: "This framework provides..." opener

19. 2501.07278 — oneLinerEn
    "This survey comprehensively details methodologies for enabling LLM agents to continuously learn and retain past knowledge even in new environments."
    Why: "This survey..." opener

### Meta-descriptor openers ("A [content type]...", "A study...", "A new study...") — 5 cases

20. 2602.08004 — oneLinerEn (also a fragment)
    "A study quantifying the landscape of 40,285 Claude Skills from a public marketplace, revealing what skills exist, how they're used, and where the risks lie."
    Why: "A study quantifying..." + no main predicate verb (fragment)

21. reddit_ClaudeAI_1sad9rb — oneLinerEn
    "A post detailing how users with ADHD have successfully created a 'second brain' centered around Claude..."
    Why: "A post detailing" meta-describes content type instead of stating finding

22. 9136387112bd31614aab05d82bd97e13773df08e — oneLinerEn
    "A study extending LLM code generation research from Python to Android (Java) and iOS (Swift) delivers a decision tree for choosing the right model for the job."
    Why: "A study extending..." content meta-descriptor

23. hn_47401734 — oneLinerEn
    "A study demonstrates that while introducing AI coding tools like Cursor AI boosts short-term development velocity..."
    Why: "A study demonstrates that..." equivalent to "Researchers found that..."

24. hn_47690415 — oneLinerEn
    "A new study analyzing the writing styles of 178 AI models across 32 dimensions reveals over 78% similarity..."
    Why: "A new study analyzing..." vague opener

### Fragments (no main predicate verb) — 2 cases

25. 2603.13017 — oneLinerEn
    "Compressing AI coding agent conversation histories 11x for searchable memory with minimal quality loss based on vector search."
    Why: Gerund phrase with no subject or finite verb — fragment

26. 2603.20105 — oneLinerEn
    "A framework achieving 21.9% higher accuracy and 4.1x faster processing of long documents by leveraging deterministic combinators..."
    Why: "A framework achieving..." — no main finite verb, participial not predicate

### keyFindingsEn — 1 case

27. 2505.04016 — keyFindingsEn[0]
    "The idea of attaching a separate, lightweight model (SLOT) as a post-processing layer to convert LLM outputs directly into JSON – applicable to any model without modifying existing LLM weights."
    Why: "The idea of attaching..." noun phrase, no predicate verb — fragment

---

## Good Examples

1. hn_47442435 — oneLinerEn
   "Giving Claude Code access to 16 GPUs resulted in 910 experiments run in 8 hours, improving validation loss by 2.87%, and the agent even devised a strategy to self-utilize a mixed H100/H200 hardware setup."

2. 444c2bf46949fb7ea1fe4bfffaa8cf94072f7f9c — oneLinerEn
   "LLM-based automated scoring exhibits minimal variance within a single model but significant differences between models, with accuracy improved through majority voting across multiple LLMs."

3. hn_47513475 — oneLinerEn
   "Google Research achieves zero accuracy loss with 3-bit KV cache compression using a two-stage vector compression algorithm – PolarQuant combined with QJL – resulting in up to 8x speed improvements on H100 GPUs."

4. 2603.27771 — oneLinerEn
   "Multi-agent systems powered by LLMs spontaneously replicate detrimental human societal patterns like collusion, groupthink, and role failure, even without explicit instructions."

5. 2503.01840 — oneLinerEn
   "Speculative Decoding boosts LLM inference speeds up to 6.5x by improving the draft model architecture."

6. 2603.18953 — oneLinerEn
   "Gradually injecting and then removing few-shot examples during early RL training enables models to internalize reasoning patterns independently."

7. hn_47721953 — oneLinerEn
   "The Linux kernel now formally outlines a policy for AI coding tools, stipulating full human responsibility for generated code and requiring an 'Assisted-by' tag to denote AI usage."

8. reddit_ChatGPT_1s8zocq — oneLinerEn
   "Specifying camera models and settings dramatically increases the realism and unsettling quality of AI-generated images."

9. 2507.21509 — oneLinerEn
   "An automated pipeline extracts undesirable LLM traits like 'evil', 'sycophancy', and 'hallucination' as activation vectors, proactively detecting problematic data before fine-tuning and preventing personality drift during training."

10. hn_47401042 — oneLinerEn
    "Voygr launches infrastructure for place data freshness, addressing stale data issues for AI agents interacting with the real world – a problem Google Maps API can't solve."

---

## Retrospective

### Which fields still have the most issues
- oneLinerEn: 27/100 awkward (27%)
- keyFindingsEn: 1/100 — isolated fragment, essentially solved
- howToApplyEn: 0/100 — fully solved

### What the prompt should fix next iteration

4 patterns account for all 27 awkward oneLinerEn:

1. Two-sentence trailer (14 cases, 52%): Model generates a good first sentence, then appends editorial commentary. Second-sentence starters observed: "This demonstrates/highlights...", "The [noun] provides/marks/introduces...", "Its key differentiator...", "The company aims to...", "The post details...", "The study highlights...", "Developers should...".
   Fix needed: Current post-processor regex misses most trailer variants. Need universal detection: any `. [A-Z][^.]+` → delete everything after first period, merge key fact into first sentence.

2. "This [noun]..." opener (5 cases, 18%): "This research", "This framework", "This survey", "This open-source X"
   Fix needed: Broaden opener detection to catch `^This\s+\w+` pattern broadly.

3. "A [content-type]..." meta-descriptor opener (5 cases, 18%): "A post detailing...", "A study extending...", "A study demonstrates that...", "A new study analyzing...", "A study quantifying..."
   Fix needed: Add detection: `^A\s+(study|post|paper|survey|research|report|benchmark)\s` → trigger rewrite.

4. Fragment / no main predicate verb (2 cases, 7%): Gerund-only or participial "A [noun] achieving..." without subject+finite verb.
   Fix needed: Detect if sentence lacks a finite verb before first comma/dash.

### What worked well
- keyFindingsEn and howToApplyEn are production-ready. Only 1 fragment across 100 samples' key_findings; 0 issues in how_to_apply.
- Named-entity openers and result-first openers work well: "Google Research achieves...", "Speculative Decoding boosts...", "Giving Claude Code access to 16 GPUs resulted in..." are all clean.
- A/An meta-opener rate appears lower than iter 17 (5 cases vs 17 in iter 17), suggesting A/An detection is working for some patterns.
- The two dominant patterns (two-sentence trailer + This opener) account for 70% of failures. Fix these two and the pass rate should exceed 95%.
