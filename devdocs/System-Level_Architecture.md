⚙️ **System-Level Architecture (from `sih_hackathon_platform.ts`)**

1. **Core Entities**

   - `Hackathon` → holds event metadata (title, theme, dates).
   - `ProblemStatement` → challenge definitions, domain tags.
   - `Team` → participants, mentors, institution info.
   - `Submission` → project uploads, descriptions, GitHub links.
   - `JudgingCriteria` → evaluation parameters, weights, scoring functions.

2. **Core Modules**

   - **Registration Module**
     Handles team registration, linking students, mentors, and institution.
   - **Problem Bank Module**
     Stores problem statements by domain, allows organizers to manage them.
   - **Submission Module**
     Teams upload solutions (files, links, descriptions).
   - **Judging Module**
     Judges assign scores based on criteria → aggregated results.
   - **Leaderboard Module**
     Displays real-time rankings by score, domain, or round.
   - **Admin Module**
     CRUD for hackathon setup, teams, mentors, problem statements.

3. **Data Flow**

   - Organizer sets up **Hackathon** → adds **Problems**.
   - Teams **Register** → get mapped to problems.
   - Teams **Submit** solutions → stored in DB.
   - Judges **Score** submissions → system aggregates into leaderboard.

4. **Integration Points**

   - **Auth** (Google OAuth / Institutional SSO).
   - **Storage** (cloud for submission files).
   - **External APIs** (GitHub, Google Drive for project links).

5. **Frontend Viewpoints**

   - **Team Dashboard** (registration, submissions, status).
   - **Judge Dashboard** (assigned teams, scoring forms).
   - **Admin Dashboard** (hackathon config, team management, leaderboard).

---

🚀 **Extension Points for SIH 2025**

- Multi-stage rounds (Idea → Prototype → Final).
- AI-powered judging assist (plagiarism, code quality analysis).
- Real-time team collaboration (chat, notifications).
- Analytics dashboard (domain participation, institution stats).
- Flexible scoring rubrics (customizable by round/domain).
