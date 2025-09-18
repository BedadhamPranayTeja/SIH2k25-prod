## SIH 2025 Platform – Implementation Plan

### Overview
Align the codebase with the system design in `devdocs/System-Level_Architecture.md`. Implement missing modules, enforce RBAC, add rounds, judging, storage, and admin analytics in phases.

### Current vs Target (Gap Summary)
- Registration: Team registration exists; missing edit flows, invites/activation.
- Problem Bank: Read-only list exists; missing admin CRUD, taxonomy, bulk import.
- Submissions: Model exists; missing file storage, per-round versions, windows.
- Judging: Models partially exist; missing criteria config, judge assignment, scoring UI.
- Leaderboard: API exists; missing full UI and filters (round/domain).
- Admin: Minimal page; missing dashboards and CRUD for problems/teams/rounds.
- Auth/RBAC: JWT works; edge-safe verification missing; route guards incomplete.
- Storage/Integrations: None; need cloud storage (files) and optional OAuth/Drive/GitHub.
- Events/Phases: Timer via env; missing multi-stage rounds and gating.
- Analytics: None; need participation and progress insights.

### Phase 1: RBAC and Admin Foundation
- Use `jose` in `src/middleware.ts` for Edge-safe JWT verification; restore role checks.
- Create `/admin` layout with nav (Problems, Teams, Mentors, Rounds, Settings).
- Admin Problems CRUD:
  - API: `GET/POST /api/admin/problems`, `PATCH/DELETE /api/admin/problems/[id]`.
  - UI: list, create, edit, delete; domain/theme management.
- Admin Teams (read-only): list + details (members, submissions, scores).

### Phase 2: Rounds and Submissions
- Add `Round` model (Idea, Prototype, Final) with open/close windows per round.
- Extend `Submission` with `round`, `files[] | link`, `version`, timestamps.
- Integrate cloud storage (S3-compatible) for file uploads; signed URLs.
- Team Submission UI per round; validate against round windows.

### Phase 3: Judging and Leaderboard
- `JudgingCriteria` model + Admin UI to define criteria and weights per round.
- Judge assignment model (judge→team, by round/domain).
- Scoring UI for mentors/admin with audit trail and comments.
- Leaderboard UI with filters (round, domain, team) and tie-breakers.

### Phase 4: Admin Dashboards and Analytics
- Admin KPIs: total teams, active submissions, mentors, per-round status.
- Analytics: participation by domain/institution, progress across rounds.
- Bulk import/export (problems, teams).

### Phase 5: Polishing and Integrations
- Optional SSO/OAuth (Google/Institutional), email notifications.
- Security: rate limits, input validation hardening, audit logs.
- DX: seed scripts per phase, fixtures, e2e smoke tests.

### Cross-Cutting Technical Notes
- Keep App Router; prefer server actions/APIs for mutations with validation via Zod.
- Re-enable middleware verification with `jose`; keep server-side verification as source of truth.
- File uploads: use presigned PUT to storage; store metadata only in DB.

### Milestone Checklist (high-level)
- [ ] Edge-safe JWT verify with `jose` + RBAC in middleware
- [ ] Admin Problems CRUD (API + UI)
- [ ] Admin Teams (read-only)
- [ ] Rounds model + round windows
- [ ] Submission v2 (rounds, versions, storage)
- [ ] Judge assignment + scoring UI
- [ ] Leaderboard UI with filters
- [ ] Admin dashboards + analytics
- [ ] Optional SSO + notifications

### References
- System design: `devdocs/System-Level_Architecture.md`
- Current models/APIs: `src/models/*`, `src/app/api/*`


