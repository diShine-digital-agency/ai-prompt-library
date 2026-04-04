---
title: Database Schema Design
category: development
tags: [database, schema, sql, normalization, data-modeling]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Database Schema Design

Design normalized, performant database schemas with proper relationships,
indexes, constraints, and migration strategies.

## When to Use

- Greenfield database design for new applications
- Schema refactoring for scaling bottlenecks
- Data model review and normalization assessment
- Migration planning between database systems
- Adding new features requiring schema changes

## The Technique

Good schema design balances normalization for data integrity with practical
query performance, considering the application's read/write patterns.

## Template

```
Design a database schema for the following system:

Application: {{application_description}}
Database: {{database_type}} (PostgreSQL / MySQL / MongoDB / etc.)
Expected scale: {{user_count}} users, {{data_volume}} records
Read/Write ratio: {{ratio}} (e.g., 80/20 read-heavy)
Key queries: {{most_common_queries}}

Provide:

1. ENTITY-RELATIONSHIP MODEL
- List all entities with their attributes
- Define relationships (1:1, 1:N, M:N)
- Identify primary keys and foreign keys
- Note nullable vs. required fields

2. TABLE DEFINITIONS (SQL DDL)
For each table:
```sql
CREATE TABLE {{table_name}} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    {{column_name}} {{type}} {{constraints}},
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

3. INDEXES
- Primary key indexes (automatic)
- Foreign key indexes
- Query-driven indexes (based on common queries)
- Composite indexes for multi-column filters
- Partial indexes for filtered queries
- Explain index strategy decisions

4. CONSTRAINTS
- NOT NULL constraints
- UNIQUE constraints
- CHECK constraints (value ranges, enums)
- Foreign key constraints (ON DELETE behavior)
- Default values

5. NORMALIZATION ASSESSMENT
- Current normal form achieved (1NF through BCNF)
- Intentional denormalization decisions with justification
- Trade-offs between normalization and query performance

6. MIGRATION STRATEGY
- Order of table creation (respect dependencies)
- Data migration for existing systems
- Rollback plan
- Zero-downtime migration considerations

7. PERFORMANCE CONSIDERATIONS
- Partitioning strategy (if applicable)
- Archiving strategy for old data
- Connection pooling recommendations
- Estimated storage requirements
```

## Examples

### SaaS Multi-Tenant Schema

```
Application: Project management SaaS (multi-tenant)
Database: PostgreSQL 16
Scale: 10,000 organizations, 500K users, 50M tasks

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    plan VARCHAR(50) NOT NULL DEFAULT 'free'
        CHECK (plan IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member'
        CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, email)
);

CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
```

## Tips

1. **Start with queries** — Design the schema based on how the data will be
   queried, not just how it will be stored.

2. **Use UUIDs for multi-tenant systems** — Sequential IDs leak information
   about tenant size and growth. UUIDs are opaque and merge-friendly.

3. **Always add timestamps** — `created_at` and `updated_at` on every table
   saves you from painful retroactive additions.

4. **Index foreign keys** — PostgreSQL does not auto-index foreign keys.
   Missing FK indexes cause slow JOINs and DELETE cascades.

5. **Plan for soft deletes** — Adding a `deleted_at` column is cheaper than
   implementing an audit log system later.

## Common Mistakes

1. **No indexes on foreign keys** — This causes full table scans on JOINs
   and can make CASCADE deletes extremely slow.

2. **Over-normalization** — 6th normal form with 50 tables for a simple app
   creates unnecessary JOIN complexity. Normalize sensibly.

3. **Missing constraints** — Without CHECK and NOT NULL constraints, invalid
   data enters the database silently. The schema should enforce business rules.

4. **Ignoring text search** — If users will search text fields, plan for
   full-text indexes or search infrastructure from the start.

5. **No migration plan** — Schema changes in production without a migration
   strategy causes downtime and data loss.
