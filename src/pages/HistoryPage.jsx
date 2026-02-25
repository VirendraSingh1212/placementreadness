import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell.jsx";
import {
  getHistory,
  deleteHistoryEntry,
  clearHistory,
  formatDate,
} from "../lib/storage.js";
import {
  Building2,
  Briefcase,
  Calendar,
  Trash2,
  ExternalLink,
  Award,
  History,
  AlertCircle,
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
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  // Determine color based on score
  let scoreColor = color;
  if (typeof children === "number") {
    if (children >= 80) scoreColor = "green";
    else if (children >= 60) scoreColor = "primary";
    else if (children >= 40) scoreColor = "yellow";
    else scoreColor = "red";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[scoreColor]}`}
    >
      {typeof children === "number" && <Award className="h-3 w-3" />}
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", onClick, className = "" }) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger:
      "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function HistoryEntry({ entry, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/results?id=${entry.id}`);
  };

  const skillCount = Object.values(entry.extractedSkills).reduce(
    (acc, cat) => acc + cat.skills.length,
    0
  );

  return (
    <div
      className="group relative rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/30 hover:shadow-sm cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {entry.company ? (
              <span className="flex items-center gap-1 text-sm font-semibold text-slate-950">
                <Building2 className="h-4 w-4 text-slate-400" />
                {entry.company}
              </span>
            ) : (
              <span className="text-sm font-semibold text-slate-500">
                Unknown Company
              </span>
            )}
            <span className="text-slate-300">•</span>
            {entry.role ? (
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <Briefcase className="h-4 w-4 text-slate-400" />
                {entry.role}
              </span>
            ) : (
              <span className="text-sm text-slate-500">Unknown Role</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(entry.createdAt)}
            </span>
            <span>{skillCount} skills detected</span>
            <span>{entry.questions.length} questions generated</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{entry.readinessScore}</Badge>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <ExternalLink className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAnalyze }) {
  return (
    <Card className="text-center py-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <History className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">
        No analysis history yet
      </h3>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
        Start by analyzing a job description to generate a personalized
        preparation plan. Your analysis history will appear here.
      </p>
      <Button onClick={onAnalyze} className="mt-6">
        Analyze Your First JD
      </Button>
    </Card>
  );
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this analysis?")) {
      deleteHistoryEntry(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      clearHistory();
      loadHistory();
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageShell
        title="Analysis History"
        description="View and manage your past job description analyses."
      />

      {history.length === 0 ? (
        <EmptyState onAnalyze={() => navigate("/analyzer")} />
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">Total Analyses</p>
              <p className="text-2xl font-bold text-slate-950">
                {history.length}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Average Score</p>
              <p className="text-2xl font-bold text-slate-950">
                {Math.round(
                  history.reduce((acc, h) => acc + h.readinessScore, 0) /
                    history.length
                )}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Highest Score</p>
              <p className="text-2xl font-bold text-slate-950">
                {Math.max(...history.map((h) => h.readinessScore))}
              </p>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {history.length} analysis{history.length !== 1 ? "es" : ""}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/analyzer")}
              >
                New Analysis
              </Button>
              <Button variant="danger" onClick={() => setShowClearConfirm(true)}>
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {history.map((entry) => (
              <HistoryEntry
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Clear Confirmation Modal */}
          {showClearConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="max-w-md w-full">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertCircle className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Clear All History?</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  This will permanently delete all {history.length} analysis
                  entries. This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
