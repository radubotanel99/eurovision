# Claude Code Commands & Workflow Guide

## How This Whole System Works

### The Big Picture

There are **two layers** working together:

1. **`CLAUDE.md`** — the "brain" file. Claude reads this at the start of every conversation. It tells Claude what your project is, how it's structured, what commands to run, and what rules to follow. Think of it as the instruction manual for your specific project.

2. **Slash commands** (the `.claude/commands/*.md` files) — these are **preset prompts**. Instead of typing "hey Claude, review my code, check for security issues, performance problems, give me a structured output..." you just type `/project:review` and the whole detailed prompt runs automatically.

### How a Command Actually Works

Each `.md` file in `.claude/commands/` is a prompt template. When you type `/project:plan add user authentication`, here's what happens:

```
1. Claude finds .claude/commands/plan.md
2. It reads the prompt inside (the "You are a software architect..." text)
3. It replaces $ARGUMENTS with "add user authentication"
4. It executes that prompt as if you had typed the whole thing yourself
```

That's it. They're just saved prompts with a role, a process, rules, and an output format. No magic.

---

## Every Command Explained

### Setup & Planning

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `/project:init` | Scans your project and auto-fills `CLAUDE.md` | **Once**, when you start a new project. It detects your tech stack, folder structure, commands, and conventions so you don't have to type them manually. |
| `/project:plan [feature]` | Creates a step-by-step plan with file paths and tasks | Before building anything non-trivial. It researches your codebase first, then gives you numbered steps. It does NOT write code — only plans. |

### Building

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `/project:scaffold [thing]` | Generates new files (components, services, etc.) | When you need a new file. It reads 2-3 existing files of the same type first, then copies their patterns exactly. No guessing. |
| `/project:refactor [what]` | Restructures code without changing behavior | When code works but is messy. It finds all callers, updates all imports, runs tests after. |
| `/project:migrate [what]` | Handles DB migrations, dependency upgrades, API changes | When upgrading a package, changing a DB schema, or versioning an API. Always creates a rollback plan. |

### Quality

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `/project:test [scope]` | Runs tests and analyzes failures | After any code change. No args = full suite. Give it a file path = run that test. It reads the failing test + source code and explains why it failed. |
| `/project:review` | Code review with structured checklist | Before committing. Checks correctness, security, performance, maintainability. Gives verdict: APPROVE / REQUEST_CHANGES. |
| `/project:security [scope]` | Full security audit (OWASP Top 10) | Before shipping. Checks for SQL injection, XSS, hardcoded credentials, auth gaps, everything. Rates severity: critical/high/medium/low. |
| `/project:cleanup [scope]` | Finds dead code, unused deps, unnecessary complexity | When your project feels bloated. It greps for usages before declaring anything dead, so it won't delete things that are still used. |
| `/project:optimize [what]` | Finds and fixes performance bottlenecks | When something is slow. It profiles, ranks optimizations by impact, and applies them one at a time. |

### Understanding

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `/project:explain [thing]` | Explains code in plain language | When you don't understand a function, module, or feature. It reads the code first, then walks you through it with ASCII diagrams if needed. |
| `/project:doc [thing]` | Generates documentation | When you need API docs, module docs, or usage guides. Writes for the right audience (consumers vs. contributors vs. users). |
| `/project:debug [bug]` | Systematic bug investigation | When something's broken. Forms hypotheses, investigates each one, finds root cause, writes a test that catches the bug, then fixes it. |

### Workflow

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `/project:pr` | Creates a GitHub pull request | When you're ready to submit. Reads ALL commits (not just the latest), writes a structured PR description, pushes, and creates it via `gh`. |
| `/project:checkpoint` | Saves progress snapshot | When your conversation is getting long or you're about to stop working. Creates "resume instructions" so a future session can pick up exactly where you left off. |
| `/project:context [action]` | Manages token/memory usage | When you want to work efficiently. Sub-commands: `map` (overview without reading everything), `focus [feature]` (minimum file set), `status` (how much context you've used). |

---

## Normal Project Workflow

### Day 1: Project Setup

```
/project:init
```

This fills in CLAUDE.md. Review it, fix anything it got wrong. This file is the single most important thing for performance — the better it is, the less Claude needs to explore your codebase every conversation.

### Starting a Feature

```
/project:plan add Stripe payment integration
```

Claude explores your codebase, identifies which files to touch, and creates a numbered plan with tasks. You review it, tell Claude if anything's wrong.

```
/project:scaffold payment-service
```

Claude looks at your existing services, copies their patterns, and generates the new files.

Then you (or Claude) implement the actual logic. For complex features, use the **implementer agent** which works in an isolated copy of your repo.

### During Development

```
/project:test src/services/payment-service.test.ts
```

Run specific tests as you go.

```
/project:explain src/lib/stripe-client.ts
```

If you hit unfamiliar code, ask Claude to explain it.

```
/project:debug "payments failing for amounts over $999"
```

If something breaks, Claude systematically traces the bug.

### Before Committing

```
/project:review
```

Claude reviews all uncommitted changes. Fix anything flagged.

```
/project:security
```

Security check. Fix anything critical or high.

```
/project:test
```

Full test suite one more time.

### Submitting

```
/project:pr
```

Creates the pull request with a proper description.

---

## Performance, Memory, and Token Optimization

This is where most people waste money and hit context limits. Here's how to avoid that.

### 1. Keep CLAUDE.md Accurate

This is loaded into every conversation. If it's accurate, Claude doesn't need to explore your codebase to figure out basic things like "where are the tests?" or "how do I run the build?" That alone saves hundreds of thousands of tokens over time.

### 2. Use `/project:context` Before Big Tasks

```
/project:context focus payments        # gives Claude just the files needed
/project:context map src/services      # lightweight overview without reading everything
```

This prevents Claude from reading 50 files when it only needs 5.

### 3. Use the Right Agent for the Job

Agents are sub-processes. They do work in their own context and only send back the result. This keeps your main conversation clean.

**Cheap agents (use Sonnet, fast and cheap):**

- `researcher` — broad exploration ("how does auth work in this project?")
- `fixer` — small bugs, under 20 lines changed
- `test-runner` — run tests in the background

**Thorough agents (use Opus, more expensive but smarter):**

- `implementer` — builds features in an isolated worktree
- `reviewer` — deep code review
- `architect` — system design decisions
- `security-auditor` — vulnerability scanning

**Key insight:** If you ask Claude "how does the auth system work?" directly, it reads all those files into the main context. If you have it spawn a `researcher` agent, it reads those files in its own context, summarizes the answer, and sends it back. The conversation stays lightweight.

### 4. Use `/project:checkpoint` Before Context Gets Full

Long conversations eat tokens. When you've been working for a while:

```
/project:checkpoint
```

This creates a snapshot. You can start a fresh conversation and Claude will pick up where it left off, with a clean context window.

### 5. Specific Over Broad

Bad: "review the whole project"
Good: "review src/services/payment-service.ts"

Bad: "explain the codebase"
Good: "explain how src/lib/auth-middleware.ts handles JWT validation"

The more specific you are, the fewer files Claude reads, the fewer tokens you burn.

### 6. Don't Chain Everything in One Conversation

Instead of doing plan -> scaffold -> implement -> test -> review -> PR all in one conversation, consider splitting at natural breakpoints. Each new conversation starts with a fresh context window.

---

## Full Example: Building a Feature in a Real Project

This walkthrough shows how all the commands and agents fit together for a bigger task — adding a **Stripe payment system** to an existing e-commerce app. It's split across multiple conversations to keep context clean.

---

### Conversation 1: Planning

**You:** `/project:plan add Stripe payment integration with subscriptions, one-time purchases, webhook handling, and a billing dashboard page`

**What happens:**
- Claude uses the `Explore` agent to scan your codebase
- It identifies existing patterns (how your other services work, where routes live, how you handle auth)
- It produces a numbered plan like:

```
Step 1: Create Stripe client config          — src/lib/stripe.ts (low)
Step 2: Create payment types                 — src/types/payment.ts (low)
Step 3: Create payment service               — src/services/payment-service.ts (high)
Step 4: Create subscription service          — src/services/subscription-service.ts (high)
Step 5: Create webhook handler               — src/app/api/webhooks/stripe/route.ts (medium)
Step 6: Create billing API routes            — src/app/api/billing/* (medium)
Step 7: Create billing dashboard page        — src/app/billing/page.tsx (medium)
Step 8: Create billing components            — src/components/billing/* (medium)
Step 9: Add database migration for payments  — src/db/migrations/* (medium)
Step 10: Write tests                         — tests/ (medium)
```

- It creates tasks so progress is tracked
- You review the plan, ask questions, adjust if needed

**You:** `/project:checkpoint`

Saves the plan state. End this conversation.

---

### Conversation 2: Database & Core Services

Start fresh. Claude reads CLAUDE.md and knows the project. You tell it to continue from the plan.

**You:** `/project:migrate add payments and subscriptions tables`

**What happens:**
- Claude reads your existing schema (Prisma, SQL, whatever you use)
- Creates the migration with proper column types, indexes, foreign keys
- Generates a rollback plan
- Runs the migration

**You:** `/project:scaffold payment-service`

**What happens:**
- Claude finds your existing services (e.g., `auth-service.ts`, `order-service.ts`)
- Reads them to learn your patterns
- Generates `payment-service.ts` with the same structure but empty methods

**You:** "Now implement the payment service — handle one-time charges and refunds using Stripe"

**What happens:**
- Claude writes the actual logic, following the patterns from your other services
- Uses the types from your plan
- Handles errors the same way your other services do

**You:** `/project:test src/services/payment-service.test.ts`

Tests the new service. If anything fails, Claude reads the test + source, explains why, and suggests a fix.

**You:** `/project:checkpoint`

Saves progress. End conversation.

---

### Conversation 3: Webhook & API Routes

**You:** "Implement the Stripe webhook handler at src/app/api/webhooks/stripe/route.ts — it needs to handle checkout.session.completed, invoice.payment_succeeded, and customer.subscription.deleted"

Claude implements it.

**You:** `/project:scaffold billing API routes`

Creates the route files matching your existing API route patterns.

**You:** "Implement the billing routes — GET /api/billing/history, POST /api/billing/subscribe, POST /api/billing/cancel"

Claude writes the route logic.

**You:** `/project:security src/app/api`

**What happens:**
- Claude audits all your API routes
- Checks for missing auth, input validation, webhook signature verification
- Flags anything like: "`src/app/api/webhooks/stripe/route.ts:12` — webhook signature not verified, an attacker could forge events"
- You fix the issues

**You:** `/project:test`

Full test suite to make sure nothing's broken.

**You:** `/project:checkpoint`

---

### Conversation 4: Frontend & Polish

**You:** `/project:scaffold BillingDashboard component`

Creates the component file matching your existing component patterns.

**You:** "Implement the billing dashboard — show current plan, payment history, and upgrade/downgrade buttons"

Claude builds the UI.

**You:** `/project:explain src/components/billing/BillingDashboard.tsx`

If you want to understand what Claude built, it walks you through the component.

**You:** `/project:optimize src/app/billing/page.tsx`

Claude checks for performance issues — unnecessary re-renders, missing loading states, large payload fetches that could be paginated.

**You:** `/project:cleanup src/services`

Checks if any dead code crept in across all the services during this feature build.

---

### Conversation 5: Final Review & Ship

**You:** `/project:test`

Full suite. Everything green.

**You:** `/project:review`

**What happens:**
- Claude reads every uncommitted file
- Checks correctness, security, performance, maintainability
- Gives structured output:

```
Verdict: REQUEST_CHANGES
Risk Level: medium

Critical Issues:
- src/services/payment-service.ts:45 — Stripe API key read from 
  process.env without fallback, will crash silently in test env

Suggestions:
- src/components/billing/PlanCard.tsx:23 — price formatting should 
  use Intl.NumberFormat for locale support

What's Good:
- Webhook handler properly verifies signatures
- Good error boundaries on the billing page
- Service patterns consistent with existing codebase
```

You fix the critical issues.

**You:** `/project:security`

Final security pass. Everything clean.

**You:** `/project:pr`

**What happens:**
- Claude reads ALL commits on this branch
- Groups changes logically (not by commit)
- Creates a PR with structured description, test plan, and breaking changes section
- Pushes and creates the PR via `gh`

Done.

---

### Why This Worked Well

| What we did | Why it matters |
|---|---|
| Split across 5 conversations | Each one had a clean context window, no token waste |
| Used `/project:plan` first | No wasted implementation — we knew exactly what to build |
| Used `/project:checkpoint` between sessions | Nothing lost between conversations |
| Used `/project:scaffold` before implementing | New files matched existing patterns automatically |
| Used `/project:security` on the API routes | Caught the unsigned webhook issue before shipping |
| Used `/project:review` at the end | Caught the env var issue that would have crashed in tests |
| Used `/project:test` often | Caught regressions early instead of debugging a pile at the end |

### When to Use Agents Instead

In the example above, everything was done directly. But for a **bigger team or more complex project**, you'd use agents:

```
# Use researcher agent to understand how existing payments work
# before planning (keeps exploration out of main context)
"Use the researcher agent to find how we currently handle orders and invoicing"

# Use implementer agent for risky changes (works in isolated worktree)
"Use the implementer agent to build the webhook handler"

# Use test-runner agent in background while you keep working
"Run the full test suite in background"

# Use security-auditor agent for deep audit
"Run the security-auditor agent on src/app/api"
```

Agents shine when you want **parallel work** or want to **keep the main conversation focused** on decisions rather than exploration.

---

## Golden Rules

1. **`/project:init` once, keep CLAUDE.md updated** — saves tokens every conversation
2. **Plan before you build** — `/project:plan` prevents wasted implementation effort
3. **Test and review before you commit** — `/project:test` then `/project:review`
4. **Use agents for exploration** — keeps your main context clean
5. **Use `/project:checkpoint`** — when conversations get long
6. **Be specific** — name files, name functions, name the problem
7. **Use `/project:context focus`** — before big tasks to load only what's needed
