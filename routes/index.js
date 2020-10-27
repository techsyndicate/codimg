const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')
const codeSearchQuery = require('../controllers/rawContentParser')
const getFiles = require('../controllers/getFiles')
const githubSearch = require('../controllers/search/githubSearch')
const axios = require('axios');

router.get('/', (req, res) => {
    res.render('index')
    getResult('https://github.com/jjwilly16/node-pdftk')
})

router.get('/new', (req, res) => {
    res.render('new', {
        layout: false
    })
})

router.post('/new', (req, res) => {
    const { name, email, repoUrl } = req.body
    userDetails = {
        name,
        email,
        repoUrl
    }
    getFiles(repoUrl).then(files => {
        res.render('choose', {
            userDetails,
            layout: false,
            files
        })
    })
})

router.post('/results', async(req, res) => {
    const { files, name, email, repoUrl } = req.body
    const username_repo = repoUrl.split('.com/')[1]
    let searchObject = await codeSearchQuery(username_repo, files)
    let searchResults = await githubSearch(searchObject)
    console.log(searchResults)
    res.redirect('/new')
})

router.get('/results', (req, res) => {
    res.render('results', {
        layout: false
    })
})

module.exports = router;