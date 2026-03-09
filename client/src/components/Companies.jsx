import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  X,
  Printer,
  Building2,
  Globe,
  Users,
  Menu,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { companiesAPI, countriesAPI, peopleAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Companies = () => {
  const formRef = useRef(null)
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newIpAddress, setNewIpAddress] = useState('')
  const [newSubdomain, setNewSubdomain] = useState('')
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState('')
  const [newEmployeeLastName, setNewEmployeeLastName] = useState('')
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('')
  const [newEmployeePosition, setNewEmployeePosition] = useState('')
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState('')

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await companiesAPI.getAll()
        
        console.log('Companies API response:', response) // Debug log
        
        if (response.success) {
          setCompanies(response.data)
        } else {
          // API failed - show empty state
          console.error('API call failed:', response.message)
          setCompanies([])
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
        // Show empty state on error
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }

    const fetchCountries = async () => {
      try {
        const response = await countriesAPI.getAll()
        if (response.success) {
          setCountries(response.data)
        } else {
          setCountries([])
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Show empty state on error
        setCountries([])
      }
    }

    fetchCompanies()
    fetchCountries()
  }, [])

  // Listen for data import events
  useEffect(() => {
    const handleDataImported = (event) => {
      console.log('Data imported, refreshing companies:', event.detail)
      fetchCompanies()
      fetchCountries()
    }

    window.addEventListener('dataImported', handleDataImported)
    return () => {
      window.removeEventListener('dataImported', handleDataImported)
    }
  }, [])

  // Helper functions for country data
  const getCountryCode = (countryName) => {
    const countryCodes = {
      'Afghanistan': 'AF', 'Algeria': 'DZ', 'Argentina': 'AR', 'Australia': 'AU',
      'Austria': 'AT', 'Azerbaijan': 'AZ', 'Bahamas': 'BS', 'Bahrain': 'BH',
      'Bangladesh': 'BD', 'Barbados': 'BB', 'Belgium': 'BE', 'Belize': 'BZ',
      'Benin': 'BJ', 'Bhutan': 'BT', 'Bolivia': 'BO', 'Botswana': 'BW',
      'Brazil': 'BR', 'Brunei': 'BN', 'Bulgaria': 'BG', 'Burkina Faso': 'BF',
      'Burundi': 'BI', 'Cambodia': 'KH', 'Cameroon': 'CM', 'Canada': 'CA',
      'Central African Republic': 'CF', 'Chad': 'TD', 'Chile': 'CL', 'China': 'CN',
      'Colombia': 'CO', 'Comoros': 'KM', 'Congo': 'CG', 'Costa Rica': 'CR',
      'Croatia': 'HR', 'Cuba': 'CU', 'Cyprus': 'CY', 'Czech Republic': 'CZ',
      'Denmark': 'DK', 'Djibouti': 'DJ', 'Dominica': 'DM', 'Dominican Republic': 'DO',
      'Democratic Republic of Congo': 'CD', 'Ecuador': 'EC', 'Egypt': 'EG', 'El Salvador': 'SV',
      'Equatorial Guinea': 'GQ', 'Eritrea': 'ER', 'Estonia': 'EE', 'Ethiopia': 'ET',
      'Fiji': 'FJ', 'Finland': 'FI', 'France': 'FR', 'Gabon': 'GA',
      'Gambia': 'GM', 'Georgia': 'GE', 'Germany': 'DE', 'Ghana': 'GH',
      'Greece': 'GR', 'Grenada': 'GD', 'Guatemala': 'GT', 'Guinea': 'GN',
      'Guinea-Bissau': 'GW', 'Guyana': 'GY', 'Haiti': 'HT', 'Honduras': 'HN',
      'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN', 'Indonesia': 'ID',
      'Iran': 'IR', 'Iraq': 'IQ', 'Ireland': 'IE', 'Israel': 'IL',
      'Italy': 'IT', 'Ivory Coast': 'CI', 'Jamaica': 'JM', 'Japan': 'JP',
      'Jordan': 'JO', 'Kazakhstan': 'KZ', 'Kenya': 'KE', 'Kiribati': 'KI',
      'Kuwait': 'KW', 'Kyrgyzstan': 'KG', 'Laos': 'LA', 'Latvia': 'LV',
      'Lebanon': 'LB', 'Lesotho': 'LS', 'Liberia': 'LR', 'Libya': 'LY',
      'Liechtenstein': 'LI', 'Lithuania': 'LT', 'Luxembourg': 'LU', 'Madagascar': 'MG',
      'Malawi': 'MW', 'Malaysia': 'MY', 'Maldives': 'MV', 'Mali': 'ML',
      'Malta': 'MT', 'Marshall Islands': 'MH', 'Mauritania': 'MR', 'Mauritius': 'MU',
      'Mexico': 'MX', 'Micronesia': 'FM', 'Moldova': 'MD', 'Monaco': 'MC',
      'Mongolia': 'MN', 'Montenegro': 'ME', 'Morocco': 'MA', 'Mozambique': 'MZ',
      'Myanmar': 'MM', 'Namibia': 'NA', 'Nauru': 'NR', 'Nepal': 'NP',
      'Netherlands': 'NL', 'New Zealand': 'NZ', 'Nicaragua': 'NI', 'Niger': 'NE',
      'Nigeria': 'NG', 'North Korea': 'KP', 'North Macedonia': 'MK', 'Norway': 'NO',
      'Oman': 'OM', 'Pakistan': 'PK', 'Palau': 'PW', 'Panama': 'PA',
      'Papua New Guinea': 'PG', 'Paraguay': 'PY', 'Peru': 'PE', 'Philippines': 'PH',
      'Poland': 'PL', 'Portugal': 'PT', 'Puerto Rico': 'PR', 'Qatar': 'QA',
      'Romania': 'RO', 'Russia': 'RU', 'Rwanda': 'RW', 'Saint Kitts and Nevis': 'KN',
      'Saint Lucia': 'LC', 'Saint Vincent and the Grenadines': 'VC', 'Samoa': 'WS',
      'San Marino': 'SM', 'São Tomé and Príncipe': 'ST', 'Saudi Arabia': 'SA',
      'Senegal': 'SN', 'Serbia': 'RS', 'Seychelles': 'SC', 'Sierra Leone': 'SL',
      'Singapore': 'SG', 'Slovakia': 'SK', 'Slovenia': 'SI', 'Solomon Islands': 'SB',
      'Somalia': 'SO', 'South Africa': 'ZA', 'South Korea': 'KR', 'South Sudan': 'SS',
      'Spain': 'ES', 'Sri Lanka': 'LK', 'Sudan': 'SD', 'Suriname': 'SR',
      'Swaziland': 'SZ', 'Sweden': 'SE', 'Switzerland': 'CH', 'Syria': 'SY',
      'Tajikistan': 'TJ', 'Tanzania': 'TZ', 'Thailand': 'TH', 'Timor-Leste': 'TL',
      'Togo': 'TG', 'Tonga': 'TO', 'Trinidad and Tobago': 'TT', 'Tunisia': 'TN',
      'Turkey': 'TR', 'Turkmenistan': 'TM', 'Tuvalu': 'TV', 'Uganda': 'UG',
      'Ukraine': 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB',
      'Uruguay': 'UY', 'United States': 'US', 'Uzbekistan': 'UZ',
      'Vanuatu': 'VU', 'Vatican City': 'VA', 'Venezuela': 'VE', 'Vietnam': 'VN',
      'Yemen': 'YE', 'Zambia': 'ZM', 'Zimbabwe': 'ZW'
    }
    return countryCodes[countryName] || 'XX'
  }

  const getCountryRegion = (countryName) => {
    const regions = {
      'Afghanistan': 'Asia', 'Algeria': 'Africa', 'Argentina': 'South America', 'Australia': 'Oceania',
      'Austria': 'Europe', 'Azerbaijan': 'Asia', 'Bahamas': 'North America', 'Bahrain': 'Asia',
      'Bangladesh': 'Asia', 'Barbados': 'North America', 'Belgium': 'Europe', 'Belize': 'North America',
      'Benin': 'Africa', 'Bhutan': 'Asia', 'Bolivia': 'South America', 'Botswana': 'Africa',
      'Brazil': 'South America', 'Brunei': 'Asia', 'Bulgaria': 'Europe', 'Burkina Faso': 'Africa',
      'Burundi': 'Africa', 'Cambodia': 'Asia', 'Cameroon': 'Africa', 'Canada': 'North America',
      'Central African Republic': 'Africa', 'Chad': 'Africa', 'Chile': 'South America', 'China': 'Asia',
      'Colombia': 'South America', 'Comoros': 'Africa', 'Congo': 'Africa', 'Costa Rica': 'North America',
      'Croatia': 'Europe', 'Cuba': 'North America', 'Cyprus': 'Europe', 'Czech Republic': 'Europe',
      'Denmark': 'Europe', 'Djibouti': 'Africa', 'Dominica': 'North America', 'Dominican Republic': 'North America',
      'Democratic Republic of Congo': 'Africa', 'Ecuador': 'South America', 'Egypt': 'Africa', 'El Salvador': 'North America',
      'Equatorial Guinea': 'Africa', 'Eritrea': 'Africa', 'Estonia': 'Europe', 'Ethiopia': 'Africa',
      'Fiji': 'Oceania', 'Finland': 'Europe', 'France': 'Europe', 'Gabon': 'Africa',
      'Gambia': 'Africa', 'Georgia': 'Asia', 'Germany': 'Europe', 'Ghana': 'Africa',
      'Greece': 'Europe', 'Grenada': 'North America', 'Guatemala': 'North America', 'Guinea': 'Africa',
      'Guinea-Bissau': 'Africa', 'Guyana': 'South America', 'Haiti': 'North America', 'Honduras': 'North America',
      'Hungary': 'Europe', 'Iceland': 'Europe', 'India': 'Asia', 'Indonesia': 'Asia',
      'Iran': 'Asia', 'Iraq': 'Asia', 'Ireland': 'Europe', 'Israel': 'Asia',
      'Italy': 'Europe', 'Ivory Coast': 'Africa', 'Jamaica': 'North America', 'Japan': 'Asia',
      'Jordan': 'Asia', 'Kazakhstan': 'Asia', 'Kenya': 'Africa', 'Kiribati': 'Oceania',
      'Kuwait': 'Asia', 'Kyrgyzstan': 'Asia', 'Laos': 'Asia', 'Latvia': 'Europe',
      'Lebanon': 'Asia', 'Lesotho': 'Africa', 'Liberia': 'Africa', 'Libya': 'Africa',
      'Liechtenstein': 'Europe', 'Lithuania': 'Europe', 'Luxembourg': 'Europe', 'Madagascar': 'Africa',
      'Malawi': 'Africa', 'Malaysia': 'Asia', 'Maldives': 'Asia', 'Mali': 'Africa',
      'Malta': 'Europe', 'Marshall Islands': 'Oceania', 'Mauritania': 'Africa', 'Mauritius': 'Africa',
      'Mexico': 'North America', 'Micronesia': 'Oceania', 'Moldova': 'Europe', 'Monaco': 'Europe',
      'Mongolia': 'Asia', 'Montenegro': 'Europe', 'Morocco': 'Africa', 'Mozambique': 'Africa',
      'Myanmar': 'Asia', 'Namibia': 'Africa', 'Nauru': 'Oceania', 'Nepal': 'Asia',
      'Netherlands': 'Europe', 'New Zealand': 'Oceania', 'Nicaragua': 'North America', 'Niger': 'Africa',
      'Nigeria': 'Africa', 'North Korea': 'Asia', 'North Macedonia': 'Europe', 'Norway': 'Europe',
      'Oman': 'Asia', 'Pakistan': 'Asia', 'Palau': 'Oceania', 'Panama': 'North America',
      'Papua New Guinea': 'Oceania', 'Paraguay': 'South America', 'Peru': 'South America', 'Philippines': 'Asia',
      'Poland': 'Europe', 'Portugal': 'Europe', 'Puerto Rico': 'North America', 'Qatar': 'Asia',
      'Romania': 'Europe', 'Russia': 'Europe', 'Rwanda': 'Africa', 'Saint Kitts and Nevis': 'North America',
      'Saint Lucia': 'North America', 'Saint Vincent and the Grenadines': 'North America', 'Samoa': 'Oceania',
      'San Marino': 'Europe', 'São Tomé and Príncipe': 'Africa', 'Saudi Arabia': 'Asia',
      'Senegal': 'Africa', 'Serbia': 'Europe', 'Seychelles': 'Africa', 'Sierra Leone': 'Africa',
      'Singapore': 'Asia', 'Slovakia': 'Europe', 'Slovenia': 'Europe', 'Solomon Islands': 'Oceania',
      'Somalia': 'Africa', 'South Africa': 'Africa', 'South Korea': 'Asia', 'South Sudan': 'Africa',
      'Spain': 'Europe', 'Sri Lanka': 'Asia', 'Sudan': 'Africa', 'Suriname': 'South America',
      'Swaziland': 'Africa', 'Sweden': 'Europe', 'Switzerland': 'Europe', 'Syria': 'Asia',
      'Tajikistan': 'Asia', 'Tanzania': 'Africa', 'Thailand': 'Asia', 'Timor-Leste': 'Asia',
      'Togo': 'Africa', 'Tonga': 'Oceania', 'Trinidad and Tobago': 'North America', 'Tunisia': 'Africa',
      'Turkey': 'Asia', 'Turkmenistan': 'Asia', 'Tuvalu': 'Oceania', 'Uganda': 'Africa',
      'Ukraine': 'Europe', 'United Arab Emirates': 'Asia', 'United Kingdom': 'Europe',
      'Uruguay': 'South America', 'United States': 'North America', 'Uzbekistan': 'Asia',
      'Vanuatu': 'Oceania', 'Vatican City': 'Europe', 'Venezuela': 'South America', 'Vietnam': 'Asia',
      'Yemen': 'Asia', 'Zambia': 'Africa', 'Zimbabwe': 'Africa'
    }
    return regions[countryName] || 'Unknown'
  }

  const getCountryCapital = (countryName) => {
    const capitals = {
      'Afghanistan': 'Kabul', 'Algeria': 'Algiers', 'Argentina': 'Buenos Aires', 'Australia': 'Canberra',
      'Austria': 'Vienna', 'Azerbaijan': 'Baku', 'Bahamas': 'Nassau', 'Bahrain': 'Manama',
      'Bangladesh': 'Dhaka', 'Barbados': 'Bridgetown', 'Belgium': 'Brussels', 'Belize': 'Belmopan',
      'Benin': 'Porto-Novo', 'Bhutan': 'Thimphu', 'Bolivia': 'La Paz', 'Botswana': 'Gaborone',
      'Brazil': 'Brasília', 'Brunei': 'Bandar Seri Begawan', 'Bulgaria': 'Sofia', 'Burkina Faso': 'Ouagadougou',
      'Burundi': 'Bujumbura', 'Cambodia': 'Phnom Penh', 'Cameroon': 'Yaoundé', 'Canada': 'Ottawa',
      'Central African Republic': 'Bangui', 'Chad': 'N\'Djamena', 'Chile': 'Santiago', 'China': 'Beijing',
      'Colombia': 'Bogotá', 'Comoros': 'Moroni', 'Congo': 'Brazzaville', 'Costa Rica': 'San José',
      'Croatia': 'Zagreb', 'Cuba': 'Havana', 'Cyprus': 'Nicosia', 'Czech Republic': 'Prague',
      'Denmark': 'Copenhagen', 'Djibouti': 'Djibouti', 'Dominica': 'Roseau', 'Dominican Republic': 'Santo Domingo',
      'Democratic Republic of Congo': 'Kinshasa', 'Ecuador': 'Quito', 'Egypt': 'Cairo', 'El Salvador': 'San Salvador',
      'Equatorial Guinea': 'Malabo', 'Eritrea': 'Asmara', 'Estonia': 'Tallinn', 'Ethiopia': 'Addis Ababa',
      'Fiji': 'Suva', 'Finland': 'Helsinki', 'France': 'Paris', 'Gabon': 'Libreville',
      'Gambia': 'Banjul', 'Georgia': 'Tbilisi', 'Germany': 'Berlin', 'Ghana': 'Accra',
      'Greece': 'Athens', 'Grenada': 'St. George\'s', 'Guatemala': 'Guatemala City', 'Guinea': 'Conakry',
      'Guinea-Bissau': 'Bissau', 'Guyana': 'Georgetown', 'Haiti': 'Port-au-Prince', 'Honduras': 'Tegucigalpa',
      'Hungary': 'Budapest', 'Iceland': 'Reykjavik', 'India': 'New Delhi', 'Indonesia': 'Jakarta',
      'Iran': 'Tehran', 'Iraq': 'Baghdad', 'Ireland': 'Dublin', 'Israel': 'Jerusalem',
      'Italy': 'Rome', 'Ivory Coast': 'Yamoussoukro', 'Jamaica': 'Kingston', 'Japan': 'Tokyo',
      'Jordan': 'Amman', 'Kazakhstan': 'Nur-Sultan', 'Kenya': 'Nairobi', 'Kiribati': 'Tarawa',
      'Kuwait': 'Kuwait City', 'Kyrgyzstan': 'Bishkek', 'Laos': 'Vientiane', 'Latvia': 'Riga',
      'Lebanon': 'Beirut', 'Lesotho': 'Maseru', 'Liberia': 'Monrovia', 'Libya': 'Tripoli',
      'Liechtenstein': 'Vaduz', 'Lithuania': 'Vilnius', 'Luxembourg': 'Luxembourg', 'Madagascar': 'Antananarivo',
      'Malawi': 'Lilongwe', 'Malaysia': 'Kuala Lumpur', 'Maldives': 'Malé', 'Mali': 'Bamako',
      'Malta': 'Valletta', 'Marshall Islands': 'Majuro', 'Mauritania': 'Nouakchott', 'Mauritius': 'Port Louis',
      'Mexico': 'Mexico City', 'Micronesia': 'Palikir', 'Moldova': 'Chișinău', 'Monaco': 'Monaco',
      'Mongolia': 'Ulaanbaatar', 'Montenegro': 'Podgorica', 'Morocco': 'Rabat', 'Mozambique': 'Maputo',
      'Myanmar': 'Naypyidaw', 'Namibia': 'Windhoek', 'Nauru': 'Yaren', 'Nepal': 'Kathmandu',
      'Netherlands': 'Amsterdam', 'New Zealand': 'Wellington', 'Nicaragua': 'Managua', 'Niger': 'Niamey',
      'Nigeria': 'Abuja', 'North Korea': 'Pyongyang', 'North Macedonia': 'Skopje', 'Norway': 'Oslo',
      'Oman': 'Muscat', 'Pakistan': 'Islamabad', 'Palau': 'Ngerulmud', 'Panama': 'Panama City',
      'Papua New Guinea': 'Port Moresby', 'Paraguay': 'Asunción', 'Peru': 'Lima', 'Philippines': 'Manila',
      'Poland': 'Warsaw', 'Portugal': 'Lisbon', 'Puerto Rico': 'San Juan', 'Qatar': 'Doha',
      'Romania': 'Bucharest', 'Russia': 'Moscow', 'Rwanda': 'Kigali', 'Saint Kitts and Nevis': 'Basseterre',
      'Saint Lucia': 'Castries', 'Saint Vincent and the Grenadines': 'Kingstown', 'Samoa': 'Apia',
      'San Marino': 'San Marino', 'São Tomé and Príncipe': 'São Tomé', 'Saudi Arabia': 'Riyadh',
      'Senegal': 'Dakar', 'Serbia': 'Belgrade', 'Seychelles': 'Victoria', 'Sierra Leone': 'Freetown',
      'Singapore': 'Singapore', 'Slovakia': 'Bratislava', 'Slovenia': 'Ljubljana', 'Solomon Islands': 'Honiara',
      'Somalia': 'Mogadishu', 'South Africa': 'Pretoria', 'South Korea': 'Seoul', 'South Sudan': 'Juba',
      'Spain': 'Madrid', 'Sri Lanka': 'Colombo', 'Sudan': 'Khartoum', 'Suriname': 'Paramaribo',
      'Swaziland': 'Mbabane', 'Sweden': 'Stockholm', 'Switzerland': 'Bern', 'Syria': 'Damascus',
      'Tajikistan': 'Dushanbe', 'Tanzania': 'Dodoma', 'Thailand': 'Bangkok', 'Timor-Leste': 'Dili',
      'Togo': 'Lomé', 'Tonga': 'Nuku\'alofa', 'Trinidad and Tobago': 'Port of Spain', 'Tunisia': 'Tunis',
      'Turkey': 'Ankara', 'Turkmenistan': 'Ashgabat', 'Tuvalu': 'Funafuti', 'Uganda': 'Kampala',
      'Ukraine': 'Kyiv', 'United Arab Emirates': 'Abu Dhabi', 'United Kingdom': 'London',
      'Uruguay': 'Montevideo', 'United States': 'Washington D.C.', 'Uzbekistan': 'Tashkent',
      'Vanuatu': 'Port Vila', 'Vatican City': 'Vatican City', 'Venezuela': 'Caracas', 'Vietnam': 'Hanoi',
      'Yemen': 'Sana\'a', 'Zambia': 'Lusaka', 'Zimbabwe': 'Harare'
    }
    return capitals[countryName] || 'Unknown'
  }

  const handleAddCompany = async (companyData) => {
    try {
      console.log('Creating company:', companyData)
      const response = await companiesAPI.create(companyData)
      
      if (response.success) {
        // Check if country exists, if not create it
        const countryName = companyData.country
        const existingCountry = countries.find(c => c.name === countryName)
        
        if (!existingCountry) {
          // Create new country if it doesn't exist
          const countryResponse = await countriesAPI.create({
            name: countryName,
            code: getCountryCode(countryName),
            region: getCountryRegion(countryName),
            capital: getCountryCapital(countryName),
            population: 1000000 // Default population
          })
          
          if (countryResponse.success) {
            console.log('Country created successfully:', countryName)
            // Refresh countries list to include the new country
            const updatedCountriesResponse = await countriesAPI.getAll()
            if (updatedCountriesResponse.success) {
              setCountries(updatedCountriesResponse.data)
            }
          }
        }
        
        // Refresh companies list
        const updatedResponse = await companiesAPI.getAll()
        if (updatedResponse.success) {
          setCompanies(updatedResponse.data)
        }
        setShowAddModal(false)
        setSelectedCompany(null)
      } else {
        alert('Failed to create company: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating company:', error)
      alert('Error creating company: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleUpdateCompany = async (id, companyData) => {
    try {
      console.log('Updating company with ID:', id)
      console.log('Company data being sent:', companyData)
      console.log('Domains being sent:', companyData.domains)
      const response = await companiesAPI.update(id, companyData)
      console.log('Update response:', response)
      if (response.data) {
        console.log('Updated company data:', response.data)
        console.log('Updated company domains:', response.data.domains)
      }
      
      if (response.success) {
        // Refresh companies list
        const updatedResponse = await companiesAPI.getAll()
        if (updatedResponse.success) {
          setCompanies(updatedResponse.data)
        }
        setSelectedCompany(null)
        setIsEditMode(false)
        setShowAddModal(false)
        
        // Trigger dashboard refresh
        console.log('Dispatching companyUpdated event')
        window.dispatchEvent(new CustomEvent('companyUpdated', { detail: { company: response.data } }))
      } else {
        alert('Failed to update company: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating company:', error)
      alert('Error updating company: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleViewCompany = async (company) => {
    try {
      // Fetch the company details with virtual field populated
      const response = await companiesAPI.getById(company._id)
      if (response.success) {
        setSelectedCompany(response.data)
        setIsEditMode(false)
        setNewIpAddress('')
        setNewSubdomain('')
        setNewEmployeeFirstName('')
        setNewEmployeeLastName('')
        setNewEmployeeEmail('')
        setNewEmployeePosition('')
        setNewEmployeeDepartment('')
        console.log('Viewing company:', response.data)
      } else {
        // Fallback to using the company from the list
        setSelectedCompany(company)
        setIsEditMode(false)
        setNewIpAddress('')
        setNewSubdomain('')
        setNewEmployeeFirstName('')
        setNewEmployeeLastName('')
        setNewEmployeeEmail('')
        setNewEmployeePosition('')
        setNewEmployeeDepartment('')
        console.log('Viewing company (fallback):', company)
      }
    } catch (error) {
      console.error('Error fetching company details:', error)
      // Fallback to using the company from the list
      setSelectedCompany(company)
      setIsEditMode(false)
      setNewIpAddress('')
      setNewSubdomain('')
      setNewEmployeeFirstName('')
      setNewEmployeeLastName('')
      setNewEmployeeEmail('')
      setNewEmployeePosition('')
      setNewEmployeeDepartment('')
      console.log('Viewing company (fallback):', company)
    }
  }

  const handleEditCompany = (company) => {
    console.log('handleEditCompany called with:', company)
    setSelectedCompany(company)
    setIsEditMode(true)
    setShowAddModal(true)
    console.log('After setting - selectedCompany should be:', company)
  }

  const handleAddEmployeeForCompany = async () => {
    if (!selectedCompany) return
    if (!newEmployeeFirstName.trim() || !newEmployeeLastName.trim() || !newEmployeeEmail.trim()) {
      alert('First name, last name and email are required')
      return
    }

    try {
      const payload = {
        firstName: newEmployeeFirstName.trim(),
        lastName: newEmployeeLastName.trim(),
        email: newEmployeeEmail.trim(),
        position: newEmployeePosition.trim() || undefined,
        department: newEmployeeDepartment.trim() || undefined,
        company: selectedCompany.name,
        country: selectedCompany.country
      }

      const response = await peopleAPI.create(payload)

      if (response.success) {
        try {
          const companyResponse = await companiesAPI.getById(selectedCompany._id)
          if (companyResponse.success) {
            setSelectedCompany(companyResponse.data)
          } else {
            setSelectedCompany(prev => prev ? { ...prev, people: [...(prev.people || []), response.data] } : prev)
          }
        } catch {
          setSelectedCompany(prev => prev ? { ...prev, people: [...(prev.people || []), response.data] } : prev)
        }

        setNewEmployeeFirstName('')
        setNewEmployeeLastName('')
        setNewEmployeeEmail('')
        setNewEmployeePosition('')
        setNewEmployeeDepartment('')
      } else {
        alert('Failed to add employee')
      }
    } catch (error) {
      console.error('Error adding employee:', error)
      alert('Error adding employee: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleAddIpForCompany = async () => {
    if (!selectedCompany || !newIpAddress.trim()) return
    try {
      const response = await companiesAPI.addIpAddress(selectedCompany._id, newIpAddress.trim())
      if (response.success) {
        setSelectedCompany(prev => prev ? { ...prev, ipAddresses: response.data } : prev)
        setNewIpAddress('')
      } else {
        alert('Failed to add IP address')
      }
    } catch (error) {
      console.error('Error adding IP address:', error)
      alert('Error adding IP address: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleRemoveIpForCompany = async (ip) => {
    if (!selectedCompany) return
    try {
      const response = await companiesAPI.removeIpAddress(selectedCompany._id, ip)
      if (response.success) {
        setSelectedCompany(prev => prev ? { ...prev, ipAddresses: response.data } : prev)
      } else {
        alert('Failed to remove IP address')
      }
    } catch (error) {
      console.error('Error removing IP address:', error)
      alert('Error removing IP address: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleAddSubdomainForCompany = async () => {
    if (!selectedCompany || !newSubdomain.trim()) return
    try {
      const response = await companiesAPI.addSubdomain(selectedCompany._id, newSubdomain.trim())
      if (response.success) {
        setSelectedCompany(prev => prev ? { ...prev, subdomains: response.data } : prev)
        setNewSubdomain('')
      } else {
        alert('Failed to add subdomain')
      }
    } catch (error) {
      console.error('Error adding subdomain:', error)
      alert('Error adding subdomain: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleRemoveSubdomainForCompany = async (subdomain) => {
    if (!selectedCompany) return
    try {
      const response = await companiesAPI.removeSubdomain(selectedCompany._id, subdomain)
      if (response.success) {
        setSelectedCompany(prev => prev ? { ...prev, subdomains: response.data } : prev)
      } else {
        alert('Failed to remove subdomain')
      }
    } catch (error) {
      console.error('Error removing subdomain:', error)
      alert('Error removing subdomain: ' + (error.response?.data?.message || error.message))
    }
  }

  const handlePrintCompany = async (company) => {
    try {
      console.log('=== DEBUG: Print Company ===')
      console.log('Company object:', company)
      console.log('Company name:', company.name)
      console.log('Company ID:', company._id)
      
      // Fetch employees associated with this company using company name
      let employees = []
      try {
        console.log('Fetching employees for company:', company.name)
        
        // Try multiple approaches to get employees
        let employeesResponse = null
        
        // Method 1: Try peopleAPI.getByCompany
        try {
          employeesResponse = await peopleAPI.getByCompany(company.name)
          console.log('Method 1 - peopleAPI.getByCompany response:', employeesResponse)
        } catch (error1) {
          console.log('Method 1 failed:', error1.message)
        }
        
        // Method 2: Try direct fetch call
        if (!employeesResponse || !employeesResponse.success) {
          try {
            const directResponse = await fetch(`/api/v1/people/company/${encodeURIComponent(company.name)}`)
            employeesResponse = await directResponse.json()
            console.log('Method 2 - Direct fetch response:', employeesResponse)
          } catch (error2) {
            console.log('Method 2 failed:', error2.message)
          }
        }
        
        // Method 3: Try companiesAPI.getPeople (if it exists)
        if (!employeesResponse || !employeesResponse.success) {
          try {
            employeesResponse = await companiesAPI.getPeople(company._id)
            console.log('Method 3 - companiesAPI.getPeople response:', employeesResponse)
          } catch (error3) {
            console.log('Method 3 failed:', error3.message)
          }
        }
        
        // Check if we got a successful response
        if (employeesResponse && employeesResponse.success && employeesResponse.data) {
          employees = employeesResponse.data
          console.log('Employees found:', employees.length)
          console.log('Employee details:', employees)
        } else {
          console.log('All methods failed, response:', employeesResponse)
          alert(`Debug: Could not fetch employees for ${company.name}\nAPI Response: ${JSON.stringify(employeesResponse, null, 2)}`)
        }
      } catch (error) {
        console.error('Error fetching employees for print:', error)
        alert(`Debug: API Error for ${company.name}: ${error.message}`)
      }
      
      console.log('Final employees array length:', employees.length)
      
      // Create a formal HTML document for printing
      const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Company Details - ${company.name}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2c3e50;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
    }
    .subtitle {
      font-size: 16px;
      color: #7f8c8d;
      margin: 5px 0 0 0;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }
    .info-label {
      font-weight: bold;
      color: #7f8c8d;
    }
    .info-value {
      color: #2c3e50;
    }
    .status-active {
      color: #27ae60;
      font-weight: bold;
    }
    .status-inactive {
      color: #e74c3c;
      font-weight: bold;
    }
    .employees-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .employees-table th,
    .employees-table td {
      border: 1px solid #ecf0f1;
      padding: 8px 12px;
      text-align: left;
    }
    .employees-table th {
      background-color: #f8f9fa;
      font-weight: bold;
      color: #2c3e50;
    }
    .employees-table tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .no-employees {
      text-align: center;
      color: #7f8c8d;
      font-style: italic;
      padding: 20px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
      text-align: center;
      font-size: 12px;
      color: #95a5a6;
    }
    @media print {
      body { margin: 0; padding: 15px; }
      .no-print { display: none; }
      .employees-table { page-break-inside: auto; }
      .employees-table tr { page-break-inside: avoid; page-break-after: auto; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="company-name">${company.name}</h1>
    <p class="subtitle">Company Profile Report</p>
    <p class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Basic Information</h2>
    <div class="info-grid">
      <div class="info-label">Company Name:</div>
      <div class="info-value">${company.name || 'Not specified'}</div>
      
      <div class="info-label">Country:</div>
      <div class="info-value">${company.country || 'Not specified'}</div>
      
      <div class="info-label">Industry:</div>
      <div class="info-value">${company.industry || 'Not specified'}</div>
      
      <div class="info-label">Website:</div>
      <div class="info-value">${company.website || 'Not specified'}</div>
      
      <div class="info-label">Founded Year:</div>
      <div class="info-value">${company.foundedYear || 'Not specified'}</div>
      
      <div class="info-label">Status:</div>
      <div class="info-value ${company.isActive ? 'status-active' : 'status-inactive'}">
        ${company.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Operational Details</h2>
    <div class="info-grid">
      <div class="info-label">Number of Employees:</div>
      <div class="info-value">${employees.length} registered personnel</div>
      
      <div class="info-label">Registration Date:</div>
      <div class="info-value">${company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Not specified'}</div>
      
      <div class="info-label">Last Updated:</div>
      <div class="info-value">${company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'Not specified'}</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Employee Information</h2>
    ${employees.length > 0 ? `
      <table class="employees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          ${employees.map(employee => `
            <tr>
              <td>${employee.firstName && employee.lastName ? `${employee.firstName} ${employee.lastName}` : employee.firstName || employee.name || 'N/A'}</td>
              <td>${employee.email || 'Not specified'}</td>
              <td>${employee.phone || 'Not specified'}</td>
              <td>${employee.position || 'Not specified'}</td>
              <td>${employee.department || 'Not specified'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : `
      <div class="no-employees">
        No employees are currently registered for this company.
      </div>
    `}
  </div>

  <div class="section">
    <h2 class="section-title">Technical Information</h2>
    <div class="info-grid">
      <div class="info-label">IP Addresses:</div>
      <div class="info-value">
        ${company.ipAddresses && company.ipAddresses.length > 0 
          ? company.ipAddresses.join(', ') 
          : 'No IP addresses registered'}
      </div>
      
      <div class="info-label">Subdomains:</div>
      <div class="info-value">
        ${company.subdomains && company.subdomains.length > 0 
          ? company.subdomains.join(', ') 
          : 'No subdomains registered'}
      </div>
    </div>
  </div>

  ${company.revenue && company.revenue.amount ? `
  <div class="section">
    <h2 class="section-title">Financial Information</h2>
    <div class="info-grid">
      <div class="info-label">Revenue:</div>
      <div class="info-value">${company.revenue.amount} ${company.revenue.currency || 'USD'}</div>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>This report was generated from the Global Registration Tracker system.</p>
    <p>For more information, please contact the system administrator.</p>
  </div>
</body>
</html>
      `
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Wait for content to load, then print
      printWindow.onload = function() {
        printWindow.print()
      }
      
      console.log('=== END DEBUG: Print Company ===')
      console.log('Printing company details:', company.name, 'Employees found:', employees.length)
    } catch (error) {
      console.error('Error printing company:', error)
      alert('Error printing company details: ' + (error.message || 'Unknown error'))
    }
  }

  const handleExportCompany = async (company, format) => {
    try {
      // Fetch employees for this company
      let employees = []
      try {
        console.log('Fetching employees for export:', company.name)
        
        // Try multiple approaches to get employees
        let employeesResponse = null
        
        // Method 1: Try peopleAPI.getByCompany
        try {
          employeesResponse = await peopleAPI.getByCompany(company.name)
          console.log('Export - Method 1 response:', employeesResponse)
        } catch (error1) {
          console.log('Export - Method 1 failed:', error1.message)
        }
        
        // Method 2: Try direct fetch call
        if (!employeesResponse || !employeesResponse.success) {
          try {
            const directResponse = await fetch(`/api/v1/people/company/${encodeURIComponent(company.name)}`)
            employeesResponse = await directResponse.json()
            console.log('Export - Method 2 response:', employeesResponse)
          } catch (error2) {
            console.log('Export - Method 2 failed:', error2.message)
          }
        }
        
        // Check if we got a successful response
        if (employeesResponse && employeesResponse.success && employeesResponse.data) {
          employees = employeesResponse.data
          console.log('Export - Employees found:', employees.length)
        } else {
          console.log('Export - Could not fetch employees, using empty array')
        }
      } catch (error) {
        console.error('Error fetching employees for export:', error)
      }
      
      if (format === 'json') {
        // Export to JSON with employees
        const exportData = {
          company: {
            name: company.name,
            country: company.country,
            industry: company.industry,
            website: company.website,
            foundedYear: company.foundedYear,
            isActive: company.isActive,
            domains: company.domains || [],
            ipAddresses: company.ipAddresses || [],
            subdomains: company.subdomains || [],
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
            revenue: company.revenue || null
          },
          employees: employees.map(emp => ({
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            position: emp.position,
            department: emp.department,
            city: emp.city,
            country: emp.country,
            isActive: emp.isActive,
            createdAt: emp.createdAt
          })),
          summary: {
            totalEmployees: employees.length,
            exportDate: new Date().toISOString(),
            exportedBy: 'Global Registration Tracker'
          }
        }
        
        const jsonData = JSON.stringify(exportData, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${company.name.replace(/\s+/g, '_')}_company_data.json`
        link.click()
        URL.revokeObjectURL(url)
        
      } else if (format === 'csv') {
        // Export to CSV with employees
        const csvHeaders = ['Name', 'Country', 'Industry', 'Website', 'Founded Year', 'Status', 'Employees', 'IP Addresses', 'Subdomains', 'Created At']
        const csvContent = [
          csvHeaders,
          [
            company.name,
            company.country,
            company.industry,
            company.website,
            company.foundedYear,
            company.isActive ? 'Active' : 'Inactive',
            company.domains ? company.domains.join('; ') : '',
            employees.length,
            company.ipAddresses ? company.ipAddresses.join('; ') : '',
            company.subdomains ? company.subdomains.join('; ') : '',
            new Date(company.createdAt).toLocaleString()
          ]
        ]
        
        // Add employee details if there are employees
        if (employees.length > 0) {
          csvContent.push([]) // Empty row separator
          csvContent.push(['EMPLOYEES']) // Section header
          csvContent.push(['First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Department', 'City', 'Country', 'Status'])
          
          employees.forEach(emp => {
            csvContent.push([
              emp.firstName || '',
              emp.lastName || '',
              emp.email || '',
              emp.phone || '',
              emp.position || '',
              emp.department || '',
              emp.city || '',
              emp.country || '',
              emp.isActive ? 'Active' : 'Inactive'
            ])
          })
        }
        
        const csvString = csvContent.map(row => row.join(',')).join('\n')
        
        const csvBlob = new Blob([csvString], { type: 'text/csv' })
        const csvUrl = URL.createObjectURL(csvBlob)
        const csvLink = document.createElement('a')
        csvLink.href = csvUrl
        csvLink.download = `${company.name.replace(/\s+/g, '_')}_company_data.csv`
        csvLink.click()
        URL.revokeObjectURL(csvUrl)
        
      } else if (format === 'pdf') {
        // Export to PDF with employees
        const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Company Report - ${company.name}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2c3e50;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
    }
    .subtitle {
      font-size: 16px;
      color: #7f8c8d;
      margin: 5px 0 0 0;
    }
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }
    .info-label {
      font-weight: bold;
      color: #7f8c8d;
    }
    .info-value {
      color: #2c3e50;
    }
    .status-active {
      color: #27ae60;
      font-weight: bold;
    }
    .status-inactive {
      color: #e74c3c;
      font-weight: bold;
    }
    .employees-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .employees-table th,
    .employees-table td {
      border: 1px solid #ecf0f1;
      padding: 8px 12px;
      text-align: left;
    }
    .employees-table th {
      background-color: #f8f9fa;
      font-weight: bold;
      color: #2c3e50;
    }
    .employees-table tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
      text-align: center;
      font-size: 12px;
      color: #95a5a6;
    }
    @media print {
      body { margin: 0; padding: 15px; }
      .section { page-break-inside: avoid; }
      .employees-table { page-break-inside: auto; }
      .employees-table tr { page-break-inside: avoid; page-break-after: auto; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="company-name">${company.name}</h1>
    <p class="subtitle">Company Profile Report</p>
    <p class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Basic Information</h2>
    <div class="info-grid">
      <div class="info-label">Company Name:</div>
      <div class="info-value">${company.name || 'Not specified'}</div>
      
      <div class="info-label">Country:</div>
      <div class="info-value">${company.country || 'Not specified'}</div>
      
      <div class="info-label">Industry:</div>
      <div class="info-value">${company.industry || 'Not specified'}</div>
      
      <div class="info-label">Website:</div>
      <div class="info-value">${company.website || 'Not specified'}</div>
      
      <div class="info-label">Founded Year:</div>
      <div class="info-value">${company.foundedYear || 'Not specified'}</div>
      
      <div class="info-label">Status:</div>
      <div class="info-value ${company.isActive ? 'status-active' : 'status-inactive'}">
        ${company.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Operational Details</h2>
    <div class="info-grid">
      <div class="info-label">Number of Employees:</div>
      <div class="info-value">${employees.length} registered personnel</div>
      
      <div class="info-label">Registration Date:</div>
      <div class="info-value">${company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Not specified'}</div>
      
      <div class="info-label">Last Updated:</div>
      <div class="info-value">${company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'Not specified'}</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Employee Information</h2>
    ${employees.length > 0 ? `
      <table class="employees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          ${employees.map(employee => `
            <tr>
              <td>${employee.firstName && employee.lastName ? `${employee.firstName} ${employee.lastName}` : employee.firstName || employee.name || 'N/A'}</td>
              <td>${employee.email || 'Not specified'}</td>
              <td>${employee.phone || 'Not specified'}</td>
              <td>${employee.position || 'Not specified'}</td>
              <td>${employee.department || 'Not specified'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : `
      <p style="text-align: center; color: #7f8c8d; font-style: italic;">No employees are currently registered for this company.</p>
    `}
  </div>

  <div class="section">
    <h2 class="section-title">Technical Information</h2>
    <div class="info-grid">
      <div class="info-label">IP Addresses:</div>
      <div class="info-value">
        ${company.ipAddresses && company.ipAddresses.length > 0 
          ? company.ipAddresses.join(', ') 
          : 'No IP addresses registered'}
      </div>
      
      <div class="info-label">Subdomains:</div>
      <div class="info-value">
        ${company.subdomains && company.subdomains.length > 0 
          ? company.subdomains.join(', ') 
          : 'No subdomains registered'}
      </div>
    </div>
  </div>

  ${company.revenue && company.revenue.amount ? `
  <div class="section">
    <h2 class="section-title">Financial Information</h2>
    <div class="info-grid">
      <div class="info-label">Revenue:</div>
      <div class="info-value">${company.revenue.amount} ${company.revenue.currency || 'USD'}</div>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>This report was generated from the Global Registration Tracker system.</p>
    <p>For more information, please contact the system administrator.</p>
  </div>
</body>
</html>
        `
        
        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank')
        printWindow.document.write(printContent)
        printWindow.document.close()
        
        // Wait for content to load, then trigger print dialog
        printWindow.onload = function() {
          printWindow.print()
          // Close the window after printing
          setTimeout(() => {
            printWindow.close()
          }, 1000)
        }
      }
      
      console.log(`Exported company data as ${format.toUpperCase()}:`, company.name, `Employees: ${employees.length}`)
    } catch (error) {
      console.error('Error exporting company:', error)
      alert('Error exporting company data: ' + (error.message || 'Unknown error'))
    }
  }

  const getPeopleCountForCompany = (companyName) => {
    // This would ideally come from the backend, but for now we'll use the people data
    // from the People component if available, or the virtual field
    if (companyName && selectedCompany && selectedCompany.personCount !== undefined) {
      return selectedCompany.personCount;
    }
    return 0;
  };

  const handleDeleteCompany = async (id) => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return
    }
    
    try {
      const response = await companiesAPI.delete(id)
      
      if (response.success) {
        // Refresh companies list
        const updatedResponse = await companiesAPI.getAll()
        if (updatedResponse.success) {
          setCompanies(updatedResponse.data)
        }
      } else {
        alert('Failed to delete company: ' + (response.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      alert('Error deleting company: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-cyber-red">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-red mb-2">Companies</h1>
          <p className="text-gray-400">Manage and monitor registered companies</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setShowAddModal(true)
              setIsEditMode(false)
              setSelectedCompany(null)
            }}
            className="cyber-button-green flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-gray-100">{companies.length}</p>
            </div>
            <Globe className="w-8 h-8 text-cyber-red" />
          </div>
        </div>
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Companies</p>
              <p className="text-2xl font-bold text-cyber-green">
                {companies.filter(c => c.isActive).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-cyber-green" />
          </div>
        </div>
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total People</p>
              <p className="text-2xl font-bold text-cyber-red">
                {companies.reduce((sum, c) => sum + (c.personCount || 0), 0)}
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
            placeholder="Search companies..."
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

      {/* Companies Table */}
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cyber-dark/50 border-b border-cyber-blue/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  People
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyber-red uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-blue/10">
              {filteredCompanies.map((company) => {
                return (
                  <tr key={company._id} className="hover:bg-cyber-blue/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-cyber-red" />
                        <div>
                          <div className="text-sm font-medium text-gray-100">{company.name}</div>
                          <div className="text-sm text-gray-400">{company.website}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Globe className="w-4 h-4 mr-2 text-cyber-red" />
                        {company.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {company.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {company.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-cyber-red" />
                        {company.personCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCompany(company)}
                          className="text-cyber-red hover:text-cyber-green transition-colors"
                          title="View Company Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="text-cyber-red hover:text-cyber-blue transition-colors"
                          title="Edit Company"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handlePrintCompany(company)}
                          className="text-cyber-red hover:text-cyber-yellow transition-colors"
                          title="Print Company Details"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteCompany(company._id)}
                            className="text-cyber-red hover:text-cyber-red transition-colors"
                            title="Delete Company"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-cyber-blue mb-4">
              {isEditMode ? 'Edit Company' : 'Add New Company'}
            </h2>
            <form ref={formRef} onSubmit={(e) => {
              e.preventDefault()
              const form = e.target
              const companyData = {
                name: form.name.value,
                country: form.country.value,
                industry: form.industry.value,
                website: form.website.value,
                foundedYear: parseInt(form.foundedYear.value) || null,
                domains: form.domains.value ? form.domains.value.split(',').map(d => d.trim()) : [],
                subdomains: form.subdomains.value ? form.subdomains.value.split(',').map(s => s.trim()) : [],
                ipAddresses: form.ipAddresses.value ? form.ipAddresses.value.split(',').map(ip => ip.trim()) : [],
                isActive: form.isActive.checked
              }
              console.log('Form submission - isEditMode:', isEditMode)
              console.log('Form submission - selectedCompany:', selectedCompany)
              if (isEditMode && selectedCompany) {
                console.log('Calling handleUpdateCompany for:', selectedCompany._id)
                handleUpdateCompany(selectedCompany._id, companyData)
              } else {
                console.log('Calling handleAddCompany')
                handleAddCompany(companyData)
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="cyber-input"
                    placeholder="Enter company name"
                    defaultValue={isEditMode && selectedCompany ? selectedCompany.name : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <select
                    name="country"
                    required
                    className="cyber-input pl-10 appearance-none cursor-pointer"
                    defaultValue={isEditMode && selectedCompany ? selectedCompany.country : ''}
                  >
                    <option value="">Select a country</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Democratic Republic of Congo">Democratic Republic of Congo</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Korea">North Korea</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Swaziland">Swaziland</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="United States">United States</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    required
                    className="cyber-input"
                    placeholder="Enter industry"
                    defaultValue={isEditMode && selectedCompany ? selectedCompany.industry : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    className="cyber-input"
                    placeholder="https://example.com"
                    defaultValue={isEditMode && selectedCompany ? selectedCompany.website : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Founded Year</label>
                  <input
                    type="number"
                    name="foundedYear"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="cyber-input"
                    placeholder="2024"
                    defaultValue={isEditMode && selectedCompany ? selectedCompany.foundedYear || '' : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domains (comma-separated)</label>
                  <input
                    type="text"
                    name="domains"
                    className="cyber-input"
                    placeholder="example.com,www.example.com"
                    defaultValue={isEditMode && selectedCompany && selectedCompany.domains ? selectedCompany.domains.join(', ') : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subdomains (comma-separated)</label>
                  <input
                    type="text"
                    name="subdomains"
                    className="cyber-input"
                    placeholder="secure.example.com,online.example.com"
                    defaultValue={isEditMode && selectedCompany && selectedCompany.subdomains ? selectedCompany.subdomains.join(', ') : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">IP Addresses (comma-separated)</label>
                  <input
                    type="text"
                    name="ipAddresses"
                    className="cyber-input"
                    placeholder="203.0.113.10,203.0.113.20"
                    defaultValue={isEditMode && selectedCompany && selectedCompany.ipAddresses ? selectedCompany.ipAddresses.join(', ') : ''}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={isEditMode && selectedCompany ? selectedCompany.isActive : true}
                    className="h-4 w-4 bg-cyber-dark border-cyber-blue/30 rounded text-cyber-blue focus:ring-cyber-blue focus:ring-2"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-300">Active</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setIsEditMode(false)
                    setSelectedCompany(null)
                  }}
                  className="cyber-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-button-green"
                >
                  {isEditMode ? 'Update Company' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Company Details Modal */}
      {selectedCompany && !isEditMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyber-blue mb-4">Company Details</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportCompany(selectedCompany, 'json')}
                  className="flex items-center space-x-1 px-3 py-2 bg-cyber-red text-white rounded hover:bg-cyber-red/80 transition-colors text-sm"
                  title="Export as JSON"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => handleExportCompany(selectedCompany, 'csv')}
                  className="flex items-center space-x-1 px-3 py-2 bg-cyber-blue text-white rounded hover:bg-cyber-blue/80 transition-colors text-sm"
                  title="Export as CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExportCompany(selectedCompany, 'pdf')}
                  className="flex items-center space-x-1 px-3 py-2 bg-cyber-green text-white rounded hover:bg-cyber-green/80 transition-colors text-sm"
                  title="Export as PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handlePrintCompany(selectedCompany)}
                  className="text-cyber-blue hover:text-cyber-green transition-colors"
                  title="Print Company Details"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCompany(null)
                    setNewIpAddress('')
                    setNewSubdomain('')
                    setNewEmployeeFirstName('')
                    setNewEmployeeLastName('')
                    setNewEmployeeEmail('')
                    setNewEmployeePosition('')
                    setNewEmployeeDepartment('')
                  }}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.country}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.industry}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.website}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Domains</label>
                  <div className="text-gray-100 font-mono">
                    {selectedCompany.domains && selectedCompany.domains.length > 0 
                      ? selectedCompany.domains.join(', ') 
                      : 'No domains registered'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Founded Year</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.foundedYear}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.isActive ? 'Active' : 'Inactive'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Employees</label>
                  <div className="space-y-3">
                    <div className="text-gray-100 font-mono">
                      {selectedCompany.people && selectedCompany.people.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCompany.people.map((person, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-cyber-dark/30 rounded">
                              <div>
                                <div className="text-sm font-medium">{person.firstName} {person.lastName}</div>
                                <div className="text-xs text-gray-400">{person.position} - {person.department}</div>
                              </div>
                              <div className="text-xs text-gray-400">{person.email}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No employees found</span>
                      )}
                    </div>
                    {user?.role === 'pentester' && (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        <input
                          type="text"
                          value={newEmployeeFirstName}
                          onChange={(e) => setNewEmployeeFirstName(e.target.value)}
                          placeholder="First name"
                          className="cyber-input text-xs"
                        />
                        <input
                          type="text"
                          value={newEmployeeLastName}
                          onChange={(e) => setNewEmployeeLastName(e.target.value)}
                          placeholder="Last name"
                          className="cyber-input text-xs"
                        />
                        <input
                          type="email"
                          value={newEmployeeEmail}
                          onChange={(e) => setNewEmployeeEmail(e.target.value)}
                          placeholder="Email"
                          className="cyber-input text-xs"
                        />
                        <input
                          type="text"
                          value={newEmployeePosition}
                          onChange={(e) => setNewEmployeePosition(e.target.value)}
                          placeholder="Position"
                          className="cyber-input text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newEmployeeDepartment}
                            onChange={(e) => setNewEmployeeDepartment(e.target.value)}
                            placeholder="Department"
                            className="cyber-input text-xs flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleAddEmployeeForCompany}
                            className="cyber-button-green text-xs px-3 whitespace-nowrap"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">IP Addresses</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.ipAddresses && selectedCompany.ipAddresses.length > 0 ? (
                        selectedCompany.ipAddresses.map((ip, index) => (
                          <span
                            key={`${ip}-${index}`}
                            className="inline-flex items-center px-2 py-1 bg-cyber-dark/40 rounded text-xs font-mono text-gray-100"
                          >
                            {ip}
                            {user?.role === 'pentester' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveIpForCompany(ip)}
                                className="ml-1 text-cyber-red hover:text-cyber-red/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No IP addresses registered</span>
                      )}
                    </div>
                    {user?.role === 'pentester' && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newIpAddress}
                          onChange={(e) => setNewIpAddress(e.target.value)}
                          placeholder="Add IP (e.g. 203.0.113.10)"
                          className="cyber-input flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddIpForCompany}
                          className="cyber-button-green text-xs px-3"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subdomains</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.subdomains && selectedCompany.subdomains.length > 0 ? (
                        selectedCompany.subdomains.map((sub, index) => (
                          <span
                            key={`${sub}-${index}`}
                            className="inline-flex items-center px-2 py-1 bg-cyber-dark/40 rounded text-xs font-mono text-gray-100"
                          >
                            {sub}
                            {user?.role === 'pentester' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSubdomainForCompany(sub)}
                                className="ml-1 text-cyber-red hover:text-cyber-red/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No subdomains registered</span>
                      )}
                    </div>
                    {user?.role === 'pentester' && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newSubdomain}
                          onChange={(e) => setNewSubdomain(e.target.value)}
                          placeholder="Add subdomain (e.g. vpn.example.com)"
                          className="cyber-input flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddSubdomainForCompany}
                          className="cyber-button-green text-xs px-3"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Created At</label>
                  <div className="text-gray-100 font-mono">{new Date(selectedCompany.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Revenue</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.revenue ? `${selectedCompany.revenue.amount} ${selectedCompany.revenue.currency}` : 'Not specified'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated By</label>
                  <div className="text-gray-100 font-mono">
                    {selectedCompany.lastUpdatedByName
                      ? `${selectedCompany.lastUpdatedByName}${selectedCompany.lastUpdatedByRole ? ` (${selectedCompany.lastUpdatedByRole})` : ''}`
                      : 'Not available'}
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

export default Companies
