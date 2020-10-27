const express = require('express');
const router = express.Router();
const getLicense = require('../controllers/licenseDetector')
const { codeSearchQuery, rawGithubLinkParserSingular } = require('../controllers/rawContentParser')
const getFiles = require('../controllers/getFiles')
const githubSearch = require('../controllers/search/githubSearch')
const resultsParser = require('../controllers/resultsParser')
const axios = require('axios');

router.get('/', (req, res) => {
    res.render('index')
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
    let results = await resultsParser(searchResults)
    for(const [key, value] of Object.entries(results)) {
        try {
            const new_key = key.split('master/')[1]
            const file_name = new_key.split('/')[1]
            const new_file_name = file_name.split('.')[0]
            results[new_file_name] = results[key]
            delete results[key]
        } catch (error) {
            const new_key = key.split('main/')[1]
            const file_name = new_key.split('/')[1]
            const new_file_name = file_name.split('.')[0]
            results[new_file_name] = results[key]
            delete results[key]
            console.log(error)
        }
    }
    let repoLicense = 'nonexistant'
    // console.log(results)
    getLicense(repoUrl).then((license => {
        repoLicense = license
    }))
    const keysofData = Object.keys(results)
    const newKeys = []
    for (let i = 0; i < keysofData.length; i++) {
        const new_key = keysofData[i].split('.')[0]
        newKeys.push(new_key)
    }
    res.render('results', {
        name: name,
        email: email,
        repoUrl: repoUrl,
        layout: false,
        repoLicense: repoLicense,
        results: results,
        keys: newKeys,
    })
})

module.exports = router;