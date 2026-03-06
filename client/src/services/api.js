import axios from 'axios'

// Use direct backend URL to avoid proxy issues
const API_BASE_URL = 'http://localhost:5000/api/v1'

console.log('API Base URL:', API_BASE_URL) // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout
  withCredentials: false, // Changed to false
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (userData) => {
    // Handle FormData for file uploads
    const config = {
      headers: {
        'Content-Type': userData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }
    
    const response = await api.post('/auth/register', userData, config)
    console.log('Register API response:', response) // Debug log
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },
}

// Dashboard API calls
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },
  
  getRecentActivity: async () => {
    const response = await api.get('/dashboard/activities')
    return response.data
  },
}

// Companies API calls
export const companiesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/companies', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/companies/${id}`)
    return response.data
  },
  
  create: async (companyData) => {
    const response = await api.post('/companies', companyData)
    return response.data
  },
  
  update: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/companies/${id}`)
    return response.data
  },
  
  getPeople: async (id) => {
    const response = await api.get(`/companies/${id}/people`)
    return response.data
  },

  addIpAddress: async (id, ipAddress) => {
    const response = await api.post(`/companies/${id}/ips`, { ipAddress })
    return response.data
  },

  removeIpAddress: async (id, ip) => {
    const response = await api.delete(`/companies/${id}/ips/${encodeURIComponent(ip)}`)
    return response.data
  },

  addSubdomain: async (id, subdomain) => {
    const response = await api.post(`/companies/${id}/subdomains`, { subdomain })
    return response.data
  },

  removeSubdomain: async (id, subdomain) => {
    const response = await api.delete(`/companies/${id}/subdomains/${encodeURIComponent(subdomain.toLowerCase())}`)
    return response.data
  }
}

// Countries API calls
export const countriesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/countries', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/countries/${id}`)
    return response.data
  },
  
  create: async (countryData) => {
    const response = await api.post('/countries', countryData)
    return response.data
  },
  
  update: async (id, countryData) => {
    const response = await api.put(`/countries/${id}`, countryData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/countries/${id}`)
    return response.data
  },
  
  getCompanies: async (id) => {
    const response = await api.get(`/countries/${id}/companies`)
    return response.data
  },
  
  getPeople: async (id) => {
    const response = await api.get(`/countries/${id}/people`)
    return response.data
  }
}

// People API calls
export const peopleAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/people', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/people/${id}`)
    return response.data
  },
  
  create: async (personData) => {
    const response = await api.post('/people', personData)
    return response.data
  },
  
  update: async (id, personData) => {
    const response = await api.put(`/people/${id}`, personData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/people/${id}`)
    return response.data
  },
  
  getByCountry: async (countryId) => {
    const response = await api.get(`/people/country/${countryId}`)
    return response.data
  },
  
  getByCompany: async (companyId) => {
    const response = await api.get(`/people/company/${companyId}`)
    return response.data
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/people/${id}/status`, { status })
    return response.data
  }
}

// User API calls
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (userData) => {
    console.log('API createUser called with:', userData) // Debug log
    // Handle FormData for file uploads
    const config = {
      headers: {
        'Content-Type': userData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }
    const response = await api.post('/users', userData, config)
    console.log('API createUser response:', response.data) // Debug log
    return response.data
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  assignCompanies: async (userId, companyIds) => {
    console.log('API assignCompanies called with userId:', userId) // Debug log
    console.log('API assignCompanies called with companyIds:', companyIds) // Debug log
    const response = await api.put(`/users/${userId}/assign-companies`, { companyIds })
    console.log('API assignCompanies response:', response.data) // Debug log
    return response.data
  },

  updatePermissions: async (userId, permissions) => {
    const response = await api.put(`/users/${userId}/permissions`, { permissions })
    return response.data
  },

  updateProfile: async (profileData) => {
    // Handle FormData for file uploads
    const config = {
      headers: {
        'Content-Type': profileData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }
    
    const response = await api.put('/users/profile', profileData, config)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

export default api
