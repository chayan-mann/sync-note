import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import type { AppDispatch, RootState } from "../app/store.ts"
import { loginUser } from "../features/auth/authSlice.ts" // Import the Redux thunk

const LoginPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  // Use the auth state from the Redux store
  const { isAuthenticated, status, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dispatch the loginUser async thunk instead of making a direct API call
    dispatch(loginUser({ username, password }))
  }

  const isLoading = status === 'loading';

  return (
    // Main container - ensures the form is centered on the page
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6" aria-labelledby="login-title">
      {/* Frosted glass card */}
      <section 
        className="w-full max-w-md bg-white/10 border border-white/20 shadow-2xl backdrop-blur-lg rounded-2xl p-8 text-white" 
        role="region" 
        aria-label="Login form"
      >
        <header className="text-center mb-6">
          <h1 id="login-title" className="text-3xl font-bold">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-300">Please sign in to continue.</p>
        </header>

        {/* Error message display from Redux state */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm"
          >
            {error}
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Login"}
          </button>
        </form>

        <footer className="mt-6 text-center">
          <span className="text-slate-300">
            New here?{" "}
            <Link to="/signup" className="text-cyan-400 hover:underline font-medium">
              Create an account
            </Link>
          </span>
        </footer>
      </section>
    </main>
  )
}

export default LoginPage
