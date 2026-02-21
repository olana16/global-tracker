import { useState, useEffect } from 'react'
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
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { companiesAPI, countriesAPI } from '../services/api'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await companiesAPI.getAll()
        
        console.log('Companies API response:', response) // Debug log
        
        if (response.success) {
          setCompanies(response.data)
        } else {
          // Use mock data if API fails
          console.log('Using mock data for companies')
          setCompanies([
            {
              id: 1,
              name: 'TechCorp International',
              country: 'United States',
              industry: 'Technology',
              employees: 5000,
              status: 'active',
              securityLevel: 'high',
              lastScan: '2024-01-15',
              threats: 2
            },
            {
              id: 2,
              name: 'Global Finance Ltd',
              country: 'United Kingdom',
              industry: 'Finance',
              employees: 3200,
              status: 'active',
              securityLevel: 'medium',
              lastScan: '2024-01-14',
              threats: 5
            },
            {
              id: 3,
              name: 'SecureNet Systems',
              country: 'Germany',
              industry: 'Cybersecurity',
              employees: 800,
              status: 'active',
              securityLevel: 'high',
              lastScan: '2024-01-15',
              threats: 0
            },
            {
              id: 4,
              name: 'DataFlow Analytics',
              country: 'Japan',
              industry: 'Data Analytics',
              employees: 1500,
              status: 'monitoring',
              securityLevel: 'low',
              lastScan: '2024-01-13',
              threats: 8
            },
            {
              id: 5,
              name: 'CloudTech Solutions',
              country: 'Canada',
              industry: 'Cloud Services',
              employees: 2200,
              status: 'active',
              securityLevel: 'medium',
              lastScan: '2024-01-15',
              threats: 3
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
        // Set mock data on error
        setCompanies([
          {
            id: 1,
            name: 'TechCorp International',
            country: 'United States',
            industry: 'Technology',
            employees: 5000,
            status: 'active',
            securityLevel: 'high',
            lastScan: '2024-01-15',
            threats: 2
          },
          {
            id: 2,
            name: 'Global Finance Ltd',
            country: 'United Kingdom',
            industry: 'Finance',
            employees: 3200,
            status: 'active',
            securityLevel: 'medium',
            lastScan: '2024-01-14',
            threats: 5
          },
          {
            id: 3,
            name: 'SecureNet Systems',
            country: 'Germany',
            industry: 'Cybersecurity',
            employees: 800,
            status: 'active',
            securityLevel: 'high',
            lastScan: '2024-01-15',
            threats: 0
          },
          {
            id: 4,
            name: 'DataFlow Analytics',
            country: 'Japan',
            industry: 'Data Analytics',
            employees: 1500,
            status: 'monitoring',
            securityLevel: 'low',
            lastScan: '2024-01-13',
            threats: 8
          },
          {
            id: 5,
            name: 'CloudTech Solutions',
            country: 'Canada',
            industry: 'Cloud Services',
            employees: 2200,
            status: 'active',
            securityLevel: 'medium',
            lastScan: '2024-01-15',
            threats: 3
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    const fetchCountries = async () => {
      try {
        const response = await countriesAPI.getAll()
        if (response.success) {
          setCountries(response.data)
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Add all countries as fallback
        setCountries([
          { _id: 'ethiopia', name: 'Ethiopia', code: 'ET' },
          { _id: 'usa', name: 'United States', code: 'US' },
          { _id: 'uk', name: 'United Kingdom', code: 'GB' },
          { _id: 'canada', name: 'Canada', code: 'CA' },
          { _id: 'australia', name: 'Australia', code: 'AU' },
          { _id: 'germany', name: 'Germany', code: 'DE' },
          { _id: 'france', name: 'France', code: 'FR' },
          { _id: 'italy', name: 'Italy', code: 'IT' },
          { _id: 'spain', name: 'Spain', code: 'ES' },
          { _id: 'netherlands', name: 'Netherlands', code: 'NL' },
          { _id: 'belgium', name: 'Belgium', code: 'BE' },
          { _id: 'switzerland', name: 'Switzerland', code: 'CH' },
          { _id: 'austria', name: 'Austria', code: 'AT' },
          { _id: 'sweden', name: 'Sweden', code: 'SE' },
          { _id: 'norway', name: 'Norway', code: 'NO' },
          { _id: 'denmark', name: 'Denmark', code: 'DK' },
          { _id: 'finland', name: 'Finland', code: 'FI' },
          { _id: 'poland', name: 'Poland', code: 'PL' },
          { _id: 'czech', name: 'Czech Republic', code: 'CZ' },
          { _id: 'hungary', name: 'Hungary', code: 'HU' },
          { _id: 'romania', name: 'Romania', code: 'RO' },
          { _id: 'bulgaria', name: 'Bulgaria', code: 'BG' },
          { _id: 'greece', name: 'Greece', code: 'GR' },
          { _id: 'portugal', name: 'Portugal', code: 'PT' },
          { _id: 'ireland', name: 'Ireland', code: 'IE' },
          { _id: 'russia', name: 'Russia', code: 'RU' },
          { _id: 'ukraine', name: 'Ukraine', code: 'UA' },
          { _id: 'belarus', name: 'Belarus', code: 'BY' },
          { _id: 'estonia', name: 'Estonia', code: 'EE' },
          { _id: 'latvia', name: 'Latvia', code: 'LV' },
          { _id: 'lithuania', name: 'Lithuania', code: 'LT' },
          { _id: 'china', name: 'China', code: 'CN' },
          { _id: 'japan', name: 'Japan', code: 'JP' },
          { _id: 'south-korea', name: 'South Korea', code: 'KR' },
          { _id: 'north-korea', name: 'North Korea', code: 'KP' },
          { _id: 'india', name: 'India', code: 'IN' },
          { _id: 'pakistan', name: 'Pakistan', code: 'PK' },
          { _id: 'bangladesh', name: 'Bangladesh', code: 'BD' },
          { _id: 'sri-lanka', name: 'Sri Lanka', code: 'LK' },
          { _id: 'nepal', name: 'Nepal', code: 'NP' },
          { _id: 'bhutan', name: 'Bhutan', code: 'BT' },
          { _id: 'maldives', name: 'Maldives', code: 'MV' },
          { _id: 'myanmar', name: 'Myanmar', code: 'MM' },
          { _id: 'thailand', name: 'Thailand', code: 'TH' },
          { _id: 'vietnam', name: 'Vietnam', code: 'VN' },
          { _id: 'cambodia', name: 'Cambodia', code: 'KH' },
          { _id: 'laos', name: 'Laos', code: 'LA' },
          { _id: 'singapore', name: 'Singapore', code: 'SG' },
          { _id: 'malaysia', name: 'Malaysia', code: 'MY' },
          { _id: 'indonesia', name: 'Indonesia', code: 'ID' },
          { _id: 'philippines', name: 'Philippines', code: 'PH' },
          { _id: 'brunei', name: 'Brunei', code: 'BN' },
          { _id: 'east-timor', name: 'East Timor', code: 'TL' },
          { _id: 'papua-new-guinea', name: 'Papua New Guinea', code: 'PG' },
          { _id: 'new-zealand', name: 'New Zealand', code: 'NZ' },
          { _id: 'fiji', name: 'Fiji', code: 'FJ' },
          { _id: 'solomon-islands', name: 'Solomon Islands', code: 'SB' },
          { _id: 'vanuatu', name: 'Vanuatu', code: 'VU' },
          { _id: 'samoa', name: 'Samoa', code: 'WS' },
          { _id: 'tonga', name: 'Tonga', code: 'TO' },
          { _id: 'kiribati', name: 'Kiribati', code: 'KI' },
          { _id: 'tuvalu', name: 'Tuvalu', code: 'TV' },
          { _id: 'nauru', name: 'Nauru', code: 'NR' },
          { _id: 'palau', name: 'Palau', code: 'PW' },
          { _id: 'marshall-islands', name: 'Marshall Islands', code: 'MH' },
          { _id: 'micronesia', name: 'Micronesia', code: 'FM' },
          { _id: 'mexico', name: 'Mexico', code: 'MX' },
          { _id: 'guatemala', name: 'Guatemala', code: 'GT' },
          { _id: 'belize', name: 'Belize', code: 'BZ' },
          { _id: 'honduras', name: 'Honduras', code: 'HN' },
          { _id: 'el-salvador', name: 'El Salvador', code: 'SV' },
          { _id: 'nicaragua', name: 'Nicaragua', code: 'NI' },
          { _id: 'costa-rica', name: 'Costa Rica', code: 'CR' },
          { _id: 'panama', name: 'Panama', code: 'PA' },
          { _id: 'cuba', name: 'Cuba', code: 'CU' },
          { _id: 'jamaica', name: 'Jamaica', code: 'JM' },
          { _id: 'haiti', name: 'Haiti', code: 'HT' },
          { _id: 'dominican-republic', name: 'Dominican Republic', code: 'DO' },
          { _id: 'puerto-rico', name: 'Puerto Rico', code: 'PR' },
          { _id: 'trinidad-tobago', name: 'Trinidad and Tobago', code: 'TT' },
          { _id: 'barbados', name: 'Barbados', code: 'BB' },
          { _id: 'bahamas', name: 'Bahamas', code: 'BS' },
          { _id: 'grenada', name: 'Grenada', code: 'GD' },
          { _id: 'saint-lucia', name: 'Saint Lucia', code: 'LC' },
          { _id: 'saint-vincent', name: 'Saint Vincent and the Grenadines', code: 'VC' },
          { _id: 'antigua-barbuda', name: 'Antigua and Barbuda', code: 'AG' },
          { _id: 'dominica', name: 'Dominica', code: 'DM' },
          { _id: 'saint-kitts-nevis', name: 'Saint Kitts and Nevis', code: 'KN' },
          { _id: 'argentina', name: 'Argentina', code: 'AR' },
          { _id: 'brazil', name: 'Brazil', code: 'BR' },
          { _id: 'chile', name: 'Chile', code: 'CL' },
          { _id: 'peru', name: 'Peru', code: 'PE' },
          { _id: 'colombia', name: 'Colombia', code: 'CO' },
          { _id: 'venezuela', name: 'Venezuela', code: 'VE' },
          { _id: 'ecuador', name: 'Ecuador', code: 'EC' },
          { _id: 'bolivia', name: 'Bolivia', code: 'BO' },
          { _id: 'paraguay', name: 'Paraguay', code: 'PY' },
          { _id: 'uruguay', name: 'Uruguay', code: 'UY' },
          { _id: 'guyana', name: 'Guyana', code: 'GY' },
          { _id: 'suriname', name: 'Suriname', code: 'SR' },
          { _id: 'french-guiana', name: 'French Guiana', code: 'GF' },
          { _id: 'egypt', name: 'Egypt', code: 'EG' },
          { _id: 'libya', name: 'Libya', code: 'LY' },
          { _id: 'tunisia', name: 'Tunisia', code: 'TN' },
          { _id: 'algeria', name: 'Algeria', code: 'DZ' },
          { _id: 'morocco', name: 'Morocco', code: 'MA' },
          { _id: 'sudan', name: 'Sudan', code: 'SD' },
          { _id: 'south-sudan', name: 'South Sudan', code: 'SS' },
          { _id: 'chad', name: 'Chad', code: 'TD' },
          { _id: 'niger', name: 'Niger', code: 'NE' },
          { _id: 'mali', name: 'Mali', code: 'ML' },
          { _id: 'burkina-faso', name: 'Burkina Faso', code: 'BF' },
          { _id: 'senegal', name: 'Senegal', code: 'SN' },
          { _id: 'gambia', name: 'Gambia', code: 'GM' },
          { _id: 'guinea-bissau', name: 'Guinea-Bissau', code: 'GW' },
          { _id: 'guinea', name: 'Guinea', code: 'GN' },
          { _id: 'sierra-leone', name: 'Sierra Leone', code: 'SL' },
          { _id: 'liberia', name: 'Liberia', code: 'LR' },
          { _id: 'ivory-coast', name: 'Ivory Coast', code: 'CI' },
          { _id: 'ghana', name: 'Ghana', code: 'GH' },
          { _id: 'togo', name: 'Togo', code: 'TG' },
          { _id: 'benin', name: 'Benin', code: 'BJ' },
          { _id: 'nigeria', name: 'Nigeria', code: 'NG' },
          { _id: 'cameroon', name: 'Cameroon', code: 'CM' },
          { _id: 'central-african-republic', name: 'Central African Republic', code: 'CF' },
          { _id: 'congo', name: 'Congo', code: 'CG' },
          { _id: 'drc', name: 'Democratic Republic of Congo', code: 'CD' },
          { _id: 'uganda', name: 'Uganda', code: 'UG' },
          { _id: 'kenya', name: 'Kenya', code: 'KE' },
          { _id: 'tanzania', name: 'Tanzania', code: 'TZ' },
          { _id: 'rwanda', name: 'Rwanda', code: 'RW' },
          { _id: 'burundi', name: 'Burundi', code: 'BI' },
          { _id: 'somalia', name: 'Somalia', code: 'SO' },
          { _id: 'djibouti', name: 'Djibouti', code: 'DJ' },
          { _id: 'eritrea', name: 'Eritrea', code: 'ER' },
          { _id: 'seychelles', name: 'Seychelles', code: 'SC' },
          { _id: 'mauritius', name: 'Mauritius', code: 'MU' },
          { _id: 'madagascar', name: 'Madagascar', code: 'MG' },
          { _id: 'comoros', name: 'Comoros', code: 'KM' },
          { _id: 'cape-verde', name: 'Cape Verde', code: 'CV' },
          { _id: 'sao-tome-principe', name: 'São Tomé and Príncipe', code: 'ST' },
          { _id: 'equatorial-guinea', name: 'Equatorial Guinea', code: 'GQ' },
          { _id: 'gabon', name: 'Gabon', code: 'GA' },
          { _id: 'zambia', name: 'Zambia', code: 'ZM' },
          { _id: 'malawi', name: 'Malawi', code: 'MW' },
          { _id: 'zimbabwe', name: 'Zimbabwe', code: 'ZW' },
          { _id: 'botswana', name: 'Botswana', code: 'BW' },
          { _id: 'namibia', name: 'Namibia', code: 'NA' },
          { _id: 'south-africa', name: 'South Africa', code: 'ZA' },
          { _id: 'lesotho', name: 'Lesotho', code: 'LS' },
          { _id: 'eswatini', name: 'Eswatini', code: 'SZ' },
          { _id: 'mozambique', name: 'Mozambique', code: 'MZ' },
          { _id: 'angola', name: 'Angola', code: 'AO' },
          { _id: 'turkey', name: 'Turkey', code: 'TR' },
          { _id: 'cyprus', name: 'Cyprus', code: 'CY' },
          { _id: 'georgia', name: 'Georgia', code: 'GE' },
          { _id: 'armenia', name: 'Armenia', code: 'AM' },
          { _id: 'azerbaijan', name: 'Azerbaijan', code: 'AZ' },
          { _id: 'kazakhstan', name: 'Kazakhstan', code: 'KZ' },
          { _id: 'uzbekistan', name: 'Uzbekistan', code: 'UZ' },
          { _id: 'turkmenistan', name: 'Turkmenistan', code: 'TM' },
          { _id: 'kyrgyzstan', name: 'Kyrgyzstan', code: 'KG' },
          { _id: 'tajikistan', name: 'Tajikistan', code: 'TJ' },
          { _id: 'afghanistan', name: 'Afghanistan', code: 'AF' },
          { _id: 'pakistan', name: 'Pakistan', code: 'PK' },
          { _id: 'bangladesh', name: 'Bangladesh', code: 'BD' },
          { _id: 'sri-lanka', name: 'Sri Lanka', code: 'LK' },
          { _id: 'maldives', name: 'Maldives', code: 'MV' },
          { _id: 'nepal', name: 'Nepal', code: 'NP' },
          { _id: 'bhutan', name: 'Bhutan', code: 'BT' },
          { _id: 'myanmar', name: 'Myanmar', code: 'MM' },
          { _id: 'thailand', name: 'Thailand', code: 'TH' },
          { _id: 'laos', name: 'Laos', code: 'LA' },
          { _id: 'vietnam', name: 'Vietnam', code: 'VN' },
          { _id: 'cambodia', name: 'Cambodia', code: 'KH' },
          { _id: 'malaysia', name: 'Malaysia', code: 'MY' },
          { _id: 'singapore', name: 'Singapore', code: 'SG' },
          { _id: 'indonesia', name: 'Indonesia', code: 'ID' },
          { _id: 'philippines', name: 'Philippines', code: 'PH' },
          { _id: 'brunei', name: 'Brunei', code: 'BN' },
          { _id: 'east-timor', name: 'East Timor', code: 'TL' },
          { _id: 'mongolia', name: 'Mongolia', code: 'MN' },
          { _id: 'north-korea', name: 'North Korea', code: 'KP' },
          { _id: 'south-korea', name: 'South Korea', code: 'KR' },
          { _id: 'japan', name: 'Japan', code: 'JP' },
          { _id: 'china', name: 'China', code: 'CN' },
          { _id: 'taiwan', name: 'Taiwan', code: 'TW' },
          { _id: 'hong-kong', name: 'Hong Kong', code: 'HK' },
          { _id: 'macau', name: 'Macau', code: 'MO' },
          { _id: 'israel', name: 'Israel', code: 'IL' },
          { _id: 'jordan', name: 'Jordan', code: 'JO' },
          { _id: 'lebanon', name: 'Lebanon', code: 'LB' },
          { _id: 'syria', name: 'Syria', code: 'SY' },
          { _id: 'iraq', name: 'Iraq', code: 'IQ' },
          { _id: 'iran', name: 'Iran', code: 'IR' },
          { _id: 'saudi-arabia', name: 'Saudi Arabia', code: 'SA' },
          { _id: 'yemen', name: 'Yemen', code: 'YE' },
          { _id: 'oman', name: 'Oman', code: 'OM' },
          { _id: 'uae', name: 'United Arab Emirates', code: 'AE' },
          { _id: 'qatar', name: 'Qatar', code: 'QA' },
          { _id: 'kuwait', name: 'Kuwait', code: 'KW' },
          { _id: 'bahrain', name: 'Bahrain', code: 'BH' }
        ])
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
      const response = await companiesAPI.update(id, companyData)
      
      if (response.success) {
        // Refresh companies list
        const updatedResponse = await companiesAPI.getAll()
        if (updatedResponse.success) {
          setCompanies(updatedResponse.data)
        }
        setSelectedCompany(null)
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
        console.log('Viewing company:', response.data)
      } else {
        // Fallback to using the company from the list
        setSelectedCompany(company)
        console.log('Viewing company (fallback):', company)
      }
    } catch (error) {
      console.error('Error fetching company details:', error)
      // Fallback to using the company from the list
      setSelectedCompany(company)
      console.log('Viewing company (fallback):', company)
    }
  }

  const handlePrintCompany = (company) => {
    try {
      // Create a formatted string for printing
      const printContent = `
====================================
        COMPANY DETAILS
====================================

Name: ${company.name}
Country: ${company.country}
Industry: ${company.industry}
Website: ${company.website}
Founded Year: ${company.foundedYear}
Status: ${company.isActive ? 'Active' : 'Inactive'}
Employees: ${company.personCount || 0}
IP Addresses: ${company.ipAddresses ? company.ipAddresses.join(', ') : 'None'}
Subdomains: ${company.subdomains ? company.subdomains.join(', ') : 'None'}
Created At: ${new Date(company.createdAt).toLocaleString()}
Revenue: ${company.revenue ? `${company.revenue.amount} ${company.revenue.currency}` : 'Not specified'}

====================================
      `
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      console.log('Printing company details:', company.name)
    } catch (error) {
      console.error('Error printing company:', error)
      alert('Error printing company details: ' + (error.message || 'Unknown error'))
    }
  }

  const handleExportCompany = async (company, format) => {
    try {
      if (format === 'json') {
        // Export to JSON
        const jsonData = JSON.stringify(company, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${company.name.replace(/\s+/g, '_')}_company_data.json`
        link.click()
      } else if (format === 'csv') {
        // Export to CSV
        const csvContent = [
          ['Name', 'Country', 'Industry', 'Website', 'Founded Year', 'Status', 'Employees', 'IP Addresses', 'Subdomains', 'Created At'],
          [
            company.name,
            company.country,
            company.industry,
            company.website,
            company.foundedYear,
            company.isActive ? 'Active' : 'Inactive',
            company.personCount || 0,
            company.ipAddresses ? company.ipAddresses.join('; ') : '',
            company.subdomains ? company.subdomains.join('; ') : '',
            new Date(company.createdAt).toLocaleString()
          ]
        ]
        
        const csvString = csvContent.map(row => row.join(',')).join('\n')
        
        const csvBlob = new Blob([csvString], { type: 'text/csv' })
        const csvUrl = URL.createObjectURL(csvBlob)
        const csvLink = document.createElement('a')
        csvLink.href = csvUrl
        csvLink.download = `${company.name.replace(/\s+/g, '_')}_company_data.csv`
        csvLink.click()
      }
      
      console.log(`Exported company data as ${format.toUpperCase()}:`, company.name)
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
        <button
          onClick={() => setShowAddModal(true)}
          className="cyber-button-green flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </button>
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
                          onClick={() => handlePrintCompany(company)}
                          className="text-cyber-red hover:text-cyber-yellow transition-colors"
                          title="Print Company Details"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company._id)}
                          className="text-cyber-red hover:text-cyber-red transition-colors"
                          title="Delete Company"
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

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-cyber-blue mb-4">Add New Company</h2>
            <form onSubmit={(e) => {
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
              handleAddCompany(companyData)
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <select
                    name="country"
                    required
                    className="cyber-input pl-10 appearance-none cursor-pointer"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    className="cyber-input"
                    placeholder="https://example.com"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domains (comma-separated)</label>
                  <input
                    type="text"
                    name="domains"
                    className="cyber-input"
                    placeholder="example.com,www.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subdomains (comma-separated)</label>
                  <input
                    type="text"
                    name="subdomains"
                    className="cyber-input"
                    placeholder="secure.example.com,online.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">IP Addresses (comma-separated)</label>
                  <input
                    type="text"
                    name="ipAddresses"
                    className="cyber-input"
                    placeholder="203.0.113.10,203.0.113.20"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={true}
                    className="h-4 w-4 bg-cyber-dark border-cyber-blue/30 rounded text-cyber-blue focus:ring-cyber-blue focus:ring-2"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-300">Active</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="cyber-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-button-green"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cyber-card p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyber-blue mb-4">Company Details</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleExportCompany(selectedCompany, 'json')
                    handleExportCompany(selectedCompany, 'csv')
                  }}
                  className="text-cyber-red hover:text-cyber-yellow transition-colors"
                  title="Export Company Data (JSON and CSV)"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePrintCompany(selectedCompany)}
                  className="text-cyber-blue hover:text-cyber-green transition-colors"
                  title="Print Company Details"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedCompany(null)}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Founded Year</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.foundedYear}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.isActive ? 'Active' : 'Inactive'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Employees</label>
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
                      <span className="text-gray-500">No employees found</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">IP Addresses</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.ipAddresses ? selectedCompany.ipAddresses.join(', ') : 'None'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subdomains</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.subdomains ? selectedCompany.subdomains.join(', ') : 'None'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Created At</label>
                  <div className="text-gray-100 font-mono">{new Date(selectedCompany.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Revenue</label>
                  <div className="text-gray-100 font-mono">{selectedCompany.revenue ? `${selectedCompany.revenue.amount} ${selectedCompany.revenue.currency}` : 'Not specified'}</div>
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
