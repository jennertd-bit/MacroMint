const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { query } = require("./db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-change-me";
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || APP_BASE_URL;
const parseOrigins = (value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const CLIENT_ORIGINS = process.env.CLIENT_ORIGINS
  ? parseOrigins(process.env.CLIENT_ORIGINS)
  : [CLIENT_ORIGIN, APP_BASE_URL].filter(Boolean);
const ALLOW_ALL_ORIGINS =
  process.env.ALLOW_ALL_ORIGINS === "true" || CLIENT_ORIGINS.includes("*");
const isHttpsOrigin = (value) => typeof value === "string" && value.startsWith("https://");
const COOKIE_SECURE =
  process.env.COOKIE_SECURE === "true" ||
  (process.env.COOKIE_SECURE !== "false" &&
    (process.env.NODE_ENV === "production" || isHttpsOrigin(APP_BASE_URL) || isHttpsOrigin(CLIENT_ORIGIN)));
const COOKIE_SAMESITE = COOKIE_SECURE ? "none" : "lax";

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })
  : null;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOW_ALL_ORIGINS) return callback(null, true);
      if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const createToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

const setAuthCookie = (res, token) => {
  res.cookie("mm_token", token, {
    httpOnly: true,
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_SECURE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const generateTokenPair = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return { token, tokenHash: hashToken(token) };
};

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`Email disabled. To: ${to}. Subject: ${subject}.`);
    console.log(html);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@macromint.app",
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const link = `${APP_BASE_URL}/verify.html?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your MacroMint account",
    html: `<p>Welcome to MacroMint!</p><p>Verify your email:</p><p><a href=\"${link}\">${link}</a></p>`,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const link = `${APP_BASE_URL}/reset.html?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your MacroMint password",
    html: `<p>Reset your password:</p><p><a href=\"${link}\">${link}</a></p>`,
  });
};

const getAuthToken = (req) => {
  const cookieToken = req.cookies.mm_token;
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
};

const requireAuth = (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { token, tokenHash } = generateTokenPair();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await query(
      `INSERT INTO users (
        email, password_hash, name, email_verified, verification_token, verification_expires
      ) VALUES ($1, $2, $3, FALSE, $4, $5)
      RETURNING id, email, name, email_verified`,
      [email.toLowerCase(), passwordHash, name || null, tokenHash, expiresAt]
    );

    const user = result.rows[0];
    await query("INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING", [user.id]);
    await sendVerificationEmail(user.email, token);

    const authToken = createToken(user);
    setAuthCookie(res, authToken);
    return res.json({ user, token: authToken });
  } catch (error) {
    if (String(error).includes("users_email_key")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await query(
      "SELECT id, email, name, password_hash, email_verified FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) return res.status(401).json({ error: "Invalid credentials" });

    const token = createToken(user);
    setAuthCookie(res, token);
    return res.json({
      user: { id: user.id, email: user.email, name: user.name, email_verified: user.email_verified },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("mm_token");
  res.json({ status: "logged_out" });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  const result = await query("SELECT id, email, name, email_verified FROM users WHERE id = $1", [
    req.user.sub,
  ]);
  const user = result.rows[0];
  return res.json({ user });
});

app.post("/api/auth/resend-verify", requireAuth, async (req, res) => {
  const { token, tokenHash } = generateTokenPair();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await query(
    "UPDATE users SET verification_token = $1, verification_expires = $2 WHERE id = $3",
    [tokenHash, expiresAt, req.user.sub]
  );

  const result = await query("SELECT email FROM users WHERE id = $1", [req.user.sub]);
  await sendVerificationEmail(result.rows[0].email, token);
  return res.json({ status: "sent" });
});

app.get("/api/auth/verify", async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ error: "Missing token" });

  const tokenHash = hashToken(token);
  const result = await query(
    "SELECT id, email FROM users WHERE verification_token = $1 AND verification_expires > NOW()",
    [tokenHash]
  );
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  await query(
    "UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_expires = NULL WHERE id = $1",
    [user.id]
  );

  return res.json({ status: "verified" });
});

app.post("/api/auth/request-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const result = await query("SELECT id, email FROM users WHERE email = $1", [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) {
    return res.json({ status: "sent" });
  }

  const { token, tokenHash } = generateTokenPair();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await query("UPDATE users SET reset_token = $1, reset_expires = $2 WHERE id = $3", [
    tokenHash,
    expiresAt,
    user.id,
  ]);

  await sendPasswordResetEmail(user.email, token);
  return res.json({ status: "sent" });
});

app.post("/api/auth/reset", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  const tokenHash = hashToken(token);
  const result = await query(
    "SELECT id FROM users WHERE reset_token = $1 AND reset_expires > NOW()",
    [tokenHash]
  );
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  const passwordHash = await bcrypt.hash(password, 10);
  await query(
    "UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2",
    [passwordHash, user.id]
  );

  return res.json({ status: "reset" });
});

app.put("/api/account", requireAuth, async (req, res) => {
  const { name, email } = req.body || {};
  const result = await query("SELECT email FROM users WHERE id = $1", [req.user.sub]);
  const current = result.rows[0];

  if (email && email.toLowerCase() !== current.email) {
    const { token, tokenHash } = generateTokenPair();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await query(
      "UPDATE users SET name = $1, email = $2, email_verified = FALSE, verification_token = $3, verification_expires = $4 WHERE id = $5",
      [name || null, email.toLowerCase(), tokenHash, expiresAt, req.user.sub]
    );
    await sendVerificationEmail(email.toLowerCase(), token);
  } else {
    await query("UPDATE users SET name = $1 WHERE id = $2", [name || null, req.user.sub]);
  }

  const updated = await query("SELECT id, email, name, email_verified FROM users WHERE id = $1", [
    req.user.sub,
  ]);
  return res.json({ user: updated.rows[0] });
});

app.get("/api/profile", requireAuth, async (req, res) => {
  const result = await query("SELECT * FROM profiles WHERE user_id = $1", [req.user.sub]);
  return res.json({ profile: result.rows[0] || null });
});

app.put("/api/profile", requireAuth, async (req, res) => {
  const profile = req.body || {};
  await query(
    `INSERT INTO profiles (
      user_id, units, age, sex, height_ft, height_in, height_cm, weight_lb, weight_kg,
      activity, goal_preset, adjustment, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      units = EXCLUDED.units,
      age = EXCLUDED.age,
      sex = EXCLUDED.sex,
      height_ft = EXCLUDED.height_ft,
      height_in = EXCLUDED.height_in,
      height_cm = EXCLUDED.height_cm,
      weight_lb = EXCLUDED.weight_lb,
      weight_kg = EXCLUDED.weight_kg,
      activity = EXCLUDED.activity,
      goal_preset = EXCLUDED.goal_preset,
      adjustment = EXCLUDED.adjustment,
      updated_at = NOW()`,
    [
      req.user.sub,
      profile.units || "us",
      profile.age || null,
      profile.sex || null,
      profile.heightFt || null,
      profile.heightIn || null,
      profile.heightCm || null,
      profile.weightLb || null,
      profile.weightKg || null,
      profile.activity || null,
      profile.goalPreset || null,
      profile.adjustment || 0,
    ]
  );

  const result = await query("SELECT * FROM profiles WHERE user_id = $1", [req.user.sub]);
  return res.json({ profile: result.rows[0] });
});

app.get("/api/meals", requireAuth, async (req, res) => {
  const from = req.query.from || new Date().toISOString().slice(0, 10);
  const to = req.query.to || from;

  const result = await query(
    "SELECT * FROM meals WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC, created_at DESC",
    [req.user.sub, from, to]
  );
  return res.json({ meals: result.rows });
});

app.post("/api/meals", requireAuth, async (req, res) => {
  const { name, type, calories, date } = req.body || {};
  if (!name || !calories || !date) {
    return res.status(400).json({ error: "Name, calories, and date are required" });
  }

  const result = await query(
    "INSERT INTO meals (user_id, name, type, calories, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [req.user.sub, name, type || null, Math.round(calories), date]
  );

  return res.json({ meal: result.rows[0] });
});

app.delete("/api/meals/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM meals WHERE id = $1 AND user_id = $2", [id, req.user.sub]);
  return res.json({ status: "deleted" });
});

const clientDir = path.join(__dirname, "..");
app.use(express.static(clientDir));

app.listen(PORT, () => {
  console.log(`MacroMint server running on http://localhost:${PORT}`);
});
