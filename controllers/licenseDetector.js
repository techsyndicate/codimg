const axios = require('axios')
const cheerio = require('cheerio')

function getLicense(repoURL) {
    axios.get(repoURL)
        .then(res => {
            let html = res.data
            let license = ''
            let classes = cheerio('.mt-3', html).text().split("\n")
            classes.forEach((value, index) => {
                if (value.includes('License')) {
                    license = value.trim()
                }
            })
            return license
        })
}

module.exports = getLicense;