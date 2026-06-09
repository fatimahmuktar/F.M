const http = require("http");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "dist", "public");
const port = process.env.PORT || 3456;

const MIME = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".json": "application/json",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

function json(res, code, data) {
  res.writeHead(code, { "Content-Type": "application/json", ...CORS });
  res.end(JSON.stringify(data));
}

// ── Demo data (mutable arrays so import works) ─────────────
const DEMO = {
  users: [
    { id: "20225507", name: "Fatumo Mukhtar", email: "20225507@std.neu.edu.tr", role: "student", studentNumber: "20225507", password: "123456789" },
    { id: "prof-001", name: "Demo Professor", email: "prof@neu.edu.tr",         role: "professor", studentNumber: null,    password: "123456789" },
    { id: "admin-01", name: "Admin User",      email: "admin@neu.edu.tr",        role: "admin",     studentNumber: null,    password: "123456789" },
  ],
  semesters: ["2025-2026"],
  sessions: [
    { id: "aaaaaaaa-0001-0000-0000-000000000001", courseId: "COM382-FRI-1330", token: "101010", active: false, startedAt: "2026-05-13T11:30:00Z", endedAt: "2026-05-13T13:00:00Z" },
    { id: "aaaaaaaa-0001-0000-0000-000000000002", courseId: "COM382-FRI-1330", token: "202020", active: false, startedAt: "2026-05-06T11:30:00Z", endedAt: "2026-05-06T13:00:00Z" },
    { id: "aaaaaaaa-0001-0000-0000-000000000003", courseId: "COM382-FRI-1330", token: "303030", active: false, startedAt: "2026-04-29T11:30:00Z", endedAt: "2026-04-29T13:00:00Z" },
    { id: "aaaaaaaa-0001-0000-0000-000000000004", courseId: "COM382-FRI-1330", token: "404040", active: false, startedAt: "2026-04-22T11:30:00Z", endedAt: "2026-04-22T13:00:00Z" },
    { id: "aaaaaaaa-0001-0000-0000-000000000005", courseId: "COM382-FRI-1330", token: "505050", active: false, startedAt: "2026-04-15T11:30:00Z", endedAt: "2026-04-15T13:00:00Z" },
    { id: "aaaaaaaa-0001-0000-0000-000000000006", courseId: "COM352",          token: "606060", active: true,  startedAt: "2026-06-08T10:00:00Z", endedAt: null },
  ],
  attendance: [
    { sessionId: "aaaaaaaa-0001-0000-0000-000000000001", courseId: "COM382-FRI-1330", studentId: "20225507", studentName: "Fatumo Mukhtar", method: "qr",     flagged: false, checkedInAt: "2026-05-13T11:45:00Z" },
    { sessionId: "aaaaaaaa-0001-0000-0000-000000000002", courseId: "COM382-FRI-1330", studentId: "20225507", studentName: "Fatumo Mukhtar", method: "manual", flagged: false, checkedInAt: "2026-05-06T11:35:00Z" },
    { sessionId: "aaaaaaaa-0001-0000-0000-000000000003", courseId: "COM382-FRI-1330", studentId: "20225507", studentName: "Fatumo Mukhtar", method: "qr",     flagged: false, checkedInAt: "2026-04-29T11:40:00Z" },
  ],
  enrolled: ["20225507", "20225508", "20225509"],
};

// Start with empty courses — user imports via admin page
let COURSES = [];

function findUser(identifier) {
  return DEMO.users.find(u => u.email === identifier || u.studentNumber === identifier);
}

function makeToken(user) {
  const payload = { sub: user.id, role: user.role, iat: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

// ── Request router ─────────────────────────────────────────
http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  const url = req.url;
  const method = req.method;

  // ── Serve HTML with diagnostic script ──
  if (url === "/" || url === "/index.html") {
    const indexPath = path.join(dir, "index.html");
    fs.readFile(indexPath, (err, data) => {
      if (err) { res.writeHead(404); res.end("404"); return; }
      let html = data.toString("utf8");
      html = html.replace("</body>",
        `<div id="diag" style="position:fixed;bottom:10px;left:10px;z-index:99999;background:#cc0000;color:white;padding:8px 16px;font:14px monospace;border-radius:6px;display:flex;gap:8px;align-items:center;box-shadow:0 2px 12px rgba(0,0,0,0.5);">
  <span id="diag-status" style="color:#0f0;">&#9679;</span>
  <span id="diag-msg">Mock API active</span>
</div>\n</body>`);
      res.writeHead(200, { "Content-Type": "text/html", ...CORS, ...NO_CACHE, "Content-Length": Buffer.byteLength(html) });
      res.end(html);
    });
    return;
  }

  // ── API routes ──
  if (url.startsWith("/api/")) {
    // health
    if (url === "/api/healthz") {
      return json(res, 200, { status: "ok" });
    }

    // POST /api/auth/login
    if (url === "/api/auth/login" && method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        try {
          const { identifier, password } = JSON.parse(body);
          const user = findUser(identifier);
          if (!user || user.password !== password) {
            return json(res, 401, { error: "Invalid credentials" });
          }
          const token = makeToken(user);
          return json(res, 200, {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              studentNumber: user.studentNumber,
            },
          });
        } catch { return json(res, 400, { error: "Bad request" }); }
      });
      return;
    }

    // POST /api/auth/register
    if (url === "/api/auth/register" && method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          return json(res, 200, { email: data.email, demoCode: "123456" });
        } catch { return json(res, 400, { error: "Bad request" }); }
      });
      return;
    }

    // POST /api/auth/verify-email
    if (url === "/api/auth/verify-email" && method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          const user = DEMO.users.find(u => u.email === data.email);
          if (!user) return json(res, 400, { error: "User not found" });
          const token = makeToken(user);
          return json(res, 200, {
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, studentNumber: user.studentNumber },
          });
        } catch { return json(res, 400, { error: "Bad request" }); }
      });
      return;
    }

    // POST /api/auth/forgot-password
    if (url === "/api/auth/forgot-password" && method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          const user = findUser(data.identifier);
          if (!user) return json(res, 400, { error: "User not found" });
          return json(res, 200, { email: user.email, demoCode: "999999" });
        } catch { return json(res, 400, { error: "Bad request" }); }
      });
      return;
    }

    // POST /api/auth/reset-password
    if (url === "/api/auth/reset-password" && method === "POST") {
      return json(res, 200, { success: true });
    }

    // GET /api/courses — list all courses (optionally filtered by semester)
    if (url.startsWith("/api/courses") && method === "GET") {
      const u = new URL(url, "http://localhost");
      const semester = u.searchParams.get("semester");
      // Return all courses regardless of semester for demo purposes
      return json(res, 200, { courses: COURSES, semesters: DEMO.semesters });
    }

    // GET /api/courses/semesters
    if (url === "/api/courses/semesters" && method === "GET") {
      return json(res, 200, DEMO.semesters);
    }

    // GET /api/settings/active-semester
    if (url === "/api/settings/active-semester" && method === "GET") {
      return json(res, 200, { semester: "2025-2026" });
    }

    // POST /api/courses/import — import timetable
    if (url === "/api/courses/import" && method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        try {
          const { courses, semester } = JSON.parse(body);
          if (Array.isArray(courses)) {
            const existing = new Set(COURSES.map(c => c.id));
            for (const c of courses) {
              if (!existing.has(c.id)) {
                COURSES.push({ ...c, semester: semester || "2025-2026", enrollment: c.enrollment || 0 });
                existing.add(c.id);
              }
            }
          }
          return json(res, 200, { success: true, count: courses?.length || 0 });
        } catch { return json(res, 400, { error: "Bad request" }); }
      });
      return;
    }

    // DELETE /api/courses — delete all courses
    if (url === "/api/courses" && method === "DELETE") {
      COURSES = [];
      return json(res, 200, { success: true });
    }

    // DELETE /api/courses/:id — delete single course
    if (url.match(/^\/api\/courses\/[\w-]+$/) && method === "DELETE") {
      const id = url.split("/").pop();
      COURSES = COURSES.filter(c => c.id !== id);
      return json(res, 200, { success: true });
    }

    // GET /api/student/courses — enrolled courses
    if (url === "/api/student/courses" && method === "GET") {
      return json(res, 200, { courses: COURSES });
    }

    // POST /api/student/courses — enroll in course
    if (url === "/api/student/courses" && method === "POST") {
      return json(res, 200, { success: true });
    }

    // DELETE /api/student/courses/:id — unenroll
    if (url.match(/^\/api\/student\/courses\/[\w-]+$/) && method === "DELETE") {
      return json(res, 200, { success: true });
    }

    // GET /api/student/sessions — sessions for enrolled courses
    if (url === "/api/student/sessions" && method === "GET") {
      return json(res, 200, DEMO.sessions);
    }

    // GET /api/student/attendance — attendance records
    if (url === "/api/student/attendance" && method === "GET") {
      return json(res, 200, DEMO.attendance);
    }

    // GET /api/professor/courses — courses taught
    if (url === "/api/professor/courses" && method === "GET") {
      return json(res, 200, { courses: COURSES });
    }

    // GET /api/professor/courses/:id/students
    if (url.match(/^\/api\/professor\/courses\/[\w-]+\/students$/) && method === "GET") {
      return json(res, 200, { students: DEMO.enrolled.map(id => ({ id, name: "Student " + id, email: id + "@std.neu.edu.tr" })) });
    }

    // POST /api/professor/courses — create course
    if (url === "/api/professor/courses" && method === "POST") {
      return json(res, 200, { id: "new-course-id" });
    }

    // DELETE /api/professor/courses/:id
    if (url.match(/^\/api\/professor\/courses\/[\w-]+$/) && method === "DELETE") {
      return json(res, 200, { success: true });
    }

    // POST /api/sessions — start a session
    if (url === "/api/sessions" && method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        try {
          const { courseId } = JSON.parse(body);
          const newSession = { id: "session-" + Date.now(), courseId, token: "123456", active: true, startedAt: new Date().toISOString(), endedAt: null };
          return json(res, 200, { session: newSession });
        } catch { return json(res, 200, { session: { id: "session-1", token: "123456", active: true } }); }
      });
      return;
    }

    // GET /api/sessions — list sessions
    if (url === "/api/sessions" && method === "GET") {
      return json(res, 200, DEMO.sessions);
    }

    // PATCH /api/sessions/:id/end — end session
    if (url.match(/^\/api\/sessions\/[\w-]+\/end$/) && method === "PATCH") {
      return json(res, 200, { success: true });
    }

    // GET /api/sessions/:id/attendance — session attendance
    if (url.match(/^\/api\/sessions\/[\w-]+\/attendance$/) && method === "GET") {
      return json(res, 200, { records: DEMO.attendance });
    }

    // GET /api/professor/sessions — all sessions (old route)
    if (url === "/api/professor/sessions" && method === "GET") {
      return json(res, 200, DEMO.sessions);
    }

    // POST /api/professor/sessions — create session (old route)
    if (url === "/api/professor/sessions" && method === "POST") {
      return json(res, 200, { id: "new-session-id", token: "123456", active: true });
    }

    // POST /api/attendance — mark attendance (QR)
    if (url === "/api/attendance" && method === "POST") {
      return json(res, 200, { success: true, verified: true });
    }

    // POST /api/attendance/manual — manual attendance
    if (url === "/api/attendance/manual" && method === "POST") {
      return json(res, 200, { success: true });
    }

    // GET /api/attendance/student/:id — student attendance records
    if (url.match(/^\/api\/attendance\/student\/[\w-]+$/) && method === "GET") {
      return json(res, 200, { records: DEMO.attendance });
    }

    // GET /api/admin/courses — all courses
    if (url === "/api/admin/courses" && method === "GET") {
      return json(res, 200, { courses: COURSES });
    }

    // Catch-all: return empty data for any other API endpoint
    return json(res, 200, { data: [], error: null });
  }

  // ── Static files ──
  let file = url === "/" ? "/index.html" : url;
  const p = path.join(dir, file);
  if (!p.startsWith(dir)) { res.writeHead(403); res.end("Forbidden"); return; }

  fs.readFile(p, (err, data) => {
    if (err) {
      fs.readFile(path.join(dir, "index.html"), (e2, d2) => {
        if (e2) { res.writeHead(404); res.end("404"); return; }
        res.writeHead(200, { "Content-Type": "text/html", ...CORS });
        res.end(d2);
      });
      return;
    }
    const ext = path.extname(file);
    const ct = MIME[ext] || "text/html";
    res.writeHead(200, { "Content-Type": ct, ...CORS });
    res.end(data);
  });
}).listen(port, () => console.log("Mock API server: http://localhost:" + port));
