import { PageShell } from "../components/PageShell.jsx";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Play, Calendar, Clock } from "lucide-react";

// --- Components ---

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
      {children}
    </h3>
  );
}

function Progress({ value, max = 100, className = "" }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// --- Section Components ---

function CircularProgress({ value, max = 100, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, value / max));
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-950">{value}</span>
          <span className="text-sm text-slate-500">/ {max}</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">Readiness Score</p>
    </div>
  );
}

function SkillBreakdown() {
  const data = [
    { subject: "DSA", value: 75, fullMark: 100 },
    { subject: "System Design", value: 60, fullMark: 100 },
    { subject: "Communication", value: 80, fullMark: 100 },
    { subject: "Resume", value: 85, fullMark: 100 },
    { subject: "Aptitude", value: 70, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="hsl(var(--primary) / 0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ContinuePractice() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Last Topic</p>
          <p className="text-lg font-semibold text-slate-950">Dynamic Programming</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Play className="h-5 w-5 text-primary" fill="currentColor" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-950">3 / 10 completed</span>
        </div>
        <Progress value={3} max={10} />
      </div>
      <Button className="w-full">
        <Play className="h-4 w-4" />
        Continue
      </Button>
    </div>
  );
}

function WeeklyGoals() {
  const days = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: false },
    { day: "Fri", active: true },
    { day: "Sat", active: false },
    { day: "Sun", active: false },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Problems Solved</span>
          <span className="text-sm font-medium text-slate-950">12 / 20 this week</span>
        </div>
        <Progress value={12} max={20} />
      </div>
      <div className="flex justify-between pt-2">
        {days.map(({ day, active }) => (
          <div key={day} className="flex flex-col items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full ${
                active
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-400"
              } flex items-center justify-center text-xs font-medium`}
            >
              {day[0]}
            </div>
            <span className="text-xs text-slate-500">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingAssessments() {
  const assessments = [
    {
      title: "DSA Mock Test",
      date: "Tomorrow",
      time: "10:00 AM",
      icon: Calendar,
    },
    {
      title: "System Design Review",
      date: "Wed",
      time: "2:00 PM",
      icon: Clock,
    },
    {
      title: "HR Interview Prep",
      date: "Friday",
      time: "11:00 AM",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-3">
      {assessments.map((assessment, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition hover:border-slate-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <assessment.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-950">
              {assessment.title}
            </p>
            <p className="text-xs text-slate-500">
              {assessment.date}, {assessment.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Dashboard Page ---

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageShell
        title="Dashboard"
        description="Your placement readiness at a glance."
      />

      {/* 2-column grid on desktop, single column on mobile */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Readiness - Large circular progress */}
        <Card className="flex flex-col items-center justify-center">
          <CardTitle>Overall Readiness</CardTitle>
          <div className="mt-6">
            <CircularProgress value={72} max={100} />
          </div>
        </Card>

        {/* Skill Breakdown - Radar Chart */}
        <Card>
          <CardTitle>Skill Breakdown</CardTitle>
          <div className="mt-4">
            <SkillBreakdown />
          </div>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardTitle>Continue Practice</CardTitle>
          <div className="mt-4">
            <ContinuePractice />
          </div>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardTitle>Weekly Goals</CardTitle>
          <div className="mt-4">
            <WeeklyGoals />
          </div>
        </Card>

        {/* Upcoming Assessments - spans full width on mobile, half on desktop */}
        <Card className="md:col-span-2">
          <CardTitle>Upcoming Assessments</CardTitle>
          <div className="mt-4">
            <UpcomingAssessments />
          </div>
        </Card>
      </div>
    </div>
  );
}

