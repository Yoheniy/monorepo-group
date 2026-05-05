require("dotenv").config()

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const { connectDB, disconnectDB } = require("./config/db")

const app = express()

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
]

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultOrigins

// ==================
// Middleware
// ==================
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())
app.use(cookieParser())

// ==================
// Routes
// ==================
app.use("/api/auth", require("./routes/auth"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/teams", require("./routes/team"))
app.use("/api/tournaments", require("./routes/tournament"))
app.use("/api/participants", require("./routes/teamParticipant"))
app.use("/api/standings", require("./routes/standing"))
app.use("/api/matches", require("./routes/match"))
app.use("/api/match-events", require("./routes/matchEvent"))
app.use("/api/injuries", require("./routes/injury"))
app.use("/api/polls", require("./routes/poll"))
app.use("/api/poll-options", require("./routes/pollOption"))
app.use("/api/votes", require("./routes/vote"))

// ==================
// Health check
// ==================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" })
})

// ==================
// Start server ONCE DB is connected
// ==================
const PORT = process.env.PORT || 5000

async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`🌐 CORS enabled for: ${corsOrigins.join(", ")}`)
  })
}

startServer()

// ==================
// Graceful shutdown
// ==================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...")
  await disconnectDB()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("🛑 Terminating...")
  await disconnectDB()
  process.exit(0)
})
