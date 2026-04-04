---
title: Statistical Analysis Prompt
category: data
tags: [statistics, hypothesis-testing, regression, significance, analysis]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Statistical Analysis Prompt

Guide rigorous statistical analysis including hypothesis formulation,
test selection, assumption checking, and result interpretation.

## When to Use

- A/B test result analysis and significance testing
- Regression modeling for prediction or causal inference
- Survey data analysis and interpretation
- Time series analysis and forecasting
- Any decision requiring statistical evidence

## The Technique

Statistical analysis follows a structured process: formulate the question,
choose the method, check assumptions, run the analysis, and interpret
results in business context.

## Template

```
Conduct a statistical analysis for the following:

Research question: {{question}}
Data description: {{dataset_overview}}
Sample size: {{n}}
Variables:
- Dependent: {{dependent_var}} (type: continuous / categorical / count)
- Independent: {{independent_vars}} (types for each)
Significance level: {{alpha}} (default: 0.05)

Provide:

1. HYPOTHESIS FORMULATION
- Null hypothesis (H0): [precise statement]
- Alternative hypothesis (H1): [precise statement]
- Directionality: one-tailed or two-tailed, with justification

2. METHOD SELECTION
- Recommended test: [test name]
- Why this test: [assumptions it makes, why they fit this data]
- Alternatives if assumptions are violated: [non-parametric options]

3. ASSUMPTION CHECKS
For the selected test, verify:
- Normality (Shapiro-Wilk for n<50, visual for larger)
- Homogeneity of variance (Levene's test)
- Independence of observations
- Sample size adequacy (power analysis)
- Linearity (for regression)
- No multicollinearity (VIF for multiple regression)

4. ANALYSIS EXECUTION
- Test statistic value
- p-value
- Effect size (Cohen's d, eta-squared, R-squared, odds ratio)
- Confidence interval for the effect
- Power of the test

5. INTERPRETATION
- Statistical significance: [yes/no at alpha level]
- Practical significance: [is the effect size meaningful?]
- Business translation: [what does this mean in plain language?]
- Limitations: [what this analysis cannot tell us]

6. RECOMMENDATIONS
- Business action based on findings
- Further analysis suggested
- Data collection improvements for future studies
```

## Examples

### A/B Test Analysis

```
Research question: Does the new checkout flow increase conversion rate?

Data:
- Control (old flow): 5,000 visitors, 350 conversions (7.0%)
- Treatment (new flow): 5,200 visitors, 416 conversions (8.0%)

Hypothesis:
- H0: p_treatment = p_control (no difference in conversion rates)
- H1: p_treatment > p_control (new flow converts better)
- One-tailed test (we only care if the new flow is better)

Method: Two-proportion z-test
- z = 1.96, p = 0.025
- Effect size: 1.0 percentage point absolute lift
- 95% CI for difference: [0.1%, 1.9%]
- Relative lift: 14.3%

Interpretation:
- Statistically significant at alpha = 0.05 (p = 0.025)
- Practically significant: 1pp absolute lift at current volume
  equals ~$240K additional annual revenue
- Recommendation: Roll out new checkout flow to 100% of traffic
- Caveat: Monitor for 2 more weeks to confirm no novelty effect
```

## Tips

1. **Always report effect sizes** — p-values tell you if an effect exists;
   effect sizes tell you if it matters. Both are essential.

2. **Check assumptions before testing** — Running a t-test on non-normal data
   or small samples produces unreliable results.

3. **Distinguish statistical from practical significance** — A p-value of 0.001
   with a 0.1% improvement may be statistically significant but not worth acting on.

4. **Use confidence intervals** — They convey both the estimate and the
   uncertainty in one measure. More informative than p-values alone.

5. **Pre-register your analysis plan** — Decide on the test, sample size,
   and significance level before looking at the data to avoid p-hacking.

## Common Mistakes

1. **p-hacking** — Running multiple tests until one is significant inflates
   false positive rates. Use Bonferroni correction for multiple comparisons.

2. **Confusing correlation with causation** — Regression shows association.
   Causal claims require experimental design or causal inference methods.

3. **Ignoring sample size** — Small samples produce unstable estimates. Use
   power analysis to determine minimum required sample size before collecting data.

4. **Reporting only significant results** — Publication bias. Non-significant
   results are informative and should be reported and acted upon.

5. **Misinterpreting p-values** — p = 0.05 does NOT mean "5% chance the null
   is true." It means "5% chance of seeing this data if the null IS true."
