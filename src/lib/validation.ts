import { z } from "zod";

export const RegisterSchema = z.object({
  // Team Lead
  leadName: z.string().min(2, "Name must be at least 2 characters"),
  leadEmail: z.string().email("Invalid email address"),
  leadRollNo: z.string().min(6, "Roll number must be at least 6 characters"),
  leadPassword: z.string().min(6, "Password must be at least 6 characters"),

  // Team Info
  teamName: z.string().min(3, "Team name must be at least 3 characters"),

  // Members
  members: z
    .array(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        rollNo: z.string().min(6, "Roll number must be at least 6 characters"),
      })
    )
    .min(1, "At least 1 team member is required")
    .max(5, "Maximum 5 members allowed"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  repoUrl: z
    .string()
    .url("Invalid repository URL")
    .optional()
    .or(z.literal("")),
  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),
  presentationUrl: z
    .string()
    .url("Invalid presentation URL")
    .optional()
    .or(z.literal("")),
});

export const ScoreSchema = z.object({
  teamCode: z.string(),
  round: z.number().min(1).max(3),
  criteria: z.object({
    innovation: z.number().min(0).max(10),
    feasibility: z.number().min(0).max(10),
    technical: z.number().min(0).max(10),
    presentation: z.number().min(0).max(10),
  }),
  comments: z.string().min(10, "Comments must be at least 10 characters"),
});
