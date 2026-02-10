/* ============================================
   PERSONAWEB — Local Storage Data Manager
   ============================================ */

const STORAGE_KEYS = {
    HERO: 'personaweb_hero',
    PROJECTS: 'personaweb_projects',
    EXPERIENCES: 'personaweb_experiences',
    CERTIFICATES: 'personaweb_certificates',
    SKILLS: 'personaweb_skills',
    CONTACT: 'personaweb_contact',
    AUTH: 'personaweb_auth',
    SESSION: 'personaweb_session',
    PROFILE_IMAGE: 'personaweb_profile_image',
    PROJECT_IMAGES: 'personaweb_project_images',
    CERT_IMAGES: 'personaweb_cert_images'
};

/* ---------- Default Data ---------- */

const DEFAULT_HERO = {
    name: "Abed Nego",
    title: "Fullstack Engineer",
    subtitle: "Crafting Digital Experiences with Precision & Passion",
    summary: "A passionate Fullstack Engineer with expertise in building scalable, high-performance web applications. Specializing in modern JavaScript frameworks, cloud architecture, and creating seamless user experiences that bridge the gap between cutting-edge technology and intuitive design.",
    resumeLink: "#",
    typingTexts: ["Fullstack Engineer", "UI/UX Enthusiast", "Cloud Architect", "Problem Solver"]
};

const DEFAULT_PROJECTS = [
    {
        id: "proj_1",
        title: "E-Commerce Platform",
        category: "fullstack",
        description: "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built with React, Node.js, and PostgreSQL.",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
        liveUrl: "#",
        githubUrl: "#",
        featured: true
    },
    {
        id: "proj_2",
        title: "AI Chat Application",
        category: "fullstack",
        description: "Real-time chat application with AI-powered responses, sentiment analysis, and multi-language support. Utilizes WebSocket for instant messaging.",
        technologies: ["Next.js", "Python", "TensorFlow", "WebSocket", "MongoDB"],
        liveUrl: "#",
        githubUrl: "#",
        featured: true
    },
    {
        id: "proj_3",
        title: "Cloud Dashboard",
        category: "frontend",
        description: "Interactive cloud infrastructure monitoring dashboard with real-time metrics, alerting system, and resource optimization recommendations.",
        technologies: ["Vue.js", "D3.js", "GraphQL", "AWS"],
        liveUrl: "#",
        githubUrl: "#",
        featured: false
    },
    {
        id: "proj_4",
        title: "DevOps Pipeline Manager",
        category: "backend",
        description: "Automated CI/CD pipeline management tool with Docker orchestration, deployment tracking, and rollback capabilities.",
        technologies: ["Go", "Docker", "Kubernetes", "Jenkins", "Terraform"],
        liveUrl: "#",
        githubUrl: "#",
        featured: false
    },
    {
        id: "proj_5",
        title: "Mobile Banking App",
        category: "mobile",
        description: "Secure mobile banking application with biometric authentication, real-time transactions, and financial analytics dashboard.",
        technologies: ["React Native", "Firebase", "Node.js", "Plaid API"],
        liveUrl: "#",
        githubUrl: "#",
        featured: true
    },
    {
        id: "proj_6",
        title: "Social Media Analytics",
        category: "fullstack",
        description: "Comprehensive social media analytics platform with sentiment analysis, trend prediction, and automated reporting features.",
        technologies: ["Angular", "Python", "Flask", "PostgreSQL", "Chart.js"],
        liveUrl: "#",
        githubUrl: "#",
        featured: false
    }
];

const DEFAULT_EXPERIENCES = [
    {
        id: "exp_1",
        company: "Tech Innovators Inc.",
        position: "Senior Fullstack Engineer",
        period: "2023 — Present",
        description: "Leading the development of microservices architecture serving 2M+ users. Mentoring junior developers and establishing coding standards across the engineering team.",
        highlights: [
            "Reduced API response time by 40% through optimization",
            "Led migration from monolith to microservices architecture",
            "Implemented CI/CD pipelines reducing deployment time by 60%",
            "Mentored 5 junior developers"
        ]
    },
    {
        id: "exp_2",
        company: "Digital Solutions Co.",
        position: "Fullstack Developer",
        period: "2021 — 2023",
        description: "Developed and maintained multiple client-facing web applications using React and Node.js. Collaborated with cross-functional teams to deliver projects on time.",
        highlights: [
            "Built 10+ production web applications",
            "Integrated third-party APIs and payment gateways",
            "Improved test coverage from 30% to 85%",
            "Received 'Developer of the Year' award"
        ]
    },
    {
        id: "exp_3",
        company: "StartUp Ventures",
        position: "Junior Web Developer",
        period: "2019 — 2021",
        description: "Started career building responsive websites and progressive web applications. Gained experience in agile development practices.",
        highlights: [
            "Developed company's first PWA application",
            "Contributed to open-source projects",
            "Learned cloud deployment (AWS, GCP)",
            "Participated in 3 hackathons"
        ]
    }
];

const DEFAULT_CERTIFICATES = [
    {
        id: "cert_1",
        title: "AWS Solutions Architect — Associate",
        issuer: "Amazon Web Services",
        date: "2024",
        credentialUrl: "#"
    },
    {
        id: "cert_2",
        title: "Google Cloud Professional Developer",
        issuer: "Google Cloud",
        date: "2023",
        credentialUrl: "#"
    },
    {
        id: "cert_3",
        title: "Meta Frontend Developer Professional",
        issuer: "Meta (Coursera)",
        date: "2023",
        credentialUrl: "#"
    },
    {
        id: "cert_4",
        title: "Certified Kubernetes Administrator",
        issuer: "CNCF",
        date: "2024",
        credentialUrl: "#"
    },
    {
        id: "cert_5",
        title: "MongoDB Certified Developer",
        issuer: "MongoDB University",
        date: "2022",
        credentialUrl: "#"
    }
];

const DEFAULT_SKILLS = {
    categories: [
        {
            name: "Frontend",
            skills: [
                { name: "React / Next.js", level: 95 },
                { name: "Vue.js / Nuxt", level: 85 },
                { name: "TypeScript", level: 90 },
                { name: "HTML5 / CSS3", level: 95 },
                { name: "Tailwind CSS", level: 88 }
            ]
        },
        {
            name: "Backend",
            skills: [
                { name: "Node.js / Express", level: 92 },
                { name: "Python / Django", level: 80 },
                { name: "Go", level: 70 },
                { name: "REST / GraphQL APIs", level: 90 },
                { name: "Microservices", level: 85 }
            ]
        },
        {
            name: "Database",
            skills: [
                { name: "PostgreSQL", level: 88 },
                { name: "MongoDB", level: 85 },
                { name: "Redis", level: 80 },
                { name: "Firebase", level: 82 }
            ]
        },
        {
            name: "DevOps & Cloud",
            skills: [
                { name: "Docker / Kubernetes", level: 82 },
                { name: "AWS / GCP", level: 80 },
                { name: "CI/CD Pipelines", level: 87 },
                { name: "Terraform", level: 72 }
            ]
        }
    ]
};

const DEFAULT_CONTACT = {
    email: "abednego0492@gmail.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    linkedin: "https://linkedin.com/in/abednego",
    github: "https://github.com/abednego",
    twitter: "https://twitter.com/abednego",
    message: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. Let's build something amazing together!"
};

const DEFAULT_AUTH = {
    email: "abednego0492@gmail.com",
    password: "Masuk1234!"
};

/* ---------- Storage Helpers ---------- */

const StorageManager = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return (parsed !== null && parsed !== undefined) ? parsed : fallback;
        } catch {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    /* --- Image helpers (base64) --- */
    setImage(key, base64) {
        try {
            localStorage.setItem(key, base64);
            return true;
        } catch (e) {
            console.error('Image storage error:', e);
            return false;
        }
    },

    getImage(key) {
        return localStorage.getItem(key);
    },

    /* ---------- Section Accessors ---------- */
    getHero() { return this.get(STORAGE_KEYS.HERO, DEFAULT_HERO); },
    setHero(data) { return this.set(STORAGE_KEYS.HERO, data); },

    getProjects() { return this.get(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS); },
    setProjects(data) { return this.set(STORAGE_KEYS.PROJECTS, data); },

    getExperiences() { return this.get(STORAGE_KEYS.EXPERIENCES, DEFAULT_EXPERIENCES); },
    setExperiences(data) { return this.set(STORAGE_KEYS.EXPERIENCES, data); },

    getCertificates() { return this.get(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES); },
    setCertificates(data) { return this.set(STORAGE_KEYS.CERTIFICATES, data); },

    getSkills() { return this.get(STORAGE_KEYS.SKILLS, DEFAULT_SKILLS); },
    setSkills(data) { return this.set(STORAGE_KEYS.SKILLS, data); },

    getContact() { return this.get(STORAGE_KEYS.CONTACT, DEFAULT_CONTACT); },
    setContact(data) { return this.set(STORAGE_KEYS.CONTACT, data); },

    getAuth() { return this.get(STORAGE_KEYS.AUTH, DEFAULT_AUTH); },
    setAuth(data) { return this.set(STORAGE_KEYS.AUTH, data); },

    getSession() { return this.get(STORAGE_KEYS.SESSION, null); },
    setSession(data) { return this.set(STORAGE_KEYS.SESSION, data); },
    clearSession() { this.remove(STORAGE_KEYS.SESSION); },

    getProfileImage() { return this.getImage(STORAGE_KEYS.PROFILE_IMAGE); },
    setProfileImage(b64) { return this.setImage(STORAGE_KEYS.PROFILE_IMAGE, b64); },

    getProjectImage(id) { return this.getImage(STORAGE_KEYS.PROJECT_IMAGES + '_' + id); },
    setProjectImage(id, b64) { return this.setImage(STORAGE_KEYS.PROJECT_IMAGES + '_' + id, b64); },

    getCertImage(id) { return this.getImage(STORAGE_KEYS.CERT_IMAGES + '_' + id); },
    setCertImage(id, b64) { return this.setImage(STORAGE_KEYS.CERT_IMAGES + '_' + id, b64); },

    /* Initialise defaults if first visit */
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
            this.setAuth(DEFAULT_AUTH);
        }
    }
};

StorageManager.init();
