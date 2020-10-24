const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')

router.get('/', (req, res) => {
    res.render('index')
    // getResult('https://github.com/jjwilly16/node-pdftk')
})

module.exports = router;