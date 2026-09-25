# Contributing to SnakeSafe

This project is actively maintained by two people. This doc exists so we don't
step on each other's work — read it once, it's short.

## Team & Ownership

| Area | Owner | Covers |
|---|---|---|
| **Backend & AI** | **Mohammad Saad** | `backend/` (Spring Boot API, entities, auth, config), `ai-service/` (FastAPI), Docker/CI, architecture decisions |
| **Frontend & UX** | **Akil Siddiki** | `frontend/` (all React/TS pages, `EmergencyContext`, routing, styling), UX redesign, component tests, screenshots/demo assets |

**Shared, needs both:** anything that changes the contract between frontend and backend (API request/response shapes, new endpoints, the case data model) — talk before building, not after. The upcoming emergency-flow UX redesign is a shared item for exactly this reason: it changes both how the frontend sequences screens *and* how the backend's case status model works (dispatch-first, details-optional).

## Git Workflow

- `main` is always demo-ready — never push directly to it.
- One feature branch per task: `feature/short-description` or `fix/short-description`.
- Open a Pull Request even though it's just the two of us — the other person reviews and approves before merging. This is exactly how real teams work, and it's a genuinely good habit to already have for internship/job settings.
- Small, focused commits with clear messages beat one giant commit. Good: `fix: hospital selection race condition`. Not great: `updates`.
- If you touch the other person's area (e.g., Akil needs a new backend endpoint), open the PR but tag the owner for review rather than merging solo.

## Before You Start Any Task

1. Check the [Roadmap & Limitations](README.md#roadmap--limitations) section in the README — that's our live task list.
2. Claim it (a quick message to the other person is enough, no formal ticket system needed at this size).
3. Branch, build, PR, review, merge.

## Setup

See the [Getting Started](README.md#getting-started) section in the README — same steps for both of you.
