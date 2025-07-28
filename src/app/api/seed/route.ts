import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Starting Seeding ... ");
    //Only allow in development

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Seeding is only allowed in the development" },
        { status: 403 }
      );
    }

    //Clean existing data that is present
    await prisma.analysis.deleteMany();
    await prisma.savedJob.deleteMany();
    await prisma.resume.deleteMany();
    await prisma.jobDescription.deleteMany();
    await prisma.user.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.analyticsEvent.deleteMany();

    console.log("Cleaned existing data");

    //1. CREATE THE SKILL DATASET
    const skills = await prisma.skill.createMany({
      data: [
        {
          name: "React.js",
          category: "Frontend",
          subcategory: "Javascript Framework",
          importance: 5,
          aliases: ["React", "ReactJS", "React.js"],
        },
        {
          name: "Node.js",
          category: "Backend",
          subcategory: "Runtime",
          importance: 4, // Fixed: was string "4", now number
          aliases: ["Node", "NodeJS", "Node.js"],
        },
        {
          name: "Python",
          category: "Backend",
          subcategory: "Programming Language",
          importance: 5,
          aliases: ["Python3", "py"],
        },
        {
          name: "TypeScript",
          category: "Frontend",
          subcategory: "Programming Language",
          importance: 4,
          aliases: ["TS", "TypeScript"],
        },
        {
          name: "AWS",
          category: "DevOps",
          subcategory: "Cloud Platform",
          importance: 4,
          aliases: ["Amazon Web Services", "AWS"],
        },
        {
          name: "Project Management",
          category: "Soft Skills",
          subcategory: "Leadership",
          importance: 3,
          aliases: ["PM", "Project Management"],
        },
      ],
    });

    //2. Create Test User -( simulating clerk users )
    const user1 = await prisma.user.create({
      data: {
        id: "user_2NxG8JK9p3LmQ4A1B",
        email: "john@email.com",
        firstName: "John",
        lastName: "Doe",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        preferredIndustry: "Technology",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        id: "user_2NxG8Vinay",
        email: "test@gmail.com",
        firstName: "Vinay",
        lastName: "Nain",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        preferredIndustry: "Finance",
      },
    });

    //=============== CREATE TEST RESUME =================
    const resume1 = await prisma.resume.create({
      data: {
        fileName: "john_doe_resume_2024.pdf",
        originalName: "John Doe Resume.pdf",
        fileUrl: "https://example.com/storage/resumes/john_doe_resume.pdf",
        fileSize: 245760, // ~240KB
        extractedText: `John Doe
Software Engineer

EXPERIENCE:
Senior Frontend Developer at TechCorp (2021-2024)
- Built responsive web applications using React.js and TypeScript
- Led team of 4 developers on major product redesign
- Implemented CI/CD pipelines using AWS and Docker
- Improved application performance by 40%

Frontend Developer at StartupXYZ (2019-2021) 
- Developed user interfaces with React and Node.js
- Collaborated with UX team on user experience improvements
- Reduced load times by 30% through optimization

SKILLS:
React.js, TypeScript, Node.js, AWS, Docker, Python, Project Management

EDUCATION:
BS Computer Science, University of Technology (2019)

CERTIFICATIONS:
AWS Certified Developer Associate`,
        skills: [
          "React.js",
          "TypeScript",
          "Node.js",
          "AWS",
          "Docker",
          "Python",
          "Project Management",
        ],
        experienceYrs: 5,
        education: "BS Computer Science, University of Technology (2019)",
        certifications: ["AWS Certified Developer Associate"],
        userId: user1.id,
      },
    });

    const resume2 = await prisma.resume.create({
      data: {
        fileName: "jane_smith_resume_2024.pdf",
        originalName: "Jane Smith CV.pdf",
        fileUrl: "https://example.com/storage/resumes/jane_smith_resume.pdf",
        fileSize: 198432, // ~194KB
        extractedText: `Jane Smith
Full Stack Developer

EXPERIENCE:
Full Stack Developer at FinanceApp Inc (2022-2024)
- Built financial dashboards using React and Python
- Designed RESTful APIs with Node.js and PostgreSQL
- Implemented data visualization with D3.js
- Processed $2M+ in daily transactions

Junior Developer at DataCorp (2020-2022)
- Developed web applications using JavaScript and Python
- Optimized database queries, reducing response time by 50%
- Created automated testing suites

SKILLS:  
Python, React.js, Node.js, PostgreSQL, JavaScript, Data Analysis, D3.js

EDUCATION:
MS Data Science, Tech University (2020)
BS Mathematics, State College (2018)`,
        skills: [
          "Python",
          "React.js",
          "Node.js",
          "PostgreSQL",
          "JavaScript",
          "Data Analysis",
          "D3.js",
        ],
        experienceYrs: 4,
        education: "MS Data Science, Tech University (2020)",
        certifications: [],
        userId: user2.id,
      },
    });

    //4- Create job description
    const job1 = await prisma.jobDescription.create({
      data: {
        title: "Senior React Developer",
        company: "TechGiant Corp",
        description: `We are looking for an experienced Senior React Developer to join our frontend team.

RESPONSIBILITIES:
- Lead development of complex React applications
- Mentor junior developers and conduct code reviews  
- Collaborate with design and backend teams
- Implement best practices for testing and deployment

REQUIREMENTS:
- 5+ years of React.js experience
- Strong TypeScript skills
- Experience with AWS deployment
- Team leadership experience
- Bachelor's degree in Computer Science or related field

NICE TO HAVE:
- Node.js backend experience
- Docker containerization
- CI/CD pipeline experience`,
        requirements:
          "5+ years React.js, TypeScript, AWS, Team Leadership, CS Degree",
        location: "San Francisco, CA (Remote OK)",
        experienceLevel: "Senior",
        industry: "Technology",
        salaryMin: 120000,
        salaryMax: 180000,
        employmentType: "Full-time",
        requiredSkills: [
          "React.js",
          "TypeScript",
          "AWS",
          "Team Leadership",
          "5+ years experience",
        ],
        preferredSkills: ["Node.js", "Docker", "CI/CD"],
        benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
        source: "Company Website",
      },
    });

    const job2 = await prisma.jobDescription.create({
      data: {
        title: "Python Full Stack Developer",
        company: "FinTech Startup",
        description: `Join our growing fintech startup as a Python Full Stack Developer!

WHAT YOU'LL DO:
- Build scalable web applications with Python and React
- Design and implement RESTful APIs
- Work with financial data and payment systems
- Collaborate in an agile development environment

REQUIREMENTS:
- 3+ years Python development experience
- React.js frontend skills
- Database design experience (PostgreSQL preferred)
- Understanding of financial systems (preferred)

BONUS POINTS:
- Node.js experience
- AWS/cloud deployment
- Data analysis skills`,
        requirements:
          "3+ years Python, React.js, Database design, Financial systems knowledge",
        location: "New York, NY (Hybrid)",
        experienceLevel: "Mid-Level",
        industry: "Finance",
        salaryMin: 90000,
        salaryMax: 130000,
        employmentType: "Full-time",
        requiredSkills: [
          "Python",
          "React.js",
          "PostgreSQL",
          "3+ years experience",
        ],
        preferredSkills: [
          "Node.js",
          "AWS",
          "Data Analysis",
          "Financial Systems",
        ],
        benefits: ["Health Insurance", "401k", "Flexible Hours"],
        source: "LinkedIn",
      },
    });

    // 5. Create Test Analyses
    const analysis1 = await prisma.analysis.create({
      data: {
        atsScore: 87,
        keywordMatch: 0.78,
        experienceMatch: "Good Match",
        missingKeywords: ["Team Leadership Examples", "Code Review Process"],
        matchedSkills: ["React.js", "TypeScript", "AWS", "Node.js"],
        weakAreas: ["Leadership Examples", "Mentoring Experience"],
        strengths: [
          "Strong Technical Skills",
          "Relevant Experience",
          "AWS Certification",
        ],
        suggestions: JSON.stringify({
          improvements: [
            "Add specific examples of team leadership and mentoring",
            "Include metrics from your project management experience",
            "Mention code review processes you've implemented",
          ],
          recommendations: [
            "Highlight the team size you managed at TechCorp",
            "Add quantifiable achievements (performance improvements, etc.)",
            "Include any technical blog posts or open source contributions",
          ],
        }),
        summary:
          "Strong technical match with 5 years React experience. Missing some leadership examples.",
        recommendedChanges:
          "Add leadership examples, quantify achievements, mention code reviews",
        analysisTimeMs: 2340,
        aiModel: "gpt-4",
        userId: user1.id,
        resumeId: resume1.id,
        jobDescriptionId: job1.id,
      },
    });

    const analysis2 = await prisma.analysis.create({
      data: {
        atsScore: 92,
        keywordMatch: 0.85,
        experienceMatch: "Excellent Match",
        missingKeywords: ["Financial Systems", "Payment Processing"],
        matchedSkills: ["Python", "React.js", "PostgreSQL", "Data Analysis"],
        weakAreas: ["Financial Domain Knowledge"],
        strengths: [
          "Perfect Tech Stack Match",
          "Data Science Background",
          "Full Stack Skills",
        ],
        suggestions: JSON.stringify({
          improvements: [
            "Emphasize any financial or data analysis projects",
            "Mention experience with financial data or dashboards",
            "Highlight database optimization work",
          ],
          recommendations: [
            "Great match! Consider emphasizing the financial dashboard work",
            "Your data science background is a strong differentiator",
            "Mention any experience with financial regulations or compliance",
          ],
        }),
        summary:
          "Excellent technical and experience match. Perfect for fintech role.",
        recommendedChanges:
          "Emphasize financial dashboard experience, add domain knowledge",
        analysisTimeMs: 1890,
        aiModel: "claude-3",
        userId: user2.id,
        resumeId: resume2.id,
        jobDescriptionId: job2.id,
      },
    });

    //Create test saved jobs
    await prisma.savedJob.create({
      data: {
        userId: user1.id,
        jobDescriptionId: job1.id,
        notes: "Great Company culture, matches my react experience perfectly",
        status: "interested",
      },
    });

    await prisma.savedJob.create({
      data: {
        userId: user2.id,
        jobDescriptionId: job2.id,
        notes: "Applied on LinkedIn, waiting for the response from the company",
        status: "Applied",
        appliedAt: new Date(),
      },
    });

    // ------------------- Create Analysis Events ----------------
    await prisma.analyticsEvent.createMany({
      data: [
        {
          userId: user1.id,
          event: "resume_uploaded",
          metadata: JSON.stringify({
            fileName: "john_doe_resume_2024.pdf",
            fileSize: 245760,
          }),
        },
        {
          userId: user1.id,
          event: "analysis_completed",
          metadata: JSON.stringify({ atsScore: 87, analysisTime: 2340 }),
        },
        {
          userId: user2.id,
          event: "resume_uploaded",
          metadata: JSON.stringify({
            fileName: "jane_smith_resume_2024.pdf",
            fileSize: 198432,
          }),
        },
        {
          userId: user2.id,
          event: "analysis_completed",
          metadata: JSON.stringify({ atsScore: 92, analysisTime: 1890 }),
        },
        {
          userId: user2.id,
          event: "job_saved",
          metadata: JSON.stringify({
            jobTitle: "Python Full Stack Developer",
            company: "FinTech Startup",
          }),
        },
      ],
    });

    // Test a relation query
    const userWithData = await prisma.user.findFirst({
      include: {
        resumes: {
          include: {
            analyses: {
              include: {
                jobDescription: {
                  select: { title: true, company: true },
                },
              },
            },
          },
        },
      },
    });

    const summary = {
      message: "Seed Completed successfully",
      data: {
        skills: skills.count,
        users: 2,
        resume: 2,
        jobDescriptions: 2,
        analyses: 2,
        savedJobs: 2,
        analyticsEvent: 5,
      },

      sample: {
        user: `${userWithData?.firstName} ${userWithData?.lastName}`,
        resumeCount: userWithData?.resumes.length || 0,
        analysisCount: userWithData?.resumes.reduce(
          (acc, resume) => acc + resume.analyses.length,
          0
        ) || 0,
      },
    };

    return NextResponse.json(summary);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("❌ Seed failed:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// -----------------------------------
// GET ROUTE TEST
// -----------------------------------

export async function GET() {
  try {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.jobDescription.count(),
      prisma.analysis.count(),
      prisma.skill.count(),
      prisma.savedJob.count(),
      prisma.analyticsEvent.count(),
    ]);

    const [users, resumes, jobs, analyses, skills, savedJobs, events] = counts;

    return NextResponse.json({
      message: "Current database status",
      data: {
        users,
        resumes,
        jobDescriptions: jobs,
        analyses,
        skills,
        savedJobs,
        analyticsEvents: events,
        total: users + resumes + jobs + analyses + skills + savedJobs + events,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to get database status", details: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}