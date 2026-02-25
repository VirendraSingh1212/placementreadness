// Skill extraction and analysis logic

const SKILL_CATEGORIES = {
  coreCS: {
    label: "Core CS",
    skills: ["DSA", "OOP", "DBMS", "OS", "Networks"],
  },
  languages: {
    label: "Languages",
    skills: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go"],
  },
  web: {
    label: "Web Development",
    skills: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL"],
  },
  data: {
    label: "Data & Databases",
    skills: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
  },
  cloudDevOps: {
    label: "Cloud & DevOps",
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
  },
  testing: {
    label: "Testing",
    skills: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"],
  },
};

// Normalize skill names for matching
const SKILL_ALIASES = {
  "Data Structures": "DSA",
  "Data Structures and Algorithms": "DSA",
  "Algorithms": "DSA",
  "Object Oriented Programming": "OOP",
  "Object-Oriented": "OOP",
  "Operating System": "OS",
  "Networking": "Networks",
  "Computer Networks": "Networks",
  "JS": "JavaScript",
  "TS": "TypeScript",
  "Node": "Node.js",
  "Express.js": "Express",
  "NextJS": "Next.js",
  "ReactJS": "React",
  "Postgres": "PostgreSQL",
  "Google Cloud": "GCP",
  "Amazon Web Services": "AWS",
  "K8s": "Kubernetes",
  "Containerization": "Docker",
};

/**
 * Extract skills from JD text using keyword matching
 */
export function extractSkills(jdText) {
  const text = jdText.toLowerCase();
  const extracted = {};

  // Check each category
  for (const [categoryKey, category] of Object.entries(SKILL_CATEGORIES)) {
    const found = [];

    for (const skill of category.skills) {
      // Check direct match
      const skillLower = skill.toLowerCase();
      const skillPattern = new RegExp(
        `\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );

      if (skillPattern.test(text)) {
        found.push(skill);
        continue;
      }

      // Check aliases
      for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
        if (canonical === skill) {
          const aliasPattern = new RegExp(
            `\\b${alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
            "i"
          );
          if (aliasPattern.test(text)) {
            found.push(skill);
            break;
          }
        }
      }
    }

    if (found.length > 0) {
      extracted[categoryKey] = {
        label: category.label,
        skills: [...new Set(found)],
      };
    }
  }

  // If no skills found, return General fresher stack
  if (Object.keys(extracted).length === 0) {
    return {
      general: {
        label: "General Fresher Stack",
        skills: ["DSA", "OOP", "DBMS", "SQL", "Java/Python"],
      },
    };
  }

  return extracted;
}

/**
 * Calculate readiness score based on inputs
 */
export function calculateReadinessScore(company, role, jdText, extractedSkills) {
  let score = 35;

  // +5 per detected category (max 30)
  const categoryCount = Object.keys(extractedSkills).length;
  score += Math.min(categoryCount * 5, 30);

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10;
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10;
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Generate round-wise preparation checklist
 */
export function generateChecklist(extractedSkills) {
  const hasSkill = (category, skill) => {
    return extractedSkills[category]?.skills.includes(skill) ?? false;
  };

  const hasCategory = (category) => category in extractedSkills;

  const checklist = {
    round1: {
      title: "Round 1: Aptitude / Basics",
      items: [
        "Practice quantitative aptitude (time-speed-distance, profit-loss, percentages)",
        "Solve logical reasoning puzzles (coding-decoding, blood relations, syllogisms)",
        "Review verbal ability (reading comprehension, sentence correction)",
        "Brush up on basic mathematics (probability, permutations, combinations)",
        "Take 2-3 full-length mock aptitude tests",
        ...(hasCategory("coreCS")
          ? ["Review Core CS fundamentals (OOP, DBMS, OS basics)"]
          : []),
      ],
    },
    round2: {
      title: "Round 2: DSA + Core CS",
      items: [
        ...(hasSkill("coreCS", "DSA")
          ? [
              "Master arrays, strings, and hash maps",
              "Practice two-pointer and sliding window techniques",
              "Solve tree and graph traversal problems (BFS/DFS)",
              "Review dynamic programming patterns (knapsack, LCS, LIS)",
              "Practice sorting and searching algorithms",
            ]
          : [
              "Focus on basic programming logic and loops",
              "Practice simple array and string manipulations",
            ]),
        ...(hasSkill("coreCS", "OOP")
          ? [
              "Explain inheritance, polymorphism, encapsulation with examples",
              "Understand abstract classes vs interfaces",
            ]
          : []),
        ...(hasSkill("coreCS", "DBMS")
          ? [
              "Practice SQL queries (joins, subqueries, aggregations)",
              "Understand normalization and ACID properties",
            ]
          : []),
        ...(hasSkill("coreCS", "OS")
          ? [
              "Review process vs thread, scheduling algorithms",
              "Understand memory management and paging",
            ]
          : []),
      ],
    },
    round3: {
      title: "Round 3: Technical Interview (Projects + Stack)",
      items: [
        "Prepare 2-3 project explanations with technical depth",
        "Be ready to explain your role and contributions clearly",
        ...(hasCategory("languages")
          ? [
              `Deep dive into ${extractedSkills.languages.skills.slice(0, 2).join(", ")} - language-specific features and best practices`,
            ]
          : []),
        ...(hasCategory("web")
          ? extractedSkills.web.skills.flatMap((skill) => {
              if (skill === "React")
                return [
                  "Explain React hooks, lifecycle, and virtual DOM",
                  "Compare state management options (Context, Redux, Zustand)",
                ];
              if (skill === "Node.js")
                return [
                  "Explain event loop, async programming in Node.js",
                  "Understand Express middleware and routing",
                ];
              if (skill === "REST")
                return [
                  "Design RESTful APIs with proper HTTP methods",
                  "Understand status codes and authentication (JWT/OAuth)",
                ];
              return [`Review ${skill} concepts and practical applications`];
            })
          : []),
        ...(hasCategory("data")
          ? [
              "Understand database indexing and query optimization",
              `Compare ${extractedSkills.data.skills.slice(0, 2).join(" vs ")} use cases`,
            ]
          : []),
        ...(hasCategory("cloudDevOps")
          ? [
              "Explain CI/CD pipeline and deployment strategies",
              "Understand containerization basics (Docker, Kubernetes)",
            ]
          : []),
      ],
    },
    round4: {
      title: "Round 4: Managerial / HR",
      items: [
        "Prepare STAR-format answers for behavioral questions",
        "Research company culture, values, and recent news",
        "Practice 'Tell me about yourself' (2-minute version)",
        "Prepare questions to ask the interviewer",
        "Review your resume thoroughly - every point should be explainable",
        "Practice salary negotiation basics (know your market value)",
        "Prepare answers for: strengths, weaknesses, career goals",
        "Be ready to explain why you want to join this company/role",
      ],
    },
  };

  return checklist;
}

/**
 * Generate 7-day preparation plan
 */
export function generatePlan(extractedSkills) {
  const hasCategory = (category) => category in extractedSkills;
  const hasSkill = (category, skill) => {
    return extractedSkills[category]?.skills.includes(skill) ?? false;
  };

  const plan = [
    {
      day: 1,
      title: "Basics + Core CS Fundamentals",
      tasks: [
        "Review OOP principles with code examples",
        "Study DBMS basics: normalization, ACID, indexing",
        hasSkill("coreCS", "OS") ? "Review OS concepts: processes, threads, scheduling" : "",
        hasSkill("coreCS", "Networks")
          ? "Study network layers, TCP/IP, HTTP/HTTPS"
          : "",
        "Solve 5 easy problems on arrays/strings",
      ].filter(Boolean),
    },
    {
      day: 2,
      title: "Core CS Deep Dive",
      tasks: [
        "Practice SQL queries: joins, subqueries, aggregations",
        "Review system design basics (scalability, load balancing)",
        hasCategory("languages")
          ? `Study ${extractedSkills.languages.skills[0]} advanced features`
          : "",
        "Read about design patterns (Singleton, Factory, Observer)",
        "Solve 3 medium problems on hash maps/sets",
      ].filter(Boolean),
    },
    {
      day: 3,
      title: "DSA + Coding Practice",
      tasks: [
        "Master two-pointer and sliding window patterns",
        "Practice tree traversals (in-order, pre-order, post-order)",
        "Solve graph problems (BFS, DFS, shortest path)",
        "Review recursion and backtracking techniques",
        "Complete 5 DSA problems (mix of medium difficulty)",
      ],
    },
    {
      day: 4,
      title: "Advanced DSA",
      tasks: [
        "Study dynamic programming patterns",
        "Practice greedy algorithms",
        "Review sorting and searching variants",
        "Solve problems on heaps and tries",
        "Complete 5 hard problems with optimization focus",
      ],
    },
    {
      day: 5,
      title: "Projects + Resume Alignment",
      tasks: [
        "Document 2-3 projects with technical details",
        "Prepare project demos/presentations",
        "Align resume with JD keywords",
        ...(hasCategory("web")
          ? [
              "Review frontend/backend architecture decisions",
              `Study ${extractedSkills.web.skills.slice(0, 2).join(", ")} best practices`,
            ]
          : []),
        "Prepare answers for 'Walk me through your resume'",
      ],
    },
    {
      day: 6,
      title: "Mock Interview Questions",
      tasks: [
        "Practice 10 technical questions aloud",
        "Do a mock coding interview (timed)",
        "Review common system design questions",
        "Practice behavioral questions (STAR format)",
        "Record yourself answering - check clarity and pace",
      ],
    },
    {
      day: 7,
      title: "Revision + Weak Areas",
      tasks: [
        "Review all notes and flashcards",
        "Re-solve previously difficult problems",
        "Focus on identified weak areas",
        "Light reading - company-specific technologies",
        "Rest well - mental preparation for interview day",
      ],
    },
  ];

  return plan;
}

/**
 * Generate likely interview questions based on skills
 */
export function generateQuestions(extractedSkills) {
  const questions = [];
  const hasSkill = (category, skill) => {
    return extractedSkills[category]?.skills.includes(skill) ?? false;
  };

  // Core CS questions
  if (hasSkill("coreCS", "DSA")) {
    questions.push(
      "How would you optimize search in a sorted array? Compare linear vs binary search.",
      "Explain the time and space complexity of merge sort vs quick sort.",
      "When would you use a hash map vs a tree? Give examples.",
      "How do you detect a cycle in a linked list? Explain Floyd's algorithm.",
      "Explain dynamic programming with the example of Fibonacci or knapsack."
    );
  }

  if (hasSkill("coreCS", "OOP")) {
    questions.push(
      "Explain the four pillars of OOP with real-world examples.",
      "What is the difference between abstraction and encapsulation?",
      "When would you use an abstract class vs an interface?",
      "Explain method overloading vs method overriding."
    );
  }

  if (hasSkill("coreCS", "DBMS")) {
    questions.push(
      "Explain database normalization. Why is 3NF important?",
      "What are ACID properties? Explain each with examples.",
      "Compare clustered vs non-clustered indexes.",
      "How would you optimize a slow-running SQL query?"
    );
  }

  if (hasSkill("coreCS", "OS")) {
    questions.push(
      "Explain the difference between a process and a thread.",
      "What is deadlock? How can it be prevented?",
      "Explain paging and segmentation in memory management.",
      "What are the different CPU scheduling algorithms?"
    );
  }

  // Language-specific questions
  if (extractedSkills.languages?.skills.includes("Java")) {
    questions.push(
      "Explain Java's garbage collection mechanism.",
      "What is the difference between String, StringBuilder, and StringBuffer?",
      "Explain Java 8 features: streams, lambdas, optional."
    );
  }

  if (extractedSkills.languages?.skills.includes("Python")) {
    questions.push(
      "Explain Python's GIL and its impact on multithreading.",
      "What are decorators in Python? How do they work?",
      "Compare lists vs tuples vs sets in Python."
    );
  }

  if (extractedSkills.languages?.skills.includes("JavaScript")) {
    questions.push(
      "Explain JavaScript's event loop and call stack.",
      "What is the difference between var, let, and const?",
      "Explain closures in JavaScript with an example.",
      "What is the 'this' keyword and how does it work?"
    );
  }

  // Web development questions
  if (hasSkill("web", "React")) {
    questions.push(
      "Explain the virtual DOM and how React uses it for optimization.",
      "Compare useState vs useEffect. When would you use each?",
      "Explain React's reconciliation algorithm.",
      "What are the different ways to manage state in React applications?"
    );
  }

  if (hasSkill("web", "Node.js")) {
    questions.push(
      "Explain the event-driven architecture of Node.js.",
      "What is the event loop in Node.js?",
      "How does Node.js handle asynchronous operations?"
    );
  }

  if (hasSkill("web", "REST")) {
    questions.push(
      "Design a RESTful API for a blogging platform.",
      "What are the differences between PUT, PATCH, and POST?",
      "How would you implement authentication in a REST API?"
    );
  }

  // Data questions
  if (hasSkill("data", "SQL")) {
    questions.push(
      "Explain indexing in SQL and when it helps vs hurts performance.",
      "Write a query to find the second highest salary.",
      "Explain the difference between INNER JOIN and LEFT JOIN.",
      "What are window functions? Give an example."
    );
  }

  if (hasSkill("data", "MongoDB")) {
    questions.push(
      "Compare SQL vs NoSQL databases. When to use each?",
      "Explain MongoDB's aggregation pipeline.",
      "How does sharding work in MongoDB?"
    );
  }

  // Cloud/DevOps questions
  if (extractedSkills.cloudDevOps?.skills.some((s) => ["AWS", "Azure", "GCP"].includes(s))) {
    questions.push(
      "Explain the difference between IaaS, PaaS, and SaaS.",
      "How would you design a scalable architecture on the cloud?",
      "What are the benefits of using a CDN?"
    );
  }

  if (hasSkill("cloudDevOps", "Docker")) {
    questions.push(
      "What is containerization and how does Docker work?",
      "Explain the difference between an image and a container.",
      "How would you dockerize a Node.js application?"
    );
  }

  // Testing questions
  if (extractedSkills.testing) {
    questions.push(
      "Explain unit testing vs integration testing vs E2E testing.",
      "What is test-driven development (TDD)?",
      "How would you mock dependencies in unit tests?"
    );
  }

  // General questions if fewer than 10
  if (questions.length < 10) {
    const generalQuestions = [
      "Tell me about yourself and your technical background.",
      "What is your strongest technical skill and why?",
      "Describe a challenging technical problem you solved.",
      "How do you keep up with new technologies?",
      "Explain a project you're most proud of and your specific contributions.",
      "How do you approach debugging a complex issue?",
      "What is your experience with version control (Git)?",
      "How do you handle tight deadlines and pressure?",
    ];
    questions.push(...generalQuestions.slice(0, 10 - questions.length));
  }

  return questions.slice(0, 10);
}

/**
 * Perform complete analysis
 */
export function analyzeJD(company, role, jdText) {
  const extractedSkills = extractSkills(jdText);
  const readinessScore = calculateReadinessScore(company, role, jdText, extractedSkills);
  const checklist = generateChecklist(extractedSkills);
  const plan = generatePlan(extractedSkills);
  const questions = generateQuestions(extractedSkills);

  return {
    company,
    role,
    jdText,
    extractedSkills,
    readinessScore,
    checklist,
    plan,
    questions,
    createdAt: new Date().toISOString(),
  };
}
