---
title: Graduation report DOCX (60–100 pp) + rename faculty→professor
---
# Graduation Report DOCX (60–100 pp) + Rename faculty→professor

## What & Why
Two deliverables in one task:

1. **Rename `faculty` → `professor`** throughout the entire frontend codebase (TypeScript/React). Every occurrence of `faculty`/`Faculty` — in route paths, directory names, component names, imports, i18n keys, localStorage keys, type literals, and displayed UI text — must be replaced with `professor`/`Professor`.

2. **Generate a complete NEU Computer Engineering graduation project report** as a downloadable `.docx` file (≥ 60 pages, target 80–100, A4 portrait) following NEU formatting guidelines exactly, using the `docx` npm library (v9.6.1, Node.js CJS script at `scripts/generate-report.cjs`). The writing must read as natural, human academic prose — not mechanical or AI-sounding. Tables are kept to a minimum (max 4 in the entire document); everything else is written in flowing paragraphs.

**Student details:**
- Student: Fatumo Mukhtar | ID: 20225507
- Department: Computer Engineering, Near East University
- Course: COM491 | Spring 2025–2026
- Backend stack: Python FastAPI, PostgreSQL, SQLAlchemy, JWT
- Frontend stack: React, TypeScript, Vite, Tailwind CSS

## Done looks like

### Rename
- All occurrences of `faculty`/`Faculty` in `artifacts/neu-attendai/src/` replaced with `professor`/`Professor`
- Directory `src/pages/faculty/` renamed to `src/pages/professor/`
- Route paths updated: `/faculty` → `/professor`, `/faculty/sessions` → `/professor/sessions`, `/faculty/students` → `/professor/students`
- All i18n keys `"faculty.*"` renamed to `"professor.*"`; all displayed strings say "Professor" (not "Faculty")
- localStorage key renamed: `neu_faculty_courses` → `neu_professor_courses`
- App still runs correctly after rename (no broken imports, no TypeScript errors)

### Report
- `artifacts/neu-attendai/public/NEU_AttendAI_Graduation_Report.docx` is regenerated, ≥ 60 pages
- Opens cleanly in Microsoft Word and Google Docs
- All body text: Times New Roman 12pt, justified, 1.5 line spacing
- Page margins: Left 3.5 cm, Top/Right/Bottom 2.5 cm
- Page numbers: bottom-center
- Heading styles: Chapter titles 14pt bold uppercase centered; section headings 14pt bold; subsection headings 12pt bold
- Written in natural, flowing academic English — reads as if a human wrote it; varied sentence structure, no repeated phrases, no mechanical lists
- **Maximum 4 tables** in the entire document; all requirements, database design, test cases, and tech stack described in prose paragraphs, not tables
- Every figure caption appears **below** the figure; every table caption appears **above** the table; each is referenced in the text before it appears
- Uses "Professor Portal" exclusively — never "Faculty Portal"
- Includes HOTP token Python code example and Haversine Python code example as formatted monospace code blocks
- Covers: GPS spoofing detection, JWT auth, bcrypt hashing, HTTPS, role-based access, replay attack prevention, geo-fencing logic
- IEEE-style citations [1], [2], … inline; ≥ 15 references in the References section
- The 5 new screenshots (from `attached_assets/`) are copied to `artifacts/neu-attendai/public/report-imgs-new/` and embedded at the correct positions in Chapter 6

### Figures placed correctly in Chapter 6
- **Figure 6.1** — `IMG_0922_...jpeg` (Login page) → §6.1 (System Entry & Authentication)
- **Figure 6.2** — `IMG_0920_...jpeg` (Admin timetable import page) → §6.2 (Admin Portal)
- **Figure 6.3** — `IMG_0916_...jpeg` (Live QR code + location map) → §6.3 (Professor Portal – Live Session)
- **Figure 6.4** — `IMG_0917_...jpeg` (Live Student Roster) → §6.3 (Professor Portal – Live Roster)
- **Figure 6.5** — `IMG_0921_...jpeg` (Student Add Course dialog) → §6.4 (Student Portal)

Each figure has a two-sentence descriptive caption directly below it.

### Document structure (in order)
1. Cover Page — dark-blue/navy background, white text: NEU logo area, department, project title, student name & ID, academic year
2. Title Page — white background, full project info, supervisor line, submission date
3. Acknowledgment — ≥ 1 full page, warm and personal academic tone
4. Abstract — ≥ 300 words, formal; 5–7 keywords listed below
5. Table of Contents — all chapters and sections with page numbers
6. List of Abbreviations — single simple table (abbreviation | definition) — counts as 1 of 4 allowed tables
7. List of Figures
8. List of Tables
9. Chapter 1 – Introduction (4–5 pages): motivation, problem statement, objectives, scope, report organisation — all prose
10. Chapter 2 – Literature Review (6–8 pages): critical survey of ≥ 8 related works; comparative discussion in prose; identification of gaps
11. Chapter 3 – System Requirements Analysis (5–6 pages): stakeholder analysis, functional requirements (prose narrative, not bullet list), non-functional requirements, use-case descriptions — all in paragraphs
12. Chapter 4 – System Architecture & Design (6–8 pages): high-level architecture description, component interactions, database schema described in prose (with one schema overview table — counts as 2 of 4), API design overview
13. Chapter 5 – Security & Safety Measures (6–8 pages): threat model in prose, HOTP token design (with Python code block), Haversine geo-fencing (with Python code block), GPS spoofing detection, Impossible Travel Detection algorithm, JWT auth + bcrypt hashing, HTTPS + CORS + CSP, role-based access control, replay attack prevention, 3–4 attack scenario walk-throughs described as narratives
14. Chapter 6 – Implementation (8–10 pages): system entry/auth, admin portal, professor portal (live session + roster with Figures 6.1–6.5 embedded at correct positions), student portal, real-time updates
15. Chapter 7 – Testing & Evaluation (5–6 pages): test plan narrative, unit testing approach, integration testing, system-level testing, performance results — all prose; one test results summary table (counts as 3 of 4 allowed tables)
16. Chapter 8 – Conclusions & Future Work (3–4 pages): summary of contributions, reflection, Phase 2 roadmap (offline mode, biometric integration, LMS export, analytics dashboard)
17. References — ≥ 15 IEEE-format citations
18. Appendix A – Project Structure
19. Appendix B – Excel Timetable Format (column definitions described in prose + one small table — counts as 4 of 4)
20. Appendix C – Classroom Coordinates (described as prose with example values inline)

## Out of scope
- Changing Python backend files
- Modifying `report.html`
- Adding any screenshots beyond the 5 provided

## Steps

1. **Copy new screenshots** — Copy the 5 images from `attached_assets/` to `artifacts/neu-attendai/public/report-imgs-new/` with short stable filenames: `login.jpeg`, `admin-timetable.jpeg`, `qr-session.jpeg`, `live-roster.jpeg`, `student-add-course.jpeg`.

2. **Rename the faculty pages directory** — Rename `src/pages/faculty/` to `src/pages/professor/`. Update all three files inside (`dashboard.tsx`, `sessions.tsx`, `students.tsx`) fixing internal references.

3. **Update App.tsx** — Change all import paths from `@/pages/faculty/...` to `@/pages/professor/...`. Update route paths.

4. **Update layout.tsx** — Rename `"faculty"` type literal and object key to `"professor"`. Update all `href` values and display labels.

5. **Update login.tsx** — Rename `"faculty"` role type and display label. Update default role state.

6. **Update i18n.ts** — Rename all `"faculty.*"` keys to `"professor.*"`. Update all string values saying "Faculty" → "Professor".

7. **Update store.ts** — Rename `KEYS.faculty` localStorage key and all exported functions. Update call sites in page components.

8. **Fix remaining src/ occurrences** — Search for any remaining `faculty`/`Faculty` in `src/` and fix them (including `session-token.ts`, `not-found.tsx`).

9. **Rewrite `scripts/generate-report.cjs`** — Replace the entire script. Use `docx` v9.6.1, CJS format, output path `artifacts/neu-attendai/public/NEU_AttendAI_Graduation_Report.docx`. Apply exact NEU formatting (A4, margins, Times New Roman, 1.5 spacing, justified, page numbers). The writing must feel natural and human — use varied vocabulary, proper academic transitions ("This chapter examines…", "Of particular significance is…", "It is worth noting that…"), avoid repeating the same sentence structures. Max 4 tables total. All 20 document sections listed above.

10. **Embed the 5 screenshots** in Chapter 6 at the correct positions (Figure 6.1–6.5) with descriptive two-sentence captions below each. Use the images from `artifacts/neu-attendai/public/report-imgs-new/`.

11. **Write all chapters as flowing prose** — Each paragraph should be 5–8 sentences with natural transitions. Avoid starting consecutive paragraphs the same way. Avoid bullet lists except in the List of Abbreviations and Appendix B table.

12. **Add Python code examples** — HOTP token generation and Haversine formula, formatted as monospace code blocks using the `docx` library's code paragraph style.

13. **Run the script and verify** — Execute `cd scripts && node generate-report.cjs`. Confirm: (a) no errors, (b) file exists at the correct path, (c) file size > 5 MB.

## Relevant files
- `artifacts/neu-attendai/src/App.tsx`
- `artifacts/neu-attendai/src/components/layout.tsx`
- `artifacts/neu-attendai/src/pages/login.tsx`
- `artifacts/neu-attendai/src/pages/not-found.tsx`
- `artifacts/neu-attendai/src/lib/i18n.ts`
- `artifacts/neu-attendai/src/lib/store.ts`
- `artifacts/neu-attendai/src/lib/session-token.ts`
- `artifacts/neu-attendai/src/pages/faculty/dashboard.tsx`
- `artifacts/neu-attendai/src/pages/faculty/sessions.tsx`
- `artifacts/neu-attendai/src/pages/faculty/students.tsx`
- `scripts/generate-report.cjs`
- `attached_assets/IMG_0922_1779339867571.jpeg` (login screen)
- `attached_assets/IMG_0920_1779339867571.jpeg` (admin timetable)
- `attached_assets/IMG_0916_1779339867571.jpeg` (QR + location map)
- `attached_assets/IMG_0917_1779339867571.jpeg` (live student roster)
- `attached_assets/IMG_0921_1779339867571.jpeg` (student add course)