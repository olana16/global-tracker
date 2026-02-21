import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Globe, 
  Users, 
  Menu, 
  X,
  Shield,
  Activity,
  Database,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/companies', icon: Building2, label: 'Companies' },
    { path: '/countries', icon: Globe, label: 'Countries' },
    { path: '/people', icon: Users, label: 'People' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="fixed top-0 left-0 z-50 h-full w-64 bg-cyber-dark border-r border-cyber-red/20">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-red/20">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyber-red" />
            <div>
              <h1 className="text-xl font-bold text-cyber-red">Global</h1>
              <p className="text-xs text-gray-400">Registration System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-cyber-red/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyber-red/20 rounded-full">
              <User className="w-5 h-5 text-cyber-red" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  cyber-sidebar-item
                  ${isActive ? 'active' : ''}
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-blue/20 space-y-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Activity className="w-4 h-4 text-cyber-green" />
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Database className="w-4 h-4 text-cyber-blue" />
            <span>Connected</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-300 hover:text-cyber-red hover:bg-cyber-red/10 transition-all duration-300 rounded text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
