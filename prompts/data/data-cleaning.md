---
title: Data Cleaning Instructions Generator
category: data
tags: [data-cleaning, etl, data-quality, transformation, preprocessing]
difficulty: intermediate
models: [claude, gpt-4, gemini, mistral]
---

# Data Cleaning Instructions Generator

Generate precise data cleaning and transformation steps from a description of
the dataset, its quality issues, and the desired target format.

## When to Use

- Preparing raw data for analysis or machine learning pipelines
- Documenting data transformation logic for reproducibility
- Standardizing messy data from multiple sources
- Creating data cleaning scripts from natural language requirements
- Auditing data quality before loading into production systems

## The Technique

Describe the dataset, its known issues, the target format, and any business
rules that govern valid data. The model generates step-by-step cleaning
instructions — or executable code — that handles each issue systematically.
The key is being explicit about what "clean" means for your specific use case.

## Template

```
Generate data cleaning instructions for the following dataset.

## Dataset Description
{{dataset_description}}
Include: column names, data types, row count, source system, and a sample
of 3-5 representative rows (including problematic rows).

## Known Data Issues
{{data_issues}}
List every known quality problem, for example:
- Missing values in specific columns
- Inconsistent date formats
- Duplicate records
- Outliers or impossible values
- Encoding issues
- Mixed data types in a single column

## Target Format
{{target_format}}
Describe the desired output: column names, data types, constraints, and
the schema of the destination system.

## Business Rules
{{business_rules}}
Rules that determine valid data, for example:
- "Age must be between 0 and 120"
- "Email addresses must be unique per account"
- "Dates in the future are invalid for transaction records"

## Output
Provide:
1. A numbered list of cleaning steps in execution order.
2. For each step: what it does, why it is necessary, and how to validate
   that it worked.
3. A summary of expected data loss (rows removed or values nullified).
4. Executable code in Python (pandas) implementing all steps.
```

## Examples

### E-commerce Transaction Data

```
Step 1: Remove exact duplicate rows
  Why: Source system double-writes during high load.
  Validation: Row count should decrease by ~2% (approx 1,200 rows).

Step 2: Standardize date formats
  Convert all date columns to ISO 8601 (YYYY-MM-DD).
  - "MM/DD/YYYY" in order_date (38% of rows)
  - "DD-Mon-YYYY" in ship_date (12% of rows)
  Validation: pd.to_datetime should parse 100% of non-null dates.

Step 3: Handle missing values
  - customer_email: Flag as "missing", do not drop (needed for order linkage).
  - ship_date: Null is valid (order not yet shipped). Leave as NaT.
  - price: Drop rows where price is null or <= 0 (estimated 0.3% of rows).
  Validation: Null counts per column should match expected thresholds.

Step 4: Normalize categorical values
  - status column: Map {"Shipped", "SHIPPED", "shipped"} → "shipped".
  - payment_method: Map {"cc", "credit card", "CC"} → "credit_card".
  Validation: df["status"].nunique() should equal 4 (pending, shipped,
  delivered, cancelled).

Step 5: Remove outliers
  - price > $10,000 for non-enterprise accounts: Flag for manual review.
  - quantity > 100: Flag for manual review (do not auto-remove).
  Validation: Flagged rows should be < 0.1% of total.

Expected data loss: ~2.3% of rows removed (duplicates + null prices).
```

## Tips

1. **Show sample rows** — Include both clean and dirty rows in your description.
   The model detects patterns better from examples than from abstract descriptions.

2. **Define "missing" precisely** — Is a missing value null, empty string, "N/A",
   "0", or "-"? Different source systems use different sentinel values.

3. **Specify idempotency** — Good cleaning scripts produce the same result whether
   run once or ten times. Ask the model to ensure operations are idempotent.

4. **Ask for validation queries** — Every cleaning step should have a check.
   "Trust but verify" prevents silent data corruption.

5. **Document expected data loss** — Stakeholders need to know how many rows will
   be removed and why. Surprises erode trust in the pipeline.

## Common Mistakes

1. **Dropping rows without logging** — Silently removing data makes debugging
   impossible. Always log what was removed and why.

2. **Cleaning in place without backup** — Always preserve the raw data. Cleaning
   should produce a new table or file, not overwrite the source.

3. **Ignoring encoding issues** — UTF-8 vs. Latin-1 mismatches cause subtle
   corruption (e.g., "café" becomes "cafÃ©"). Specify encoding explicitly.

4. **Hardcoding thresholds** — "Remove rows where age > 120" works today.
   Parameterize thresholds so they can be adjusted without code changes.

5. **No profiling before cleaning** — Jumping to cleaning without profiling
   the data first means you will miss issues. Run value counts, null checks,
   and distribution plots before writing a single transformation.
