---
title: ETL automation prompts
category: data
tags: [etl, data-transformation, regex, cleaning, schema-mapping]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# ETL automation prompts

Prompts for automating extract-transform-load workflows — from messy source data
to clean, structured output. These work best when you give the LLM actual sample
data rather than abstract descriptions.

## When to use

- transforming data between incompatible systems
- cleaning messy CSV/JSON exports from third-party tools
- generating regex patterns for parsing semi-structured text
- mapping schemas between databases or APIs
- writing validation rules for incoming data

## Template: data transformation

```
I need to transform data from {{source_format}} to {{target_format}}.

**Source schema:**
```{{format}}
{{source_schema}}
```

**Target schema:**
```{{format}}
{{target_schema}}
```

**Sample source data (3-5 rows):**
```
{{sample_data}}
```

**Transformation rules I know about:**
{{known_rules}}

**Edge cases I'm worried about:**
{{edge_cases}}

Write the transformation logic in {{language}}. For each field mapping:
1. show the source → target mapping
2. any type conversions or formatting changes
3. how to handle null/missing values
4. how to handle invalid data (log and skip? default value? fail?)

Also generate 5 test cases covering normal data, edge cases, and invalid input.
```

## Template: regex generation for parsing

```
I need to extract structured data from this semi-structured text.

**Sample inputs (showing the variety I need to handle):**
```
{{sample_1}}
```
```
{{sample_2}}
```
```
{{sample_3}}
```

**What I need to extract:**
{{fields_to_extract}}

Write regex patterns in {{language}} that:
1. handle all the variations shown in the samples
2. use named capture groups for readability
3. are as permissive as possible on formatting (spaces, case) but strict on data types
4. include comments explaining each part of the pattern

Also give me 3 inputs that would break the regex so I know my coverage gaps.
```

## Template: data cleaning pipeline

```
I have a {{format}} file with {{row_count}} rows that needs cleaning before
I can load it into {{target_system}}.

**Sample of the messy data (first 10 rows with headers):**
```
{{sample_data}}
```

**Known data quality issues:**
{{known_issues}}

**Target requirements:**
- {{requirement_1}}
- {{requirement_2}}
- {{requirement_3}}

Write a {{language}} cleaning pipeline that:
1. profiles the data first (null counts, unique values, type distribution per column)
2. applies cleaning transformations in a logical order
3. logs every transformation with before/after counts
4. produces a data quality report at the end
5. doesn't silently drop rows — quarantine bad records to a separate file

Structure the code so each cleaning step is a separate function I can
enable/disable independently.
```

## Template: schema mapping between systems

```
I need to migrate data from {{source_system}} to {{target_system}}.

**Source schema:**
```sql
{{source_ddl}}
```

**Target schema:**
```sql
{{target_ddl}}
```

**Business rules for the mapping:**
{{business_rules}}

Generate:
1. a field-by-field mapping table (source column → target column → transformation)
2. SQL or {{language}} code to perform the migration
3. a list of fields in the target that have no source (need defaults or manual input)
4. a list of source fields that will be dropped (confirm these are intentional)
5. validation queries to run after migration to verify row counts and data integrity
```

## Template: data validation rules

```
I need validation rules for data coming into my {{system}} from {{source}}.

**Schema:**
```
{{schema}}
```

**Sample valid data:**
```
{{valid_sample}}
```

**Sample invalid data I've seen in production:**
```
{{invalid_sample}}
```

Generate validation rules in {{language}} that check:
1. required fields (not null, not empty string, not whitespace-only)
2. type constraints (dates are valid dates, numbers are in range, etc.)
3. format constraints (email format, phone format, postal codes, etc.)
4. referential integrity (foreign keys exist, enum values are valid)
5. business logic (e.g., end_date > start_date, total = sum of line items)
6. cross-field dependencies (if field A is X, then field B must be Y)

For each rule, specify:
- severity (error = reject the record, warning = accept but flag)
- the error message (human-readable, includes the actual bad value)
- suggested fix if possible
```

## Template: API response normalization

```
I'm integrating {{count}} different APIs that return similar data in
different formats. I need to normalize them into a single schema.

**API 1 ({{api_1_name}}) response:**
```json
{{api_1_sample}}
```

**API 2 ({{api_2_name}}) response:**
```json
{{api_2_sample}}
```

**My target normalized schema:**
```json
{{target_schema}}
```

Write a normalizer for each API that:
1. maps fields to the target schema
2. handles missing fields with sensible defaults
3. normalizes data types (dates to ISO 8601, currencies to decimal, etc.)
4. preserves the original response in a `_raw` field for debugging
5. includes a `_source` field indicating which API it came from
```

## Tips

- always include real sample data in your prompts — abstract descriptions lead to abstract code
- ask the LLM to profile the data first before writing transformations
- request that cleaning code logs what it changes — silent transformations are debugging nightmares
- for regex, provide 3+ examples showing the full range of formats you encounter
- test generated ETL code on a small subset before running on the full dataset
- include your edge cases explicitly — the LLM can't guess that "N/A" appears in your numeric columns

## Common mistakes

- describing data transformations in words when you could just show sample input → desired output
- not asking for error handling — the first run on real data always has surprises
- generating one monolithic transformation script instead of composable steps
- forgetting to validate output data quality, not just input
- not preserving source data — always keep the original until you've verified the transform
