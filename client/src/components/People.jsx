import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Building2,
  MapPin,
  User
} from 'lucide-react'
import { peopleAPI } from '../services/api'

const People = () => {
  const [people, setPeople] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list', 'add', 'edit', 'details'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true)
        const response = await peopleAPI.getAll({ limit: 1000 }) // Get all people
        
        console.log('People API response:', response) // Debug log
        
        if (response.success) {
          setPeople(response.data)
        } else {
          // Use mock data if API fails - updated to match actual schema
          setPeople([])
        }
      } catch (error) {
        console.error('Error fetching people:', error)
        // Set mock data on error
        setPeople([])
      } finally {
        setLoading(false)
      }
    }

    fetchPeople()
  }, [])

  // Listen for data import events
  useEffect(() => {
    const handleDataImported = (event) => {
      console.log('Data imported, refreshing people:', event.detail)
      fetchPeople()
    }

    window.addEventListener('dataImported', handleDataImported)
    return () => {
      window.removeEventListener('dataImported', handleDataImported)
    }
  }, [])

  const handleAddPerson = async (personData) => {
    try {
      console.log('Creating person:', personData)
      const response = await peopleAPI.create(personData)
      
      if (response.success) {
        console.log('Person created successfully, refreshing list...')
        // Refresh people list
        const updatedResponse = await peopleAPI.getAll({ limit: 1000 }) // Get all people
        console.log('Refresh response:', updatedResponse)
        if (updatedResponse.success) {
          console.log('Setting people data:', updatedResponse.data)
          setPeople(updatedResponse.data)
        } else {
          console.log('Failed to refresh people list:', updatedResponse)
        }
        setShowAddModal(false)
        setSelectedPerson(null)
      } else {
        console.log('Server response:', response)
        alert(response.error || 'Failed to create person')
      }
    } catch (error) {
      console.error('Error creating person:', error)
      console.log('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create person'
      alert(errorMessage)
    }
  }

  const handleUpdatePerson = async (id, personData) => {
    try {
      const response = await peopleAPI.update(id, personData)
      
      if (response.success) {
        // Refresh people list
        const updatedResponse = await peopleAPI.getAll({ limit: 1000 }) // Get all people
        if (updatedResponse.success) {
          setPeople(updatedResponse.data)
        }
        // Close modal and go back to list view
        setShowAddModal(false)
        setSelectedPerson(null)
        setViewMode('list')
      } else {
        alert('Failed to update person: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating person:', error)
      alert('Error updating person: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEditPerson = (person) => {
    setSelectedPerson(person)
    setViewMode('edit')
    setShowAddModal(true)
  }

  const handleDeletePerson = async (id) => {
    if (!confirm('Are you sure you want to delete this person?')) {
      return
    }
    
    try {
      const response = await peopleAPI.delete(id)
      
      if (response.success) {
        // Refresh people list
        const updatedResponse = await peopleAPI.getAll({ limit: 1000 }) // Get all people
        if (updatedResponse.success) {
          setPeople(updatedResponse.data)
        }
      } else {
        alert('Failed to delete person: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting person:', error)
      alert('Error deleting person: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredPeople = people.filter(person =>
    `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSecurityLevelColor = (level) => {
    // Since we don't have securityLevel anymore, return default color
    return 'text-cyber-green'
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'text-cyber-green' : 'text-cyber-red'
  }

  const getSecurityLevelIcon = (level) => {
    // Since we don't have securityLevel anymore, return default icon
    return Shield
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-red mx-auto mb-4"></div>
          <p className="text-cyber-red">Loading people...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-red mb-2">People</h1>
          <p className="text-gray-400">Manage and monitor personnel records</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true)
            setViewMode('add')
          }}
          className="cyber-button-green flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total People</p>
              <p className="text-2xl font-bold text-gray-100">{people.length}</p>
            </div>
            <Users className="w-8 h-8 text-cyber-red" />
          </div>
        </div>
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active People</p>
              <p className="text-2xl font-bold text-cyber-red">
                {people.filter(p => p.isActive).length}
              </p>
            </div>
            <Users className="w-8 h-8 text-cyber-red" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input pl-10"
          />
        </div>
        <button className="cyber-button flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* People Table */}
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cyber-dark/50 border-b border-cyber-blue/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-blue uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-blue uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-blue uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-blue uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-blue/10">
              {filteredPeople.map((person) => {
                return (
                  <tr key={person._id} className="hover:bg-cyber-blue/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-cyber-red/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-cyber-red" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">{person.firstName} {person.lastName}</div>
                          <div className="text-sm text-gray-400">ID: #{person._id ? person._id.toString().slice(-6) : '000000'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Building2 className="w-4 h-4 mr-2 text-cyber-red" />
                          {person.company || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-100">{person.position || 'N/A'}</div>
                        <div className="text-sm text-gray-400">{person.department || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-3 h-3 mr-1" />
                        {person.country || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(person.isActive)}`}>
                        {person.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPerson(person)
                            setViewMode('details')
                          }}
                          className="text-cyber-red hover:text-cyber-green transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditPerson(person)}
                          className="text-cyber-red hover:text-cyber-yellow transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePerson(person._id)}
                          className="text-cyber-red hover:text-cyber-red transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Person Modal */}
      {showAddModal && (viewMode === 'add' || viewMode === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-cyber-red mb-4">
              {selectedPerson ? 'Edit Person' : 'Add New Person'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.target
              const personData = {
                firstName: form.firstName.value,
                lastName: form.lastName.value,
                email: form.email.value,
                phone: form.phone.value,
                position: form.position.value,
                company: form.company.value,
                country: form.country.value,
                city: form.city.value,
                department: form.department.value,
                isActive: form.isActive.checked
              }
              if (selectedPerson) {
                handleUpdatePerson(selectedPerson._id, personData)
              } else {
                handleAddPerson(personData)
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="cyber-input"
                    placeholder="Enter first name"
                    defaultValue={selectedPerson?.firstName || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="cyber-input"
                    placeholder="Enter last name"
                    defaultValue={selectedPerson?.lastName || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="cyber-input"
                    placeholder="Enter email"
                    defaultValue={selectedPerson?.email || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="cyber-input"
                    placeholder="Enter phone number"
                    defaultValue={selectedPerson?.phone || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    className="cyber-input"
                    placeholder="Enter position"
                    defaultValue={selectedPerson?.position || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    className="cyber-input"
                    placeholder="Enter department"
                    defaultValue={selectedPerson?.department || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="cyber-input"
                    placeholder="Enter company"
                    defaultValue={selectedPerson?.company || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="cyber-input"
                    placeholder="Enter country"
                    defaultValue={selectedPerson?.country || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    className="cyber-input"
                    placeholder="Enter city"
                    defaultValue={selectedPerson?.city || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={selectedPerson?.isActive ?? true}
                      className="h-4 w-4 bg-cyber-dark border-cyber-red/30 rounded text-cyber-red focus:ring-cyber-red focus:ring-2"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedPerson(null)
                    setViewMode('list')
                  }}
                  className="cyber-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-button-green"
                >
                  {selectedPerson ? 'Update Person' : 'Add Person'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Person Details Modal */}
      {viewMode === 'details' && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyber-red">Person Details</h2>
              <button
                onClick={() => {
                  setSelectedPerson(null)
                  setViewMode('list')
                }}
                className="text-cyber-red hover:text-cyber-yellow transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-cyber-red mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-gray-100">{selectedPerson.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-gray-100">{selectedPerson.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-gray-100">{selectedPerson.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Position</p>
                    <p className="text-gray-100">{selectedPerson.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Department</p>
                    <p className="text-gray-100">{selectedPerson.department}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyber-red mb-3">Professional Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="text-gray-100">{selectedPerson.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-gray-100">{selectedPerson.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">City</p>
                    <p className="text-gray-100">{selectedPerson.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPerson.isActive)}`}>
                      {selectedPerson.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default People
