const axios = require('axios')

function getLicense(repoName) {
    let licenseUrl = `https://api.github.com/repos/${repoName}/license`
    let promise = new Promise((resolve, reject) => {
        axios.get(licenseUrl)
            .then(res => {
                    license = res.data.license.name
                    resolve(license)
                })
            .catch(err => {
                if(err.response.status == 404) {
                    license = 'nonexistant'
                    resolve(license)
                }
            })
    })
    return promise
}

module.exports = getLicense;