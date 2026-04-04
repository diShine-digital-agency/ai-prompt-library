---
title: Code Review Prompt
category: development
tags: [code-review, security, best-practices, quality, bugs]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Code Review Prompt

A structured prompt for thorough code reviews covering correctness, security,
performance, maintainability, and adherence to best practices.

## When to Use

- Pre-merge pull request reviews
- Security audits of critical code paths
- Onboarding reviews to teach team standards
- Legacy code assessment before refactoring
- Performance-critical code validation

## The Technique

Systematic code review requires examining code through multiple lenses, each
targeting different types of issues.

## Template

```
Review the following code thoroughly. Analyze it through these lenses:

Language: {{language}}
Context: {{what_the_code_does}}
Standards: {{coding_standards_or_style_guide}}

1. CORRECTNESS
- Does the code do what it claims to do?
- Are edge cases handled (null, empty, boundary values)?
- Is error handling comprehensive and appropriate?
- Are there off-by-one errors or race conditions?

2. SECURITY
- Input validation and sanitization
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization checks
- Sensitive data exposure (logs, error messages, responses)
- Dependency vulnerabilities (known CVEs)

3. PERFORMANCE
- Algorithmic complexity (time and space)
- Database query efficiency (N+1, missing indexes)
- Memory leaks or unnecessary allocations
- Caching opportunities
- Unnecessary computation in hot paths

4. MAINTAINABILITY
- Code readability and clarity
- Function and variable naming
- Appropriate abstraction level (not too abstract, not too concrete)
- Test coverage and testability
- Documentation completeness

5. STYLE AND CONVENTIONS
- Adherence to team/language style guide
- Consistent formatting
- Import organization
- Comment quality (why, not what)

For each issue found:
- Severity: CRITICAL / WARNING / SUGGESTION / PRAISE
- Location: File and line reference
- Problem: What is wrong
- Impact: Why it matters
- Fix: Specific code change to resolve it

End with:
- Overall assessment (approve / request changes / needs discussion)
- Summary of critical issues
- Positive observations (what was done well)

Code to review:
{{code}}
```

## Examples

### Python API Endpoint Review

```
Context: User registration endpoint in a Flask application
Language: Python 3.11

Code:
def register_user(request):
    email = request.json['email']
    password = request.json['password']
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return {"id": user.id}, 201

Review findings:

CRITICAL — No password hashing
Location: Line 4
Problem: Password stored in plaintext
Impact: Database breach exposes all user passwords
Fix: Use bcrypt: password=bcrypt.hashpw(password.encode(), bcrypt.gensalt())

CRITICAL — No input validation
Location: Lines 2-3
Problem: No validation on email format or password strength
Fix: Add email regex validation and password policy checks

WARNING — No error handling
Location: Lines 2-3
Problem: KeyError if email or password missing from request
Fix: Use request.json.get() with validation, return 400 for missing fields

WARNING — No duplicate check
Location: Line 4
Problem: IntegrityError if email already exists
Fix: Check for existing user before insert, return 409 Conflict
```

## Tips

1. **Provide full context** — Include the file path, surrounding code, and
   what the code is supposed to do. Isolated snippets miss architectural issues.

2. **Specify the severity system** — Without severity levels, every issue
   feels equally important, making reviews less actionable.

3. **Include positive feedback** — Noting what is done well encourages good
   practices and makes feedback more constructive.

4. **Limit scope per review** — Reviewing 500+ lines at once reduces quality.
   Break large changes into focused reviews.

5. **Ask for alternative approaches** — "Is there a better way to do this?"
   often surfaces design improvements beyond bug fixes.

## Common Mistakes

1. **Style-only reviews** — Focusing only on formatting while missing security
   issues provides false confidence in code quality.

2. **No severity classification** — Without priorities, developers don't know
   which feedback to address first.

3. **Missing the fix** — "This is wrong" without "here's how to fix it" is
   frustrating and less educational.

4. **Ignoring the happy path** — Testing only edge cases without verifying the
   main flow works correctly misses fundamental bugs.

5. **No architectural assessment** — Line-level review without considering the
   overall design misses structural problems.
