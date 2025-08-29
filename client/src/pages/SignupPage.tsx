import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import type { AppDispatch, RootState } from "../app/store.ts"
import axios from "axios"

const API_BASE_URL = (import.meta as ImportMeta).env?.VITE_API_BASE_URL || "http://localhost:8000/api/auth"

const SignupPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)
    try {
      // Corrected the endpoint to be appended to the base URL
      await axios.post(`${API_BASE_URL}/signup`, { username, password })
      navigate("/login")
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Signup failed. Please try again."
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-800 flex items-center justify-center p-6" aria-labelledby="signup-title">
      {/* Frosted glass card */}
      <section 
        className="w-full max-w-md bg-white/10 border border-white/20 shadow-2xl backdrop-blur-lg rounded-2xl p-8 text-white" 
        role="region" 
        aria-label="Signup form"
      >
        <header className="text-center mb-6">
          <h1 id="signup-title" className="text-3xl font-bold">
            Create your account
          </h1>
          <p className="mt-2 text-slate-300">Join us in a few seconds.</p>
        </header>

        {/* Error message display */}
        {errorMsg && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm mb-2 text-slate-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Choose a username"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm mb-2 text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Create a password"
              required
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <footer className="mt-6 text-center">
          <span className="text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline font-medium">
              Login
            </Link>
          </span>
        </footer>
      </section>
    </main>
  )
}

export default SignupPage
