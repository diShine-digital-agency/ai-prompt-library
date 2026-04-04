---
title: Data Quality Audit
category: data
tags: [data-quality, validation, profiling, governance, audit]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Data Quality Audit

Systematic data quality assessment covering completeness, accuracy, consistency,
timeliness, and uniqueness across datasets.

## When to Use

- Before starting a new analytics project (trust the data first)
- After data migration or system integration
- Regular governance audits
- Debugging unexpected analytical results
- Preparing data for machine learning models

## The Technique

Data quality is measured across five dimensions. Each dimension has specific
checks that produce actionable scores and remediation plans.

## Template

```
Conduct a data quality audit for:

Dataset: {{dataset_name}}
Source system: {{source}}
Table/Collection: {{table_name}}
Purpose: {{what_this_data_is_used_for}}
Expected record count: {{expected_volume}}

Generate quality checks for each dimension:

1. COMPLETENESS
- What percentage of records have NULL values per column?
- Which required fields have missing data?
- Are there records missing entirely (gaps in sequences, dates)?

SQL checks:
```sql
-- Completeness per column
SELECT
    COUNT(*) AS total_rows,
    {{#each columns}}
    ROUND(COUNT({{this}})::NUMERIC / COUNT(*) * 100, 2) AS {{this}}_pct,
    {{/each}}
FROM {{table}};
```

2. ACCURACY
- Do values fall within expected ranges?
- Do categorical fields contain only valid values?
- Do calculated fields match their formula?
- Cross-reference with authoritative sources

3. CONSISTENCY
- Same entity, same value across tables? (e.g., customer name in orders vs. CRM)
- Date formats consistent?
- Enum values standardized? (US vs. USA vs. United States)
- Foreign key integrity

4. TIMELINESS
- When was the data last updated?
- Are there stale records beyond the expected refresh window?
- Is there a lag between event time and load time?

5. UNIQUENESS
- Duplicate records (exact and fuzzy)
- Primary key uniqueness violations
- Business key uniqueness (email, phone, SSN)

Output:

DATA QUALITY SCORECARD:
| Dimension | Score | Status | Critical Issues |
|-----------|-------|--------|-----------------|
| Completeness | {{pct}}% | [pass/warn/fail] | {{issue}} |
| Accuracy | {{pct}}% | [pass/warn/fail] | {{issue}} |
| Consistency | {{pct}}% | [pass/warn/fail] | {{issue}} |
| Timeliness | {{pct}}% | [pass/warn/fail] | {{issue}} |
| Uniqueness | {{pct}}% | [pass/warn/fail] | {{issue}} |

REMEDIATION PLAN:
For each failing dimension:
- Root cause
- Recommended fix (immediate and long-term)
- Owner
- Priority
```

## Examples

### Customer Data Audit

```
Dataset: Customer master table
Issues found:

COMPLETENESS: 87% — WARN
- phone_number: 34% NULL (acceptable for optional field)
- email: 2% NULL (critical — required for account recovery)
- address_state: 12% NULL (impacts regional reporting)

ACCURACY: 92% — WARN
- 847 email addresses without @ symbol
- 23 zip codes with non-numeric characters
- 156 birth dates in the future

UNIQUENESS: 95% — WARN
- 3,201 duplicate email addresses across accounts
- 412 exact duplicate rows (same name + email + phone)

Remediation:
1. CRITICAL: Fix 2% missing emails — query source system for recovery
2. HIGH: Deduplicate 412 exact duplicates — merge or archive
3. MEDIUM: Validate email format on insert (add CHECK constraint)
```

## Tips

1. **Automate recurring checks** — Run data quality checks as part of your
   data pipeline, not as one-off audits.

2. **Define thresholds before auditing** — "95% completeness" means something
   only if you defined 95% as your target in advance.

3. **Prioritize by business impact** — A 5% NULL rate on a rarely-used column
   matters less than 1% corruption on a revenue-critical field.

4. **Profile before you analyze** — Never start analytical work without
   profiling the data first. Bad data produces worse insights.

5. **Track quality over time** — A single audit is a snapshot. Track quality
   scores weekly to catch degradation trends.

## Common Mistakes

1. **Auditing without context** — "12% NULL" is meaningless without knowing
   if the field is required, optional, or conditionally required.

2. **Ignoring cross-system consistency** — Data in the warehouse may be accurate
   per-table but inconsistent across systems. Always check cross-references.

3. **Not testing the tests** — Data quality checks can have bugs too. Validate
   your checks against known-good and known-bad samples.

4. **One-time audit mindset** — Data quality degrades continuously. Automated
   monitoring catches issues before they affect business decisions.

5. **No remediation plan** — Identifying problems without actionable fixes
   produces a report that gathers dust. Every finding needs an owner and deadline.
