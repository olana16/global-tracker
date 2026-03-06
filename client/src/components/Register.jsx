import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, Briefcase, UserPlus, Camera, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  
  const { register, error, loading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo size should be less than 5MB')
        return
      }
      
      setFormData({
        ...formData,
        photo: file
      })
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return
    }
    
    setIsSubmitting(true)
    
    // Create FormData for file upload
    const submitData = new FormData()
    submitData.append('firstName', formData.firstName)
    submitData.append('lastName', formData.lastName)
    submitData.append('email', formData.email)
    submitData.append('password', formData.password)
    submitData.append('role', 'admin') // Always register as admin
    if (formData.photo) {
      submitData.append('photo', formData.photo)
    }
    
    const result = await register(submitData)
    
    console.log('Register result:', result) // Debug log
    
    if (result.success) {
      console.log('Registration successful, navigating to dashboard...')
      navigate('/dashboard')
    } else {
      console.log('Registration failed, result:', result)
    }
    
    setIsSubmitting(false)
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
                <UserPlus className="w-8 h-8 text-cyber-blue" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-cyber-blue mb-2">Create Account</h1>
            <p className="text-gray-400">Join Global Registration Tracker</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-cyber-red/10 border border-cyber-red/30 rounded flex items-center">
              <AlertCircle className="w-5 h-5 text-cyber-red mr-2" />
              <span className="text-cyber-red text-sm">{error}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="cyber-input pl-10"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="cyber-input pl-10"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {/* Photo Preview */}
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-cyber-red/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-cyber-dark/60 border-2 border-cyber-red/30 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <div className="flex-1">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center px-4 py-2 bg-cyber-dark/60 border border-cyber-red/30 rounded-lg cursor-pointer hover:bg-cyber-dark/80 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2 text-cyber-red" />
                    <span className="text-sm text-gray-300">
                      {formData.photo ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="cyber-input pl-10"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="cyber-input pl-10 pr-10"
                  placeholder="•••••••••"
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
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className={`cyber-input pl-10 pr-10 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-cyber-red'
                      : ''
                  }`}
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-blue"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-cyber-red">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading || formData.password !== formData.confirmPassword}
              className="w-full cyber-button-green disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyber-green mr-2"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyber-blue hover:text-cyber-green transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
