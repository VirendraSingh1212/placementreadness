import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell.jsx";
import { analyzeJD } from "../lib/analysis.js";
import { saveToHistory } from "../lib/storage.js";
import { Sparkles, Building2, Briefcase, FileText, Loader2 } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function Input({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
        {label}
      </label>
      <input
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        {...props}
      />
    </div>
  );
}

function TextArea({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
        {label}
      </label>
      <textarea
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        {...props}
      />
    </div>
  );
}

function Button({ children, variant = "primary", isLoading, className = "", ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function AnalyzerPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;

    setIsAnalyzing(true);

    // Simulate processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const result = analyzeJD(company, role, jdText);
      const savedEntry = saveToHistory(result);
      navigate(`/results?id=${savedEntry.id}`);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isValid = jdText.trim().length > 0;

  return (
    <div className="space-y-6">
      <PageShell
        title="JD Analyzer"
        description="Paste a job description to get a personalized preparation plan."
      />

      <Card>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Company Name (optional)"
              icon={Building2}
              placeholder="e.g., Google, Amazon, StartupXYZ"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Role (optional)"
              icon={Briefcase}
              placeholder="e.g., Software Engineer, Full Stack Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <TextArea
            label="Job Description"
            icon={FileText}
            placeholder="Paste the full job description here. Include requirements, skills, and responsibilities..."
            rows={12}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {jdText.length > 0 ? `${jdText.length} characters` : "JD required for analysis"}
            </p>
            <Button
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              disabled={!isValid}
            >
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze JD"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tips Card */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-950">Tips for best results</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Paste the complete job description including requirements and responsibilities
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Include company name and role for better readiness scoring
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Longer JDs (&gt;800 chars) get higher readiness score weight
          </li>
        </ul>
      </Card>
    </div>
  );
}
