"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RegisterSchema } from "@/lib/validation";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  rollNo: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    leadName: "",
    leadEmail: "",
    leadRollNo: "",
    leadPassword: "",
    teamName: "",
    members: [{ name: "", email: "", rollNo: "" }] as TeamMember[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Filter out empty members
      const filteredData = {
        ...formData,
        members: formData.members.filter(
          (member) =>
            member.name.trim() && member.email.trim() && member.rollNo.trim()
        ),
      };

      // Validate form data
      const validatedData = RegisterSchema.parse(filteredData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Show success message and redirect
      alert(`Registration successful! Your team code is: ${data.teamCode}`);
      router.push("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const path = err.path.join(".");
            fieldErrors[path] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          general:
            error instanceof Error ? error.message : "Registration failed",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData((prev) => ({ ...prev, members: newMembers }));

    // Clear related error
    const errorKey = `members.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addMember = () => {
    if (formData.members.length < 5) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, { name: "", email: "", rollNo: "" }],
      }));
    }
  };

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, members: newMembers }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Register Your Team
            </CardTitle>
            <CardDescription className="text-center">
              Create your team account for SIH Internal Hackathon 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Team Leader Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Leader Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="leadName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <Input
                      id="leadName"
                      name="leadName"
                      value={formData.leadName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={errors.leadName ? "border-red-300" : ""}
                    />
                    {errors.leadName && (
                      <p className="text-sm text-red-600">{errors.leadName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="leadEmail"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      id="leadEmail"
                      name="leadEmail"
                      type="email"
                      value={formData.leadEmail}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={errors.leadEmail ? "border-red-300" : ""}
                    />
                    {errors.leadEmail && (
                      <p className="text-sm text-red-600">{errors.leadEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="leadRollNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Roll Number
                    </label>
                    <Input
                      id="leadRollNo"
                      name="leadRollNo"
                      value={formData.leadRollNo}
                      onChange={handleChange}
                      placeholder="Enter your roll number"
                      className={errors.leadRollNo ? "border-red-300" : ""}
                    />
                    {errors.leadRollNo && (
                      <p className="text-sm text-red-600">
                        {errors.leadRollNo}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="leadPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Input
                      id="leadPassword"
                      name="leadPassword"
                      type="password"
                      value={formData.leadPassword}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={errors.leadPassword ? "border-red-300" : ""}
                    />
                    {errors.leadPassword && (
                      <p className="text-sm text-red-600">
                        {errors.leadPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Information
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="teamName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Team Name
                  </label>
                  <Input
                    id="teamName"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Enter your team name"
                    className={errors.teamName ? "border-red-300" : ""}
                  />
                  {errors.teamName && (
                    <p className="text-sm text-red-600">{errors.teamName}</p>
                  )}
                </div>
              </div>

              {/* Team Members Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Team Members (1-5 members)
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMember}
                    disabled={formData.members.length >= 5}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>

                {formData.members.map((member, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Member {index + 1}
                      </h4>
                      {formData.members.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <Input
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, "name", e.target.value)
                          }
                          placeholder="Member name"
                          className={
                            errors[`members.${index}.name`]
                              ? "border-red-300"
                              : ""
                          }
                        />
                        {errors[`members.${index}.name`] && (
                          <p className="text-sm text-red-600">
                            {errors[`members.${index}.name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            handleMemberChange(index, "email", e.target.value)
                          }
                          placeholder="Member email"
                          className={
                            errors[`members.${index}.email`]
                              ? "border-red-300"
                              : ""
                          }
                        />
                        {errors[`members.${index}.email`] && (
                          <p className="text-sm text-red-600">
                            {errors[`members.${index}.email`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Roll No
                        </label>
                        <Input
                          value={member.rollNo}
                          onChange={(e) =>
                            handleMemberChange(index, "rollNo", e.target.value)
                          }
                          placeholder="Roll number"
                          className={
                            errors[`members.${index}.rollNo`]
                              ? "border-red-300"
                              : ""
                          }
                        />
                        {errors[`members.${index}.rollNo`] && (
                          <p className="text-sm text-red-600">
                            {errors[`members.${index}.rollNo`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div
                      className="spinner mr-2"
                      style={{ width: "16px", height: "16px" }}
                    />
                    Creating Team...
                  </>
                ) : (
                  "Create Team Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign in here
              </Link>
            </p>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 text-center"
            >
              ← Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
