const axios = require('axios')
const cheerio = require('cheerio')

function getLicense(repoURL) {
    axios.get(repoURL)
        .then(res => {
            let html = res.data
            console.log(html)
            let classes = cheerio('.mt-3', html)
            console.log(classes)
        })
}

module.exports = getLicense;