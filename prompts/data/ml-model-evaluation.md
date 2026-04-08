---
title: ML Model Evaluation Framework
category: data
tags: [machine-learning, model-evaluation, metrics, bias, performance]
difficulty: advanced
models: [claude, gpt-4, gemini, mistral]
---

# ML Model Evaluation Framework

Systematically evaluate machine learning models across performance, fairness,
robustness, and production-readiness. Goes beyond accuracy — covering error
analysis, bias detection, failure modes, and improvement recommendations.

## When to Use

- A model is trained and you need to decide whether it is ready for production
- Comparing multiple model candidates and need a structured evaluation
- Investigating why a deployed model is underperforming on a segment
- Preparing a model review for stakeholders before deployment

## The Technique

Provide the model type, task description, dataset characteristics, and
current metrics. The framework identifies blind spots — most teams evaluate
accuracy and stop. This forces examination of error patterns, subgroup
performance, calibration, and operational characteristics before shipping.

The critical input is where the model will be used and who it affects. A
misclassification in a spam filter is an inconvenience; in a medical
diagnostic model, it is a different kind of risk.

## Template

```
Evaluate the following machine learning model and provide improvement
recommendations.

## Model Type
{{model_type}}
Algorithm, key hyperparameters, and framework used.

## Task Description
{{task_description}}
What the model predicts, business context, how predictions are consumed,
and consequences of false positives vs. false negatives.

## Dataset Description
{{dataset_description}}
Size, class distribution, train/val/test split method, known biases,
time range, and whether temporal drift is a concern.

## Current Metrics
{{current_metrics}}
All metrics measured: accuracy, precision, recall, F1, AUC-ROC, AUC-PR,
confusion matrix, and any per-class breakdowns.

## Output
Produce an evaluation report with:
1. **Metric assessment** — are the reported metrics appropriate? What is
   missing? Recommend the primary metric.
2. **Error analysis** — categorize error types, identify top 3-5 patterns.
3. **Subgroup analysis** — performance across demographic, geographic,
   temporal, and behavioral segments.
4. **Bias assessment** — disparate impact, equal opportunity, calibration.
5. **Robustness check** — sensitivity to perturbations, missing features,
   distribution shift.
6. **Calibration analysis** — are predicted probabilities well-calibrated?
7. **Feature importance** — key drivers, proxy variables, target leakage.
8. **Production readiness** — latency, throughput, model size, monitoring.
9. **Improvement recommendations** — ranked by expected impact and effort.
10. **Go/no-go recommendation** — deploy, improve first, or abandon.
```

## Examples

### Fraud Detection Model

```
Metric assessment:
- Current: Accuracy 99.2%, Precision 78%, Recall 45%.
- Problem: Accuracy is misleading — 99:1 class imbalance. The model
  catches less than half of fraudulent transactions.
- Recommended primary metric: AUC-PR (robust to imbalance). Secondary:
  recall at fixed precision thresholds.

Error analysis:
- Pattern 1: Misses fraud on transactions under $20 (55% of FNs).
- Pattern 2: New merchant categories have 3x the false negative rate.
- Pattern 3: Performance degrades on weekends when legitimate patterns shift.

Improvement recommendations:
1. Oversample low-value fraud cases or use SMOTE (est. +12% recall).
2. Add merchant category age as a feature.
3. Train separate weekend/weekday models or add time-of-week features.
4. Implement human review queue for 0.4-0.7 confidence predictions.

Go/no-go: Improve first. Recall of 45% means most fraud is undetected.
Target 65% recall at 75% precision before deployment.
```

## Tips

1. **Choose metrics that match the cost structure** — If false negatives
   cost 100x more than false positives, optimize recall. State the cost
   ratio explicitly.

2. **Evaluate on held-out data from a different time period** — A random
   split leaks temporal patterns. If your model predicts the future,
   evaluate it on future data.

3. **Check for data leakage first** — Suspiciously high metrics often mean
   a feature is leaking the target. A 99.5% accuracy model using
   "claim_resolution_date" to predict fraud is a bug, not a model.

4. **Evaluate at multiple operating points** — A single threshold hides
   trade-offs. Plot precision-recall and ROC curves for the full picture.

5. **Document the evaluation** — Record the exact dataset version, split
   method, metrics, and thresholds. Future teams will need this baseline.

## Common Mistakes

1. **Reporting only accuracy on imbalanced datasets** — A model predicting
   "not fraud" for every transaction achieves 99% accuracy with 1% fraud
   rate. Accuracy alone is meaningless.

2. **Ignoring calibration** — A model predicting 0.9 confidence for
   everything is not well-calibrated, even if AUC is high.

3. **Evaluating on training distribution only** — Stress-test with
   out-of-distribution samples, adversarial inputs, and missing features.

4. **Treating feature importance as causation** — An important feature may
   be a correlation or proxy. Do not make business decisions on feature
   importance alone.

5. **Skipping subgroup analysis** — Aggregate metrics hide underperformance
   on minority groups. A model at 90% overall but 60% for a specific
   demographic is a liability, not a success.
