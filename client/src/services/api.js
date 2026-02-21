import axios from 'axios'

// Use relative URL since Vite proxy will handle the routing
const API_BASE_URL = '/api/v1'

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
    const response = await api.post('/auth/register', userData)
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

export default api
