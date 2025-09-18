import mongoose from "mongoose";
import { ProblemStatement } from "../src/models/ProblemStatement";
import { User } from "../src/models/User";
import { hashPassword } from "../src/lib/auth";
import connectDB from "../src/lib/db";

const problemStatementsData = [
  {
    sNo: 1,
    organization: "Ministry of Education",
    title: "Digital Learning Platform for Rural Areas",
    description:
      "Develop a comprehensive digital learning platform that works effectively in areas with limited internet connectivity, providing offline content access and progress tracking.",
    category: "Software" as const,
    psNumber: "SIH2025_001",
    theme: "Education",
    ideas: 12,
  },
  {
    sNo: 2,
    organization: "Department of Health",
    title: "Telemedicine & Remote Healthcare Management",
    description:
      "Create a telemedicine solution that enables remote consultations, patient monitoring, and healthcare management in underserved areas.",
    category: "Software" as const,
    psNumber: "SIH2025_002",
    theme: "Healthcare",
    ideas: 8,
  },
  {
    sNo: 3,
    organization: "Ministry of Agriculture",
    title: "Smart Farming & Crop Monitoring System",
    description:
      "Build an IoT-based smart farming solution with crop monitoring, weather prediction, and automated irrigation management.",
    category: "Hardware" as const,
    psNumber: "SIH2025_003",
    theme: "Agriculture",
    ideas: 15,
  },
  {
    sNo: 4,
    organization: "Department of Transportation",
    title: "AI-Powered Traffic Management System",
    description:
      "Develop an intelligent traffic management system using AI and computer vision to optimize traffic flow and reduce congestion.",
    category: "Software" as const,
    psNumber: "SIH2025_004",
    theme: "Transportation",
    ideas: 10,
  },
  {
    sNo: 5,
    organization: "Ministry of Environment",
    title: "Real-time Air Quality Monitoring Network",
    description:
      "Create a network of IoT sensors for real-time air quality monitoring with predictive analytics and public alerts.",
    category: "Hardware" as const,
    psNumber: "SIH2025_005",
    theme: "Environment",
    ideas: 7,
  },
  {
    sNo: 6,
    organization: "Department of Finance",
    title: "Digital Payment Security & Fraud Detection",
    description:
      "Build an advanced fraud detection system for digital payments using machine learning and behavioral analysis.",
    category: "Software" as const,
    psNumber: "SIH2025_006",
    theme: "FinTech",
    ideas: 9,
  },
  {
    sNo: 7,
    organization: "Ministry of Rural Development",
    title: "Rural Employment & Skill Development Platform",
    description:
      "Develop a platform connecting rural workers with employment opportunities and skill development programs.",
    category: "Software" as const,
    psNumber: "SIH2025_007",
    theme: "Employment",
    ideas: 6,
  },
  {
    sNo: 8,
    organization: "Department of Energy",
    title: "Smart Grid Management & Energy Optimization",
    description:
      "Create a smart grid management system for optimal energy distribution and renewable energy integration.",
    category: "Hardware" as const,
    psNumber: "SIH2025_008",
    theme: "Energy",
    ideas: 11,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing data
    await ProblemStatement.deleteMany({});
    await User.deleteMany({ role: { $in: ["admin", "mentor"] } });
    console.log("Cleared existing seed data");

    // Seed problem statements
    await ProblemStatement.insertMany(problemStatementsData);
    console.log("✅ Problem statements seeded");

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const adminUser = new User({
      name: "System Administrator",
      email: "admin@sih2025.in",
      role: "admin",
      password: adminPassword,
    });
    await adminUser.save();
    console.log(
      "✅ Admin user created (email: admin@sih2025.in, password: admin123)"
    );

    // Create sample mentors
    const mentors = [
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.mentor@sih2025.in",
        role: "mentor",
        password: await hashPassword("mentor123"),
      },
      {
        name: "Prof. Priya Sharma",
        email: "priya.mentor@sih2025.in",
        role: "mentor",
        password: await hashPassword("mentor123"),
      },
      {
        name: "Mr. Anil Verma",
        email: "anil.mentor@sih2025.in",
        role: "mentor",
        password: await hashPassword("mentor123"),
      },
    ];

    for (const mentorData of mentors) {
      const mentor = new User(mentorData);
      await mentor.save();
    }
    console.log("✅ Sample mentors created (password: mentor123)");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\nLogin credentials:");
    console.log("Admin: admin@sih2025.in / admin123");
    console.log("Mentors: *.mentor@sih2025.in / mentor123");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedDatabase();
