# Hardik Jain's Portfolio & CMS

<div align="center">

A modern, full-stack personal portfolio website with an integrated content management system built with Next.js 15, featuring AI-powered content creation, real-time editing, and comprehensive admin tools.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?logo=prisma)](https://www.prisma.io/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-2596BE?logo=trpc)](https://trpc.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Demo](https://hardikja.in) · [Report Bug](https://github.com/jainhardik120/hardik-jain/issues) · [Request Feature](https://github.com/jainhardik120/hardik-jain/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

This is a production-ready portfolio website with a powerful CMS that combines modern web technologies to deliver a seamless content management experience. The project showcases best practices in Next.js development, including App Router, Server Components, tRPC for type-safe APIs, and AI-powered content generation.

**Live Demo:** [hardikja.in](https://hardikja.in)

## ✨ Features

### 🌐 Portfolio Website

- **Modern UI/UX**
  - Responsive design optimized for all devices
  - Dark mode support with `next-themes`
  - Smooth animations using Framer Motion
  - Interactive typing animations and carousels
  
- **Content Display**
  - Dynamic blog with rich text formatting
  - Project showcase with filtering and categorization
  - Skills visualization with progress indicators
  - Contact form with email integration
  - SEO optimized with structured data

### 🔐 Admin Panel

- **Authentication & Authorization**
  - Secure NextAuth.js v5 integration
  - Email/password authentication
  - OAuth providers (GitHub, Google)
  - Role-based access control (RBAC)
  - Email verification system
  
- **Content Management**
  - Advanced rich text editor powered by Novel/TipTap
  - AI-assisted content creation using Google Gemini
    - Automatic title suggestions
    - Content outline generation
    - Smart content writing
    - SEO description generation
  - Image upload and management via AWS S3
  - Draft and publish workflow
  
- **Design Tools Integration**
  - Canva Connect API integration
  - Excalidraw diagram editor
  - Asset management and export functionality
  
- **Task Management**
  - Kanban-style task boards
  - Drag-and-drop interface
  - Team collaboration features
  
- **Communication**
  - Email template builder
  - Contact form message management
  - AWS SES integration

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI components |
| [shadcn/ui](https://ui.shadcn.com/) | Component library |
| [Novel](https://novel.sh/) | WYSIWYG editor |
| [TanStack Query](https://tanstack.com/query) | Data fetching |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Recharts](https://recharts.org/) | Data visualization |

### Backend

| Technology | Purpose |
|------------|---------|
| [tRPC](https://trpc.io/) | Type-safe API |
| [Prisma](https://www.prisma.io/) | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [NextAuth.js](https://next-auth.js.org/) | Authentication |
| [Zod](https://zod.dev/) | Schema validation |
| [AWS S3](https://aws.amazon.com/s3/) | File storage |
| [AWS SES](https://aws.amazon.com/ses/) | Email service |

### AI & Integrations

- [Google Generative AI](https://ai.google.dev/) - Content generation
- [Canva Connect API](https://www.canva.com/developers/) - Design integration
- [Excalidraw](https://excalidraw.com/) - Diagram creation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (project uses 10.8.0) or npm/yarn
- **PostgreSQL** 14.x or higher
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jainhardik120/hardik-jain.git
   cd hardik-jain
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   See [Environment Variables](#environment-variables) section below for detailed configuration.

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Authentication
AUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_OAUTH_CLIENT_ID="your-google-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-google-client-secret"

# AWS Services
AWS_REGION_NEW="us-east-1"
AWS_ACCESS_KEY_ID_NEW="your-aws-access-key"
AWS_SECRET_ACCESS_KEY_NEW="your-aws-secret-key"
S3_BUCKET_NAME_NEW="your-bucket-name"
EMAIL_SENDER_ADDRESS="noreply@yourdomain.com"

# Canva API
BASE_CANVA_CONNECT_API_URL="https://api.canva.com"
CANVA_CLIENT_ID="your-canva-client-id"
CANVA_CLIENT_SECRET="your-canva-client-secret"

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Public URLs
NEXT_PUBLIC_FILE_STORAGE_HOST="https://storage.yourdomain.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Development
NODE_ENV="development"
```

**Required API Keys:**

- **PostgreSQL Database:** Set up a PostgreSQL instance locally or use a cloud provider
- **Auth Secret:** Generate using `openssl rand -base64 32`
- **AWS Credentials:** Create an IAM user with S3 and SES permissions
- **Canva API:** Register at [Canva Developers](https://www.canva.com/developers/)
- **Google AI:** Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OAuth Providers:** Configure GitHub and Google OAuth apps in respective developer consoles

### Database Setup

1. **Run Prisma migrations**

   ```bash
   pnpm prisma migrate dev
   # or
   npx prisma migrate dev
   ```

2. **Generate Prisma Client**

   ```bash
   pnpm prisma generate
   ```

3. **Seed the database (optional)**

   ```bash
   pnpm prisma db seed
   ```

## 💻 Development

### Running the Development Server

```bash
pnpm dev
```

The application will be available at:
- Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run ESLint
pnpm typecheck          # Run TypeScript compiler
pnpm format:check       # Check code formatting
pnpm format:write       # Format code with Prettier

# Database (using Prisma CLI)
npx prisma studio       # Open Prisma Studio
npx prisma migrate dev  # Run migrations

# Email Development
pnpm email:dev          # Start email preview server
```

### Linting and Formatting

This project uses ESLint and Prettier for code quality:

```bash
# Check for linting errors
pnpm lint

# Check formatting
pnpm format:check

# Auto-fix formatting
pnpm format:write

# Type check
pnpm typecheck
```

## 🌍 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jainhardik120/hardik-jain)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed on any platform that supports Next.js:

- **Docker**: See `Dockerfile` (if available)
- **Railway**: Connect GitHub repository
- **Netlify**: Use Next.js runtime
- **Self-hosted**: Build and use `pnpm start`

**Production Build:**

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
hardik-jain/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   └── placeholder.svg        # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (home)/           # Public portfolio pages
│   │   ├── admin/            # Admin panel routes
│   │   ├── api/              # API routes
│   │   └── auth/             # Authentication pages
│   ├── components/           # React components
│   ├── server/
│   │   └── api/              # tRPC routers
│   ├── lib/                  # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   ├── actions/              # Server actions
│   └── env.ts                # Environment validation
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS config
└── tsconfig.json             # TypeScript config
```

## 📚 API Documentation

This project uses tRPC for type-safe APIs. The API is organized into routers:

- **Auth Router** (`/api/trpc/auth.*`) - Authentication and user management
- **Post Router** (`/api/trpc/post.*`) - Blog post CRUD operations
- **Portfolio Router** (`/api/trpc/portfolio.*`) - Portfolio content
- **File Router** (`/api/trpc/files.*`) - File upload and management
- **Canva Router** (`/api/trpc/canva.*`) - Canva integration
- **Contact Router** (`/api/trpc/contact.*`) - Contact form handling
- **Task Router** (`/api/trpc/tasks.*`) - Task management
- **Email Router** (`/api/trpc/email.*`) - Email templates

All API endpoints are type-safe and automatically validated using Zod schemas.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Hardik Jain](https://github.com/jainhardik120)**

If you found this project helpful, please give it a ⭐️!

</div>