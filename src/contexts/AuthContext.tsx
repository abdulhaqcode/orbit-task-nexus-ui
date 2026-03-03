import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, User } from '@/lib/api'
import { useNavigate } from 'react-router-dom'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (identifier: string, password: string) => Promise<any>
  signUp: (username: string, email: string, password: string, fullName?: string) => Promise<any>
  signOut: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('user')
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
          const { user: freshUser } = await authAPI.getProfile()
          setUser(freshUser)
          localStorage.setItem('user', JSON.stringify(freshUser))
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }
    initialize()
  }, [])

  const signIn = async (identifier: string, password: string) => {
    setLoading(true)
    try {
      const response = await authAPI.login({ identifier, password })
      setUser(response.user)
      setLoading(false)
      return { data: response, error: null }
    } catch (err: any) {
      setLoading(false)
      return { 
        data: null, 
        error: { message: err.response?.data?.error || 'Login failed' } 
      }
    }
  }

  const signUp = async (username: string, email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      const response = await authAPI.register({ 
        username, 
        email, 
        password, 
        full_name: fullName 
      })
      setUser(response.user)
      setLoading(false)
      return { data: response, error: null }
    } catch (err: any) {
      setLoading(false)
      return { 
        data: null, 
        error: { message: err.response?.data?.error || 'Registration failed' } 
      }
    }
  }

  const signOut = () => {
    authAPI.logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
