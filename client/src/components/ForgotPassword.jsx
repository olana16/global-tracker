import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { authAPI } from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await authAPI.forgotPassword(email)
      if (response.success) {
        setIsSubmitted(true)
      } else {
        setError(response.message || 'Failed to send reset email')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-cyber-purple/10 to-cyber-green/10"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="cyber-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-cyber-green/20 rounded-full border border-cyber-green/50">
                  <CheckCircle className="w-8 h-8 text-cyber-green" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-cyber-blue mb-2">Email Sent</h1>
              <p className="text-gray-400">Password reset instructions have been sent to your email</p>
            </div>

            {/* Success Message */}
            <div className="mb-6 p-4 bg-cyber-green/10 border border-cyber-green/30 rounded">
              <p className="text-cyber-green text-sm">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-cyber-blue hover:text-cyber-green transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
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
                <Mail className="w-8 h-8 text-cyber-blue" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-cyber-blue mb-2">Forgot Password</h1>
            <p className="text-gray-400">Enter your email to receive password reset instructions</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-cyber-red/10 border border-cyber-red/30 rounded flex items-center">
              <AlertCircle className="w-5 h-5 text-cyber-red mr-2" />
              <span className="text-cyber-red text-sm">{error}</span>
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="cyber-input pl-10"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-cyber-blue hover:text-cyber-green transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
