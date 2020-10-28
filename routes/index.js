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
    const filesArray = []
    console.log(files)
    if(typeof(files) == "string") {
        filesArray.push(files)
    } else {
        for(let i=0; i < files.length; i++) {
            filesArray.push(files[i])
        }
    }
    console.log(filesArray)
    let searchObject = await codeSearchQuery(username_repo, filesArray)
    let searchResults = await githubSearch(searchObject)
    let results = await resultsParser(searchResults)
    for(const [key, value] of Object.entries(results)) {
        let new_key = key.split('/')
        new_key = new_key[new_key.length - 1]
        const new_file_name = new_key.split('.')[0]
        results[new_file_name] = results[key]
        delete results[key]
    }
    // console.log(results)
    let repoName = repoUrl.split('.com/')[1]
    let repoLicense = await getLicense(repoName)
    const keysofData = Object.keys(results)
    const newKeys = []
    for (let i = 0; i < keysofData.length; i++) {
        const new_key = keysofData[i].split('.')[0]
        newKeys.push(new_key)
    }
    const licenseLink = repoUrl + '/blob/master/LICENSE'
    console.log(repoLicense)
    res.render('results', {
        name: name,
        email: email,
        repoUrl: repoUrl,
        licenseLink: licenseLink,
        layout: false,
        repoLicense: repoLicense,
        results: results,
        keys: newKeys,
    })
})

module.exports = router;