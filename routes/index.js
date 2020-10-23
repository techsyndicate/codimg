const express = require('express');
const router = express.Router();
const getResult = require('../controllers/searchController')

router.get('/', (req, res) => res.render('index'))

module.exports = router;
