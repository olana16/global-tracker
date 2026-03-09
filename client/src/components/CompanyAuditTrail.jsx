import { useState, useEffect } from 'react'
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
  Building2,
  Globe,
  ChevronDown,
  ChevronUp,
  Monitor,
  Server
} from 'lucide-react'
import { companiesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const CompanyAuditTrail = () => {
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [auditData, setAuditData] = useState([])
  const [detailedChanges, setDetailedChanges] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [expandedCompany, setExpandedCompany] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [filterType, setFilterType] = useState('all') // 'all', 'create', 'update', 'delete'

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCompanies()
      fetchAuditData()
    }
  }, [user])

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

  const fetchAuditData = async () => {
    try {
      setLoading(true)
      // Get all companies with their audit information
      const response = await companiesAPI.getAll()
      if (response.success) {
        const companiesWithAudit = response.data.map(company => ({
          ...company,
          lastUpdatedInfo: {
            by: company.lastUpdatedByName || 'Unknown',
            role: company.lastUpdatedByRole || 'Unknown',
            at: company.updatedAt
          }
        }))
        setAuditData(companiesWithAudit)
      }
    } catch (error) {
      console.error('Error fetching audit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetailedChanges = async (companyId) => {
    if (!companyId) return
    
    try {
      setLoadingDetails(true)
      const response = await companiesAPI.getAuditHistory(companyId)
      
      if (response.success) {
        setDetailedChanges(response.data)
      } else {
        console.error('Error fetching detailed changes:', response.error)
      }
    } catch (error) {
      console.error('Error fetching detailed changes:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const getActionIcon = (type) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'update':
        return <Edit className="w-4 h-4 text-blue-500" />
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-500" />
      default:
        return <Edit className="w-4 h-4 text-gray-500" />
    }
  }

  const getActionColor = (type) => {
    switch (type) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getChangeIcon = (field) => {
    switch (field) {
      case 'name':
      case 'country':
      case 'industry':
      case 'website':
        return <Building2 className="w-4 h-4 text-gray-500" />
      case 'ipAddresses':
        return <Server className="w-4 h-4 text-gray-500" />
      case 'subdomains':
        return <Globe className="w-4 h-4 text-gray-500" />
      case 'company_creation':
        return <Plus className="w-4 h-4 text-green-500" />
      default:
        return <Edit className="w-4 h-4 text-gray-500" />
    }
  }

  const formatFieldName = (field) => {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const toggleCompanyExpansion = async (company) => {
    if (expandedCompany === company._id) {
      setExpandedCompany(null)
      setDetailedChanges([])
    } else {
      setExpandedCompany(company._id)
      setSelectedCompany(company)
      await fetchDetailedChanges(company._id)
    }
  }

  const filteredAuditData = auditData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lastUpdatedInfo.by.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'updated' && item.lastUpdatedInfo.by !== 'Unknown') ||
                         (filterType === 'new' && item.lastUpdatedInfo.by === 'Unknown')
    return matchesSearch && matchesFilter
  })

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-cyber-red mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-cyber-red mb-4">Access Denied</h1>
          <p className="text-gray-300">Admin access required to view audit trail.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyber-red mb-2 flex items-center">
            <History className="w-8 h-8 mr-3" />
            Company Audit Trail
          </h1>
          <p className="text-gray-300">Track which pentesters modified company details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyber-blue/20 border border-cyber-blue/50 rounded">
                <Building2 className="w-6 h-6 text-cyber-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-100">{auditData.length}</div>
                <p className="text-gray-400 text-sm">Total Companies</p>
              </div>
            </div>
          </div>
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyber-green/20 border border-cyber-green/50 rounded">
                <Edit className="w-6 h-6 text-cyber-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-100">
                  {auditData.filter(item => item.lastUpdatedInfo.by !== 'Unknown').length}
                </div>
                <p className="text-gray-400 text-sm">Modified</p>
              </div>
            </div>
          </div>
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyber-yellow/20 border border-cyber-yellow/50 rounded">
                <User className="w-6 h-6 text-cyber-yellow" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-100">
                  {new Set(auditData.filter(item => item.lastUpdatedInfo.by !== 'Unknown').map(item => item.lastUpdatedInfo.by)).size}
                </div>
                <p className="text-gray-400 text-sm">Unique Editors</p>
              </div>
            </div>
          </div>
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyber-red/20 border border-cyber-red/50 rounded">
                <Calendar className="w-6 h-6 text-cyber-red" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-100">
                  {auditData.filter(item => {
                    const lastWeek = new Date()
                    lastWeek.setDate(lastWeek.getDate() - 7)
                    return new Date(item.lastUpdatedInfo.at) > lastWeek
                  }).length}
                </div>
                <p className="text-gray-400 text-sm">Updated This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="cyber-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by company name or pentester..."
                  className="cyber-input w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="cyber-input px-4 py-2"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Companies</option>
                <option value="updated">Recently Updated</option>
                <option value="new">New Companies</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="cyber-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cyber-red/20">
              <thead className="bg-cyber-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Modified By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-cyber-dark divide-y divide-cyber-red/20">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-red"></div>
                        <span className="ml-3 text-gray-400">Loading audit data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAuditData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No audit data found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAuditData.map((company) => (
                    <>
                      <tr key={company._id} className="hover:bg-cyber-red/10">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleCompanyExpansion(company)}
                              className="mr-2 p-1 hover:bg-cyber-red/20 rounded transition-colors"
                            >
                              {expandedCompany === company._id ? (
                                <ChevronUp className="w-4 h-4 text-cyber-blue" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <div className="flex-shrink-0 h-10 w-10 bg-cyber-red/20 rounded-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-cyber-red" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-100">{company.name}</div>
                              <div className="text-sm text-gray-400">{company.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-100">
                                {company.lastUpdatedInfo.by}
                              </div>
                              {company.lastUpdatedInfo.by !== 'Unknown' && (
                                <div className="text-xs text-cyber-blue">
                                  Assigned Pentester
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            company.lastUpdatedInfo.role === 'admin' ? 'bg-cyber-red text-white' : 
                            company.lastUpdatedInfo.role === 'pentester' ? 'bg-cyber-blue text-white' : 
                            'bg-gray-600 text-white'
                          }`}>
                            {company.lastUpdatedInfo.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(company.lastUpdatedInfo.at).toLocaleDateString()}
                            <span className="ml-2 text-xs text-gray-500">
                              {new Date(company.lastUpdatedInfo.at).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {company.lastUpdatedInfo.by !== 'Unknown' ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-green-400">Modified</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                                <span className="text-sm text-yellow-400">Original</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Detailed Changes Row */}
                      {expandedCompany === company._id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-cyber-dark/50">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-cyber-red flex items-center">
                                  <History className="w-5 h-5 mr-2" />
                                  Detailed Change History for {company.name}
                                </h4>
                                <button
                                  onClick={() => toggleCompanyExpansion(company)}
                                  className="text-gray-400 hover:text-gray-300"
                                >
                                  <EyeOff className="w-5 h-5" />
                                </button>
                              </div>
                              
                              {loadingDetails ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyber-red mr-3"></div>
                                  <span className="text-gray-400">Loading detailed changes...</span>
                                </div>
                              ) : detailedChanges.length === 0 ? (
                                <div className="text-center py-8">
                                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-400">No detailed changes found for this company</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {detailedChanges.map((change, index) => (
                                    <div key={index} className="cyber-card p-4 border-l-4 border-cyber-blue">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                          {getActionIcon(change.action)}
                                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getActionColor(change.action)}`}>
                                            {change.action.toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(change.timestamp).toLocaleString()}
                                        </div>
                                      </div>
                                      
                                      <div className="text-sm text-gray-300 mb-2">
                                        <span className="font-medium">{change.userName}</span>
                                        <span className="text-cyber-blue ml-2">({change.userRole})</span>
                                        {change.description && (
                                          <span className="block mt-1 text-gray-400">{change.description}</span>
                                        )}
                                      </div>
                                      
                                      {change.changes && change.changes.length > 0 && (
                                        <div className="space-y-2">
                                          {change.changes.map((fieldChange, fieldIndex) => (
                                            <div key={fieldIndex} className="flex items-start bg-cyber-dark/30 p-3 rounded">
                                              <div className="mr-3 mt-1">
                                                {getChangeIcon(fieldChange.field)}
                                              </div>
                                              <div className="flex-1">
                                                <div className="text-xs font-medium text-gray-400 mb-1">
                                                  {formatFieldName(fieldChange.field)}
                                                </div>
                                                {fieldChange.oldValue !== undefined && fieldChange.newValue !== undefined ? (
                                                  <div className="space-y-1">
                                                    <div className="text-sm">
                                                      <span className="text-red-400">From:</span> 
                                                      <span className="ml-2 text-gray-300">
                                                        {typeof fieldChange.oldValue === 'object' 
                                                          ? JSON.stringify(fieldChange.oldValue, null, 2)
                                                          : String(fieldChange.oldValue || 'None')
                                                        }
                                                      </span>
                                                    </div>
                                                    <div className="text-sm">
                                                      <span className="text-green-400">To:</span> 
                                                      <span className="ml-2 text-gray-300">
                                                        {typeof fieldChange.newValue === 'object' 
                                                          ? JSON.stringify(fieldChange.newValue, null, 2)
                                                          : String(fieldChange.newValue || 'None')
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="text-sm text-gray-300">
                                                    {fieldChange.newValue !== undefined 
                                                      ? String(fieldChange.newValue)
                                                      : 'Added/Removed'
                                                    }
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        {!loading && filteredAuditData.length > 0 && (
          <div className="mt-8 cyber-card p-6">
            <h2 className="text-xl font-semibold text-cyber-red mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Most Active Pentesters</h3>
                <div className="space-y-2">
                  {Array.from(
                    new Set(
                      auditData
                        .filter(item => item.lastUpdatedInfo.by !== 'Unknown')
                        .map(item => item.lastUpdatedInfo.by)
                    )
                  )
                    .map(pentester => ({
                      name: pentester,
                      count: auditData.filter(item => item.lastUpdatedInfo.by === pentester).length
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((pentester, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{pentester.name}</span>
                        <span className="text-cyber-blue font-medium">{pentester.count} companies</span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  {auditData
                    .filter(item => item.lastUpdatedInfo.by !== 'Unknown')
                    .sort((a, b) => new Date(b.lastUpdatedInfo.at) - new Date(a.lastUpdatedInfo.at))
                    .slice(0, 5)
                    .map((company, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{company.name}</span>
                        <span className="text-gray-500">
                          {new Date(company.lastUpdatedInfo.at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyAuditTrail
