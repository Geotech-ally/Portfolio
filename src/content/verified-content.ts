export type VerifiedProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  problem: string;
  solution: string;
  features: string[];
  role: string;
  status: "in_progress" | "completed" | "maintained" | "archived";
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  project_technologies: { technology: string }[];
  project_images: { id: string; image_path: string; caption: string | null; sort_order: number }[];
  content_status: "draft" | "published" | "archived";
};

export const VERIFIED_PROFILE = {
  full_name: "Geoffrey Akoo",
  professional_title: "Full-Stack Developer + Cybersecurity Analyst",
  short_bio:
    "I build practical digital products with a strong emphasis on security, maintainability, and clear product thinking.",
  long_bio:
    "I design and build modern web applications and platform systems with a security-aware mindset. My work spans frontend interfaces, backend logic, data access, and resilient product architecture.",
  location: "Bondo, Siaya County, Kenya",
  email: "lemkwangjaline@gmail.com",
  github_url: "https://github.com/Geotech-ally",
  linkedin_url: null,
  phone: "+254 768 998 191",
  other_links: [],
} as const;

export const VERIFIED_PROJECTS: VerifiedProject[] = [
  {
    id: "project-siaya-community-digital-hub",
    title: "Siaya Community Digital Hub Learning Platform",
    slug: "siaya-community-digital-hub",
    short_description:
      "A community learning platform that connects users to digital education resources, course workflows, and user-focused learning experiences.",
    full_description:
      "The Siaya Community Digital Hub Learning Platform is a monorepo project built with a Next.js frontend and a NestJS backend connected to a Prisma data layer. It focuses on delivering accessible learning experiences, supporting course discovery, quizzes, user management, and secure role-based access patterns.",
    problem:
      "Communities need a digital learning environment that can organize educational content, support user access, and create a more consistent learning experience across the platform.",
    solution:
      "The platform brings together a Next.js frontend, a NestJS API, and Prisma-managed data access to provide a structured course and quiz experience with user authentication and role-aware access controls.",
    features: [
      "Next.js frontend for course and user experiences",
      "NestJS backend API with authentication and user flows",
      "Prisma database layer for structured data access",
      "Course, user, and quiz-related workflows",
      "REST API endpoints for learning platform operations",
    ],
    role: "Full-stack and product-oriented implementation work across the application stack.",
    status: "completed",
    github_url: "https://github.com/Geotech-ally/Siaya-Community-Digital-Hub-Learning-Platfrom.git",
    live_url: null,
    featured: true,
    sort_order: 1,
    project_technologies: [
      { technology: "Next.js" },
      { technology: "NestJS" },
      { technology: "Prisma" },
      { technology: "PostgreSQL" },
      { technology: "TypeScript" },
      { technology: "REST API" },
      { technology: "JWT" },
    ],
    project_images: [],
    content_status: "published",
  },
  {
    id: "project-datalens-saas-analytics",
    title: "DataLens — SaaS Analytics Platform",
    slug: "saas-analytics",
    short_description:
      "A multi-tenant SaaS analytics platform designed for secure data processing, organizational isolation, and operational reporting.",
    full_description:
      "DataLens combines a React frontend with Django REST Framework for authentication and organization-level workflows, plus a FastAPI analytics service for data processing, KPI calculations, anomaly detection, and trend analysis. The design emphasizes secure tenant isolation and structured analytics workflows.",
    problem:
      "Organizations need a way to manage datasets, apply analytics, and maintain clear access boundaries for business data without compromising security or operational clarity.",
    solution:
      "The platform separates authentication and organization logic from analytics processing, enabling role-based access, organization-scoped data access, and analytics services focused on reporting and insight generation.",
    features: [
      "React frontend for dashboards and analytics workflows",
      "Django REST Framework for authentication and organization management",
      "FastAPI analytics service for KPI, trend, and anomaly logic",
      "Organization-scoped access and RBAC patterns",
      "Dataset processing and reporting workflows",
      "JWT-based authentication and tenant isolation",
    ],
    role: "Product and application engineering across frontend, backend, and security-aware architecture patterns.",
    status: "completed",
    github_url: "https://github.com/Geotech-ally/saas-analytics.git",
    live_url: null,
    featured: true,
    sort_order: 2,
    project_technologies: [
      { technology: "React" },
      { technology: "TypeScript" },
      { technology: "Django" },
      { technology: "Django REST Framework" },
      { technology: "FastAPI" },
      { technology: "PostgreSQL" },
      { technology: "JWT" },
      { technology: "RBAC" },
      { technology: "Docker" },
    ],
    project_images: [],
    content_status: "published",
  },
  {
    id: "project-portfolio",
    title: "Portfolio",
    slug: "portfolio",
    short_description:
      "A professional portfolio and content-driven web application built to present projects, skills, and technical work in a secure and maintainable way.",
    full_description:
      "This portfolio is built with React, TypeScript, Vite, and Supabase to provide a modern public-facing site with structured content and an admin-friendly content model. It combines secure public reads with content storage, routing, and reusable UI patterns.",
    problem:
      "A strong portfolio needs to communicate technical capability clearly while keeping the content easy to update, secure, and maintainable.",
    solution:
      "The application uses a React + TypeScript architecture with route-based public pages, a service layer, and Supabase-backed content storage for structured project, skill, and profile data.",
    features: [
      "React + TypeScript frontend with Vite",
      "Responsive portfolio pages and project detail views",
      "Supabase-powered content and data access",
      "TanStack Query state management",
      "React Router navigation and reusable UI patterns",
      "RLS-aware content architecture",
    ],
    role: "End-to-end portfolio implementation and system design for the public-facing experience.",
    status: "maintained",
    github_url: "https://github.com/Geotech-ally/Portfolio.git",
    live_url: null,
    featured: true,
    sort_order: 3,
    project_technologies: [
      { technology: "React" },
      { technology: "TypeScript" },
      { technology: "Vite" },
      { technology: "Tailwind CSS" },
      { technology: "Supabase" },
      { technology: "PostgreSQL" },
      { technology: "TanStack Query" },
    ],
    project_images: [],
    content_status: "published",
  },
  {
    id: "project-health",
    title: "Health",
    slug: "health",
    short_description:
      "A healthcare management system focused on structured patient, doctor, appointment, and operational workflows around medical data handling.",
    full_description:
      "The Health project is organized as a monorepo with a Django backend and React frontend, covering domain areas such as users, patients, doctors, appointments, finance, pharmacy, and lab workflows. The repository documentation identifies a healthcare-focused application architecture with separate domain apps.",
    problem:
      "Healthcare operations require reliable workflow management across patient records, appointment scheduling, prescriptions, referral pathways, and operational coordination.",
    solution:
      "The repository organizes healthcare functionality into distinct backend domain apps and a Vite + React frontend to keep the application modular and maintainable while supporting major healthcare processes.",
    features: [
      "Django backend for domain operations",
      "React frontend with separate page and component structure",
      "Users, patients, doctors, appointments, finance, and pharmacy modules",
      "Django REST Framework API endpoints",
      "Healthcare workflow organization across major operational domains",
    ],
    role: "Application architecture and healthcare workflow-oriented application work.",
    status: "completed",
    github_url: "https://github.com/Geotech-ally/Health.git",
    live_url: null,
    featured: true,
    sort_order: 4,
    project_technologies: [
      { technology: "React" },
      { technology: "Django" },
      { technology: "Django REST Framework" },
      { technology: "PostgreSQL" },
      { technology: "JWT" },
      { technology: "Vite" },
    ],
    project_images: [],
    content_status: "published",
  },
  {
    id: "project-smart-voting-system",
    title: "Smart Voting System",
    slug: "smart-voting-system",
    short_description:
      "A blockchain-based voting platform using a React frontend and Solidity smart contracts for transparent, wallet-connected election workflows.",
    full_description:
      "The Smart Voting System repo contains a React + Vite frontend and a Hardhat backend for deployment and testing of Solidity smart contracts. It emphasizes wallet-based voting, election logic, and a decentralized voting experience on Ethereum-compatible infrastructure.",
    problem:
      "Elections and voting workflows need transparency, immutability, and user trust in the system of record for votes.",
    solution:
      "The platform combines a frontend for ballot and result presentation with Solidity contracts and Hardhat tooling to support on-chain voting workflows and deployment testing.",
    features: [
      "React + Vite frontend",
      "Solidity smart contracts for blockchain-backed voting",
      "Hardhat deployment and testing workflow",
      "MetaMask wallet integration",
      "Ethereum-compatible voting application",
      "Real-time results and election UI",
    ],
    role: "Frontend and blockchain-aware application implementation in a decentralized election workflow.",
    status: "completed",
    github_url: "https://github.com/Geotech-ally/SmartVotingSystem.git",
    live_url: null,
    featured: true,
    sort_order: 5,
    project_technologies: [
      { technology: "React" },
      { technology: "TypeScript" },
      { technology: "Vite" },
      { technology: "Solidity" },
      { technology: "Hardhat" },
      { technology: "Ethereum" },
      { technology: "MetaMask" },
      { technology: "Tailwind CSS" },
    ],
    project_images: [],
    content_status: "published",
  },
];

export const VERIFIED_SKILL_GROUPS = [
  {
    title: "Frontend Development",
    description: "User-facing product work built with maintainable interfaces and modern web patterns.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend Development",
    description: "Application logic, service layers, and backend workflows that support product functionality.",
    technologies: [
      "Node.js",
      "NestJS",
      "Python",
      "Django",
      "Django REST Framework",
      "FastAPI",
      "REST APIs",
    ],
  },
  {
    title: "Databases & Data",
    description: "Structured data modeling and data access patterns for reliable application systems.",
    technologies: [
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "Database design",
      "Data processing",
      "Analytics",
    ],
  },
  {
    title: "DevOps / Infrastructure",
    description: "Operational awareness for deployment, environment setup, and development workflows.",
    technologies: ["Docker", "Docker Compose", "Linux", "Nginx", "Git", "Deployment tooling"],
  },
  {
    title: "Cybersecurity & Secure Systems",
    description: "Security-aware engineering grounded in application risk, access control, and system review.",
    technologies: [
      "OWASP",
      "Authentication",
      "Authorization",
      "RBAC",
      "JWT",
      "RLS",
      "Tenant isolation",
      "Network security",
      "Linux security",
      "Nmap",
      "Wireshark",
      "Kali Linux",
    ],
  },
] as const;

export const VERIFIED_TRAINING_RECORDS = [
  {
    name: "Cisco Introduction to Cybersecurity",
    issuer: "Cisco",
    type: "Training",
    description: "Foundational cybersecurity awareness covering principles, threats, and secure system thinking.",
  },
  {
    name: "Artificial Intelligence",
    issuer: "Cisco",
    type: "Training",
    description: "AI-focused learning supporting practical understanding of modern data and intelligent systems.",
  },
  {
    name: "Cisco Basic Networking",
    issuer: "Cisco",
    type: "Training",
    description: "Networking fundamentals covering core concepts, connectivity, and infrastructure awareness.",
  },
  {
    name: "Introduction to JavaScript",
    issuer: "Learning path / course",
    type: "Course",
    description: "Programming fundamentals for web application development and front-end logic.",
  },
  {
    name: "Python Essentials",
    issuer: "Learning path / course",
    type: "Course",
    description: "Core Python concepts relevant to backend development, automation, and scripting work.",
  },
] as const;
