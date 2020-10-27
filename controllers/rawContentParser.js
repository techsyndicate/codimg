const axios = require('axios')

function rawGithubLinkParser(repoUrl, files) {
    let links = []
    files.forEach(async(file, index) => {
        branch = 'master'
        link = `https://raw.githubusercontent.com/${repoUrl}/${branch}/${file}`
        try {
            let res = await axios.get(link)
        } catch (err) {
            if (err.response.status == 404) {
                branch = 'main'
                link = `https://raw.githubusercontent.com/${repoUrl}/${branch}/${file}`
            }
        }
        links.push(link)
    })
    return links
}

/*
function codeSplitter(repoUrl, files) {
    let rawlinks = rawGithubLinkParser(repoUrl, files)
    var promise = new Promise((resolve, reject) => {
        let duoObject = {}
        rawlinks.forEach((link, index) => {
            axios.get(link)
                .then(res => {
                    let code = res.data.toString()
                    let code_array = code.split('\n')
                    let temp = ''
                    let i = 0
                    let duo_array = []
                    code_array.forEach((value, index) => {
                        temp = temp + ' ' + value
                        i = i + 1
                        if (i % 2 == 0) {
                            duo_array.push(temp)
                            temp = ''
                            i = 0
                        }
                    })
                    duoObject[link] = duo_array;
                    if (files.length == Object.keys(duoObject).length) {
                        resolve(duoObject)
                    }
                })
        })
    })
    return promise
}
*/

function CodeSearchQuery(repoUrl, files) {
    object = {}
    let rawlinks = rawGithubLinkParser(repoUrl, files)
    var promise = new Promise((resolve, reject) => {
        rawlinks.forEach((link, index) => {
            axios.get(link)
                .then(res => {
                    let code = res.data.toString()
                    if (files.length == Object.keys(object).length) {
                        resolve(object)
                    }
                })
        })
    })
    return promise
}

module.exports = codeSplitter;