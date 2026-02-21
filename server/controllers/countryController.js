const Country = require('../models/Country');
const Company = require('../models/Company');
const Person = require('../models/Person');

// @desc    Get all countries
// @route   GET /api/countries
// @access  Public
exports.getCountries = async (req, res) => {
    try {
        const countries = await Country.find().sort('name');
        console.log('All countries found in database:', countries.map(c => ({ name: c.name, code: c.code })));
        
        // Check if Ethiopia exists
        const ethiopia = countries.find(c => c.name === 'Ethiopia');
        if (!ethiopia) {
            console.log('Ethiopia not found in database, creating it...');
            // Create Ethiopia if it doesn't exist
            const newEthiopia = new Country({
                name: 'Ethiopia',
                code: 'ET',
                continent: 'Africa',
                capital: 'Addis Ababa',
                population: 120000000,
                currency: 'ETB',
                language: 'Amharic',
                isActive: true
            });
            await newEthiopia.save();
            console.log('Ethiopia created successfully');
            
            // Refresh countries list
            const updatedCountries = await Country.find().sort('name');
            console.log('Updated countries list:', updatedCountries.map(c => ({ name: c.name, code: c.code })));
            
            // Now proceed with counting
            return processCountriesWithCounts(updatedCountries, res);
        }
        
        // Process existing countries
        return processCountriesWithCounts(countries, res);
        
    } catch (error) {
        console.error('Error getting countries:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const processCountriesWithCounts = async (countries, res) => {
    // Add company and person counts to each country
    const countriesWithCounts = await Promise.all(
        countries.map(async (country) => {
            const companyCount = await Company.countDocuments({ country: country.name });
            const personCount = await Person.countDocuments({ country: country.name });
            
            console.log(`Country: "${country.name}", Company count: ${companyCount}, Person count: ${personCount}`);
            
            // Debug: Let's also see what companies exist for this country
            const companies = await Company.find({ country: country.name });
            console.log(`Companies found for ${country.name}:`, companies.map(c => ({ name: c.name, country: c.country })));
            
            return {
                ...country.toObject(),
                companyCount: companyCount,
                personCount: personCount
            };
        })
    );
    
    res.json({
        success: true,
        count: countriesWithCounts.length,
        data: countriesWithCounts
    });
};

// @desc    Get single country
// @route   GET /api/countries/:id
// @access  Public
exports.getCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        
        if (!country) {
            return res.status(404).json({
                success: false,
                error: 'Country not found'
            });
        }

        // Get companies for this country
        const companies = await Company.find({ country: country.name })
            .select('name industry website isActive')
            .sort({ name: 1 });
        
        // Get people count for this country
        const personCount = await Person.countDocuments({ country: country.name });
        
        // Add the companies array and counts to the country object
        const countryWithCompanies = {
            ...country.toObject(),
            companies: companies,
            companyCount: companies.length,
            personCount: personCount
        };

        res.json({
            success: true,
            data: countryWithCompanies
        });
    } catch (error) {
        console.error('Error getting country:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Create country
// @route   POST /api/countries
// @access  Private/Admin
exports.createCountry = async (req, res) => {
    try {
        const { name, code, region, population, capital } = req.body;

        // Check if country already exists
        const codeQuery = typeof code === 'string' ? code.toUpperCase() : undefined;
        let country = await Country.findOne({ $or: [ name ? { name } : {}, codeQuery ? { code: codeQuery } : {} ] });
        
        if (country) {
            return res.status(400).json({
                success: false,
                error: 'Country with this name or code already exists',
                message: 'Country with this name or code already exists'
            });
        }

        country = new Country({
            name,
            code: (code || '').toUpperCase(),
            region,
            population,
            capital
        });

        await country.save();

        res.status(201).json({
            success: true,
            data: country
        });
    } catch (error) {
        console.error('Error creating country:', error);
        // If this goes through central error handler, include both fields
        res.status(500).json({ success: false, error: 'Server error', message: 'Server error' });
    }
};

// @desc    Update country
// @route   PUT /api/countries/:id
// @access  Private/Admin
exports.updateCountry = async (req, res) => {
    try {
        const { name, code, region, population, isActive, capital } = req.body;
        
        let country = await Country.findById(req.params.id);
        
        if (!country) {
            return res.status(404).json({
                success: false,
                error: 'Country not found'
            });
        }

        // Check if another country exists with the same name or code
        if (name || code) {
            const existingCountry = await Country.findOne({
                _id: { $ne: req.params.id },
                $or: [
                    name ? { name } : {},
                    code ? { code: code.toUpperCase() } : {}
                ]
            });

            if (existingCountry) {
                return res.status(400).json({
                    success: false,
                    error: 'Another country with this name or code already exists'
                });
            }
        }

        // Update fields
        if (name) country.name = name;
        if (code) country.code = code.toUpperCase();
        if (region !== undefined) country.region = region;
        if (population !== undefined) country.population = population;
        if (isActive !== undefined) country.isActive = isActive;
        if (capital !== undefined) country.capital = capital;
        
        country.updatedAt = Date.now();
        
        await country.save();

        res.json({
            success: true,
            data: country
        });
    } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Delete country
// @route   DELETE /api/countries/:id
// @access  Private/Admin
exports.deleteCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        
        if (!country) {
            return res.status(404).json({
                success: false,
                error: 'Country not found'
            });
        }

        // Check if there are companies or people associated with this country
        const [companyCount, personCount] = await Promise.all([
            Company.countDocuments({ country: req.params.id }),
            Person.countDocuments({ country: req.params.id })
        ]);

        // If force delete requested, cascade delete associated data first
        const force = String(req.query.force || '').toLowerCase() === 'true';
        if (force && (companyCount > 0 || personCount > 0)) {
            const [companiesDeleted, peopleDeleted] = await Promise.all([
                Company.deleteMany({ country: req.params.id }),
                Person.deleteMany({ country: req.params.id })
            ]);
            await country.deleteOne();
            return res.json({
                success: true,
                data: {},
                meta: {
                    companiesDeleted: companiesDeleted?.deletedCount || 0,
                    peopleDeleted: peopleDeleted?.deletedCount || 0
                }
            });
        }

        if (companyCount > 0 || personCount > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete country with ${companyCount} companies and ${personCount} people associated`,
                message: `Cannot delete country with ${companyCount} companies and ${personCount} people associated`
            });
        }

        await country.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting country:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Get companies by country
// @route   GET /api/countries/:id/companies
// @access  Public
exports.getCountryCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ country: req.params.id })
            .populate('country', 'name code')
            .sort('name');

        res.json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (error) {
        console.error('Error getting companies by country:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Get people by country
// @route   GET /api/countries/:id/people
// @access  Public
exports.getCountryPeople = async (req, res) => {
    try {
        const people = await Person.find({ country: req.params.id })
            .populate('country', 'name code')
            .populate('company', 'name')
            .sort('lastName firstName');

        res.json({
            success: true,
            count: people.length,
            data: people
        });
    } catch (error) {
        console.error('Error getting people by country:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
