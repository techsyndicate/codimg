const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')
const codeSplitter = require('../controllers/rawContentParser')
const getFiles = require('../controllers/getFiles')
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

router.post('/results', (req, res) => {
    const { files, name, email, repoUrl } = req.body
    const username_repo = repoUrl.split('.com/')[1]
    codeSplitter(username_repo, files).then(duoObject => {
        console.log(duoObject)
    })
    res.redirect('/new')
})

router.get('/results', (req, res) => {
    res.render('results', {
        layout: false
    })
})

module.exports = router;