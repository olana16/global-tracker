import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Globe,
  Users,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle,
  MapPin,
  FileText,
  X
} from 'lucide-react'
import { countriesAPI } from '../services/api'

const Countries = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const response = await countriesAPI.getAll()
        
        console.log('Countries API response:', response) // Debug log
        console.log('Countries data:', response.data) // Debug log
        
        if (response.success) {
          console.log('Setting countries data:', response.data)
          setCountries(response.data)
        } else {
          console.error('API response not successful:', response)
          // Don't use mock data, set empty array to show real data
          setCountries([])
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Set empty array on error to show real data
        setCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const handleDataImported = (event) => {
      console.log('Data imported event received in Countries:', event.detail)
      // Refresh for any import type, but especially for companies
      if (event.detail.type === 'companies' || event.detail.type === 'all') {
        console.log('Refreshing countries for companies import')
        fetchCountries()
      } else {
        console.log('Refreshing countries for other import type:', event.detail.type)
        fetchCountries()
      }
    }

    window.addEventListener('dataImported', handleDataImported)
    return () => {
      window.removeEventListener('dataImported', handleDataImported)
    }
  }, [])

  // Add refresh function
  const refreshCountries = () => {
    fetchCountries()
  }

  const handleAddCountry = async (countryData) => {
    try {
      console.log('Creating country:', countryData)
      const response = await countriesAPI.create(countryData)
      
      if (response.success) {
        // Refresh countries list
        const updatedResponse = await countriesAPI.getAll()
        if (updatedResponse.success) {
          setCountries(updatedResponse.data)
        }
        setShowAddModal(false)
        setSelectedCountry(null)
      } else {
        alert('Failed to create country: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating country:', error)
      alert('Error creating country: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleUpdateCountry = async (id, countryData) => {
    try {
      const response = await countriesAPI.update(id, countryData)
      
      if (response.success) {
        // Refresh countries list
        const updatedResponse = await countriesAPI.getAll()
        if (updatedResponse.success) {
          setCountries(updatedResponse.data)
        }
        setSelectedCountry(null)
      } else {
        alert('Failed to update country: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating country:', error)
      alert('Error updating country: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleViewCountry = async (country) => {
    try {
      // Fetch the country details with companies populated
      const response = await countriesAPI.getById(country._id)
      if (response.success) {
        setSelectedCountry(response.data)
        console.log('Viewing country:', response.data)
      } else {
        // Fallback to using the country from the list
        setSelectedCountry(country)
        console.log('Viewing country (fallback):', country)
      }
    } catch (error) {
      console.error('Error fetching country details:', error)
      // Fallback to using the country from the list
      setSelectedCountry(country)
      console.log('Viewing country (fallback):', country)
    }
  }

  const handleEditCountry = (country) => {
    setSelectedCountry(country)
    setShowAddModal(true)
  }

  const handleDeleteCountry = async (id) => {
    if (!confirm('Are you sure you want to delete this country?')) {
      return
    }
    
    try {
      const response = await countriesAPI.delete(id)
      
      if (response.success) {
        // Refresh countries list
        const updatedResponse = await countriesAPI.getAll()
        if (updatedResponse.success) {
          setCountries(updatedResponse.data)
        }
      } else {
        alert('Failed to delete country: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting country:', error)
      alert('Error deleting country: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.continent.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSecurityLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-cyber-green'
      case 'medium': return 'text-cyber-yellow'
      case 'low': return 'text-cyber-red'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-cyber-green'
      case 'monitoring': return 'text-cyber-yellow'
      case 'suspended': return 'text-cyber-red'
      default: return 'text-gray-400'
    }
  }

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-cyber-green'
    if (score >= 60) return 'text-cyber-yellow'
    return 'text-cyber-red'
  }

  const getSecurityLevelIcon = (level) => {
    switch (level) {
      case 'high': return CheckCircle
      case 'medium': return Shield
      case 'low': return AlertTriangle
      default: return Shield
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-red mx-auto mb-4"></div>
          <p className="text-cyber-red">Loading countries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-red mb-2">Countries</h1>
          <p className="text-gray-400">Monitor global security by country</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="cyber-button-green flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Country
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Countries</p>
              <p className="text-2xl font-bold text-gray-100">{countries.length}</p>
            </div>
            <Globe className="w-8 h-8 text-cyber-red" />
          </div>
        </div>
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-cyber-red">
                {countries.reduce((sum, c) => sum + (c.companyCount || 0), 0)}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-cyber-red" />
          </div>
        </div>
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Regions</p>
              <p className="text-2xl font-bold text-cyber-blue">
                7
              </p>
            </div>
            <FileText className="w-8 h-8 text-cyber-blue" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search countries..."
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

      {/* Countries Table */}
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cyber-dark/50 border-b border-cyber-blue/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Continent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Companies
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Capital
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-blue/10">
              {filteredCountries.map((country) => {
                return (
                  <tr key={country._id} className="hover:bg-cyber-blue/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-cyber-blue/20 rounded-full flex items-center justify-center">
                          <Globe className="w-5 h-5 text-cyber-blue" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">{country.name}</div>
                          <div className="text-sm text-gray-400">{country.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-cyber-red" />
                        {country.continent || country.region || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {country.companyCount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {country.capital || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${country.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {country.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCountry(country)}
                          className="text-cyber-red hover:text-cyber-green transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditCountry(country)}
                          className="text-cyber-red hover:text-cyber-yellow transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCountry(country._id)}
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

      {/* Add Country Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-cyber-red mb-4">
              {selectedCountry ? 'Edit Country' : 'Add New Country'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.target
              const countryData = {
                name: form.name.value,
                code: form.code.value,
                region: selectedCountry?.region || '',
                capital: selectedCountry?.capital || '',
                isActive: form.isActive.checked
              }
              if (selectedCountry) {
                handleUpdateCountry(selectedCountry._id, countryData)
              } else {
                handleAddCountry(countryData)
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="cyber-input"
                    placeholder="Enter country name"
                    defaultValue={selectedCountry?.name || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country Code</label>
                  <input
                    type="text"
                    name="code"
                    required
                    maxLength={3}
                    className="cyber-input"
                    placeholder="Enter country code (e.g., US)"
                    defaultValue={selectedCountry?.code || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={selectedCountry?.isActive ?? true}
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
                    setSelectedCountry(null)
                  }}
                  className="cyber-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-button-green"
                >
                  {selectedCountry ? 'Update Country' : 'Add Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Country Details Modal */}
      {selectedCountry && !showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyber-red">Country Details</h2>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-cyber-red hover:text-cyber-yellow transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-cyber-red mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Country Name</p>
                    <p className="text-gray-100">{selectedCountry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country Code</p>
                    <p className="text-gray-100">{selectedCountry.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Region</p>
                    <p className="text-gray-100">{selectedCountry.continent || selectedCountry.region || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Capital</p>
                    <p className="text-gray-100">{selectedCountry.capital || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Population</p>
                    <p className="text-gray-100">{selectedCountry.population?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Currency</p>
                    <p className="text-gray-100">{selectedCountry.currency || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Language</p>
                    <p className="text-gray-100">{selectedCountry.language || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyber-red mb-3">Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Companies</p>
                    <div className="text-gray-100">
                      {selectedCountry.companies && selectedCountry.companies.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCountry.companies.map((company, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-cyber-dark/30 rounded">
                              <div>
                                <div className="text-sm font-medium">{company.name}</div>
                                <div className="text-xs text-gray-400">{company.industry}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {company.website && (
                                  <a 
                                    href={company.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-cyber-red hover:text-cyber-yellow transition-colors"
                                  >
                                    Visit
                                  </a>
                                )}
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {company.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No companies found</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCountry.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedCountry.isActive ? 'Active' : 'Inactive'}
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

export default Countries
