<div align="center">

# 🏢 Kenzo HRMS

### Smart Workforce Management for Modern Enterprises

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-teal?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

</div>

---

## 🚀 Overview

Kenzo HRMS is a production-grade, enterprise-class Human Resource Management System designed to manage the complete employee lifecycle. Built as a multi-tenant platform, it supports startups, SMEs, and enterprises with a modern, API-first architecture.

## ✨ Features

- **🔐 Authentication & Security** — Email/password, OAuth, MFA, session management
- **🏗️ Organization Management** — Companies, branches, departments, teams, designations
- **👤 Employee 360** — Complete employee lifecycle management
- **📋 Attendance** — Clock in/out, GPS, shifts, overtime, analytics
- **🌴 Leave Management** — Leave policies, requests, approvals, balances
- **💰 Payroll** — Salary structures, processing, payslips, tax calculations
- **🎯 Recruitment (ATS)** — Job requisitions, candidate tracking, interviews, offers
- **📈 Performance** — OKRs, KPIs, 360° reviews, promotions
- **📦 Asset Management** — Device tracking, assignments, maintenance
- **🎫 Helpdesk** — HR, IT, Finance ticketing with SLA tracking
- **📊 Reports & Analytics** — Comprehensive workforce analytics
- **🤖 AI Copilot** — AI-powered HR assistance (Phase 4)

## 🏗️ Architecture

```
Monorepo (npm workspaces)
├── apps/web          → Next.js 15 Frontend
├── apps/api          → NestJS Backend
├── packages/         → Shared packages
├── docs/             → Documentation
└── docker/           → Docker configuration
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI |
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Database** | PostgreSQL 16 (Neon) |
| **Cache** | Redis 7 |
| **Auth** | JWT + Passport.js |
| **API Docs** | OpenAPI/Swagger |

## 📦 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose (for local services)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Kenzo_Kore_HRMS

# Install dependencies
npm install

# Start local services (PostgreSQL, Redis)
docker compose -f docker/docker-compose.yml up -d

# Set up environment
cp .env.example .env
# Edit .env with your database connection string

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:migrate

# Seed demo data
npm run db:seed

# Start development servers
npm run dev:web   # Frontend on http://localhost:3000
npm run dev:api   # Backend on http://localhost:4000
```

### Demo Credentials

```
Email:    admin@kenzo.com
Password: Admin@123
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [Architecture](docs/architecture.md) | System Architecture |
| [Database ERD](docs/database-erd.md) | Entity Relationship Diagram |
| [API Specification](docs/API-specification.md) | REST API Documentation |
| [RBAC Matrix](docs/RBAC-matrix.md) | Role-Permission Matrix |
| [Security Checklist](docs/security-checklist.md) | Security Requirements |
| [Deployment Guide](docs/deployment-guide.md) | Deployment Instructions |
| [Testing Strategy](docs/testing-strategy.md) | Test Plans |

## 🔒 Multi-Tenancy

Kenzo HRMS uses **row-level tenant isolation** with `tenant_id` on every table. Each tenant gets:
- Isolated data
- Custom roles & permissions
- Configurable settings
- Independent leave/payroll policies

## 📄 License

Proprietary — All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ by Kenzo</strong>
</div>
