const axios = require('axios');

// https://github.com/jjwilly16/node-pdftk (repo with license)
// https://github.com/laxyapahuja/bhyi.tk  (repo without license)

module.exports = 
    function getResult(inputRepoUrl) {
        const repoUrl = inputRepoUrl.split('.com/')[1]

        const contentsUrl = `https://api.github.com/repos/${repoUrl}/contents` 

        axios.get(contentsUrl)
        .then(response => {
            let contents = response.data
            let licensePresent = false
            let licenseUrl = ''
            contents.map((item) => {
            if(item.name == 'LICENSE.md') {
                licensePresent = true
                licenseUrl = item.download_url
            }
            })
            if(licensePresent) {
            // give the type and the license itself as a response
            axios.get(licenseUrl)
                .then(response => {
                const licenseData = response.data
                console.log(licenseData)
                })
                .catch(error => {
                console.log(error)
                })
            contents = contents.filter((item) => item.name !== 'LICENSE.md')
            }
            console.log(contents)
        })
        .catch(error => {
            console.log(error);
        });
    }

