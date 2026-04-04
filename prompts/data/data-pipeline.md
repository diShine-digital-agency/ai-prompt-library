---
title: Data Pipeline Design
category: data
tags: [etl, data-engineering, pipeline, orchestration, transformation]
difficulty: advanced
models: [claude, gpt-4, gemini]
---

# Data Pipeline Design

Design robust data pipelines covering extraction, transformation, loading,
orchestration, error handling, and monitoring.

## When to Use

- Building ETL/ELT pipelines for data warehouses
- Migrating from manual data processes to automated pipelines
- Designing real-time streaming data architectures
- Creating data integration between systems
- Scaling existing pipelines for growing data volumes

## The Technique

A well-designed data pipeline handles not just the happy path but also
schema changes, data quality issues, partial failures, and backfill scenarios.

## Template

```
Design a data pipeline for the following requirements:

Source systems: {{sources}} (APIs, databases, files, streams)
Destination: {{destination}} (data warehouse, lake, application DB)
Volume: {{data_volume}} (records/day or GB/day)
Latency requirement: {{latency}} (real-time / near-real-time / batch)
Update pattern: {{pattern}} (full refresh / incremental / CDC)

Provide:

1. ARCHITECTURE DIAGRAM (text-based)
- Source connectors
- Extraction layer
- Staging area
- Transformation layer
- Loading strategy
- Orchestration

2. EXTRACTION DESIGN
For each source:
- Connection method (API, JDBC, file, CDC)
- Extraction strategy (full, incremental, change data capture)
- Incremental key (timestamp, sequence ID, etc.)
- Rate limiting and backpressure handling
- Schema detection and evolution

3. TRANSFORMATION LOGIC
- Staging transforms (type casting, null handling, deduplication)
- Business transforms (joins, aggregations, derived fields)
- Data quality rules (validation checks at each stage)
- Slowly changing dimension handling (SCD Type 1/2/3)

4. LOADING STRATEGY
- Load pattern (append, upsert, replace)
- Partitioning strategy
- Clustering/sort keys
- Idempotency guarantees

5. ORCHESTRATION
- DAG definition (task dependencies)
- Scheduling (cron, event-triggered, dependency-based)
- Retry policies (max retries, backoff strategy)
- Timeout configurations

6. ERROR HANDLING
- Dead letter queue for failed records
- Partial failure recovery
- Alert thresholds and escalation
- Manual re-run procedures

7. MONITORING AND OBSERVABILITY
- Data freshness SLAs
- Volume anomaly detection
- Quality score tracking
- Pipeline performance metrics
- Dashboard and alerting setup

8. BACKFILL STRATEGY
- How to re-process historical data
- How to handle schema changes during backfill
- Idempotency during re-runs
```

## Examples

### E-commerce Analytics Pipeline

```
Sources: Shopify API, Google Analytics, PostgreSQL (inventory)
Destination: BigQuery data warehouse
Volume: 500K orders/day, 10M pageviews/day
Latency: 1-hour freshness SLA

Architecture:
[Shopify API] ---> [Airbyte] ---> [GCS Staging] ---> [dbt] ---> [BigQuery]
[GA4]         ---> [BigQuery Export] ---+                          |
[PostgreSQL]  ---> [Airbyte CDC]   ----+---> [dbt transforms] ----+

Extraction:
- Shopify: Incremental by updated_at, 2 requests/second rate limit
- GA4: Direct BigQuery export (automatic)
- PostgreSQL: CDC via Debezium through Airbyte
```

## Tips

1. **Design for failure** — Every component will fail eventually. Plan how
   the pipeline recovers from each failure mode.

2. **Make pipelines idempotent** — Running the same pipeline twice with the
   same input should produce the same output. This enables safe re-runs.

3. **Version your transforms** — Use dbt, SQLMesh, or similar tools that
   version-control transformation logic alongside application code.

4. **Test with production-like data** — Synthetic test data misses edge cases
   that real data contains (encoding issues, NULL patterns, outliers).

5. **Start with batch, add streaming later** — Batch pipelines are simpler
   to build, debug, and maintain. Add streaming only when latency requires it.

## Common Mistakes

1. **No idempotency** — Pipelines that duplicate data on re-run are dangerous.
   Use upsert strategies or staging tables with deduplication.

2. **Ignoring schema evolution** — Sources add columns, change types, or rename
   fields. Pipelines must handle this without manual intervention.

3. **Missing data quality checks** — Loading corrupt or incomplete data into
   the warehouse pollutes downstream analyses. Validate at every stage.

4. **Over-engineering for scale** — A Kafka + Spark + Flink setup for 1000
   records/day is unnecessary overhead. Match architecture to actual volume.

5. **No monitoring** — "The pipeline stopped 3 days ago and nobody noticed"
   is a common story. Set up freshness alerts from day one.
