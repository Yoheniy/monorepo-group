require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

const globalForPrisma = global

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
    errorFormat: "minimal",
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log("✅ Prisma connected to Neon")
  } catch (err) {
    console.error("❌ Prisma failed to connect:", err)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  await prisma.$disconnect()
  console.log("🔌 Prisma disconnected")
}

module.exports = { prisma, connectDB, disconnectDB }
