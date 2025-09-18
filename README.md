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
