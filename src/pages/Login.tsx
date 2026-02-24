import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { signIn, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await signIn(identifier, password)
      if (res.error) {
        setError(res.error.message ?? 'Unable to login')
        return
      }
      navigate('/')
    } catch (err: any) {
      setError(err?.message ?? 'Error')
    }
  }

  const handleOAuthLogin = (provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.location.href = `${apiUrl}/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-glow border border-border/50 animate-scale-in">
        <h1 className="text-2xl font-bold mb-6 gradient-text">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email or Username</label>
            <Input 
              value={identifier} 
              onChange={e => setIdentifier(e.target.value)} 
              type="text" 
              placeholder="you@example.com or username" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••" 
              required
            />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="flex items-center justify-between">
            <Button type="submit" className="w-full gradient-primary border-0 text-white shadow-glow hover:shadow-glow-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOAuthLogin('google')}
              className="w-full"
            >
              Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOAuthLogin('facebook')}
              className="w-full"
            >
              Facebook
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOAuthLogin('github')}
              className="w-full"
            >
              GitHub
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/signup" className="text-primary underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
