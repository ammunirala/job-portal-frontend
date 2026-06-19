import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const questions = [
  {
    category: "Spring Boot & Backend",
    color: "#1F4E79",
    items: [
      {
        q: "Q1. Why did you use Spring Boot in Hyro? What are its key advantages?",
        a: "Spring Boot was chosen because it provides auto-configuration — no need to manually configure beans. It comes with an embedded Tomcat server, so separate deployment is not required. In Hyro, I used Spring Boot to build 15+ REST APIs, configure JWT security, and connect to MySQL through JPA — all with minimal boilerplate code.\n\nKey advantages:\n• Auto-configuration\n• Embedded Tomcat server\n• Starter dependencies (Web, JPA, Security)\n• Production-ready in minutes",
        tip: "Key points: Auto-configuration, starter dependencies, embedded server."
      },
      {
        q: "Q2. Explain the JWT Authentication flow you implemented in Hyro.",
        a: "JWT authentication works in 3 steps:\n1. User sends email/password to /api/auth/login\n2. Server verifies and generates JWT token (Header.Payload.Signature)\n3. Client sends token in every request: Authorization: Bearer <token>\n\nI created JwtUtil class to generate/validate tokens using jjwt-api with HS256 algorithm. JwtAuthFilter (OncePerRequestFilter) intercepts every request, validates the token, and sets authentication in SecurityContext.",
        tip: "Be ready to explain what happens if token is expired — filter rejects with 401."
      },
      {
        q: "Q3. How did you implement Role-Based Access Control (RBAC)?",
        a: "I added @EnableMethodSecurity on SecurityConfig. Then applied @PreAuthorize on controller methods:\n\n• @PreAuthorize(\"hasRole('RECRUITER')\") — only recruiters post jobs\n• @PreAuthorize(\"hasRole('JOBSEEKER')\") — only jobseekers apply\n• @PreAuthorize(\"isAuthenticated()\") — any logged-in user\n\nHyro has 3 roles: ADMIN, RECRUITER, JOBSEEKER. The role is stored inside the JWT token as a claim and extracted by JwtAuthFilter as SimpleGrantedAuthority.",
        tip: "3-role system shows enterprise-level access control understanding."
      },
      {
        q: "Q4. What is @ControllerAdvice and why did you use Global Exception Handling?",
        a: "Without @ControllerAdvice, you need try-catch in every controller. @RestControllerAdvice provides centralized exception handling.\n\nIn Hyro, GlobalExceptionHandler handles:\n• MethodArgumentNotValidException — @Valid failures with field-wise errors\n• RuntimeException — business logic errors like 'Job not found'\n• Exception — unexpected server errors (500)\n\nEvery error follows the same ApiResponse<T> format: success, message, data, timestamp.",
        tip: "Mention ApiResponse wrapper — shows API consistency thinking."
      },
      {
        q: "Q5. What is the difference between Spring Data JPA and Hibernate?",
        a: "Hibernate is the actual ORM that maps Java objects to database tables. Spring Data JPA is an abstraction layer on top providing JpaRepository with built-in CRUD methods.\n\nBy extending JpaRepository, I get findByEmail(), existsByEmail(), save(), deleteById() for free — no SQL needed.\n\nFor complex queries like job search, I used @Query with JPQL:\nSELECT j FROM Job j WHERE j.status = 'ACTIVE' AND (:title IS NULL OR LOWER(j.title) LIKE ...)\n\nSetting ddl-auto=update means Hibernate creates tables automatically on Railway.",
        tip: "ddl-auto=update detail shows production deployment understanding."
      },
    ]
  },
  {
    category: "REST API Design & Features",
    color: "#1E5C2E",
    items: [
      {
        q: "Q6. What REST API design principles did you follow?",
        a: "I followed these principles in Hyro:\n1. Proper HTTP methods — GET, POST, PUT, DELETE\n2. Resource-based URLs — /api/jobs/{id}, /api/jobs/{id}/applicants\n3. Consistent response — ApiResponse<T> from every endpoint\n4. Meaningful status codes — 200, 400, 401, 403, 404, 500\n5. DTOs for all input/output — never exposing entities\n6. Input validation — @Valid, @NotBlank, @Size, @Email\n7. Pagination — every list endpoint accepts page and size",
        tip: "DTO pattern and ApiResponse wrapper separate junior from professional developers."
      },
      {
        q: "Q7. How did you implement Pagination? Why is it necessary?",
        a: "Without pagination, fetching 10,000 jobs in one response would be extremely slow.\n\nI used Spring's Pageable:\nPageRequest.of(page, size, Sort.by('createdAt').descending())\n\nAPI: GET /api/jobs?page=0&size=10\n\nResponse includes: content (jobs list), totalPages, totalElements, pageNumber, isLast.\n\nRepository method:\nPage<Job> findByStatus(JobStatus status, Pageable pageable);\n\nDefault page size is 10.",
        tip: "page=0 means the first page (zero-indexed) — interviewers sometimes ask this."
      },
      {
        q: "Q8. How did you implement multi-filter job search?",
        a: "I used @Query with JPQL and null checks for optional filters:\n\nSELECT j FROM Job j WHERE j.status = 'ACTIVE'\nAND (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%',:title,'%')))\nAND (:location IS NULL OR LOWER(j.location) LIKE ...)\nAND (:jobType IS NULL OR j.jobType = :jobType)\n\nAll 6 filters are optional. A single endpoint handles all combinations:\nGET /api/jobs/search?title=java&location=bangalore",
        tip: "IS NULL check pattern for dynamic filtering is a key concept to explain."
      },
      {
        q: "Q9. How did you prevent duplicate job applications?",
        a: "I added protection at two levels:\n\n1. Database level — @UniqueConstraint on Application entity:\n@UniqueConstraint(columnNames = {\"job_id\", \"user_id\"})\n\n2. Service level — Before saving:\nif (applicationRepository.existsByJobAndApplicant(job, applicant)) {\n    throw new RuntimeException(\"Already applied\");\n}\n\nDatabase-level protection is more reliable — even if service check is bypassed, constraint catches it.",
        tip: "Always mention both levels — shows defensive programming skills."
      },
      {
        q: "Q10. How did you implement the AI Resume Match Score feature?",
        a: "This was the most unique feature in Hyro. Flow:\n\n1. Jobseeker calls GET /api/match/{jobId}\n2. Backend fetches job description + user profile skills\n3. Structured prompt sent to Google Gemini 2.5 Flash API\n4. Gemini returns JSON: matchPercentage, matchingSkills, missingSkills, feedback\n5. Response parsed and returned to frontend\n\nGemini API key stored as environment variable (GEMINI_API_KEY) on Railway — never hardcoded.",
        tip: "This feature alone differentiates your resume from 99% of freshers."
      },
    ]
  },
  {
    category: "Database & Architecture",
    color: "#5C2E00",
    items: [
      {
        q: "Q11. Explain Hyro's database schema.",
        a: "Hyro has 6 main tables:\n\n1. users — id, name, email, password, role(ENUM), enabled\n2. jobs — id, title, description, location, salary_min/max, job_type, status, recruiter_id(FK)\n3. applications — id, job_id(FK), user_id(FK), status, cover_letter [UNIQUE: job_id+user_id]\n4. profiles — id, user_id(FK unique), bio, skills, resume_url, linkedin_url\n5. saved_jobs — id, user_id(FK), job_id(FK) [UNIQUE: user_id+job_id]\n6. categories — id, name\n\nRelationships: User→Job (1:Many), User→Application (1:Many), Job→Application (1:Many)",
        tip: "Unique constraints on applications and saved_jobs show data integrity thinking."
      },
      {
        q: "Q12. Why did you use DTOs instead of exposing Entity classes?",
        a: "Exposing entities directly causes 3 problems:\n\n1. Security — password field would be exposed in every user response\n2. Circular reference — User has Jobs, Jobs have User → infinite recursion in JSON\n3. Tight coupling — DB schema change immediately breaks API response\n\nIn Hyro, I created Request DTOs (with validation) and Response DTOs (controlled output). UserResponse contains only id, name, email, role — password never exposed.",
        tip: "Lead with security concern (password exposure) — strongest argument."
      },
      {
        q: "Q13. What is CORS and how did you configure it?",
        a: "CORS blocks browser requests from different origins. When React frontend (hyro-brown.vercel.app) calls Spring Boot backend (railway.app), browser blocks it — different origins.\n\nIn Hyro, CorsConfig class:\ncorsConfig.addAllowedOrigin(\"http://localhost:3000\");\ncorsConfig.addAllowedOrigin(\"https://hyro-brown.vercel.app\");\ncorsConfig.addAllowedMethod(\"*\");\ncorsConfig.addAllowedHeader(\"*\");\ncorsConfig.setAllowCredentials(true); // for JWT headers\n\nApplied to all /api/** endpoints.",
        tip: "setAllowCredentials(true) is required for JWT Authorization headers — mention this."
      },
    ]
  },
  {
    category: "Deployment & DevOps",
    color: "#4B0082",
    items: [
      {
        q: "Q14. Explain your Docker setup. Why multi-stage builds?",
        a: "I wrote a multi-stage Dockerfile:\n\nStage 1 (Build):\nFROM maven:3.9.6-eclipse-temurin-17 AS build\nRUN mvn clean install -DskipTests\n\nStage 2 (Runtime):\nFROM eclipse-temurin:17-jre\nCOPY --from=build /app/target/*.jar app.jar\nENTRYPOINT [\"java\", \"-Xmx256m\", \"-Xms128m\", \"-jar\", \"app.jar\"]\n\nBenefit: Final image only has JRE + JAR — not Maven or source code. Smaller image, faster deployment. -Xmx256m limits memory for Railway's free tier.",
        tip: "-Xmx256m shows you understand production resource constraints."
      },
      {
        q: "Q15. Why use Environment Variables instead of hardcoding credentials?",
        a: "Hardcoding credentials is a critical security vulnerability — anyone with repo access can see them.\n\nIn Hyro, I used Spring placeholder pattern:\nspring.datasource.password=${SPRING_DATASOURCE_PASSWORD:local_default}\n\n• Production (Railway): value comes from Railway Variables tab\n• Local dev: default value after colon is used\n\nWhen I accidentally pushed an API key to GitHub, GitHub's secret scanning immediately blocked the push — confirmed the importance of environment variables.",
        tip: "The GitHub secret scanning incident shows real security awareness."
      },
      {
        q: "Q16. How does CI/CD work in your Hyro project?",
        a: "Both Railway and Vercel are connected to GitHub via webhooks.\n\nOn git push:\n\nBackend (Railway):\n1. Railway detects new commit\n2. Builds Docker image using Dockerfile\n3. Replaces running container\n4. Live in ~2-3 minutes\n\nFrontend (Vercel):\n1. Vercel detects push\n2. Runs npm run build\n3. Deploys to CDN\n4. Live in ~30-40 seconds\n\nThis is Continuous Deployment — no manual steps after initial setup.",
        tip: "CI/CD knowledge is highly valued for fresher roles."
      },
    ]
  },
  {
    category: "Behavioral & Situational",
    color: "#8B0000",
    items: [
      {
        q: "Q17. What was the biggest challenge while building Hyro?",
        a: "The deployment configuration was the biggest challenge. Everything worked on localhost but crashed on Railway with 2 errors:\n\n1. Database connection failure — application.properties had localhost hardcoded. Railway uses mysql.railway.internal. Fix: Environment variables with ${VARIABLE:default} pattern.\n\n2. Out of memory crashes — Spring Boot exceeded Railway's 512MB free tier limit. Fix: Added -Xmx256m in Dockerfile and JAVA_TOOL_OPTIONS environment variable.\n\nLearning: Always externalize configuration and understand deployment environment constraints.",
        tip: "Structure: Problem → Root Cause → Solution → Learning. Shows problem-solving maturity."
      },
      {
        q: "Q18. If you had to add one more feature to Hyro, what would it be?",
        a: "I would add real-time notifications using Server-Sent Events (SSE).\n\nCurrently, jobseekers manually refresh to see status changes. With SSE, the moment a recruiter marks application as SHORTLISTED, jobseeker sees a live notification instantly.\n\nImplementation:\n• Backend: Spring's SseEmitter, store per user session\n• Trigger events in ApplicationService.updateStatus()\n• Frontend: EventSource API in React\n\nThis would make Hyro feel like a real production application.",
        tip: "Shows product thinking beyond just coding skills."
      },
      {
        q: "Q19. How would you scale Hyro if it had 1 million users?",
        a: "For 1 million users, I would:\n\n1. Database — Add read replicas, implement caching with Redis for frequently accessed data (job listings)\n2. Backend — Horizontally scale Spring Boot instances behind a load balancer\n3. Job Search — Replace MySQL LIKE queries with Elasticsearch for fast full-text search\n4. File Storage — Move resume uploads to AWS S3 instead of local filesystem\n5. Async Processing — Use message queues (RabbitMQ/Kafka) for email notifications instead of synchronous sending\n6. CDN — Serve static assets through CloudFront\n\nFor now, Hyro is designed for small to medium scale with good architecture foundations.",
        tip: "This shows you think beyond the current project — great impression on senior engineers."
      },
      {
        q: "Q20. What did you learn from building the Hyro full-stack project?",
        a: "Building Hyro taught me several real-world lessons:\n\n1. Security matters from day 1 — JWT, RBAC, input validation, environment variables\n2. Deployment is different from development — localhost assumptions break in production\n3. Architecture decisions matter — DTOs, layered architecture, exception handling make code maintainable\n4. AI integration is accessible — Gemini API added a unique feature with minimal effort\n5. CI/CD saves time — automated deployment after every push removes manual errors\n\nMost importantly, I learned that building a complete product end-to-end (design → code → deploy) teaches more than any tutorial.",
        tip: "End with the end-to-end deployment point — shows full-stack maturity."
      },
    ]
  },
];

export default function InterviewPrep() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (idx) => {
    setActiveCategory(prev => prev === idx ? null : idx);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13',
      padding:'96px 24px 48px' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center',
            gap:10, background:'rgba(99,102,241,0.1)',
            border:'1px solid rgba(99,102,241,0.3)',
            borderRadius:999, padding:'6px 16px',
            fontSize:13, color:'#6366f1', marginBottom:16 }}>
            <BookOpen size={14}/> Interview Preparation Guide
          </div>
          <h1 style={{ fontSize:32, fontWeight:700, marginBottom:8 }}>
            Hyro <span className="gradient-text">Interview Q&A</span>
          </h1>
          <p style={{ color:'#9ca3af', fontSize:15 }}>
            20 questions with detailed answers based on the Hyro project
          </p>
        </div>

        {/* Categories */}
        {questions.map((section, catIdx) => (
          <div key={catIdx} style={{ marginBottom:16 }}>

            {/* Category Header */}
            <button onClick={() => toggleCategory(catIdx)}
              style={{ width:'100%', padding:'14px 20px',
                borderRadius:12, border:'none', cursor:'pointer',
                background: section.color,
                display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:8 }}>
              <span style={{ color:'white', fontWeight:600,
                fontSize:15 }}>{section.category}</span>
              <span style={{ color:'white' }}>
                {activeCategory === catIdx
                  ? <ChevronUp size={18}/>
                  : <ChevronDown size={18}/>}
              </span>
            </button>

            {/* Questions */}
            {activeCategory === catIdx && (
              <div style={{ display:'flex', flexDirection:'column',
                gap:8 }} className="fade-in">
                {section.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={itemIdx}
                      style={{ background:'rgba(255,255,255,0.03)',
                        border:'1px solid rgba(255,255,255,0.08)',
                        borderRadius:12, overflow:'hidden' }}>

                      {/* Question */}
                      <button onClick={() => toggle(catIdx, itemIdx)}
                        style={{ width:'100%', padding:'16px 20px',
                          background:'none', border:'none',
                          cursor:'pointer', textAlign:'left',
                          display:'flex', justifyContent:'space-between',
                          alignItems:'center', gap:12 }}>
                        <span style={{ color:'white', fontWeight:500,
                          fontSize:14, lineHeight:1.5 }}>
                          {item.q}
                        </span>
                        <span style={{ color:'#6366f1', flexShrink:0 }}>
                          {isOpen
                            ? <ChevronUp size={18}/>
                            : <ChevronDown size={18}/>}
                        </span>
                      </button>

                      {/* Answer */}
                      {isOpen && (
                        <div style={{ padding:'0 20px 20px' }}
                          className="fade-in">
                          <div style={{
                            background:'rgba(255,255,255,0.04)',
                            borderRadius:10, padding:'14px 16px',
                            marginBottom:10 }}>
                            {item.a.split('\n').map((line, i) => (
                              line.trim() ? (
                                <p key={i} style={{
                                  color: line.startsWith('•') || /^\d\./.test(line)
                                    ? '#e2e8f0' : '#9ca3af',
                                  fontSize:13, lineHeight:1.7,
                                  marginBottom:4,
                                  fontFamily: line.includes('FROM ') ||
                                    line.includes('GET /') ||
                                    line.includes('Page<') ||
                                    line.includes('if (')
                                    ? 'monospace' : 'inherit',
                                  background: line.includes('FROM ') ||
                                    line.includes('GET /') ||
                                    line.includes('Page<') ||
                                    line.includes('if (')
                                    ? 'rgba(99,102,241,0.1)' : 'transparent',
                                  padding: line.includes('FROM ') ||
                                    line.includes('GET /') ||
                                    line.includes('if (')
                                    ? '2px 8px' : '0',
                                  borderRadius:4,
                                }}>
                                  {line}
                                </p>
                              ) : <br key={i}/>
                            ))}
                          </div>

                          {/* Tip */}
                          <div style={{
                            background:'rgba(251,191,36,0.08)',
                            border:'1px solid rgba(251,191,36,0.2)',
                            borderRadius:8, padding:'10px 14px',
                            display:'flex', gap:8, alignItems:'flex-start' }}>
                            <span style={{ fontSize:14 }}>💡</span>
                            <p style={{ color:'#fbbf24', fontSize:12,
                              lineHeight:1.6, margin:0 }}>
                              <strong>Interviewer Tip: </strong>{item.tip}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Footer note */}
        <div style={{ textAlign:'center', marginTop:40,
          padding:20, background:'rgba(99,102,241,0.05)',
          border:'1px solid rgba(99,102,241,0.2)',
          borderRadius:12 }}>
          <p style={{ color:'#9ca3af', fontSize:13, lineHeight:1.7 }}>
            💪 In every answer, say <span style={{ color:'#6366f1' }}>
            "In Hyro, I implemented..."</span> — this makes your answers
            authentic and memorable to interviewers.
          </p>
        </div>
      </div>
    </div>
  );
}