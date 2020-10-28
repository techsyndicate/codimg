const axios = require('axios')

require('dotenv').config()

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${process.env.OAUTH_GITHUB}`
    }
}

async function getFiles(repoUrl) {
    const newRepoUrl = repoUrl.split('.com/')[1]
    let res = await axios.get(`https://api.github.com/repos/${newRepoUrl}`)
    let branch = res.data.default_branch
    const treeUrl = `https://api.github.com/repos/${newRepoUrl}/git/trees/${branch}?recursive=1`
    const files = []
    var promise = new Promise((resolve, reject) => {
        axios.get(treeUrl, config)
            .then(response => {
                let contents = response.data.tree
                contents.map((item) => {
                    if (item.type == 'blob') {
                        files.push(item.path)
                    }
                })
                resolve(files)
            })
            .catch(error => {
                console.log(error);
            });
    })
    return promise
}

module.exports = getFiles;