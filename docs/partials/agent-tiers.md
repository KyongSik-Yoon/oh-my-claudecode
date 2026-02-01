# Agent Tiers Reference

This is the single source of truth for all agent tier information. All skill files and documentation should reference this file instead of duplicating the table.

## Tier Matrix

| Domain | LOW (Haiku) | MEDIUM (Sonnet) | HIGH (Opus) |
|--------|-------------|-----------------|-------------|
| **Analysis** | architect-low | architect-medium | architect |
| **Execution** | executor-low | executor | executor-high |
| **Search** | explore | explore-medium | explore-high |
| **Research** | researcher-low | researcher | - |
| **Frontend** | designer-low | designer | designer-high |
| **Docs** | writer | - | - |
| **Visual** | - | vision | - |
| **Planning** | - | - | planner |
| **Critique** | - | - | critic |
| **Pre-Planning** | - | - | analyst |
| **Testing** | - | qa-tester | qa-tester-high |
| **Security** | security-reviewer-low | - | security-reviewer |
| **Build** | build-fixer-low | build-fixer | - |
| **TDD** | tdd-guide-low | tdd-guide | - |
| **Code Review** | code-reviewer-low | - | code-reviewer |
| **Data Science** | scientist-low | scientist | scientist-high |

## Model Routing Guide

| Task Complexity | Tier | Model | When to Use |
|-----------------|------|-------|-------------|
| Simple | LOW | haiku | Quick lookups, simple fixes, "What does X return?" |
| Standard | MEDIUM | sonnet | Feature implementation, standard debugging, "Add validation" |
| Complex | HIGH | opus | Architecture decisions, complex debugging, "Refactor system" |

## Agent Selection by Task Type

| Task Type | Best Agent | Tier |
|-----------|------------|------|
| Quick code lookup | explore | LOW |
| Find files/patterns | explore, explore-medium | LOW/MEDIUM |
| Complex architectural search | explore-high | HIGH |
| Simple code change | executor-low | LOW |
| Feature implementation | executor | MEDIUM |
| Complex refactoring | executor-high | HIGH |
| Debug simple issue | architect-low | LOW |
| Debug complex issue | architect | HIGH |
| UI component | designer | MEDIUM |
| Complex UI system | designer-high | HIGH |
| Write docs/comments | writer | LOW |
| Research docs/APIs | researcher | MEDIUM |
| Analyze images/diagrams | vision | MEDIUM |
| Strategic planning | planner | HIGH |
| Review/critique plan | critic | HIGH |
| Pre-planning analysis | analyst | HIGH |
| Interactive CLI testing | qa-tester | MEDIUM |
| Security review | security-reviewer | HIGH |
| Quick security scan | security-reviewer-low | LOW |
| Fix build errors | build-fixer | MEDIUM |
| Simple build fix | build-fixer-low | LOW |
| TDD workflow | tdd-guide | MEDIUM |
| Quick test suggestions | tdd-guide-low | LOW |
| Code review | code-reviewer | HIGH |
| Quick code check | code-reviewer-low | LOW |
| Data analysis/stats | scientist | MEDIUM |
| Quick data inspection | scientist-low | LOW |
| Complex ML/hypothesis | scientist-high | HIGH |

## Usage

When delegating, always specify the model explicitly:

```
Task(subagent_type="oh-my-claudecode:executor",
     model="sonnet",
     prompt="...")
```

For token savings, prefer lower tiers when the task allows:
- Use `haiku` for simple lookups and quick fixes
- Use `sonnet` for standard implementation work
- Reserve `opus` for complex reasoning tasks
