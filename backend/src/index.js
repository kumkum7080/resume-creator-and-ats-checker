require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const stripeLib = require("stripe");
const { prisma } = require("./prisma");
const { redis } = require("./redis");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Health check endpoint for Render
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// Initialize Stripe if keys are configured
const stripe = process.env.STRIPE_SECRET_KEY ? stripeLib(process.env.STRIPE_SECRET_KEY) : null;

// CORS configuration supporting dynamic local testing and Netlify prod environments
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parser supporting raw body capture for Stripe Webhook verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl === "/api/billing/webhook") {
        req.rawBody = buf;
      }
    },
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================================================
// AUTH ENDPOINTS
// ==========================================================================

// Register Account
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields (name, email, password)" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ error: "A user with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "spectra_jwt_secret_token_change_in_production",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, isPremium: user.isPremium },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Something went wrong during registration" });
  }
});

// Login Account
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "spectra_jwt_secret_token_change_in_production",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, isPremium: user.isPremium },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Something went wrong during login" });
  }
});

// Google OAuth Sign-in/Signup
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential token" });
    }

    // Decode Google ID Token (standard JWT) or local base64 mock credential
    let decoded;
    if (credential.includes(".")) {
      decoded = jwt.decode(credential);
    } else {
      try {
        decoded = JSON.parse(Buffer.from(credential, "base64").toString("utf-8"));
      } catch (err) {
        return res.status(400).json({ error: "Invalid Google credential format" });
      }
    }

    if (!decoded || !decoded.email) {
      return res.status(400).json({ error: "Invalid Google credential token" });
    }

    const email = decoded.email.toLowerCase().trim();
    const name = decoded.name || "Google User";

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: "", // Google logins use blank local passwords
        },
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "spectra_jwt_secret_token_change_in_production",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, isPremium: user.isPremium },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ error: "Something went wrong during Google authentication" });
  }
});

// Get User profile status
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, isPremium: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================================================
// RESUMES ENDPOINTS (JWT Protected)
// ==========================================================================

// List user's resumes
app.get("/api/resumes", authMiddleware, async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, templateId: true, resumeData: true, createdAt: true, updatedAt: true },
    });
    return res.json(resumes);
  } catch (error) {
    console.error("GET resumes error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create blank resume draft
app.post("/api/resumes", authMiddleware, async (req, res) => {
  try {
    const { title, templateId, resumeData } = req.body;

    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        title: title || "My Resume",
        templateId: templateId || "tpl-1",
        resumeData: resumeData || {
          personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "", summary: "", photo: "" },
          education: [],
          experience: [],
          responsibility: [],
          projects: [],
          certifications: [],
          skills: "",
        },
      },
    });

    return res.status(201).json(resume);
  } catch (error) {
    console.error("POST resume error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch single resume details
app.get("/api/resumes/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden. Ownership mismatch." });
    }

    return res.json(resume);
  } catch (error) {
    console.error("GET single resume error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Save / Update resume draft
app.put("/api/resumes/:id", authMiddleware, async (req, res) => {
  try {
    const { title, templateId, resumeData } = req.body;

    const existing = await prisma.resume.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.resume.update({
      where: { id: req.params.id },
      data: {
        title: title !== undefined ? title : existing.title,
        templateId: templateId !== undefined ? templateId : existing.templateId,
        resumeData: resumeData !== undefined ? resumeData : existing.resumeData,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("PUT resume error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete resume
app.delete("/api/resumes/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.resume.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.resume.delete({
      where: { id: req.params.id },
    });

    return res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("DELETE resume error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================================================
// REDIS SCAN RATE LIMITER
// ==========================================================================
app.post("/api/ats/scan-limit", authMiddleware, async (req, res) => {
  try {
    const rateLimitKey = `ratelimit:user:${req.user.id}`;
    
    // Increment scan count in Redis (expired after 24 hours)
    const scanCount = await redis.incr(rateLimitKey);
    if (scanCount === 1) {
      await redis.expire(rateLimitKey, 86400); // 24 hours expiry
    }

    // All users get unlimited scans.
    return res.json({ success: true, count: scanCount, isPremium: true });
  } catch (error) {
    // Graceful fallback if Redis service is disconnected/unavailable
    console.error("Redis scanner rate-limiting error:", error);
    return res.json({ success: true, fallback: true });
  }
});

// ==========================================================================
// STRIPE BILLING ENDPOINTS
// ==========================================================================

// Create Stripe Checkout Session
app.post("/api/billing/checkout", authMiddleware, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(501).json({ error: "Stripe configuration is not active on this backend." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Spectra ATS Premium Access",
              description: "Unlock all 60 premium templates and unlimited ATS scans forever.",
            },
            unit_amount: 499, // $4.99 USD
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?checkout_success=true`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?checkout_cancel=true`,
      client_reference_id: req.user.id,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);
    return res.status(500).json({ error: "Stripe checkout session failed to initialize." });
  }
});

// Stripe Webhook Listener (Webhook signature verified)
app.post("/api/billing/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret || !stripe) {
    return res.status(400).send("Webhook configuration is inactive.");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: true },
        });
        console.log(`User ${userId} successfully upgraded to Spectra Premium!`);
      } catch (error) {
        console.error("Error setting premium status for user:", error);
        return res.status(500).send("Database upgrade failed");
      }
    }
  }

  return res.json({ received: true });
});

// App startup
app.listen(PORT, () => {
  console.log(`Spectra SaaS API Backend listening on http://localhost:${PORT}`);
});
