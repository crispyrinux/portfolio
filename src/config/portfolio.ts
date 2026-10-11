/**
 * ============================================================================
 *  YOUR PORTFOLIO — edit this file and nothing else.
 * ============================================================================
 *
 *  This is the single source of truth for everything a visitor sees: your
 *  name, photo, bio, projects, skills, experience and links.
 */

import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Layers,
  Gauge,
  Boxes,
  GitBranch,
  Terminal,
  Sparkles,
  Compass,
  Database,
  Server,
  Network,
  Cpu,
  type LucideProps,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Personal                                                                  */
/* -------------------------------------------------------------------------- */

export const personal = {
  name: "Hammam Muhammad Yazid",
  /** Shown in the browser tab and the footer. */
  shortName: "Hammam",
  /** Your job title. Appears under your name. */
  role: "Backend & Systems Developer",
  /** One line under your name. Keep it under about 60 characters. */
  tagline: "I build scalable backends, robust APIs, and decentralized systems.",
  /** Rotates in the hero, one phrase at a time. */
  rotatingRoles: [
    "Backend Engineer",
    "Computer Science @ UGM",
    "Distributed & P2P Systems",
    "Web3 & Blockchain Builder",
  ],
  /** Your photo. Drop a file in public/images/ and point at it. */
  avatar: "/images/avatar.svg",
  /** Optional second photo shown in the About page. */
  portrait: "/images/portrait.svg",
  /** A few words shown in the About section. */
  shortBio:
    "Computer Science undergraduate at Universitas Gadjah Mada (GPA 3.77) focusing on backend engineering, distributed architectures, and blockchain systems. I design robust APIs, data models, and network protocols from first principles.",
  /** The longer version, used on /about. */
  longBio: [
    "I am an undergraduate Computer Science student at Universitas Gadjah Mada (GPA 3.77 / 4.00) with a deep focus on backend engineering, distributed systems, and decentralized protocols. I build software from the data layer up—prioritizing contract-first APIs, relational normalization, and clean service boundaries over hype.",
    "My hands-on experience includes engineering high-throughput competition platforms in Go and Redis, evaluating platform architectures at Kominfo Kulon Progo, developing tokenized P2P lending platforms with smart contract integration via Viem, and implementing custom peer-to-peer TCP protocols from scratch.",
    "Beyond software development, I actively train in algorithmic problem-solving with KOMATIK UGM (Competitive Programming Division) and build backend systems within student engineering organizations like OMAHTI and BEM KM UGM.",
  ],
  location: "Yogyakarta, Indonesia",
  timezone: "WIB (UTC+7)",
  email: "hammammuhammady@gmail.com",
  /** Shown as a green dot if true. Great for getting freelance work. */
  availableForWork: true,
  availableForWorkText: "Open to backend roles & internships",
  /** Path to a PDF resume inside public/. Set to null to hide the button. */
  resume: null,
  /** Used for the page title, meta description and social cards. */
  seo: {
    title: "Hammam Muhammad Yazid — Backend & Systems Developer",
    description:
      "Computer Science student at Universitas Gadjah Mada specializing in backend engineering, Go, NestJS, PostgreSQL, distributed systems, and Web3 integrations.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Socials and links                                                         */
/* -------------------------------------------------------------------------- */

export interface SocialLink {
  label: string;
  href: string;
  /** Shown in the hero and the footer. */
  primary?: boolean;
}

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/crispyrinux", primary: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hammam-muhammad-yazid-14407b323", primary: true },
  { label: "Portfolio", href: "https://crispyrinux.vercel.app/", primary: true },
  { label: "Email", href: `mailto:${personal.email}` },
];

/** Buttons in the hero. The first one is styled as the primary action. */
export const heroActions: ReadonlyArray<{ label: string; href: string; primary?: boolean }> = [
  { label: "See my projects", href: "/projects", primary: true },
  { label: "About me", href: "/about" },
  { label: "Get in touch", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/*  Numbers shown in the hero                                                  */
/* -------------------------------------------------------------------------- */

export const heroStats = [
  { value: 5, suffix: "+", label: "Shipped systems", hint: "Backend and distributed architectures deployed" },
  { value: 4, suffix: "", label: "Engineering roles", hint: "Kominfo, BEM KM UGM, OMAHTI, KOMATIK" },
  { value: 8, suffix: "+", label: "Core technologies", hint: "Go, NestJS, TypeScript, Docker, Postgres, Redis, Viem, C++" },
  { value: 100, suffix: "%", label: "Contract-first", hint: "Rigorous API specifications & schema integrity" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
  { label: "Motion Lab", href: "/lab" },
] as const;

/* -------------------------------------------------------------------------- */
/*  What I do                                                                 */
/* -------------------------------------------------------------------------- */

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional: which of your skills it maps to. */
  skills: string[];
}

export const services: Service[] = [
  {
    icon: Layers,
    title: "Backend & High-Throughput APIs",
    description:
      "Contract-first RESTful APIs and real-time WebSocket pipelines built for correctness, low latency, and high concurrency.",
    skills: ["NestJS", "Go / Gin", "Node.js", "WebSockets"],
  },
  {
    icon: Database,
    title: "Database Architecture",
    description:
      "Normalized relational schemas, Prisma & GORM mapping, query optimization, and distributed caching with PostgreSQL, MySQL, and Redis.",
    skills: ["PostgreSQL", "MySQL", "Prisma ORM", "Redis"],
  },
  {
    icon: Network,
    title: "Distributed & Network Systems",
    description:
      "Low-level socket programming, peer-to-peer mesh networking, packet framing, and encrypted data transport from first principles.",
    skills: ["TCP Sockets", "Distributed Systems", "Cryptography", "Go"],
  },
  {
    icon: Sparkles,
    title: "Web3 & Smart Contract Integration",
    description:
      "Bridging off-chain enterprise backend microservices with on-chain EVM smart contracts, state reconciliation, and crypto ledgers.",
    skills: ["Viem", "Smart Contracts", "Blockchain", "Tokenization"],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Skills                                                                    */
/* -------------------------------------------------------------------------- */

export interface SkillGroup {
  title: string;
  icon: LucideIcon;
  /** 0-100. Shown as a bar; keep it honest, it is a portfolio. */
  skills: Array<{ name: string; level: number; note?: string }>;
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: Code2,
    skills: [
      { name: "TypeScript", level: 92, note: "Primary backend language" },
      { name: "Go", level: 86, note: "High-throughput services" },
      { name: "C++", level: 84, note: "Competitive programming" },
      { name: "JavaScript", level: 90 },
      { name: "SQL", level: 88, note: "Relational queries & DDL" },
      { name: "Python", level: 78, note: "Tooling & scripting" },
    ],
  },
  {
    title: "Backend & APIs",
    icon: Boxes,
    skills: [
      { name: "NestJS", level: 92, note: "Enterprise modular design" },
      { name: "Node.js / Express", level: 90 },
      { name: "Gin (Go)", level: 84, note: "Concurrent endpoints" },
      { name: "Prisma ORM & GORM", level: 88 },
      { name: "REST APIs & WebSockets", level: 94 },
    ],
  },
  {
    title: "Databases & DevOps",
    icon: Server,
    skills: [
      { name: "PostgreSQL", level: 90, note: "Daily driver" },
      { name: "MySQL", level: 85 },
      { name: "Redis", level: 84, note: "Distributed caching" },
      { name: "Docker", level: 84, note: "Containerization" },
      { name: "Git & GitHub Actions", level: 88, note: "CI/CD & versioning" },
    ],
  },
  {
    title: "Systems & Web3",
    icon: Cpu,
    skills: [
      { name: "TCP Sockets & Networking", level: 86, note: "Raw socket protocols" },
      { name: "Smart Contract Integration", level: 80, note: "Viem & Web3" },
      { name: "Algorithms & Complexity", level: 90, note: "KOMATIK UGM" },
      { name: "Postman & Swagger", level: 88, note: "API contract specs" },
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Experience                                                                */
/* -------------------------------------------------------------------------- */

export interface ExperienceEntry {
  role: string;
  company: string;
  /** Use the format "2023 - Present" or "Jan 2023 - Jun 2024". */
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  tech: string[];
  /** "current" is highlighted in the timeline. */
  status?: "current" | "past";
}

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer Intern",
    company: "Dinas Kominfo Kulon Progo",
    period: "Sep 2026 - Present",
    location: "Kulon Progo, D.I. Yogyakarta",
    summary:
      "Collaborated with cross-functional engineering teams to evaluate legacy architectures and define modern technical solutions for the regional tourism digital platform.",
    highlights: [
      "Evaluated an existing Laravel-based platform to support system architecture assessment and technology stack decisions",
      "Participated in client discovery discussions with the Kulon Progo Tourism Office to translate complex business needs into technical requirements",
      "Drafted architectural assessments for scalable, high-availability public digital services",
    ],
    tech: ["System Architecture", "Laravel", "Requirements Engineering", "API Design"],
    status: "current",
  },
  {
    role: "Research & Development (Digital Product)",
    company: "BEM KM Universitas Gadjah Mada",
    period: "May 2025 - May 2026",
    location: "Yogyakarta, Indonesia",
    summary:
      "Developed and maintained backend services for the BEM KM UGM central organization website using NestJS and PostgreSQL.",
    highlights: [
      "Designed and implemented RESTful APIs for authentication, event management, and campus organizational operations",
      "Managed database schema design and migrations in PostgreSQL ensuring relational consistency",
      "Collaborated closely with frontend engineers to guarantee seamless integration and deployment",
    ],
    tech: ["NestJS", "TypeScript", "PostgreSQL", "REST APIs", "Prisma ORM"],
    status: "past",
  },
  {
    role: "Backend Division Member",
    company: "OMAHTI (Organisasi Mahasiswa Ahli TI)",
    period: "Dec 2024 - Present",
    location: "Yogyakarta, Indonesia",
    summary:
      "Spearheading backend feature development, API integrations, and code reviews across internal IT department projects.",
    highlights: [
      "Contributed to core department web projects during OMAHTI Internship Month, collaborating in agile teams",
      "Implemented and optimized backend features using Node.js, Express.js, and NestJS",
      "Mentored peers on RESTful architectural conventions and database normalization best practices",
    ],
    tech: ["Node.js", "Express.js", "NestJS", "API Integration", "PostgreSQL"],
    status: "current",
  },
  {
    role: "Competitive Programmer",
    company: "KOMATIK UGM",
    period: "Feb 2025 - Feb 2026",
    location: "Yogyakarta, Indonesia",
    summary:
      "Trained in advanced algorithmic problem solving, graph theory, dynamic programming, and computational complexity.",
    highlights: [
      "Participated in national competitive programming contests and problem-solving training sessions",
      "Supported peer workshops and mentoring sessions for members to enhance algorithmic thinking and implementation speed",
    ],
    tech: ["C++", "Algorithms", "Data Structures", "Computational Complexity"],
    status: "past",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export interface Project {
  /** Used in the URL: /projects/your-slug */
  slug: string;
  title: string;
  /** One line for the card. */
  summary: string;
  /** Longer, shown on the detail page. An array is one paragraph each. */
  description: string[];
  /** Path inside public/images/projects/ */
  image: string;
  tech: string[];
  year: string;
  status?: "live" | "building" | "archived";
  /** Puts it first and makes it bigger on the home page. */
  featured?: boolean;
  links?: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
  /** What makes it interesting. Shown as a list on the detail page. */
  highlights?: string[];
  /** The part you are proudest of. */
  proudest?: string;
}

export const projects: Project[] = [
  {
    slug: "joints-inspire-2026",
    title: "JOINTS × INSPIRE 2026",
    summary:
      "Real-time exam & competition backend platform handling team-based attempts, automated code grading, and live session state.",
    description: [
      "Backend service engine for a timed, exam-style programming and logic competition platform built for JOINTS × INSPIRE. Built with high concurrency requirements in mind, it handles synchronized team attempts, submission ingestion, and automated grading.",
      "Leveraged Go and Gin for high-throughput request handling, Redis for distributed session caching and rate-limiting, and WebSockets for instantaneous participant status updates and exam state synchronization.",
    ],
    image: "/images/projects/joints-inspire.svg",
    tech: ["Go", "Gin", "PostgreSQL", "Redis", "WebSocket"],
    year: "2026",
    status: "live",
    featured: true,
    links: {
      repo: "https://github.com/crispyrinux",
    },
    highlights: [
      "Real-time participant session handling and state broadcasts using WebSockets",
      "Automated evaluation and grading pipeline handling concurrent code and logic submissions",
      "Sub-millisecond session validation and attempt locking backed by Redis caching",
    ],
    proudest:
      "Architecting a resilient session state machine that handles team reconnections and concurrent submission grading without race conditions.",
  },
  {
    slug: "reflow-p2p-lending",
    title: "ReFlow",
    summary:
      "Blockchain-based P2P lending tokenization platform combining NestJS backend services with smart contract integration.",
    description: [
      "ReFlow bridges decentralized finance and real-world lending by tokenizing debt instruments on-chain while maintaining a robust, audit-compliant off-chain service layer.",
      "Engineered with NestJS and TypeScript, featuring strict role-based access control, relational debt ledgers in PostgreSQL via Prisma ORM, and seamless EVM smart contract interactions using Viem.",
    ],
    image: "/images/projects/reflow.svg",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "Prisma ORM", "Viem", "Web3"],
    year: "2026",
    status: "live",
    featured: true,
    links: {
      repo: "https://github.com/crispyrinux",
    },
    highlights: [
      "Event-driven smart contract interaction and transaction receipt verification with Viem",
      "Normalized relational financial ledger ensuring complete double-entry balance integrity",
      "JWT authentication and multi-tiered participant authorization pipelines",
    ],
    proudest:
      "Creating a reliable reconciliation service syncing on-chain token states with off-chain PostgreSQL database records.",
  },
  {
    slug: "p2p-terminal-chat",
    title: "P2P Terminal Chat",
    summary:
      "A decentralized peer-to-peer terminal chat application built from scratch over raw TCP sockets with end-to-end encryption.",
    description: [
      "An exploration into distributed networking and systems programming. Rather than relying on centralized brokers or HTTP overhead, this system establishes direct peer-to-peer TCP socket meshes between terminal clients.",
      "Features a modular architecture strictly decoupling the TCP networking layer, end-to-end cryptographic framing, CLI interactive terminal rendering, and message dispatch routines.",
    ],
    image: "/images/projects/p2p-terminal-chat.svg",
    tech: ["TypeScript", "TCP Sockets", "Cryptography", "Node.js", "Networking"],
    year: "2025",
    status: "live",
    featured: true,
    links: {
      repo: "https://github.com/crispyrinux",
    },
    highlights: [
      "Direct peer-to-peer node discovery and bidirectional TCP socket transport",
      "End-to-end encrypted packet payloads preventing network tampering and eavesdropping",
      "Clean decoupled architecture separating networking, crypto, and CLI presentation",
    ],
    proudest:
      "Designing a custom message framing protocol that safely handles fragmented TCP stream packets without dropped frames.",
  },
  {
    slug: "url-shortener-platform",
    title: "URL Shortener Platform",
    summary:
      "Full-stack scalable link shortener featuring real-time click analytics, Midtrans payment gateway, and Dockerized deployment.",
    description: [
      "A production-grade SaaS URL shortening and redirection engine with sub-10ms redirection overhead, user tiers, and rich visitor telemetry analytics.",
      "Implemented with NestJS and Next.js, featuring Prisma ORM over PostgreSQL, Midtrans subscription webhook processing, and containerized Docker environments for reproducible deployments.",
    ],
    image: "/images/projects/url-shortener.svg",
    tech: ["NestJS", "Next.js", "PostgreSQL", "Prisma ORM", "Docker", "Midtrans"],
    year: "2025",
    status: "live",
    featured: false,
    links: {
      repo: "https://github.com/crispyrinux",
    },
    highlights: [
      "Webhook-driven subscription billing integration with Midtrans payment gateway",
      "High-performance base62 slug redirection with relational analytics tracking",
      "Dockerized deployment setup for zero-configuration environment parity",
    ],
  },
  {
    slug: "expert-system-cbr",
    title: "Expert System CBR",
    summary:
      "Web-based diagnostic engine for crop disease identification utilizing Case-Based Reasoning and Nearest Neighbor algorithms.",
    description: [
      "An artificial intelligence decision-support platform designed to assist farmers in identifying rice crop pests and diseases using empirical historical cases.",
      "Implements Case-Based Reasoning (CBR) alongside Euclidean Nearest Neighbor similarity matching, backed by a structured NestJS and PostgreSQL service layer providing transparent diagnostic confidence scoring.",
    ],
    image: "/images/projects/expert-system-cbr.svg",
    tech: ["NestJS", "Prisma ORM", "PostgreSQL", "Case-Based Reasoning", "Nearest Neighbor"],
    year: "2025",
    status: "live",
    featured: false,
    links: {
      repo: "https://github.com/crispyrinux",
    },
    highlights: [
      "Case-Based Reasoning algorithm calculating explainable similarity scores from symptoms",
      "Knowledge base management API for domain experts and agronomists",
      "Normalized relational schema for symptom weighting and diagnostic historical logs",
    ],
  },
] as const;

/** Tags used by the filter on /projects. Built from the projects above. */
export const projectTags = [
  "Go",
  "NestJS",
  "TypeScript",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Web3",
  "TCP Sockets",
] as const;

/* -------------------------------------------------------------------------- */
/*  Recognition and currently learning                                          */
/* -------------------------------------------------------------------------- */

export const highlights = [
  { label: "University", value: "Universitas Gadjah Mada (GPA 3.77 / 4.00)" },
  { label: "Core focus", value: "Backend engineering, distributed & P2P systems" },
  { label: "Current internship", value: "Software Engineer Intern @ Kominfo Kulon Progo" },
  { label: "Active organization", value: "OMAHTI UGM Backend Division" },
] as const;

/* -------------------------------------------------------------------------- */
/*  SEO                                                                       */
/* -------------------------------------------------------------------------- */

export const seo = {
  title: personal.seo.title,
  description: personal.seo.description,
  keywords: [
    "Hammam Muhammad Yazid",
    "portfolio",
    "backend developer",
    "universitas gadjah mada",
    "ugm computer science",
    "nestjs",
    "go developer",
    "typescript",
    "postgresql",
    "distributed systems",
    "web3 developer",
  ],
  /** Set to your own domain once you have one. Used for canonical URLs. */
  siteUrl: "https://crispyrinux.vercel.app",
  /** Your own repo, shown in the header, footer and on the landing page. */
  repository: "https://github.com/crispyrinux",
  author: personal.name,
  license: "MIT",
  twitter: "@crispyrinux",
} as const;

/* -------------------------------------------------------------------------- */
/*  Derived helpers                                                           */
/* -------------------------------------------------------------------------- */

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The section anchor ids used by the one-page home layout. */
export const sectionIds = {
  about: "about",
  services: "services",
  skills: "skills",
  work: "work",
  experience: "experience",
  contact: "contact",
} as const;

export type IconComponent = LucideIcon;
export type { LucideProps, Terminal };
