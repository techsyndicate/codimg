const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')
const getLicense = require('../controllers/licenseDetector')
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
    const newRepoUrl = repoUrl.split('.com/')[1]
    const treeUrl = `https://api.github.com/repos/${newRepoUrl}/git/trees/master?recursive=1`
    const files = []

    axios.get(treeUrl)
        .then(response => {
            let contents = response.data.tree
            contents.map((item) => {
                if(item.type == 'blob') {
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

router.post('/choose', (req, res) => {
    const { files, name, email, repoUrl } = req.body
    console.log(files)
    console.log(name, email, repoUrl)
    getResult('https://github.com/jjwilly16/node-pdftk')
    res.redirect('/new')
})

router.get('/results', (req, res) => {
    res.render('results', {
        layout: false
    })
})

module.exports = router;