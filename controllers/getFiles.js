const axios = require('axios')

function getFiles(repoUrl) {
    const newRepoUrl = repoUrl.split('.com/')[1]
    const treeUrl = `https://api.github.com/repos/${newRepoUrl}/git/trees/master?recursive=1`
    const files = []
    var promise = new Promise((resolve, reject) => {
        axios.get(treeUrl)
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
