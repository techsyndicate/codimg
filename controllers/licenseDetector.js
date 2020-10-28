const axios = require('axios')

require('dotenv').config()

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${process.env.OAUTH_GITHUB}`
    }
}

function getLicense(repoName) {
    let licenseUrl = `https://api.github.com/repos/${repoName}/license`
    let promise = new Promise((resolve, reject) => {
        axios.get(licenseUrl, config)
            .then(res => {
                license = res.data.license.name
                resolve(license)
            })
            .catch(err => {
                if (err.response.status == 404) {
                    license = 'nonexistant'
                    resolve(license)
                }
            })
    })
    return promise
}

module.exports = getLicense;