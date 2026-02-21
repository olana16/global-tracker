import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Companies from './components/Companies'
import Countries from './components/Countries'
import People from './components/People'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-cyber-darker">
                <Sidebar />
                <div className="flex-1 ml-64">
                  <main className="p-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/companies" element={<Companies />} />
                      <Route path="/countries" element={<Countries />} />
                      <Route path="/people" element={<People />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
