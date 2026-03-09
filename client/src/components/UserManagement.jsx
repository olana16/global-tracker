import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Shield, 
  Edit, 
  Trash2, 
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  X,
  Building2
} from 'lucide-react'
import { userAPI, companiesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const UserManagement = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create', 'edit', 'assign', 'view-companies'
  const [loading, setLoading] = useState(true)
  const [userPhoto, setUserPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [expandedUser, setExpandedUser] = useState(null)
  const [userCompanies, setUserCompanies] = useState([])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers()
      fetchCompanies()
    }
  }, [user])

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
      
      setUserPhoto(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetPhotoState = () => {
    setUserPhoto(null)
    setPhotoPreview('')
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getAllUsers()
      if (response.success) {
        console.log('Fetched users data:', response.data) // Debug log
        // Log each user's assigned companies
        response.data.forEach(user => {
          console.log(`User ${user.firstName} ${user.lastName} assigned companies:`, user.assignedCompanies)
        })
        setUsers(response.data)
      } else {
        console.error('Failed to fetch users:', response.message)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.getAll()
      if (response.success) {
        setCompanies(response.data)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const handleCreateUser = () => {
    setSelectedUser({ role: 'pentester' }) // Always create pentester
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleAssignCompanies = (user) => {
    setSelectedUser(user)
    setModalMode('assign')
    setShowModal(true)
  }

  const handleViewCompanies = async (user) => {
    if (expandedUser === user._id) {
      setExpandedUser(null)
      setUserCompanies([])
    } else {
      setExpandedUser(user._id)
      setSelectedUser(user)
      
      console.log('User assigned companies:', user.assignedCompanies) // Debug log
      
      try {
        // Get detailed company information for this user's assigned companies
        const assignedCompanyIds = user.assignedCompanies || []
        console.log('Company IDs to fetch:', assignedCompanyIds) // Debug log
        
        if (assignedCompanyIds.length === 0) {
          setUserCompanies([])
          return
        }
        
        const companyDetails = await Promise.all(
          assignedCompanyIds.map(async (companyObj) => {
            try {
              // Extract the company ID from the object
              const companyId = companyObj._id || companyObj.id || companyObj
              console.log('Fetching company:', companyId) // Debug log
              const response = await companiesAPI.getById(companyId)
              console.log('Company response:', response) // Debug log
              return response.success ? response.data : null
            } catch (error) {
              console.error('Error fetching company details:', error)
              return null
            }
          })
        )
        
        const validCompanies = companyDetails.filter(company => company !== null)
        console.log('Valid companies found:', validCompanies) // Debug log
        setUserCompanies(validCompanies)
      } catch (error) {
        console.error('Error fetching user companies:', error)
        setUserCompanies([])
      }
    }
  }

  const handleRemoveFromCompany = async (userId, companyId) => {
    if (window.confirm('Are you sure you want to remove this pentester from this company?')) {
      try {
        // Get current user to see their assigned companies
        const userResponse = await userAPI.getUserById(userId)
        if (userResponse.success) {
          const currentUser = userResponse.data
          const updatedCompanyIds = (currentUser.assignedCompanies || [])
            .filter(id => id.toString() !== companyId.toString())
          
          const response = await userAPI.assignCompanies(userId, updatedCompanyIds)
          
          if (response.success) {
            // Update local state
            setUsers(users.map(u => 
              u._id === userId 
                ? { ...u, assignedCompanies: updatedCompanyIds }
                : u
            ))
            
            // Update expanded view
            setUserCompanies(userCompanies.filter(c => c._id !== companyId))
            
            alert('Pentester removed from company successfully')
          } else {
            alert('Failed to remove pentester from company: ' + response.message)
          }
        }
      } catch (error) {
        console.error('Error removing pentester from company:', error)
        alert('Error removing pentester from company: ' + error.message)
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await userAPI.deleteUser(userId)
        if (response.success) {
          setUsers(users.filter(u => u._id !== userId))
          setShowModal(false)
          setSelectedUser(null)
        } else {
          alert('Failed to delete user: ' + response.message)
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user: ' + error.message)
      }
    }
  }

  const handleSubmit = async (userData) => {
    try {
      console.log('Submitting user data:', userData) // Debug log
      console.log('Modal mode:', modalMode) // Debug log
      
      // Check if email already exists (for create mode)
      if (modalMode === 'create') {
        const existingUser = users.find(u => u.email === userData.email)
        if (existingUser) {
          alert('This email address is already registered. Please use a different email.')
          return
        }
      }
      
      let response
      if (modalMode === 'create') {
        // Handle FormData for photo upload
        if (userPhoto) {
          const formData = new FormData()
          formData.append('firstName', userData.firstName)
          formData.append('lastName', userData.lastName)
          formData.append('email', userData.email)
          formData.append('password', userData.password)
          formData.append('role', userData.role)
          formData.append('photo', userPhoto)
          
          console.log('Creating user with FormData and photo') // Debug log
          response = await userAPI.createUser(formData)
        } else {
          console.log('Creating user without photo') // Debug log
          response = await userAPI.createUser(userData)
        }
      } else if (modalMode === 'edit') {
        response = await userAPI.updateUser(selectedUser._id, userData)
      } else if (modalMode === 'assign') {
        response = await userAPI.assignCompanies(selectedUser._id, userData.companyIds)
      }

      console.log('API Response:', response) // Debug log

      if (response.success) {
        await fetchUsers()
        setShowModal(false)
        setSelectedUser(null)
        resetPhotoState() // Reset photo state after successful submission
      } else {
        console.error('Operation failed:', response.message) // Debug log
        if (response.message === 'User with this email already exists') {
          alert('This email address is already registered. Please use a different email.')
        } else {
          alert('Operation failed: ' + response.message)
        }
      }
    } catch (error) {
      console.error('Error:', error) // Debug log
      console.error('Error response:', error.response?.data) // Debug log
      alert('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
        <div className="text-center">
          <Shield className="w-16 h-16 text-cyber-red mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-cyber-red mb-4">Access Denied</h1>
          <p className="text-gray-300">Admin access required to view user management.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyber-red mb-2">Pentester Management</h1>
          <p className="text-gray-300">Register pentesters and assign them to companies</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyber-red/20 border border-cyber-red/50 rounded">
                <Users className="w-6 h-6 text-cyber-red" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{users.length}</div>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
          </div>
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyber-green/20 border border-cyber-green/50 rounded">
                <UserPlus className="w-6 h-6 text-cyber-green" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <p className="text-gray-400 text-sm">Admins</p>
            </div>
          </div>
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyber-blue/20 border border-cyber-blue/50 rounded">
                <Key className="w-6 h-6 text-cyber-blue" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">
                {users.filter(u => u.role === 'pentester').length}
              </div>
              <p className="text-gray-400 text-sm">Pentesters</p>
            </div>
          </div>
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyber-yellow/20 border border-cyber-yellow/50 rounded">
                <Shield className="w-6 h-6 text-cyber-yellow" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{companies.length}</div>
              <p className="text-gray-400 text-sm">Companies</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6">
          <button
            onClick={handleCreateUser}
            className="cyber-button px-6 py-3 flex items-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Create Pentester
          </button>
        </div>

        {/* Users Table */}
        <div className="cyber-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cyber-red/20">
              <thead className="bg-cyber-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Assigned Companies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-cyber-dark divide-y divide-cyber-red/20">
                {users.map((user) => {
                  const isExpanded = expandedUser === user._id
                  const showCompanyRow = user.role === 'pentester' && isExpanded
                  
                  return (
                    <React.Fragment key={user._id}>
                      <tr className="hover:bg-cyber-red/10">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-cyber-red/20 rounded-full flex items-center justify-center">
                              <span className="text-cyber-red font-medium">
                                {user.firstName?.charAt(0)?.toUpperCase() || 'U'}{user.lastName?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-100">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            user.role === 'admin' ? 'bg-cyber-red text-white' : 
                            user.role === 'pentester' ? 'bg-cyber-blue text-white' : 
                            'bg-gray-600 text-white'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {user.assignedCompanies?.length || 0} companies
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {user.role === 'pentester' && (
                              <button
                                onClick={() => handleViewCompanies(user)}
                                className="text-cyber-blue hover:text-white p-1 rounded"
                                title="View Assigned Companies"
                              >
                                <Building2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-cyber-red hover:text-white p-1 rounded"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAssignCompanies(user)}
                              className="text-cyber-blue hover:text-white p-1 rounded"
                              title="Assign Companies"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-cyber-red hover:text-white p-1 rounded"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expandable row for assigned companies */}
                      {showCompanyRow && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-cyber-dark/50">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-cyber-red flex items-center">
                                  <Building2 className="w-5 h-5 mr-2" />
                                  Assigned Companies for {user.firstName} {user.lastName}
                                </h4>
                                <button
                                  onClick={() => handleViewCompanies(user)}
                                  className="text-gray-400 hover:text-gray-300"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              
                              {userCompanies.length === 0 ? (
                                <div className="text-center py-8">
                                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-400">No companies assigned to this pentester</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {userCompanies.map((company) => (
                                    <div key={company._id} className="cyber-card p-4 border-l-4 border-cyber-blue">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h5 className="font-medium text-gray-100 mb-2">{company.name}</h5>
                                          <p className="text-sm text-gray-400 mb-1">{company.country}</p>
                                          <p className="text-sm text-gray-400 mb-1">{company.industry}</p>
                                          <p className="text-xs text-gray-500">
                                            {company.ipAddresses?.length || 0} IPs, {company.subdomains?.length || 0} Subdomains
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveFromCompany(user._id, company._id)}
                                          className="text-red-400 hover:text-red-300 p-1 rounded"
                                          title="Remove from this company"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-cyber-red">
                {modalMode === 'create' && 'Create Pentester'}
                {modalMode === 'edit' && 'Edit User'}
                {modalMode === 'assign' && 'Assign Companies'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>

            {/* Create/Edit User Form */}
            {(modalMode === 'create' || modalMode === 'edit') && (
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = {
                  firstName: e.target.firstName.value,
                  lastName: e.target.lastName.value,
                  email: e.target.email.value,
                  password: modalMode === 'create' ? e.target.password.value : undefined,
                  role: selectedUser?.role || 'pentester' // Use pre-set role
                }
                handleSubmit(formData)
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={selectedUser?.firstName || ''}
                    className="cyber-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={selectedUser?.lastName || ''}
                    className="cyber-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser?.email || ''}
                    className="cyber-input w-full"
                    required
                  />
                </div>
                {modalMode === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="cyber-input w-full"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    name="role"
                    defaultValue={selectedUser?.role || 'pentester'}
                    className="cyber-input w-full"
                    required
                    disabled
                  >
                    <option value="pentester">Pentester</option>
                  </select>
                </div>
                
                {/* Photo Upload Section - Only for create mode */}
                {modalMode === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo (Optional)</label>
                    <div className="flex items-center space-x-4">
                      {/* Photo Preview */}
                      <div className="relative">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-cyber-red/30"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-cyber-dark/60 border-2 border-cyber-red/30 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Upload Button */}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="user-photo-upload"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="user-photo-upload"
                          className="flex items-center justify-center px-4 py-2 bg-cyber-dark/60 border border-cyber-red/30 rounded-lg cursor-pointer hover:bg-cyber-dark/80 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2 text-cyber-red" />
                          <span className="text-sm text-gray-300">
                            {userPhoto ? 'Change Photo' : 'Upload Photo'}
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG or GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="cyber-button px-6 py-2"
                  >
                    {modalMode === 'create' ? 'Create Pentester' : 'Update User'}
                  </button>
                </div>
              </form>
            )}

            {/* Assign Companies Form */}
            {modalMode === 'assign' && (
              <form onSubmit={(e) => {
                e.preventDefault()
                const companyIds = Array.from(e.target.querySelectorAll('input[name="companies[]"]:checked'))
                  .map(input => input.value)
                console.log('Assigning companies to user:', selectedUser._id) // Debug log
                console.log('Selected company IDs:', companyIds) // Debug log
                console.log('Data being sent:', { userId: selectedUser._id, companyIds }) // Debug log
                handleSubmit({ userId: selectedUser._id, companyIds })
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Assign Companies</label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border border-cyber-red/30 rounded p-2">
                    {companies.map((company) => (
                      <div key={company._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="companies[]"
                          value={company._id}
                          defaultChecked={selectedUser?.assignedCompanies?.some(assignedId => 
                            assignedId.toString() === company._id.toString()
                          )}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="cyber-button px-6 py-2"
                  >
                    Assign Companies
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
