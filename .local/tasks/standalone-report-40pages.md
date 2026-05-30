# Standalone 40-Page Graduation Report (.docx)

## What & Why
Regenerate the NEU AttendAI graduation project report as a fully standalone Word document (.docx) that can be handed to a supervisor or printed without ever opening the web app. The existing script at `scripts/generate-report.cjs` produced a working file but it has three problems the user wants fixed: (1) it reads mechanically, like templated AI output, so every paragraph needs to be rewritten in natural academic prose; (2) there are too many tables — most should be replaced with flowing paragraphs; (3) there is no dedicated security chapter, which is a core part of the project.

The new report must follow the BDF Graduation Project Structure precisely (Cover Page with dark-blue/navy background → Title Page → Acknowledgment → Abstract → Table of Contents → List of Abbreviations → Chapters → Conclusions → References → Appendices) and must reach at least 40 pages in A4 format.

## Done looks like
- `artifacts/neu-attendai/public/NEU_AttendAI_Graduation_Report.docx` is regenerated and ≥ 40 pages
- The document opens cleanly in Microsoft Word and Google Docs
- Writing reads as natural academic English — no mechanical repetition, no bullet-heavy sections except where truly appropriate
- Tables are kept only where comparison data is intrinsically tabular (max 3–4 tables total in the entire document)
- A complete new Chapter 6 on Security Architecture covers: threat model, HOTP token design, GPS spoofing detection, Impossible Travel Detection, CSRF/XSS protections, HTTPS + session management, and attack scenario walk-throughs
- At least 7 chapters of substantial body text (Introduction, Literature Review, Requirements, Architecture & Design, Implementation, Security, Testing & Evaluation)
- 5 project screenshots embedded at correct positions in the Implementation chapter with figure captions
- BDF front matter complete: navy cover page, title page, acknowledgment (≥ 1 page), abstract (≥ 250 words with Keywords), full TOC with page numbers, list of abbreviations
- References section has ≥ 15 IEEE-format citations
- The login page download links (`/NEU_AttendAI_Graduation_Report.docx`) still work

## Out of scope
- Changing anything in the React application itself
- Adding new images — use the 5 existing screenshots in `artifacts/neu-attendai/public/report-imgs/`
- HTML report (`report.html`) — only the .docx is being updated

## Steps
1. **Rewrite the generator script** — Replace `scripts/generate-report.cjs` entirely. Keep the same output path and docx library usage (docx v9.6.1, Node.js CJS). Redesign the content so that every section is written in flowing prose paragraphs (5–8 sentences each). Replace all current table-heavy sections (technology stack, requirements list, test cases, comparative analysis) with descriptive paragraphs instead. Keep only the abbreviations table, the database schema overview table, and the comparative analysis table — remove all others.

2. **Write Chapter 6: Security Architecture** — This is a new full chapter (target: 6–8 pages). Sections: 6.1 Threat Modelling and Attack Surface; 6.2 Session Token Security (HOTP design, window size rationale, replay prevention); 6.3 GPS Verification and Anti-Spoofing; 6.4 Impossible Travel Detection; 6.5 Transport and Application Layer Security (HTTPS, CORS, CSP, XSS, CSRF); 6.6 Data Privacy and Minimal Collection Principle; 6.7 Attack Scenario Walk-Throughs (proxy attendance via token sharing, GPS spoofing, man-in-the-middle, brute-force token). Each section must be written entirely in prose.

3. **Expand all other chapters to fill 40 pages** — Each of the 7 main chapters should be roughly 4–6 pages. Expand Literature Review with deeper critical discussion of each paper. Expand Requirements with full stakeholder narrative. Expand Architecture with prose description of data-flow and module interactions. Expand Implementation by narrating each feature in detail around the screenshots. Expand Conclusions with a thorough reflection paragraph and a detailed Phase 2 roadmap.

4. **Embed screenshots in correct chapter positions** — Figure 5.1 (login) in §5.2; Figure 5.2 (admin-courses) in §5.3; Figure 5.3 (QR code) in §5.4; Figure 5.4 (live-roster) in §5.4; Figure 5.5 (student-add) in §5.5. Each figure must have a descriptive two-sentence caption.

5. **Run the script and verify output** — Execute `cd scripts && node generate-report.cjs` and confirm: (a) no errors, (b) file size > 3 MB (proxy for 40+ pages with images), (c) file saved at the correct path.

## Relevant files
- `scripts/generate-report.cjs`
- `artifacts/neu-attendai/public/report-imgs/login.jpeg`
- `artifacts/neu-attendai/public/report-imgs/admin-courses.jpeg`
- `artifacts/neu-attendai/public/report-imgs/qr-code.jpeg`
- `artifacts/neu-attendai/public/report-imgs/live-roster.jpeg`
- `artifacts/neu-attendai/public/report-imgs/student-add.jpeg`
- `artifacts/neu-attendai/src/pages/login.tsx`
- `artifacts/neu-attendai/src/lib/session-token.ts`
