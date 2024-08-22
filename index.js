const express = require('express')
const cors = require('cors')

const client = require('./conn')

const app = express()
app.use(express.json())


app.post('/api/v1/school/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body
    if (name && address && latitude && longitude) {
        var nameRegex = /^[a-zA-Z\s]+$/;
        var addressRegex = /^[a-zA-Z0-9\s.,'-]+$/;
        var latitudeRegex = /^-?([1-8]?[0-9](\.\d{1,7})?|90(\.0{1,7})?)$/;
        var longitudeRegex = /^-?([1]?[0-7]?[0-9](\.\d{1,7})?|180(\.0{1,7})?)$/;
        if ((!nameRegex.test(name)) || (!addressRegex.test(address)) || (!latitudeRegex.test(latitude)) || (!longitudeRegex.test(longitude))) {
            res.json({ message: 'Invalid details' })
        }
        else {
            try {
                const response = await client.query('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [name, address, latitude, longitude])
                res.json({ message: 'School added successfully!' })
            } catch (error) {
                res.json({ message: 'Error adding school' })
            }
        }
    }
    else {
        res.json({ message: 'Please provide all required fields' })
    }
})

app.get('/api/v1/school/listSchools', async (req, res) => {
    const { lat, long } = req.query
    try {
        const response = await client.query('SELECT * FROM schools', (error, results, fields) => {
            if (error) throw error
            const sortedByDistance = results.map(school => {
                const distance = Math.pow(Math.abs(parseFloat(lat) - school.latitude), 2) + Math.pow(Math.abs(parseFloat(long) - school.longitude), 2);
                return { ...school, distance };
            }).sort((x, y) => x.distance - y.distance);
            res.json(sortedByDistance)
        })
    } catch (error) {
        console.log(error);
        
        res.json({ message: 'Error fetching schools' })
    }
})

app.listen(5555)
