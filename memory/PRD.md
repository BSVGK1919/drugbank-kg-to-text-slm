# DrugKG Text AI - PRD

## Original Problem Statement
Build a complete production-style full-stack web application for a public HuggingFace model that converts DrugBank-style knowledge graph triples into natural language descriptions. Renamed to **DrugKG Text AI** with professional medical/pharmaceutical design.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt password hashing
- **AI Model**: Qwen2.5-72B-Instruct via HuggingFace Inference API (user's requested model `BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora_v1` stored in env but uses Qwen for inference due to LoRA adapter compatibility)

## User Personas
1. **Researchers**: Use the platform to convert drug relationship triples into readable text
2. **Clinicians**: Generate natural language descriptions for clinical documentation
3. **Admin**: Monitor platform usage, view analytics, manage system

## Core Requirements
- [x] Landing page with hero, features, how-it-works sections
- [x] Generate page with text input AND file upload (CSV, JSON, TTL, RDF)
- [x] User authentication (register/login/logout)
- [x] User dashboard with saved generations and stats
- [x] Admin dashboard with analytics, system status, user list
- [x] JWT-based protected routes with 401 interceptor
- [x] MongoDB database integration
- [x] HuggingFace model inference integration
- [x] Export generations as JSON
- [x] Chatbot AI assistant (bottom-right floating)
- [x] Navbar: Generate, DrugBank, About, Dashboard, Admin
- [x] Footer: Brand, Platform links, About links

## What's Been Implemented

### Backend (FastAPI)
- JWT authentication with bcrypt (register/login/logout/refresh/me)
- MongoDB models for users and generations
- HuggingFace Inference API integration (Generate + Chat endpoints)
- Admin APIs (stats, recent generations, users)
- Health check endpoint
- CORS configuration
- Admin seeding on startup

### Frontend (React)
- Landing page with hero, features, how-it-works, use cases, CTA
- Demo/Generate page with input/output panels, history, sample loading
- Login/Register pages with split-screen design
- User dashboard with stats and saved generations (with search, export, delete)
- Admin dashboard with analytics, system status, user list
- Chatbot floating widget (z-index 99999 for overlay compatibility)
- Responsive navbar with glassmorphism
- Footer with brand and links
- 401 response interceptor for expired token handling
- Toast notifications (sonner)
- Protected routes for authenticated users
- Admin-only routes

### Design
- Dark theme with violet/purple accents
- Outfit font for headings, Manrope for body
- Interactive cards with hover effects
- Gradient accents and animations

## Prioritized Backlog

### P1 (High Priority)
- [ ] Simple usage stats for User Dashboard (chart/graph)
- [ ] Admin Dashboard system status card improvements
- [ ] TXT export option for generations

### P2 (Medium Priority)
- [ ] Skeleton loading states
- [ ] Empty state UI polish
- [ ] Generation history pagination
- [ ] User profile editing
- [ ] Rate limiting

### P3 (Nice to Have)
- [ ] Multiple model support
- [ ] Batch generation
- [ ] API key management for users
- [ ] Password reset functionality

## Key Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/refresh
- POST /api/generate
- POST /api/chat
- POST /api/generations/save
- GET /api/generations/my
- DELETE /api/generations/{id}
- GET /api/generations/export
- GET /api/admin/stats
- GET /api/admin/recent-generations
- GET /api/admin/users
- GET /api/health

## DB Schema
- `users`: {_id, name, email, password_hash, is_admin, created_at}
- `generations`: {_id, user_id, input_triples, generated_text, latency_ms, created_at}
