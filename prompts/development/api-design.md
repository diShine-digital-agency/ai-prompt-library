---
title: API Design Prompt
category: development
tags: [api, rest, graphql, design, endpoints]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# API Design Prompt

Design RESTful or GraphQL APIs with proper resource modeling, error handling,
authentication, versioning, and documentation.

## When to Use

- Designing new API endpoints or entire APIs
- Refactoring existing API structures
- Creating API specification documents (OpenAPI/Swagger)
- Evaluating API design for consistency
- Planning API versioning strategies

## The Technique

Good API design follows predictable patterns, uses proper HTTP semantics,
handles errors gracefully, and considers the developer experience.

## Template

```
Design an API for the following system:

System: {{system_description}}
Architecture: {{rest_or_graphql}}
Authentication: {{auth_method}} (JWT / OAuth 2.0 / API Key)
Target consumers: {{who_uses_this_api}}

Provide:

1. RESOURCE MODEL
- List all resources (nouns, not verbs)
- Define relationships between resources
- Identify sub-resources vs. top-level resources

2. ENDPOINT DESIGN
For each resource:

| Method | Path | Description | Auth | Request Body | Response |
|--------|------|-------------|------|-------------|----------|
| GET | /{{resource}} | List all | Required | - | 200: array |
| GET | /{{resource}}/:id | Get one | Required | - | 200: object |
| POST | /{{resource}} | Create | Required | {{schema}} | 201: object |
| PUT | /{{resource}}/:id | Update | Required | {{schema}} | 200: object |
| DELETE | /{{resource}}/:id | Delete | Required | - | 204: empty |

3. REQUEST/RESPONSE SCHEMAS
For each resource, define:
- Request body schema (with field types, required/optional, validation)
- Response schema (with field types and descriptions)
- List response (pagination format)

4. ERROR HANDLING
Standard error response format:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": []
  }
}
```
Error codes for each endpoint.

5. PAGINATION, FILTERING, SORTING
- Pagination: cursor-based or offset-based
- Filtering: query parameter conventions
- Sorting: field and direction specification
- Example: GET /users?sort=-created_at&filter[role]=admin&limit=20&cursor=abc123

6. VERSIONING STRATEGY
- URL-based (/v1/), header-based, or query parameter
- Breaking change policy
- Deprecation timeline

7. RATE LIMITING
- Limits per authentication tier
- Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining)
- 429 response format

8. OPENAPI SPECIFICATION
Provide the OpenAPI 3.0 YAML for the core endpoints.
```

## Examples

### E-Commerce API Design

```
System: Order management for an e-commerce platform
Resources: users, products, orders, order_items, payments

Endpoint example:

POST /v1/orders
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

Request:
{
  "items": [
    {"product_id": "prod_123", "quantity": 2},
    {"product_id": "prod_456", "quantity": 1}
  ],
  "shipping_address_id": "addr_789",
  "payment_method_id": "pm_012"
}

Response (201):
{
  "id": "order_abc",
  "status": "pending",
  "items": [...],
  "subtotal": 15900,
  "tax": 1272,
  "total": 17172,
  "currency": "USD",
  "created_at": "2026-04-04T10:30:00Z"
}
```

## Tips

1. **Use nouns for resources** — `/users` not `/getUsers`. HTTP methods
   already convey the action.

2. **Consistent naming** — Pick snake_case or camelCase and use it everywhere.
   Never mix conventions within the same API.

3. **Use proper HTTP status codes** — 200 for success, 201 for creation,
   204 for deletion, 400 for validation, 401 for auth, 404 for not found.

4. **Design for the consumer** — Think about what the API client needs,
   not what your database looks like.

5. **Version from day one** — Adding versioning later is painful. Start with
   /v1/ even if you do not plan v2 soon.

## Common Mistakes

1. **Verbs in URLs** — `/api/createUser` violates REST conventions.
   Use `POST /api/users` instead.

2. **Inconsistent error formats** — Different endpoints returning errors
   in different formats makes client-side handling difficult.

3. **No pagination** — List endpoints without pagination will break at scale.
   Add pagination from the first version.

4. **Exposing internal IDs** — Sequential integer IDs leak information.
   Use UUIDs or prefixed IDs (user_abc123).

5. **Missing rate limiting** — APIs without rate limits are vulnerable to
   abuse and can cause cascading failures.
