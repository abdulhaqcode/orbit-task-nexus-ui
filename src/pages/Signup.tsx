import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { signUp, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await signUp(username, email, password, fullName || undefined)
      if (res.error) {
        setError(res.error.message ?? 'Unable to signup')
        return
      }
      navigate('/')
    } catch (err: any) {
      setError(err?.message ?? 'Error')
    }
  }

  const handleOAuthSignup = (provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.location.href = `${apiUrl}/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              type="text" 
              placeholder="username" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email" 
              placeholder="you@example.com" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name (Optional)</label>
            <Input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              type="text" 
              placeholder="John Doe" 
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
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex items-center justify-between">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOAuthSignup('google')}
              className="w-full"
            >
              Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOAuthSignup('facebook')}
              className="w-full"
            >
              Facebook
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOAuthSignup('github')}
              className="w-full"
            >
              GitHub
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
