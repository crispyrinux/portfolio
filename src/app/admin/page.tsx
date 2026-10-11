"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Github,
  Plus,
  Trash2,
  Archive,
  Star,
  Check,
  LogOut,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  FolderKanban,
  Layers,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
  getCurrentUser,
  isCurrentUserAdmin,
  signOutAdmin,
} from "@/lib/supabase";
import {
  getAdminProjects,
  archiveProject,
  toggleFeaturedProject,
  deleteProject,
  saveProject,
  type SupabaseProjectRow,
} from "@/lib/projects-service";

export default function AdminPage() {
  const [sessionUser, setSessionUser] = useState<{ email?: string; id?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard state
  const [projects, setProjects] = useState<SupabaseProjectRow[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "archived">("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Modal / Form state for Create / Edit
  const [editingProject, setEditingProject] = useState<Partial<SupabaseProjectRow> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 1. Check Authentication on Mount
  const verifyAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    setAuthError(null);

    if (!isSupabaseConfigured || !supabase) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) {
        setSessionUser(null);
        setIsAdmin(false);
        setIsCheckingAuth(false);
        return;
      }

      setSessionUser({ email: user.email, id: user.id });
      const adminStatus = await isCurrentUserAdmin();
      setIsAdmin(adminStatus);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication check failed.");
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();

    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      verifyAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [verifyAuth]);

  // 2. Load Projects when Admin confirmed
  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    const res = await getAdminProjects();
    if (res.error) {
      setFeedback({ type: "error", text: res.error });
    } else {
      setProjects(res.projects);
    }
    setIsLoadingProjects(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadProjects();
    }
  }, [isAdmin, loadProjects]);

  // Handle GitHub OAuth Login
  const handleGithubSignIn = async () => {
    if (!supabase) {
      setAuthError("Supabase is not configured.");
      return;
    }

    setIsSigningIn(true);
    setAuthError(null);
    try {
      const redirectTo = `${window.location.origin}/admin`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      });
      if (error) setAuthError(error.message);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setSessionUser(null);
    setIsAdmin(false);
  };

  // Actions
  const handleToggleArchive = async (project: SupabaseProjectRow) => {
    setBusyId(project.id);
    const newStatus = !project.is_archived;
    const res = await archiveProject(project.id, newStatus);
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_archived: newStatus } : p)),
      );
      setFeedback({
        type: "success",
        text: `Project "${project.title}" ${newStatus ? "archived" : "restored"}.`,
      });
    } else {
      setFeedback({ type: "error", text: res.error || "Action failed." });
    }
    setBusyId(null);
  };

  const handleToggleFeatured = async (project: SupabaseProjectRow) => {
    setBusyId(project.id);
    const newFeatured = !project.is_featured;
    const res = await toggleFeaturedProject(project.id, newFeatured);
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_featured: newFeatured } : p)),
      );
      setFeedback({
        type: "success",
        text: `Project "${project.title}" is now ${newFeatured ? "featured" : "standard"}.`,
      });
    } else {
      setFeedback({ type: "error", text: res.error || "Action failed." });
    }
    setBusyId(null);
  };

  const handleDelete = async (project: SupabaseProjectRow) => {
    if (!confirm(`Are you sure you want to permanently delete "${project.title}"?`)) return;
    setBusyId(project.id);
    const res = await deleteProject(project.id);
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setFeedback({ type: "success", text: `Project "${project.title}" deleted.` });
    } else {
      setFeedback({ type: "error", text: res.error || "Delete failed." });
    }
    setBusyId(null);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) {
      alert("Title is required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      ...editingProject,
      slug:
        editingProject.slug ||
        editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    };

    const res = await saveProject(payload);
    if (res.ok && res.project) {
      setFeedback({
        type: "success",
        text: `Project "${res.project.title}" saved successfully.`,
      });
      setEditingProject(null);
      loadProjects();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save project." });
    }
    setIsSaving(false);
  };

  // Filtered projects list
  const filteredProjects = projects.filter((p) => {
    if (filterTab === "active") return !p.is_archived;
    if (filterTab === "archived") return p.is_archived;
    return true;
  });

  // --------------------------------------------------------------------------
  // Render: Loading State
  // --------------------------------------------------------------------------
  if (isCheckingAuth) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="panel flex items-center gap-3 p-6 text-sm">
          <RefreshCw size={18} className="animate-spin text-[var(--color-signal-2)]" />
          <span>Verifying authentication and workspace credentials...</span>
        </div>
      </main>
    );
  }

  // --------------------------------------------------------------------------
  // Render: Not Authenticated / Not Admin Login Screen
  // --------------------------------------------------------------------------
  if (!sessionUser || !isAdmin) {
    return (
      <main className="flex min-h-[85vh] items-center justify-center px-4 py-16">
        <div className="panel panel-raised w-full max-w-lg border border-[var(--color-line)] p-8 sm:p-10">
          <div className="flex items-center justify-between">
            <span className="chip">Protected Workspace</span>
            <Link
              href="/"
              className="mono inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
            >
              <ArrowLeft size={12} /> Public site
            </Link>
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
            Admin CMS
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">
            Single-owner management portal for portfolio projects. Uses Supabase Auth and database
            shared with the <span className="mono">portfoliowindows</span> workspace.
          </p>

          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {sessionUser && !isAdmin && (
            <div className="mt-5 rounded border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
              <p className="font-semibold">Access restricted</p>
              <p className="mt-1">
                You are signed in as <span className="mono font-bold">{sessionUser.email}</span>,
                but your ID is not registered in <span className="mono font-bold">admin_profiles</span>.
              </p>
              <button
                onClick={handleSignOut}
                className="btn-ghost mt-3 text-xs"
              >
                Sign out and switch account
              </button>
            </div>
          )}

          {!sessionUser && (
            <div className="mt-8 space-y-4">
              <button
                onClick={handleGithubSignIn}
                disabled={isSigningIn}
                className="btn-bench w-full justify-center py-3 text-sm font-medium"
              >
                <Github size={16} />
                {isSigningIn ? "Redirecting to GitHub..." : "Sign in with GitHub"}
              </button>

              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
                Whitelisted administrators only
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // --------------------------------------------------------------------------
  // Render: Admin Dashboard
  // --------------------------------------------------------------------------
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 border-b border-[var(--color-line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip chip-live">Live Admin</span>
            <span className="mono text-[11px] text-[var(--color-ink-3)]">
              {sessionUser.email}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Portfolio Management</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() =>
              setEditingProject({
                title: "",
                slug: "",
                short_description: "",
                tech_stack: [],
                features: [],
                year: new Date().getFullYear(),
                is_featured: false,
                is_archived: false,
              })
            }
            className="btn-bench text-xs"
          >
            <Plus size={14} /> New project
          </button>
          <button onClick={loadProjects} className="btn-ghost text-xs" title="Refresh projects">
            <RefreshCw size={14} className={isLoadingProjects ? "animate-spin" : ""} />
          </button>
          <button onClick={handleSignOut} className="btn-ghost text-xs text-rose-400 hover:text-rose-300">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mt-6 flex items-center justify-between rounded p-4 text-xs ${
            feedback.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="label flex items-center gap-1.5">
            <FolderKanban size={14} /> Total Projects
          </p>
          <p className="mono mt-2 text-3xl font-semibold">{projects.length}</p>
        </div>
        <div className="panel p-5">
          <p className="label flex items-center gap-1.5 text-amber-300">
            <Star size={14} /> Featured
          </p>
          <p className="mono mt-2 text-3xl font-semibold text-amber-300">
            {projects.filter((p) => p.is_featured && !p.is_archived).length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="label flex items-center gap-1.5 text-slate-400">
            <Archive size={14} /> Archived
          </p>
          <p className="mono mt-2 text-3xl font-semibold text-slate-400">
            {projects.filter((p) => p.is_archived).length}
          </p>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="mt-10 flex border-b border-[var(--color-line)] pb-px">
        {(["all", "active", "archived"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              filterTab === tab
                ? "border-b-2 border-[var(--color-signal-2)] font-semibold text-[var(--color-ink)]"
                : "text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab} ({projects.filter((p) => (tab === "all" ? true : tab === "active" ? !p.is_archived : p.is_archived)).length})
          </button>
        ))}
      </div>

      {/* Project Table / List */}
      <div className="mt-6 divide-y divide-[var(--color-line-soft)] border border-[var(--color-line)] bg-[var(--color-paper)]">
        {isLoadingProjects ? (
          <div className="flex items-center justify-center p-12 text-sm text-[var(--color-ink-3)]">
            <RefreshCw size={18} className="animate-spin mr-2" /> Loading database rows...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-ink-3)]">
            No projects in this category. Click &quot;New project&quot; to add one.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-[var(--color-paper-2)]"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-base text-[var(--color-ink)]">{project.title}</h3>
                  {project.is_featured && (
                    <span className="chip border-amber-400/40 bg-amber-400/10 text-amber-300 text-[10px]">
                      ★ featured
                    </span>
                  )}
                  {project.is_archived ? (
                    <span className="chip border-slate-500/40 bg-slate-500/10 text-slate-400 text-[10px]">
                      archived
                    </span>
                  ) : (
                    <span className="chip chip-live text-[10px]">active</span>
                  )}
                </div>

                <p className="text-xs text-[var(--color-ink-2)] line-clamp-1">
                  {project.short_description || project.overview || "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[var(--color-ink-3)] font-mono">
                  <span>/{project.slug || project.id}</span>
                  <span>•</span>
                  <span>{project.year || "2026"}</span>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{project.tech_stack.slice(0, 3).join(", ")}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-center">
                {project.slug && (
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="btn-ghost p-2 text-xs"
                    title="View live case study"
                  >
                    <ExternalLink size={14} />
                  </Link>
                )}

                <button
                  disabled={busyId === project.id}
                  onClick={() => handleToggleFeatured(project)}
                  className={`btn-ghost p-2 text-xs ${project.is_featured ? "text-amber-400" : ""}`}
                  title={project.is_featured ? "Remove featured" : "Set featured"}
                >
                  <Star size={14} />
                </button>

                <button
                  disabled={busyId === project.id}
                  onClick={() => handleToggleArchive(project)}
                  className="btn-ghost p-2 text-xs"
                  title={project.is_archived ? "Restore project" : "Archive project"}
                >
                  <Archive size={14} />
                </button>

                <button
                  onClick={() => setEditingProject({ ...project })}
                  className="btn-ghost px-2.5 py-1.5 text-xs font-mono"
                >
                  Edit
                </button>

                <button
                  disabled={busyId === project.id}
                  onClick={() => handleDelete(project)}
                  className="btn-ghost p-2 text-xs text-rose-400 hover:text-rose-300"
                  title="Delete project permanently"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal / Form: Create & Edit Project */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="panel panel-raised max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-4">
              <h2 className="text-xl font-semibold">
                {editingProject.id ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="label block mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm"
                  placeholder="e.g. Distributed Queue Broker"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label block mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={editingProject.slug || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 font-mono text-xs"
                    placeholder="e.g. distributed-queue-broker"
                  />
                </div>
                <div>
                  <label className="label block mb-1">Year</label>
                  <input
                    type="number"
                    value={editingProject.year || 2026}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, year: Number(e.target.value) })
                    }
                    className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label block mb-1">Short Description (Card Summary)</label>
                <textarea
                  rows={2}
                  value={editingProject.short_description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, short_description: e.target.value })
                  }
                  className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm"
                  placeholder="One sentence summary for the project card"
                />
              </div>

              <div>
                <label className="label block mb-1">Overview / Case Study Problem &amp; Architecture</label>
                <textarea
                  rows={3}
                  value={editingProject.overview || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, overview: e.target.value })
                  }
                  className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm"
                  placeholder="Detailed background or architecture breakdown"
                />
              </div>

              <div>
                <label className="label block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingProject.tech_stack)
                      ? editingProject.tech_stack.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tech_stack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm font-mono"
                  placeholder="Go, Redis, Docker, gRPC"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label block mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_url: e.target.value })
                    }
                    className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="label block mb-1">Demo / Live URL</label>
                  <input
                    type="url"
                    value={editingProject.demo_video_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, demo_video_url: e.target.value })
                    }
                    className="w-full rounded border border-[var(--color-line)] bg-[var(--color-paper-2)] p-2.5 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.is_featured)}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, is_featured: e.target.checked })
                    }
                  />
                  <span>Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.is_archived)}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, is_archived: e.target.checked })
                    }
                  />
                  <span>Archived</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--color-line)]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-bench text-xs"
                >
                  {isSaving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
