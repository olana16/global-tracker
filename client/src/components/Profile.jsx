import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Camera,
  Upload
} from 'lucide-react'
import { userAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    photo: null
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    if (user) {
      console.log('Profile component - User data:', user) // Debug log
      console.log('Profile component - User photo:', user.photo) // Debug log
      
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        photo: null
      })
      // Set initial photo preview
      if (user.photo && user.photo !== 'no-photo.jpg') {
        const photoUrl = `http://localhost:5000/uploads/${user.photo}`
        console.log('Setting photo preview URL:', photoUrl) // Debug log
        setPhotoPreview(photoUrl)
      } else {
        console.log('No photo to display') // Debug log
        setPhotoPreview('')
      }
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    console.log('Photo selected:', file) // Debug log
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file')
        setMessageType('error')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Photo size should be less than 5MB')
        setMessageType('error')
        return
      }
      
      console.log('Photo validation passed, setting in formData') // Debug log
      setFormData(prev => ({
        ...prev,
        photo: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log('Photo preview created') // Debug log
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected') // Debug log
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      // Validate password fields if changing password
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setMessage('Current password is required to set new password')
          setMessageType('error')
          return
        }

        if (formData.newPassword !== formData.confirmPassword) {
          setMessage('New passwords do not match')
          setMessageType('error')
          return
        }

        if (formData.newPassword.length < 6) {
          setMessage('New password must be at least 6 characters')
          setMessageType('error')
          return
        }
      }

      // Create FormData for file upload
      const updateData = new FormData()
      updateData.append('firstName', formData.firstName)
      updateData.append('lastName', formData.lastName)
      
      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.append('currentPassword', formData.currentPassword)
        updateData.append('newPassword', formData.newPassword)
      }
      
      // Include photo if changed
      if (formData.photo) {
        console.log('Appending photo to FormData:', formData.photo) // Debug log
        updateData.append('photo', formData.photo)
      } else {
        console.log('No photo to append to FormData') // Debug log
      }

      console.log('Updating profile with FormData entries:') // Debug log
      for (let [key, value] of updateData.entries()) {
        console.log(`${key}:`, value) // Debug log
      }

      const response = await userAPI.updateProfile(updateData)
      console.log('Profile update response:', response) // Debug log

      if (response.success) {
        setMessage('Profile updated successfully!')
        setMessageType('success')
        
        console.log('Profile update successful - Response data:', response.data) // Debug log
        console.log('Profile update successful - Response data photo:', response.data?.photo) // Debug log
        
        // Update user context with new data
        if (response.data) {
          updateUser(response.data)
          
          // Update photo preview with new photo
          if (response.data.photo && response.data.photo !== 'no-photo.jpg') {
            const newPhotoUrl = `http://localhost:5000/uploads/${response.data.photo}`
            console.log('Updating photo preview with new URL:', newPhotoUrl) // Debug log
            setPhotoPreview(newPhotoUrl)
          } else {
            console.log('Clearing photo preview - no photo') // Debug log
            setPhotoPreview('')
          }
        }

        // Clear password fields and photo
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          photo: null
        }))
      } else {
        setMessage(response.message || 'Failed to update profile')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyber-dark">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-cyber-dark/80 border border-cyber-red/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-cyber-red mr-3" />
            <h1 className="text-2xl font-bold text-gray-100">Profile Settings</h1>
          </div>

          {/* User Info Display */}
          <div className="mb-6 p-4 bg-cyber-dark/60 border border-cyber-red/20 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              {/* Profile Photo */}
              <div className="relative">
                {user.photo && user.photo !== 'no-photo.jpg' ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.photo}`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyber-red/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-cyber-dark/40 border-2 border-cyber-red/30 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300 capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="cyber-input pl-10"
                    placeholder="First Name"
                    required
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
                    className="cyber-input pl-10"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Photo
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
                    id="profile-photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-photo-upload"
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

            {/* Password Change Section */}
            <div className="border-t border-cyber-red/20 pt-6">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Change Password</h3>
              <p className="text-sm text-gray-400 mb-4">Leave blank if you don't want to change your password</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="cyber-input pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="cyber-input pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="cyber-input pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg flex items-center ${
                messageType === 'success' 
                  ? 'bg-green-900/50 border border-green-700 text-green-300' 
                  : 'bg-red-900/50 border border-red-700 text-red-300'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-cyber-red text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
