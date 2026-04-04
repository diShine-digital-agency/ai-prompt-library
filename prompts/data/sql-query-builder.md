---
title: SQL Query Builder
category: data
tags: [sql, queries, database, optimization, analytics]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# SQL Query Builder

Generate optimized SQL queries from natural language descriptions, with
proper joins, aggregations, window functions, and performance considerations.

## When to Use

- Translating business questions into SQL queries
- Optimizing slow-running queries
- Building complex analytical queries with CTEs and window functions
- Cross-database SQL translation (PostgreSQL to BigQuery, etc.)
- Data exploration and ad-hoc analysis

## The Technique

Convert plain English questions into well-structured, performant SQL by
understanding the data model, query intent, and optimization opportunities.

## Template

```
Generate a SQL query for the following:

Question: {{business_question}}
Database: {{dialect}} (PostgreSQL / MySQL / BigQuery / Snowflake)
Schema:
{{table_definitions}}

Requirements:
- Use CTEs for readability (no deeply nested subqueries)
- Include comments explaining business logic
- Handle NULL values explicitly
- Use appropriate data types in comparisons
- Optimize for {{read_pattern}} (one-time analysis / repeated dashboard query)

Output:
1. The SQL query with inline comments
2. Expected output columns and their meaning
3. Performance notes (indexes needed, estimated complexity)
4. Alternative approaches if applicable
```

## Examples

### Revenue Analysis Query

```
Question: Show monthly revenue by product category for 2025,
with month-over-month growth percentage.

Database: PostgreSQL
Schema:
- orders(id, customer_id, total_amount, created_at, status)
- order_items(id, order_id, product_id, quantity, unit_price)
- products(id, name, category, active)

Generated SQL:

WITH monthly_revenue AS (
    -- Calculate revenue per category per month
    SELECT
        p.category,
        DATE_TRUNC('month', o.created_at) AS month,
        SUM(oi.quantity * oi.unit_price) AS revenue
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE o.status = 'completed'
      AND o.created_at >= '2025-01-01'
      AND o.created_at < '2026-01-01'
    GROUP BY p.category, DATE_TRUNC('month', o.created_at)
),
with_growth AS (
    -- Add month-over-month growth
    SELECT
        category,
        month,
        revenue,
        LAG(revenue) OVER (
            PARTITION BY category ORDER BY month
        ) AS prev_month_revenue,
        ROUND(
            (revenue - LAG(revenue) OVER (PARTITION BY category ORDER BY month))
            / NULLIF(LAG(revenue) OVER (PARTITION BY category ORDER BY month), 0)
            * 100, 1
        ) AS mom_growth_pct
    FROM monthly_revenue
)
SELECT * FROM with_growth
ORDER BY category, month;

-- Recommended indexes:
-- CREATE INDEX idx_orders_created_status ON orders(created_at, status);
-- CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

## Tips

1. **Provide the full schema** — Column names, types, and relationships are
   essential for generating correct queries. Include sample data if possible.

2. **Specify the dialect** — PostgreSQL's `DATE_TRUNC` is BigQuery's
   `DATE_TRUNC` but MySQL's `DATE_FORMAT`. Dialect matters for every function.

3. **Mention performance context** — "This runs once daily" vs. "this powers
   a real-time dashboard" affects optimization strategy.

4. **Request EXPLAIN analysis** — Ask for the expected execution plan to
   understand query performance before running on production data.

5. **Use CTEs for clarity** — CTEs make complex queries readable and
   debuggable. Each CTE should have a clear single purpose.

## Common Mistakes

1. **Missing NULL handling** — `SUM(col)` ignores NULLs silently, but
   `AVG(col)` may produce unexpected results. Be explicit.

2. **Wrong join types** — Using INNER JOIN when LEFT JOIN is needed drops
   records silently. Always consider what happens with missing relationships.

3. **No index awareness** — Queries that filter or join on unindexed columns
   cause full table scans. Always recommend supporting indexes.

4. **Date timezone issues** — Comparing dates without timezone awareness
   causes off-by-one day errors near midnight.

5. **Division by zero** — Growth rate calculations need NULLIF to prevent
   division by zero when the baseline period has no data.
