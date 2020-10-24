const axios = require('axios')
const cheerio = require('cheerio')

function getLicense(repoURL) {
    axios.get(repoURL)
    .then(res => {
        let html = res.data
        let classes = cheerio('.mt-3', html).text().split("\n")
        classes.forEach((value, index) => {
            if (value.includes('License')) {
                license = value.trim()
            }
        })
        return license
    })
    .catch(err => {
        console.log(err);
    })
}

module.exports = getLicense;