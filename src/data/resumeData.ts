// Single source of truth for the Resume Command Center (UOW-14).
// Every tab (Interactive, Schema/JSON, Terminal, PDF) reads from `resumeData`
// or one of its derived string representations below — edit only here.

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeProject {
  name: string;
  stack: string[];
  bullets: string[];
  /** Matches a spotlight card id on the home page (e.g. "streamzilla-card") for cross-linking. */
  linkKey?: string;
}

export interface ResumeExperience {
  company: string;
  location?: string;
  title: string;
  dates: string;
  bullets: string[];
}

export interface ResumePriorRole {
  company: string;
  title: string;
}

export interface ResumeEducation {
  school: string;
  field: string;
}

export interface ResumeData {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  title: string;
  focusAreas: string[];
  summary: string;
  skills: ResumeSkillGroup[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  priorRoles: ResumePriorRole[];
  education: ResumeEducation[];
}

export const resumeData: ResumeData = {
  name: "Robert Nemzek",
  location: "Leland, NC",
  email: "rnemzek@gmail.com",
  phone: "571-437-0579",
  linkedinUrl: "https://www.linkedin.com/in/robertnemzek/",
  githubUrl: "https://github.com/rnemzek",
  title: "Engineering Leader & Platform Architect",
  focusAreas: [
    "AI Platform Engineering",
    "Enterprise Observability",
    "Distributed Systems",
    "Cloud Infrastructure",
  ],
  summary:
    "Enterprise engineering leader and hands-on architect with a proven track record of scaling core " +
    "platforms through hyper-growth, driving revenue from $50M to $500M+. Expert in distributed systems, " +
    "modern AI architectures, agentic workflows, and high-performance Kubernetes infrastructure. Blends " +
    "battle-tested platform fundamentals with cutting-edge cloud-native innovation.",
  skills: [
    {
      category: "AI & Developer Tooling",
      items: ["Claude Code", "Codex", "Agentic AI Frameworks", "Gemini Workflows"],
    },
    {
      category: "Infrastructure",
      items: ["AWS", "Kubernetes", "Docker", "Systems Integration", "Virtualization", "Hybrid Cloud"],
    },
    {
      category: "Programming Languages",
      items: ["Go", "Python", "TypeScript", "JavaScript", "C", "C++", "Java", "SQL"],
    },
    {
      category: "Databases",
      items: ["Neo4j (Graph DB)", "PostgreSQL", "SQLite", "InfluxDB", "MongoDB", "MySQL", "Amazon RDS"],
    },
    {
      category: "Frameworks & Runtimes",
      items: ["FastAPI", "Express", "Node.js", "REST APIs"],
    },
  ],
  projects: [
    {
      name: "Cintara TCP Observability Platform",
      stack: ["Go", "Python", "FastAPI", "Neo4j (Graph)", "Kubernetes", "Docker"],
      bullets: [
        "Architected observability platform of Cintara's Trust Control Plane (TCP), an internal cluster " +
          "platform utilizing Go binaries for high-performance Kubernetes container integration, metrics " +
          "collection, and telemetry streaming.",
        "Engineered a Python/FastAPI state-machine backend integrating a Neo4j graph database to map " +
          'service dependencies and calculate real-time health "blast-radius" visualizations.',
        'Designing automated remediation ("do") capabilities for upcoming release cycles to transition the ' +
          "platform from read-only monitoring to autonomous infrastructure healing.",
      ],
    },
    {
      name: "Cintara Automated SOC2 Status Engine",
      stack: ["Python", "FastAPI", "Health APIs", "Automated Incident Mgmt"],
      bullets: [
        "Developed an automated compliance platform that queries 9 distinct Cintara Trust Control Plane " +
          "microservices on a continuous 1-minute interval.",
        "Built live dashboards providing historical health reporting, audit-ready uptime tracking, and " +
          "incident management workflows to fulfill automated SOC2 verification constraints.",
      ],
    },
    {
      name: "Stream Service Mobile App",
      stack: ["TypeScript", "Express", "SQLite", "Docker", "Railway", "Webhooks", "iOS Native"],
      linkKey: "streamzilla-card",
      bullets: [
        "Designed and built a full-stack media aggregation platform tracking global TV, film, and live " +
          "sports streaming schedules using an asynchronous TypeScript/Express API.",
        "Implemented native iOS mobile features including haptic feedback layers, systemic sharesheet " +
          "extensions, and high-frequency webhook notifications via Apple Push Notification service (APNs).",
      ],
    },
  ],
  experience: [
    {
      company: "Cintara",
      location: "Remote",
      title: "Advisor, Enterprise Cloud & Platform Engineering",
      dates: "February 2026 – Present",
      bullets: [
        "Agentic AI Infrastructure: Architecting code and workflows for an Agentic AI Trust Control Plane " +
          "PaaS offering on AWS, enabling enterprises to deploy AI agents with automated governance, audit " +
          "trails, and strict policy guardrails.",
        "Kubernetes Observability Backplane: Designing and developing a production-grade container " +
          "observability product using Go for high-performance cluster data plumbing and Python/FastAPI as " +
          "the state machine and backend interface.",
        "Security & Compliance Applications: Built and deployed an enterprise SOC2 compliance status " +
          "application utilizing TypeScript and Express, engineered to handle time-series service health " +
          "logs with 90-day historical health reporting.",
        "Tooling Integration: Utilizing Codex and automated developer tools to accelerate full-stack " +
          "deployment velocity and maintain robust system-level testing.",
      ],
    },
    {
      company: "Personal Career Break & Technical R&D",
      title: "Self-Directed Research",
      dates: "September 2023 – January 2026",
      bullets: [
        "Executed self-directed research into modern AI architectures, vector databases, LLM orchestration, " +
          "and cloud native scaling patterns while managing personal and family priorities.",
      ],
    },
    {
      company: "Ocient",
      location: "Chicago, IL",
      title: "Engineering Manager",
      dates: "October 2022 – August 2023",
      bullets: [
        "Managed multiple engineering teams supporting core components of a hyperscale enterprise data " +
          "warehouse product stack handling massive, complex workloads.",
        "Implemented predictable Scrum methodologies across engineering teams, significantly accelerating " +
          "release cycle predictability and feature velocity.",
        "Directed performance optimization initiatives that successfully scaled the data warehouse " +
          "infrastructure, directly enabling the sales team to close two critical enterprise accounts " +
          "necessary to secure Series B extension funding.",
      ],
    },
    {
      company: "Yellowbrick Data",
      location: "Mountain View, CA",
      title: "Founding Software Engineer (Stealth Mode – Employee #9)",
      dates: "February 2016 – July 2022",
      bullets: [
        "Telemetry & Monitoring: Joined as an early-stage startup engineer in stealth mode to design, " +
          "build, and scale Yellowbrick's core real-time observability backplane from scratch, enabling " +
          "real-time metrics collection, alerting, and telemetry.",
        "Data Collection Systems: Engineered a high-throughput Data Collection System to ingest log " +
          "files, configurations, system metrics, and real-time query statistics across mass flash-memory " +
          "storage architectures.",
        "Hardware/Software Telemetry: Designed and built the Chassis Manager runtime application, " +
          "providing real-time hardware- and software-level health monitoring and proactive alerting for " +
          "enterprise data warehouse deployments.",
        "Distributed Services: Developed Phonehome, a distributed REST application that securely streams " +
          "appliance logs and health alerts into the central support platform, enabling proactive client " +
          "troubleshooting.",
        "Cloud Identity & APIs: Implemented enterprise Single Sign-On (SSO) integrations and designed the " +
          "core REST APIs powering the Cloud Data Warehouse Manager interface.",
      ],
    },
    {
      company: "DXC (Formerly CSC / HPE Enterprise Services)",
      location: "Falls Church, VA",
      title: "Director of Cloud Engineering",
      dates: "October 2010 – February 2016",
      bullets: [
        "Directed engineering strategies to pivot a legacy hosting business unit into a highly profitable " +
          "private, public, and hybrid cloud service provider utilizing AWS, Azure, and VCE " +
          "(VMware, Cisco, EMC) architecture stacks.",
        "Scaled the cloud service provider business unit from $50M per year to over $500M in annual " +
          "revenue during tenure (now generating $2B+ annually).",
        "Managed global budgets, concurrent architecture streams, and cross-functional, geographically " +
          "dispersed systems engineering teams.",
      ],
    },
  ],
  priorRoles: [
    { company: "Sure Secure Solutions", title: "Director, Integration Solutions" },
    { company: "Fortisphere (Acquired by Red Hat)", title: "Director of Engineering" },
    { company: "Managed Objects / Novell (Employee #8 – Acquired by Novell)", title: "VP of Engineering & Support" },
  ],
  education: [{ school: "James Madison University", field: "Computer Science" }],
};

export const resumeJson: string = JSON.stringify(resumeData, null, 2);

function toMarkdown(data: ResumeData): string {
  const lines: string[] = [];
  lines.push(`# ${data.name}`);
  lines.push(
    `${data.location} | ${data.email} | ${data.phone} | [LinkedIn](${data.linkedinUrl}) | [GitHub](${data.githubUrl})`,
  );
  lines.push("");
  lines.push(`## ${data.title}`);
  lines.push(`**${data.focusAreas.join(" | ")}**`);
  lines.push("");
  lines.push(data.summary);
  lines.push("");
  lines.push("## Technical Skills");
  for (const group of data.skills) {
    lines.push(`- **${group.category}:** ${group.items.join(", ")}.`);
  }
  lines.push("");
  lines.push("## Recent Projects");
  for (const project of data.projects) {
    lines.push(`### ${project.name} | ${project.stack.join(", ")}`);
    for (const bullet of project.bullets) lines.push(`- ${bullet}`);
    lines.push("");
  }
  lines.push("## Professional Experience");
  for (const job of data.experience) {
    const place = job.location ? ` | ${job.location}` : "";
    lines.push(`### ${job.company}${place} | ${job.title} | ${job.dates}`);
    for (const bullet of job.bullets) lines.push(`- ${bullet}`);
    lines.push("");
  }
  lines.push("## Prior Roles");
  for (const role of data.priorRoles) lines.push(`- **${role.company}** | ${role.title}`);
  lines.push("");
  lines.push("## Education");
  for (const edu of data.education) lines.push(`- **${edu.school}** | ${edu.field}`);
  return lines.join("\n");
}

export const resumeMarkdown: string = toMarkdown(resumeData);
