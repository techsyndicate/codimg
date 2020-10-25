const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')
const getLicense = require('../controllers/licenseDetector')
const codeSplitter = require('../controllers/rawContentParser')
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
    const newRepoUrl = repoUrl.split('.com/')[1]
    const treeUrl = `https://api.github.com/repos/${newRepoUrl}/git/trees/master?recursive=1`
    const files = []

    axios.get(treeUrl)
        .then(response => {
            let contents = response.data.tree
            contents.map((item) => {
                if (item.type == 'blob') {
                    files.push(item.path)
                }
            })
            res.render('choose', {
                userDetails,
                layout: false,
                files: files,
            })
        })
        .catch(error => {
            console.log(error);
        });

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