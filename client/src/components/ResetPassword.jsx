import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { authAPI } from '../services/api'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState(null)

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset token')
      setTokenValid(false)
      return
    }
    // You could add a token validation endpoint here
    setTokenValid(true)
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await authAPI.resetPassword(token, formData.password)
      if (response.success) {
        setIsSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError(response.message || 'Failed to reset password')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-cyber-purple/10 to-cyber-green/10"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="cyber-card p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-cyber-red mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-cyber-red mb-2">Invalid Link</h1>
              <p className="text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
              <Link
                to="/forgot-password"
                className="cyber-button-primary"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-cyber-purple/10 to-cyber-green/10"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="cyber-card p-8">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-cyber-green mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-cyber-green mb-2">Password Reset</h1>
              <p className="text-gray-400">Your password has been successfully reset. Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-cyber-purple/10 to-cyber-green/10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="cyber-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-cyber-blue/20 rounded-full border border-cyber-blue/50">
                <Shield className="w-8 h-8 text-cyber-blue" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-cyber-blue mb-2">Reset Password</h1>
            <p className="text-gray-400">Enter your new password</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-cyber-red/10 border border-cyber-red/30 rounded flex items-center">
              <AlertCircle className="w-5 h-5 text-cyber-red mr-2" />
              <span className="text-cyber-red text-sm">{error}</span>
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="cyber-input pl-10 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-blue"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="cyber-input pl-10 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-blue"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-cyber-blue hover:text-cyber-green transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
