import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell.jsx";
import { getHistoryEntry, getLatestAnalysis, formatDate } from "../lib/storage.js";
import {
  Target,
  CheckCircle2,
  Calendar,
  HelpCircle,
  ArrowLeft,
  Building2,
  Briefcase,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({ children, color = "primary" }) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </Card>
  );
}

function CircularScore({ score, size = 120 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100;
  const dashoffset = circumference * (1 - progress);

  let color = "hsl(var(--primary))";
  if (score < 50) color = "#ef4444";
  else if (score < 70) color = "#f59e0b";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary) / 0.15)"
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-950">{score}</span>
        <span className="text-xs text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function SkillsSection({ extractedSkills }) {
  const categoryColors = {
    coreCS: "blue",
    languages: "green",
    web: "purple",
    data: "orange",
    cloudDevOps: "slate",
    testing: "primary",
    general: "primary",
  };

  return (
    <div className="space-y-4">
      {Object.entries(extractedSkills).map(([key, category]) => (
        <div key={key}>
          <h4 className="mb-2 text-sm font-medium text-slate-700">
            {category.label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <Badge key={skill} color={categoryColors[key] || "primary"}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChecklistSection({ checklist }) {
  return (
    <div className="space-y-6">
      {Object.entries(checklist).map(([key, round]) => (
        <div key={key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <h4 className="mb-3 font-semibold text-slate-950">{round.title}</h4>
          <ul className="space-y-2">
            {round.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PlanSection({ plan }) {
  return (
    <div className="space-y-4">
      {plan.map((day) => (
        <div
          key={day.day}
          className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <Badge>Day {day.day}</Badge>
            <h4 className="font-semibold text-slate-950">{day.title}</h4>
          </div>
          <ul className="ml-6 space-y-1">
            {day.tasks.map((task, idx) => (
              <li key={idx} className="text-sm text-slate-600">
                • {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function QuestionsSection({ questions }) {
  return (
    <div className="space-y-3">
      {questions.map((question, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {idx + 1}
          </span>
          <p className="text-sm text-slate-700">{question}</p>
        </div>
      ))}
    </div>
  );
}

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("id");
    let data = null;

    if (id) {
      data = getHistoryEntry(id);
    } else {
      data = getLatestAnalysis();
    }

    setAnalysis(data);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <PageShell
          title="Results"
          description="No analysis found."
        />
        <Card className="text-center py-12">
          <p className="text-slate-600">No analysis data available.</p>
          <button
            onClick={() => navigate("/analyzer")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Analyze a JD
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <PageShell
            title="Analysis Results"
            description={`Analyzed on ${formatDate(analysis.createdAt)}`}
          />
        </div>
      </div>

      {/* Company & Role Info */}
      <Card>
        <div className="flex flex-wrap items-center gap-6">
          {analysis.company && (
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Company</p>
                <p className="font-medium text-slate-950">{analysis.company}</p>
              </div>
            </div>
          )}
          {analysis.role && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="font-medium text-slate-950">{analysis.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Analyzed</p>
              <p className="font-medium text-slate-950">
                {formatDate(analysis.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Readiness Score */}
      <Card className="flex items-center gap-6">
        <CircularScore score={analysis.readinessScore} />
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-slate-950">
              Readiness Score
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {analysis.readinessScore >= 80
              ? "Excellent! You're well-prepared for this role."
              : analysis.readinessScore >= 60
              ? "Good foundation. Focus on the recommended areas."
              : "Needs work. Follow the 7-day plan to improve."}
          </p>
        </div>
      </Card>

      {/* Skills Extracted */}
      <Section title="Key Skills Extracted" icon={Target}>
        <SkillsSection extractedSkills={analysis.extractedSkills} />
      </Section>

      {/* Preparation Checklist */}
      <Section title="Round-wise Preparation Checklist" icon={CheckCircle2}>
        <ChecklistSection checklist={analysis.checklist} />
      </Section>

      {/* 7-Day Plan */}
      <Section title="7-Day Preparation Plan" icon={Calendar}>
        <PlanSection plan={analysis.plan} />
      </Section>

      {/* Interview Questions */}
      <Section title="Likely Interview Questions" icon={HelpCircle}>
        <QuestionsSection questions={analysis.questions} />
      </Section>
    </div>
  );
}
