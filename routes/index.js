const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')
const getLicense = require('../controllers/licenseDetector')

router.get('/', (req, res) => {
    res.render('index')
    getLicense('https://github.com/manojVivek/medium-unlimited')
        // getResult('https://github.com/jjwilly16/node-pdftk')
})

router.get('/new', (req, res) => {
    res.render('new', {
        layout: false
    })
})

router.post('/new', (req, res) => {
    const { name, email, repoUrl } = req.body
    res.render('results', {
        name,
        email,
        repoUrl
    })
})

router.get('/results', (req, res) => {
    res.render('results', {
        layout: false
    })
})

module.exports = router;