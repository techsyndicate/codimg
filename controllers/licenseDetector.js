const axios = require('axios')
const cheerio = require('cheerio')

function getLicense(repoURL) {
    let promise = new Promise((resolve, reject) => {
        axios.get(repoURL)
            .then(res => {
                let html = res.data
                let classes = cheerio('.mt-3', html).text().split("\n")
                classes.forEach((value, index) => {
                    if (value.includes('License')) {
                        license = value.trim()
                        resolve(license);
                    }
                })
            })
    })
    return promise
}

module.exports = getLicense;