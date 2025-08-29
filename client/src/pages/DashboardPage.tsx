
import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNotes, addNewNote } from "../features/notes/notesSlice"
import type { AppDispatch, RootState } from "../app/store"
import { logout } from "../features/auth/authSlice"
import { Link } from "react-router-dom"

const DashboardPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { notes, status } = useSelector((state: RootState) => state.notes)
  const { user } = useSelector((state: RootState) => state.auth)

  // Local state for the new note form and search/filter
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [query, setQuery] = useState("")

  // Fetch notes when the component loads
  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && content) {
      dispatch(addNewNote({ title, content }))
      // Clear form after submission
      setTitle("")
      setContent("")
    }
  }

  const renderNotes = () => {
    if (status === "loading") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md p-5 animate-pulse ring-1 ring-white/5 shadow-sm"
            >
              <div className="h-5 w-2/3 bg-slate-700 rounded mb-3" />
              <div className="h-4 w-full bg-slate-700 rounded mb-2" />
              <div className="h-4 w-5/6 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      )
    }

    const filtered = query.trim()
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(query.toLowerCase()) ||
            n.content.toLowerCase().includes(query.toLowerCase()),
        )
      : notes

    if (filtered.length === 0) {
      return (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md p-10 text-center ring-1 ring-white/5">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/60">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10 4a6 6 0 104.472 10.062l4.233 4.233a1 1 0 001.414-1.414l-4.233-4.233A6 6 0 0010 4zm-4 6a4 4 0 118 0a4 4 0 01-8 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-200">No notes found</h3>
          <p className="mt-2 text-slate-400">
            {query ? "Try a different search." : "Create your first note using the form on the left."}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
        {filtered.map((note) => (
          <div
            key={note._id}
            className="group rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md p-5 shadow-sm ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-900/20"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h4 className="font-semibold text-lg text-cyan-400 line-clamp-1">{note.title}</h4>
              <span
                className="mt-1 h-2 w-2 rounded-full bg-cyan-500/80 group-hover:bg-cyan-400/90"
                aria-hidden="true"
              />
            </div>
            <p className="text-slate-300 whitespace-pre-wrap line-clamp-5">{note.content}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar (mobile) */}
      <header className="md:hidden sticky top-0 z-10 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-balance">SyncNote</h1>
          <button
            onClick={() => dispatch(logout())}
            className="rounded-md border border-slate-800 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:py-10">
        {/* Left Sidebar */}
        <aside className="hidden md:flex w-80 shrink-0">
          <div className="flex h-full w-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-cyan-600/20 ring-1 ring-cyan-600/30 flex items-center justify-center">
                  <span className="text-cyan-400 font-semibold">
                    {user?.username ? user.username[0]?.toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">SyncNote</h2>
                  <p className="text-sm text-slate-400">Welcome, {user?.username || "User"}!</p>
                </div>
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-slate-200">Create a new note</h3>
              <div>
                <label htmlFor="title" className="block text-xs mb-1.5 text-slate-400">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-xs mb-1.5 text-slate-400">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-600"
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 font-semibold text-white hover:bg-cyan-700 transition-colors"
              >
                Add Note
              </button>
            </form>

            {/* Navigation and Logout at the bottom */}
            <div className="mt-auto pt-6">
              <nav className="flex flex-col gap-2">
                <Link to="/settings" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Settings
                </Link>
              </nav>
              <button
                onClick={() => dispatch(logout())}
                className="mt-4 w-full rounded-lg border border-red-900/40 bg-red-900/20 px-3 py-2 text-left text-red-300 hover:bg-red-900/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="mb-4 md:mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">Your Notes</h1>
                <span className="rounded-full border border-slate-800 bg-slate-800/60 px-2 py-1 text-xs text-slate-300">
                  {notes.length} total
                </span>
              </div>

              <div className="w-full md:w-auto">
                <label htmlFor="search" className="sr-only">
                  Search notes
                </label>
                <div className="relative md:w-80">
                  <span className="pointer-events-none absolute left-3 top-2.5 text-slate-500" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <path
                        fill="currentColor"
                        d="M10 4a6 6 0 104.472 10.062l4.233 4.233a1 1 0 001.414-1.414l-4.233-4.233A6 6 0 0010 4zm-4 6a4 4 0 118 0a4 4 0 01-8 0z"
                      />
                    </svg>
                  </span>
                  <input
                    id="search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/60 pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-600"
                  />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
              <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 ring-1 ring-white/5">
                <p className="text-xs text-slate-400">Total Notes</p>
                <p className="mt-1 text-2xl font-bold text-white">{notes.length}</p>
              </div>
              <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 ring-1 ring-white/5">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="mt-1 text-base font-medium text-slate-200">{user?.username || "User"}</p>
              </div>
            </div>
          </div>

          {renderNotes()}
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
