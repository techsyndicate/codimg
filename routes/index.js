const express = require('express');
const router = express.Router();
const getLicense = require('../controllers/licenseDetector')
const { codeSearchQuery, rawGithubLinkParserSingular } = require('../controllers/rawContentParser')
const getFiles = require('../controllers/getFiles')
const githubSearch = require('../controllers/search/githubSearch')
const resultsParser = require('../controllers/resultsParser')
const functionSearchObjectParser = require('../controllers/getFunctionNames')
const searchResultsUnifier = require('../controllers/searchResultsUnifier')
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
    const repoName = repoUrl.split('.com/')[1]
    axios.get(`https://api.github.com/repos/${repoName}`)
        .then(response => {
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
        .catch(err => {
            res.render('new', {
                layout: false,
                error: 'Invalid Repository Link'
            })
        })
})

router.post('/results', async(req, res) => {
    const { files, name, email, repoUrl } = req.body
    const userDetails = {
        name,
        email,
        repoUrl
    }
    if (typeof(files) === "undefined") {
        getFiles(repoUrl).then(files => {
            res.render('choose', {
                userDetails,
                layout: false,
                files,
                error: 'Choose atleast 1 file'
            })
        })
    }
    const username_repo = repoUrl.split('.com/')[1]
    const filesArray = []
    if (typeof(files) == "string") {
        filesArray.push(files)
    } else {
        for (let i = 0; i < files.length; i++) {
            filesArray.push(files[i])
        }
    }
    let searchObject = await codeSearchQuery(username_repo, filesArray)
    let functionSearchObject = await functionSearchObjectParser(searchObject)
    let searchResults = await githubSearch(searchObject)
    let functionSearchResults = await githubSearch(functionSearchObject)
    let finalSearchResults = await searchResultsUnifier(searchResults, functionSearchResults)
    let results = await resultsParser(finalSearchResults)
    for (const [key, value] of Object.entries(results)) {
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