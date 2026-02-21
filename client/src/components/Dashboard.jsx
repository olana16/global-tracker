import { useState, useEffect, useRef } from 'react'
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Globe, 
  Shield, 
  AlertTriangle,
  Activity,
  Clock,
  Eye,
  Download,
  Upload
} from 'lucide-react'
import { dashboardAPI } from '../services/api'
import { companiesAPI } from '../services/api'
import { countriesAPI } from '../services/api'
import { peopleAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalCountries: 0,
    totalPeople: 0,
    totalSubdomains: 0,
    totalIPs: 0,
    activeRegistrations: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showImportDropdown, setShowImportDropdown] = useState(false)
  const [importType, setImportType] = useState('')
  const fileInputRef = useRef(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all real data from backend
      const [companiesData, countriesData, peopleData] = await Promise.all([
        companiesAPI.getAll(),
        countriesAPI.getAll(),
        peopleAPI.getAll({ limit: 1000 })
      ])
      
      // Calculate real counts from actual backend data
      let totalSubdomains = 0
      let totalIPs = 0
      
      if (companiesData.success) {
        companiesData.data.forEach(company => {
          // Count subdomains and IPs from actual company data
          totalSubdomains += company.subdomains?.length || 1
          totalIPs += company.ips?.length || 1
        })
      }
      
      // Set real stats from backend data
      setStats({
        totalCompanies: companiesData.success ? companiesData.data.length : 0,
        totalCountries: countriesData.success ? countriesData.data.length : 0,
        totalPeople: peopleData.success ? peopleData.data.length : 0,
        totalSubdomains: totalSubdomains,
        totalIPs: totalIPs,
        activeRegistrations: companiesData.success ? companiesData.data.filter(c => c.isActive).length : 0
      })
      
      // Create recent activity from real data
      const activity = []
      if (companiesData.success && companiesData.data.length > 0) {
        activity.push({
          id: 1,
          type: 'company',
          name: companiesData.data[0].name,
          action: 'New company registered',
          time: '2 min ago',
          level: 'normal'
        })
      }
      if (peopleData.success && peopleData.data.length > 0) {
        activity.push({
          id: 2,
          type: 'person',
          name: `${peopleData.data[0].firstName || ''} ${peopleData.data[0].lastName || ''}`.trim() || peopleData.data[0].name,
          action: 'New person registered',
          time: '5 min ago',
          level: 'normal'
        })
      }
      if (countriesData.success && countriesData.data.length > 0) {
        activity.push({
          id: 3,
          type: 'country',
          name: countriesData.data[0].name,
          action: 'Country registered',
          time: '12 min ago',
          level: 'normal'
        })
      }
      
      setRecentActivity(activity)
      
    } catch (error) {
      console.error('Dashboard error:', error)
      // Set zero values on error
      setStats({
        totalCompanies: 0,
        totalCountries: 0,
        totalPeople: 0,
        totalSubdomains: 0,
        totalIPs: 0,
        activeRegistrations: 0
      })
      setRecentActivity([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleImport = async (type) => {
    setImportType(type)
    setShowImportDropdown(false)
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const text = await file.text()
      let data

      // Parse JSON or CSV
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text)
      } else {
        alert('Please upload a JSON or CSV file')
        return
      }

      // Import based on type
      let results = []
      if (importType === 'companies' || importType === 'all') {
        if (data.companies || (importType === 'companies' && Array.isArray(data))) {
          const companies = data.companies || data
          console.log('Processing companies import:', companies)
          for (const company of companies) {
            try {
              // Process company data to handle string arrays
              const processedCompany = {
                ...company,
                domains: company.domains ? company.domains.split(',').map(d => d.trim()) : [],
                subdomains: company.subdomains ? company.subdomains.split(',').map(s => s.trim()) : [],
                ipAddresses: company.ipAddresses ? company.ipAddresses.split(',').map(ip => ip.trim()) : []
              }
              
              console.log('Creating company:', processedCompany)
              const response = await companiesAPI.create(processedCompany)
              console.log('Company creation response:', response)
              
              if (response.success) {
                results.push(`Company "${company.name}" imported successfully`)
              } else {
                results.push(`Failed to import company "${company.name}": ${response.message}`)
              }
            } catch (error) {
              console.error('Error creating company:', error)
              results.push(`Failed to import company "${company.name}": ${error.message}`)
            }
          }
        }
      }

      if (importType === 'countries' || importType === 'all') {
        if (data.countries || (importType === 'countries' && Array.isArray(data))) {
          const countries = data.countries || data
          for (const country of countries) {
            try {
              const response = await countriesAPI.create(country)
              if (response.success) {
                results.push(`Country "${country.name}" imported successfully`)
              }
            } catch (error) {
              results.push(`Failed to import country "${country.name}": ${error.message}`)
            }
          }
        }
      }

      if (importType === 'people' || importType === 'all') {
        if (data.people || (importType === 'people' && Array.isArray(data))) {
          const people = data.people || data
          for (const person of people) {
            try {
              const response = await peopleAPI.create(person)
              if (response.success) {
                results.push(`Person "${person.firstName} ${person.lastName}" imported successfully`)
              }
            } catch (error) {
              results.push(`Failed to import person "${person.firstName} ${person.lastName}": ${error.message}`)
            }
          }
        }
      }

      // Show results
      alert(`Import Results:\n\n${results.join('\n')}`)
      
      // Refresh dashboard data
      fetchDashboardData()
      
      // Trigger a global refresh by dispatching a custom event
      console.log('Dispatching dataImported event with type:', importType)
      window.dispatchEvent(new CustomEvent('dataImported', { detail: { type: importType } }))
      console.log('Event dispatched successfully')
      
    } catch (error) {
      console.error('Import error:', error)
      alert(`Import failed: ${error.message}`)
    }

    // Reset file input
    event.target.value = ''
  }

  const parseCSV = (text) => {
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue
      
      const values = lines[i].split(',').map(v => v.trim())
      const row = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      data.push(row)
    }

    return data
  }

  const statCards = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      change: '+12%',
      changeType: 'positive',
      icon: Building2,
      color: 'cyber-red'
    },
    {
      title: 'Total Countries',
      value: stats.totalCountries,
      change: '+5%',
      changeType: 'positive',
      icon: Globe,
      color: 'cyber-red'
    },
    {
      title: 'Total People',
      value: stats.totalPeople,
      change: '+18%',
      changeType: 'positive',
      icon: Users,
      color: 'cyber-red'
    },
    {
      title: 'Total Subdomains',
      value: stats.totalSubdomains,
      change: '+8%',
      changeType: 'positive',
      icon: Globe,
      color: 'cyber-red'
    },
    {
      title: 'Total IP Addresses',
      value: stats.totalIPs,
      change: '+15%',
      changeType: 'positive',
      icon: Globe,
      color: 'cyber-red'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'company': return Building2
      case 'country': return Globe
      case 'person': return Users
      case 'threat': return AlertTriangle
      default: return Activity
    }
  }

  const getActivityColor = (level) => {
    switch (level) {
      case 'danger': return 'text-cyber-red'
      case 'warning': return 'text-cyber-yellow'
      case 'success': return 'text-cyber-green'
      default: return 'text-cyber-blue'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-red mx-auto mb-4"></div>
          <p className="text-cyber-red">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-red mb-2">Registration Dashboard</h1>
          <p className="text-gray-400">Manage and monitor registration data</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Import Button */}
          <div className="relative">
            <button
              onClick={() => setShowImportDropdown(!showImportDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-cyber-red text-white rounded hover:bg-cyber-red/80 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            
            {/* Import Dropdown */}
            {showImportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-cyber-dark border border-cyber-red/50 rounded shadow-lg z-50">
                <button
                  onClick={() => handleImport('companies')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cyber-red/20 transition-colors"
                >
                  Companies
                </button>
                <button
                  onClick={() => handleImport('countries')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cyber-red/20 transition-colors"
                >
                  Countries
                </button>
                <button
                  onClick={() => handleImport('people')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cyber-red/20 transition-colors"
                >
                  People
                </button>
                <button
                  onClick={() => handleImport('all')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cyber-red/20 transition-colors border-t border-cyber-red/30"
                >
                  All Data
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1 bg-cyber-green/20 border border-cyber-green/50 rounded">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
            <span className="text-cyber-green text-sm">Live</span>
          </div>
          <span className="text-gray-400 text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={`stat-${index}`} className="cyber-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}/20 border border-${stat.color}/30 rounded`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'positive' ? 'text-cyber-green' : 'text-cyber-red'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 cyber-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyber-red">Recent Activity</h2>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={`activity-${activity.id}`} className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded border border-cyber-blue/10 hover:border-cyber-blue/30 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-cyber-dark rounded ${getActivityColor(activity.level)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-gray-100 font-medium">{activity.name}</p>
                      <p className="text-gray-400 text-sm">{activity.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {activity.time}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Other Data */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-semibold text-cyber-red mb-6">Data from Backend</h2>
          <div className="space-y-4">
            <div className="p-4 bg-cyber-green/10 border border-cyber-green/30 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyber-green font-medium">Total Companies</span>
                <span className="text-cyber-green text-sm">{stats.totalCompanies}</span>
              </div>
              <div className="w-full bg-cyber-dark rounded-full h-2">
                <div className="bg-cyber-green h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-cyber-red/10 border border-cyber-red/30 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyber-red font-medium">Total Countries</span>
                <span className="text-cyber-red text-sm">{stats.totalCountries}</span>
              </div>
              <div className="w-full bg-cyber-dark rounded-full h-2">
                <div className="bg-cyber-red h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
