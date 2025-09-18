"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTimeRemaining } from "@/lib/utils";

interface ProblemStatement {
  sNo: number;
  org: string;
  title: string;
  category: "Software" | "Hardware";
  psNumber: string;
  ideas: number;
  theme: string;
}

const HACKATHON_START =
  process.env.NEXT_PUBLIC_HACKATHON_START || "2025-09-19T09:00:00.000Z";

export default function LandingPage() {
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(HACKATHON_START)
  );
  const [problemStatements, setProblemStatements] = useState<
    ProblemStatement[]
  >([]);
  const [filteredPS, setFilteredPS] = useState<ProblemStatement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(HACKATHON_START));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check authentication status
  useEffect(() => {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("auth-token="));
    setIsLoggedIn(!!token);
  }, []);

  // Fetch problem statements
  useEffect(() => {
    fetchProblemStatements();
  }, []);

  // Filter problem statements
  useEffect(() => {
    const term = (searchTerm || "").toLowerCase();
    const filtered = problemStatements.filter((ps) => {
      const org = (ps.org || "").toLowerCase();
      const title = (ps.title || "").toLowerCase();
      const theme = (ps.theme || "").toLowerCase();
      const category = (ps.category || "").toLowerCase();
      const psNumber = (ps.psNumber || "").toLowerCase();
      return (
        org.includes(term) ||
        title.includes(term) ||
        theme.includes(term) ||
        category.includes(term) ||
        psNumber.includes(term)
      );
    });
    setFilteredPS(filtered);
    setCurrentPage(1);
  }, [searchTerm, problemStatements]);

  async function fetchProblemStatements() {
    try {
      const response = await fetch("/api/problem-statements");
      if (response.ok) {
        const data = await response.json();
        setProblemStatements(data.problemStatements);
      }
    } catch (error) {
      console.error("Error fetching problem statements:", error);
      // Fallback to sample data
      setProblemStatements([
        {
          sNo: 1,
          org: "Ministry of Education",
          title: "Digital Learning Platform for Rural Areas",
          category: "Software",
          psNumber: "SIH2025_001",
          ideas: 12,
          theme: "Education",
        },
        {
          sNo: 2,
          org: "Department of Health",
          title: "Telemedicine & Healthcare Management",
          category: "Software",
          psNumber: "SIH2025_002",
          ideas: 8,
          theme: "Healthcare",
        },
        {
          sNo: 3,
          org: "Ministry of Agriculture",
          title: "Smart Farming & Crop Monitoring",
          category: "Hardware",
          psNumber: "SIH2025_003",
          ideas: 15,
          theme: "Agriculture",
        },
        {
          sNo: 4,
          org: "Department of Transportation",
          title: "AI-Powered Traffic Management",
          category: "Software",
          psNumber: "SIH2025_004",
          ideas: 10,
          theme: "Transportation",
        },
        {
          sNo: 5,
          org: "Ministry of Environment",
          title: "Real-time Pollution Monitoring",
          category: "Hardware",
          psNumber: "SIH2025_005",
          ideas: 7,
          theme: "Environment",
        },
      ]);
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredPS.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentPS = filteredPS.slice(startIndex, startIndex + entriesPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i)}
            className="mx-1"
          >
            {i}
          </Button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            SIH Internal Hackathon 2025
          </h1>
          <p className="text-lg md:text-2xl mb-8 opacity-90">
            Hosted by Sreyas Innovation & Entrepreneurship Cell
          </p>

          {/* Countdown Timer */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
            {Object.entries(timeRemaining).map(
              ([unit, value]) =>
                unit !== "isExpired" && (
                  <div
                    key={unit}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-3 sm:px-4 min-w-[70px] sm:min-w-[80px]"
                  >
                    <span className="block text-xl sm:text-2xl font-bold">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="text-xs sm:text-sm opacity-90 capitalize">
                      {unit}
                    </span>
                  </div>
                )
            )}
          </div>

          {/* Dynamic CTA Buttons */}
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap px-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  View Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                  >
                    Register Now
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-indigo-600"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Participate Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Participate?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Be part of India's largest innovation movement and showcase your
            skills on a national platform
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: "🚀",
                title: "Innovation Movement",
                description:
                  "Showcase your skills, learn new technologies, and contribute to real-world solutions.",
                bgColor: "bg-indigo-100",
                iconColor: "text-indigo-600",
              },
              {
                icon: "🏆",
                title: "Compete for SIH 2025",
                description:
                  "Top teams qualify for the national Smart India Hackathon 2025.",
                bgColor: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: "🤝",
                title: "Team Collaboration",
                description:
                  "Learn and grow through teamwork while solving challenging problems.",
                bgColor: "bg-pink-100",
                iconColor: "text-pink-600",
              },
              {
                icon: "💰",
                title: "Recognition & Prizes",
                description:
                  "Earn certificates, cash prizes, and direct entries for winners.",
                bgColor: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: "🎯",
                title: "Solve Real Problems",
                description:
                  "Tackle actual challenges faced by government departments and industries.",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: "🎓",
                title: "Skill Development",
                description:
                  "Enhance your technical and presentation skills with expert guidance.",
                bgColor: "bg-yellow-100",
                iconColor: "text-yellow-600",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}
                >
                  <span className={`${benefit.iconColor} text-xl font-bold`}>
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hackathon Timeline
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Follow our structured approach from ideation to final presentation
          </p>

          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-8">
            {[
              {
                step: 1,
                title: "Problem Statement & Ideation",
                description:
                  "Teams select a problem statement, brainstorm solutions, and define their approach.",
                bgColor: "bg-indigo-100",
                textColor: "text-indigo-600",
              },
              {
                step: 2,
                title: "Prototype Development",
                description:
                  "Develop a working prototype and maintain a repository for all code and documentation.",
                bgColor: "bg-purple-100",
                textColor: "text-purple-600",
              },
              {
                step: 3,
                title: "Final Presentation & Evaluation",
                description:
                  "Submit final presentation, live demo link, and project repo for mentor scoring and admin evaluation.",
                bgColor: "bg-pink-100",
                textColor: "text-pink-600",
              },
            ].map((phase) => (
              <div
                key={phase.step}
                className="bg-white rounded-xl shadow-md p-6 flex-1 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${phase.bgColor} rounded-full flex items-center justify-center mb-4 mx-auto`}
                >
                  <span className={`${phase.textColor} text-xl font-bold`}>
                    {phase.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {phase.title}
                </h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SIH 2025 Problem Statements
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore challenging problem statements from various government
              departments and industries
            </p>
          </div>

          {/* Search and Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <Input
              type="text"
              placeholder="Search problem statements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:max-w-md"
            />

            <div className="flex items-center gap-2 justify-center sm:justify-end">
              <label className="text-gray-600 text-sm">Show</label>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="text-gray-600 text-sm">entries</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm">
                      S.No.
                    </th>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm">
                      Organization
                    </th>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm">
                      Title
                    </th>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm hidden sm:table-cell">
                      Category
                    </th>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm hidden md:table-cell">
                      PS Number
                    </th>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm hidden lg:table-cell">
                      Ideas
                    </th>
                    <th className="py-3 px-3 sm:py-4 sm:px-6 text-left font-semibold text-sm hidden lg:table-cell">
                      Theme
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPS.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No problem statements found matching your search.
                      </td>
                    </tr>
                  ) : (
                    currentPS.map((ps) => (
                      <tr
                        key={ps.sNo}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-3 sm:py-4 sm:px-6 font-medium text-gray-900 text-sm">
                          {ps.sNo}
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-gray-700 text-sm">
                          <div
                            className="truncate max-w-[120px] sm:max-w-none"
                            title={ps.org}
                          >
                            {ps.org}
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-gray-700 font-medium text-sm">
                          <div
                            className="truncate max-w-[150px] sm:max-w-none"
                            title={ps.title}
                          >
                            {ps.title}
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 hidden sm:table-cell">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              ps.category === "Software"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {ps.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-gray-700 font-mono text-xs hidden md:table-cell">
                          {ps.psNumber}
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-center hidden lg:table-cell">
                          <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                            {ps.ideas}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-gray-700 text-sm hidden lg:table-cell">
                          {ps.theme}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {currentPage > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ‹
                </Button>
              )}
              {renderPagination()}
              {currentPage < totalPages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  ›
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Mentorship Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mentorship Support
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Get guidance from experienced mentors throughout the hackathon —
            from idea validation to final presentation
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: "💻",
                title: "Technical Mentors",
                description:
                  "Experts in software & hardware to guide you through coding and prototyping.",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: "🎯",
                title: "Domain Experts",
                description:
                  "Industry professionals to help align your solution with real-world needs.",
                bgColor: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: "📊",
                title: "Continuous Feedback",
                description:
                  "Mentors provide feedback at each stage to help teams improve and progress.",
                bgColor: "bg-purple-100",
                iconColor: "text-purple-600",
              },
            ].map((mentor, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${mentor.bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}
                >
                  <span className={`${mentor.iconColor} text-xl font-bold`}>
                    {mentor.icon}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {mentor.title}
                </h3>
                <p className="text-gray-600">{mentor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
            Join{" "}
            <span className="font-semibold">Smart India Hackathon 2025</span> at
            Sreyas Institute of Engineering & Technology. Showcase your skills,
            solve real-world problems, and win exciting rewards!
          </p>
          <div className="flex justify-center space-x-3 sm:space-x-4 flex-wrap gap-y-3">
            {!isLoggedIn && (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-gray-100"
                  >
                    Register Your Team
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-indigo-700"
                  >
                    Already Registered? Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">SIH 2025</h3>
            <p className="text-sm mb-4">
              Organized at{" "}
              <span className="font-semibold text-white">
                Sreyas Institute of Engineering & Technology
              </span>
              . A celebration of innovation, collaboration, and problem-solving.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#timeline"
                  className="hover:text-white transition-colors duration-200"
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/#problem-statements"
                  className="hover:text-white transition-colors duration-200"
                >
                  Problem Statements
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors duration-200"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>Sreyas Institute of Engineering & Technology</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:codebreakers260@gmail.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  codebreakers260@gmail.com
                </a>
              </p>
              <p>Phone: +91 8765210</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 border-t border-gray-700 pt-6 text-sm">
          © 2025 SIH Hackathon · All rights reserved
        </div>
      </footer>
    </div>
  );
}
