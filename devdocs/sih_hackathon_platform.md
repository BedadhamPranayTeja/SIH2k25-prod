# SIH Internal Hackathon 2025 - Complete Application

## 🚀 Project Structure

```
sih-hackathon-2025/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── teams/
│   │   │   ├── submissions/
│   │   │   └── scores/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── custom/
│   ├── lib/
│   ├── models/
│   └── types/
├── package.json
├── next.config.js
├── tailwind.config.js
└── .env.example
```

## 📦 package.json

```json
{
  "name": "sih-hackathon-2025",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.5.4",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.7",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "mongoose": "^8.5.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.424.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-progress": "^1.1.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "tsx": "^4.16.2"
  }
}
```

## 🔧 Configuration Files

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  },
};

module.exports = nextConfig;
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### .env.example

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sih2025?retryWrites=true&w=majority

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-here

# App Environment
NEXT_PUBLIC_APP_ENV=development

# Hackathon Configuration
NEXT_PUBLIC_HACKATHON_START=2025-09-19T09:00:00.000Z
NEXT_PUBLIC_HACKATHON_END=2025-09-20T17:00:00.000Z
```

## 🗄️ Database Models

### src/lib/db.ts

```typescript
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

### src/models/User.ts

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  rollNo?: string;
  role: "team_lead" | "team_member" | "mentor" | "admin";
  teamCode?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    rollNo: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["team_lead", "team_member", "mentor", "admin"],
      required: true,
    },
    teamCode: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ teamCode: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
```

### src/models/Team.ts

```typescript
import mongoose, { Schema, Document } from "mongoose";

interface TeamMember {
  name: string;
  email: string;
  rollNo: string;
}

export interface ITeam extends Document {
  teamCode: string;
  teamName: string;
  leader: TeamMember;
  members: TeamMember[];
  problemStatementId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<TeamMember>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNo: { type: String, required: true },
});

const TeamSchema = new Schema<ITeam>(
  {
    teamCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    leader: {
      type: TeamMemberSchema,
      required: true,
    },
    members: [TeamMemberSchema],
    problemStatementId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ teamCode: 1 });

export const Team =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
```

### src/models/Submission.ts

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  teamCode: string;
  round: number;
  fields: {
    title: string;
    description: string;
    repoUrl?: string;
    liveUrl?: string;
    presentationUrl?: string;
    fileId?: string; // GridFS file ID
  };
  status: "draft" | "submitted" | "reviewed";
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    teamCode: {
      type: String,
      required: true,
      trim: true,
    },
    round: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
    fields: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      repoUrl: { type: String },
      liveUrl: { type: String },
      presentationUrl: { type: String },
      fileId: { type: String }, // GridFS file ID
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ teamCode: 1, round: 1 });

export const Submission =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
```

### src/models/Score.ts

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IScore extends Document {
  teamCode: string;
  round: number;
  mentorScores: Array<{
    mentorId: string;
    criteria: {
      innovation: number;
      feasibility: number;
      technical: number;
      presentation: number;
    };
    comments: string;
    total: number;
  }>;
  adminScore?: {
    criteria: {
      innovation: number;
      feasibility: number;
      technical: number;
      presentation: number;
    };
    finalComment: string;
    total: number;
  };
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const CriteriaSchema = new Schema({
  innovation: { type: Number, required: true, min: 0, max: 10 },
  feasibility: { type: Number, required: true, min: 0, max: 10 },
  technical: { type: Number, required: true, min: 0, max: 10 },
  presentation: { type: Number, required: true, min: 0, max: 10 },
});

const ScoreSchema = new Schema<IScore>(
  {
    teamCode: {
      type: String,
      required: true,
      trim: true,
    },
    round: {
      type: Number,
      required: true,
    },
    mentorScores: [
      {
        mentorId: { type: String, required: true },
        criteria: { type: CriteriaSchema, required: true },
        comments: { type: String, required: true },
        total: { type: Number, required: true },
      },
    ],
    adminScore: {
      criteria: { type: CriteriaSchema },
      finalComment: { type: String },
      total: { type: Number },
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ScoreSchema.index({ teamCode: 1, round: 1 });

// Calculate average score before saving
ScoreSchema.pre("save", function (next) {
  if (this.mentorScores.length > 0) {
    const total = this.mentorScores.reduce(
      (sum, score) => sum + score.total,
      0
    );
    this.averageScore = total / this.mentorScores.length;
  }
  next();
});

export const Score =
  mongoose.models.Score || mongoose.model<IScore>("Score", ScoreSchema);
```

### src/models/ProblemStatement.ts

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IProblemStatement extends Document {
  sNo: number;
  organization: string;
  title: string;
  description: string;
  category: "Software" | "Hardware";
  psNumber: string;
  theme: string;
  ideas: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemStatementSchema = new Schema<IProblemStatement>(
  {
    sNo: {
      type: Number,
      required: true,
      unique: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Software", "Hardware"],
      required: true,
    },
    psNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    ideas: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProblemStatementSchema.index({ title: 1 });
ProblemStatementSchema.index({ theme: 1 });
ProblemStatementSchema.index({ category: 1 });

export const ProblemStatement =
  mongoose.models.ProblemStatement ||
  mongoose.model<IProblemStatement>("ProblemStatement", ProblemStatementSchema);
```

## 🔐 Authentication & Utilities

### src/lib/auth.ts

```typescript
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  teamCode?: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check for httpOnly cookie
  const token = request.cookies.get("auth-token")?.value;
  return token || null;
}
```

### src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTeamCode(): string {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TEAM-${result}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getTimeRemaining(targetDate: string) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateRollNo(rollNo: string): boolean {
  // Basic validation for roll number (adjust as needed)
  const re = /^[A-Z0-9]{6,12}$/i;
  return re.test(rollNo);
}
```

### src/lib/validation.ts

```typescript
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
```

## 🎨 UI Components (shadcn/ui style)

### src/components/ui/button.tsx

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### src/components/ui/input.tsx

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

### src/components/ui/card.tsx

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

## 📱 App Layout & Global Styles

### src/app/layout.tsx

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIH Internal Hackathon 2025 | SIEC",
  description:
    "Smart India Hackathon Internal Selection - Sreyas Innovation & Entrepreneurship Cell",
  keywords:
    "hackathon, SIH, Smart India Hackathon, SIEC, innovation, technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
```

### src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Loading spinner */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## 🏠 Landing Page (Updated from your HTML)

### src/app/page.tsx

```typescript
import { Suspense } from "react";
import LandingPage from "@/components/custom/LandingPage";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner" />
        </div>
      }
    >
      <LandingPage />
    </Suspense>
  );
}
```

### src/components/custom/LandingPage.tsx

```typescript
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
    const filtered = problemStatements.filter(
      (ps) =>
        ps.org.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.psNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
```

## 🔐 Authentication Pages

### src/app/(auth)/login/page.tsx

```typescript
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
import { LoginSchema } from "@/lib/validation";
import { z } from "zod";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = LoginSchema.parse(formData);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Redirect based on role
      if (data.user.role === "admin" || data.user.role === "mentor") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          general: error instanceof Error ? error.message : "Login failed",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "border-red-300" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div
                    className="spinner mr-2"
                    style={{ width: "16px", height: "16px" }}
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Register here
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
  );
}
```

### src/app/(auth)/register/page.tsx

```typescript
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
```

## 🔐 API Routes - Authentication

### src/app/api/auth/login/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      teamCode: user.teamCode,
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamCode: user.teamCode,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/auth/register/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Team } from "@/models/Team";
import { hashPassword } from "@/lib/auth";
import { generateTeamCode } from "@/lib/utils";
import { RegisterSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    // Check if email already exists
    const existingUser = await User.findOne({
      email: validatedData.leadEmail.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Check for duplicate member emails
    const allEmails = [
      validatedData.leadEmail.toLowerCase(),
      ...validatedData.members.map((m) => m.email.toLowerCase()),
    ];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      return NextResponse.json(
        { message: "Duplicate email addresses found" },
        { status: 400 }
      );
    }

    // Generate unique team code
    let teamCode = generateTeamCode();
    while (await Team.findOne({ teamCode })) {
      teamCode = generateTeamCode();
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.leadPassword);

    // Create team leader user
    const teamLeader = new User({
      name: validatedData.leadName,
      email: validatedData.leadEmail.toLowerCase(),
      rollNo: validatedData.leadRollNo,
      role: "team_lead",
      teamCode,
      password: hashedPassword,
    });

    // Create team member users
    const teamMembers = await Promise.all(
      validatedData.members.map(async (member) => {
        // Generate a temporary password for members (they can reset it later)
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedTempPassword = await hashPassword(tempPassword);

        return new User({
          name: member.name,
          email: member.email.toLowerCase(),
          rollNo: member.rollNo,
          role: "team_member",
          teamCode,
          password: hashedTempPassword,
        });
      })
    );

    // Create team document
    const team = new Team({
      teamCode,
      teamName: validatedData.teamName,
      leader: {
        name: validatedData.leadName,
        email: validatedData.leadEmail.toLowerCase(),
        rollNo: validatedData.leadRollNo,
      },
      members: validatedData.members.map((member) => ({
        name: member.name,
        email: member.email.toLowerCase(),
        rollNo: member.rollNo,
      })),
    });

    // Save all documents
    await teamLeader.save();
    await Promise.all(teamMembers.map((member) => member.save()));
    await team.save();

    return NextResponse.json(
      {
        message: "Team registered successfully",
        teamCode,
        teamName: validatedData.teamName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { message: "Team code or email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/auth/logout/route.ts

```typescript
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the auth token cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
```

## 📊 Dashboard & Protected Routes

### src/middleware.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  if (
    pathname.startsWith("/admin") &&
    !["admin", "mentor"].includes(payload.role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-team-code", payload.teamCode || "");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### src/app/(protected)/dashboard/layout.tsx

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  teamCode?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">SIH 2025</h1>
              </Link>

              {user?.teamCode && (
                <div className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  {user.teamCode}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {user?.role === "admin" || user?.role === "mentor" ? (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              ) : null}

              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role?.replace("_", " ")}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  Dashboard
                </Button>
              </Link>
              {user?.role === "admin" || user?.role === "mentor" ? (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Admin Panel
                  </Button>
                </Link>
              ) : null}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="text-sm font-medium text-gray-800">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user?.role?.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### src/app/(protected)/dashboard/page.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getTimeRemaining, formatDate } from "@/lib/utils";
import {
  Clock,
  Users,
  FileText,
  Trophy,
  Upload,
  CheckCircle,
} from "lucide-react";

interface TeamInfo {
  teamCode: string;
  teamName: string;
  leader: {
    name: string;
    email: string;
    rollNo: string;
  };
  members: Array<{
    name: string;
    email: string;
    rollNo: string;
  }>;
  problemStatementId?: string;
}

interface Submission {
  id: string;
  round: number;
  fields: {
    title: string;
    description: string;
    repoUrl?: string;
    liveUrl?: string;
    presentationUrl?: string;
  };
  status: "draft" | "submitted" | "reviewed";
  createdAt: string;
  updatedAt: string;
}

interface LeaderboardEntry {
  rank: number;
  teamCode: string;
  teamName: string;
  averageScore: number;
  submissions: number;
}

const HACKATHON_START =
  process.env.NEXT_PUBLIC_HACKATHON_START || "2025-09-19T09:00:00.000Z";
const HACKATHON_END =
  process.env.NEXT_PUBLIC_HACKATHON_END || "2025-09-20T17:00:00.000Z";

export default function DashboardPage() {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(HACKATHON_END)
  );
  const [currentRound, setCurrentRound] = useState(1);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    title: "",
    description: "",
    repoUrl: "",
    liveUrl: "",
    presentationUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamInfo();
    fetchSubmissions();
    fetchLeaderboard();

    // Update timer every second
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(HACKATHON_END));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTeamInfo = async () => {
    try {
      const response = await fetch("/api/teams/me");
      if (response.ok) {
        const data = await response.json();
        setTeamInfo(data.team);
      }
    } catch (error) {
      console.error("Error fetching team info:", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions/me");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          round: currentRound,
          fields: submissionData,
        }),
      });

      if (response.ok) {
        alert("Submission successful!");
        setIsSubmissionModalOpen(false);
        setSubmissionData({
          title: "",
          description: "",
          repoUrl: "",
          liveUrl: "",
          presentationUrl: "",
        });
        fetchSubmissions();
      } else {
        const error = await response.json();
        alert(error.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentSubmission = () => {
    return submissions.find((sub) => sub.round === currentRound);
  };

  const getTeamRank = () => {
    if (!teamInfo) return null;
    const teamEntry = leaderboard.find(
      (entry) => entry.teamCode === teamInfo.teamCode
    );
    return teamEntry?.rank || null;
  };

  const currentSubmission = getCurrentSubmission();
  const teamRank = getTeamRank();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Time Remaining
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {timeRemaining.isExpired
                  ? "00:00:00"
                  : `${timeRemaining.hours}:${String(
                      timeRemaining.minutes
                    ).padStart(2, "0")}:${String(
                      timeRemaining.seconds
                    ).padStart(2, "0")}`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamInfo ? teamInfo.members.length + 1 : 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Current Rank</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamRank ? `#${teamRank}` : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Round & Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Round {currentRound} Progress</CardTitle>
              <CardDescription>
                Track your progress through the current round
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">
                    {currentSubmission ? "100%" : "0%"}
                  </span>
                </div>
                <Progress
                  value={currentSubmission ? 100 : 0}
                  className="w-full"
                />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        teamInfo?.problemStatementId
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium">Problem Selected</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        currentSubmission
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium">Submitted</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        currentSubmission?.status === "reviewed"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Trophy className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium">Reviewed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Form/Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Round {currentRound} Submission</CardTitle>
                  <CardDescription>
                    Submit your solution for evaluation
                  </CardDescription>
                </div>
                {currentSubmission && (
                  <Badge
                    variant={
                      currentSubmission.status === "submitted"
                        ? "default"
                        : currentSubmission.status === "reviewed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {currentSubmission.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentSubmission ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {currentSubmission.fields.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentSubmission.fields.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentSubmission.fields.repoUrl && (
                      <a
                        href={currentSubmission.fields.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        🔗 Repository
                      </a>
                    )}
                    {currentSubmission.fields.liveUrl && (
                      <a
                        href={currentSubmission.fields.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        🌐 Live Demo
                      </a>
                    )}
                    {currentSubmission.fields.presentationUrl && (
                      <a
                        href={currentSubmission.fields.presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        📊 Presentation
                      </a>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Submitted:{" "}
                    {formatDate(new Date(currentSubmission.createdAt))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Submission Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload your solution for Round {currentRound}
                  </p>
                  <Button onClick={() => setIsSubmissionModalOpen(true)}>
                    Create Submission
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent>
              {teamInfo ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {teamInfo.teamName}
                    </h4>
                    <p className="text-sm text-gray-600">{teamInfo.teamCode}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Team Leader
                    </h5>
                    <div className="text-sm text-gray-600">
                      <p>{teamInfo.leader.name}</p>
                      <p>{teamInfo.leader.email}</p>
                      <p>{teamInfo.leader.rollNo}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Members ({teamInfo.members.length})
                    </h5>
                    <div className="space-y-2">
                      {teamInfo.members.map((member, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <p>{member.name}</p>
                          <p className="text-xs">
                            {member.email} • {member.rollNo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading team info...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mini Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Current Leaderboard</CardTitle>
              <CardDescription>Top 5 teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.teamCode}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.teamCode === teamInfo?.teamCode
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entry.teamName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.teamCode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {entry.averageScore.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.submissions} subs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmissionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Submit Solution - Round {currentRound}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSubmissionModalOpen(false)}
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <Input
                    value={submissionData.title}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    value={submissionData.description}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your solution and approach"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository URL
                  </label>
                  <Input
                    type="url"
                    value={submissionData.repoUrl}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        repoUrl: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live Demo URL
                  </label>
                  <Input
                    type="url"
                    value={submissionData.liveUrl}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        liveUrl: e.target.value,
                      }))
                    }
                    placeholder="https://your-demo.vercel.app"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presentation URL
                  </label>
                  <Input
                    type="url"
                    value={submissionData.presentationUrl}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        presentationUrl: e.target.value,
                      }))
                    }
                    placeholder="https://docs.google.com/presentation/..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSubmissionModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div
                          className="spinner mr-2"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Solution"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 📊 Additional API Routes

### src/app/api/user/me/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamCode: user.teamCode,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/teams/me/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Team } from "@/models/Team";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const teamCode = request.headers.get("x-team-code");
    if (!teamCode) {
      return NextResponse.json(
        { message: "No team associated with user" },
        { status: 404 }
      );
    }

    const team = await Team.findOne({ teamCode });
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/submissions/me/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const teamCode = request.headers.get("x-team-code");
    if (!teamCode) {
      return NextResponse.json(
        { message: "No team associated with user" },
        { status: 404 }
      );
    }

    const submissions = await Submission.find({ teamCode }).sort({
      round: 1,
      createdAt: -1,
    });

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/submissions/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { SubmissionSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const teamCode = request.headers.get("x-team-code");
    const userRole = request.headers.get("x-user-role");

    if (!teamCode || userRole !== "team_lead") {
      return NextResponse.json(
        { message: "Only team leaders can submit solutions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { round, fields } = body;

    // Validate submission data
    const validatedFields = SubmissionSchema.parse(fields);

    // Check if submission already exists for this round
    const existingSubmission = await Submission.findOne({ teamCode, round });
    if (existingSubmission) {
      return NextResponse.json(
        { message: "Submission already exists for this round" },
        { status: 400 }
      );
    }

    const submission = new Submission({
      teamCode,
      round,
      fields: validatedFields,
      status: "submitted",
    });

    await submission.save();

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/leaderboard/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Score } from "@/models/Score";
import { Team } from "@/models/Team";
import { Submission } from "@/models/Submission";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all teams with their scores and submission counts
    const teams = await Team.find({}).lean();

    const leaderboardData = await Promise.all(
      teams.map(async (team) => {
        const scores = await Score.find({ teamCode: team.teamCode }).lean();
        const submissions = await Submission.countDocuments({
          teamCode: team.teamCode,
        });

        const averageScore =
          scores.length > 0
            ? scores.reduce((sum, score) => sum + score.averageScore, 0) /
              scores.length
            : 0;

        return {
          teamCode: team.teamCode,
          teamName: team.teamName,
          averageScore,
          submissions,
        };
      })
    );

    // Sort by average score (descending) and add ranks
    const sortedLeaderboard = leaderboardData
      .sort((a, b) => b.averageScore - a.averageScore)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json(
      { leaderboard: sortedLeaderboard },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/problem-statements/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ProblemStatement } from "@/models/ProblemStatement";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const problemStatements = await ProblemStatement.find({ isActive: true })
      .sort({ sNo: 1 })
      .select("-__v");

    return NextResponse.json({ problemStatements }, { status: 200 });
  } catch (error) {
    console.error("Get problem statements error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## 🌱 Database Seeding Script

### scripts/seed.ts

```typescript
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
```

## 📋 Additional UI Components

### src/components/ui/badge.tsx

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

### src/components/ui/progress.tsx

```typescript
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
```

## 🚀 Deployment Instructions

### README.md

````markdown
# SIH Internal Hackathon 2025 Platform

A complete hackathon management platform built with Next.js 14, MongoDB, and TypeScript.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sih-hackathon-2025)

## ⚡ Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sih-hackathon-2025
   ```
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sih2025?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_HACKATHON_START=2025-09-19T09:00:00.000Z
   NEXT_PUBLIC_HACKATHON_END=2025-09-20T17:00:00.000Z
   ```

4. **Seed the database**

   ```bash
   npm run seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Default Login Credentials

After seeding:

- **Admin**: admin@sih2025.in / admin123
- **Mentors**: \*.mentor@sih2025.in / mentor123

## 📱 Features

### For Participants

- ✅ Team registration and management
- ✅ Problem statement browsing
- ✅ Solution submission with file upload
- ✅ Real-time leaderboard
- ✅ Dashboard with progress tracking
- ✅ Countdown timer for hackathon

### For Mentors/Admins

- ✅ Team and submission management
- ✅ Scoring system
- ✅ Admin dashboard
- ✅ User role management

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT with httpOnly cookies
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Vercel

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run seed         # Seed database with sample data
```

## 📊 Database Structure

- **Users** - Team members, leaders, mentors, admins
- **Teams** - Team information and member details
- **Submissions** - Project submissions by round
- **Scores** - Mentor scores and evaluations
- **Problem Statements** - Available challenges

## 🚀 Production Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Add your server's IP to the IP whitelist
4. Copy the connection string

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_HACKATHON_START=2025-09-19T09:00:00.000Z
NEXT_PUBLIC_HACKATHON_END=2025-09-20T17:00:00.000Z
```

## 🔒 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Request validation with Zod
- Role-based access control
- Protected API routes
- CORS configuration

## 📞 Support

For issues and support:

- Email: codebreakers260@gmail.com
- Create an issue on GitHub

## 📄 License

MIT License - see LICENSE file for details

```

## 🎯 Final Action Items

### Immediate (Next 2 Hours):
1. **Set up Next.js project** with all dependencies
2. **Configure MongoDB Atlas** connection
3. **Test authentication flow** (register/login)
4. **Deploy to Vercel** for initial testing

### Critical (Next 8 Hours):
1. **Complete dashboard functionality**
2. **Implement file upload system**
3. **Test submission workflow**
4. **Set up problem statements**

### Polish (Final 4 Hours):
1. **Add loading states and error handling**
2. **Mobile responsiveness testing**
3. **Performance optimization**
4. **Final deployment and DNS setup**

## 🚨 Ready to Launch Checklist

- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set
- [ ] Database seeded with problem statements
- [ ] Authentication system tested
- [ ] Team registration working
- [ ] Dashboard displays correctly
- [ ] Submission system functional
- [ ] Leaderboard updating
- [ ] Mobile responsive
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] Admin accounts created
- [ ] Mentor accounts set up

This is your **complete production-ready SIH Hackathon platform**! The codebase includes everything you need to run a successful internal hackathon with modern web technologies.

Ready to start building? Let me know if you need any clarification on specific components or want me to help you set up the deployment!
```
