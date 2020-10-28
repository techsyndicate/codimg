const axios = require('axios')
const stripComments = require('strip-comments')
const urlencode = require('urlencode')

function rawGithubLinkParser(repoUrl, files) {
    console.log(files)
    var promise = new Promise(async(resolve, reject) => {
        let links = []
        let i = 1
        files.forEach(async(file, index) => {
            let link = await rawGithubLinkParserSingular(repoUrl, file)
            links.push(link)
            if (i == files.length) {
                resolve(links)
            }
            i = i + 1
        })
    })
    return promise
}

function rawGithubLinkParserSingular(repo, file) {
    var promise = new Promise(async(resolve, reject) => {
        link = `https://api.github.com/repos/${repo}/contents/${file}`
        let res = await axios.get(link)
        let data = res.data
        resolve(data.download_url)
            // branch = 'main'
            // link = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`
            // try {
            //     let res = await axios.get(link)
            //     if (res.status == 200) {
            //         resolve(link)
            //     }
            // } catch (err) {
            //     if (err.response.status == 404) {
            //         branch = 'master'
            //         link = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`
            //         resolve(link)
            //     }
            // }
    })
    return promise
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

function codeSearchQuery(repoUrl, files) {
    var promise = new Promise(async(resolve, reject) => {
        object = {}
        let rawlinks = await rawGithubLinkParser(repoUrl, files)
        console.log(rawlinks)
        rawlinks.forEach((link, index) => {
            axios.get(link)
                .then(res => {
                    let code = res.data.toString()
                    code = stripComments(code)
                    let searchQuery = codeMinifier(code)
                    object[link] = searchQuery
                    if (files.length == Object.keys(object).length) {
                        resolve(object)
                    }
                })
        })
    })
    return promise
}

function codeMinifier(code) {
    searchQuery = ''
    let code_array = code.split('\n')
    let ind = Math.floor(code_array.length / 2)
    searchQuery = code_array[ind].trim()
    for (let i = 1; i < 15; i++) {
        if (searchQuery.length < 128) {
            ind = ind + 1
            try {
                searchQuery = `${searchQuery} ${code_array[ind].trim()}`
            } catch (err) {}
            if (ind == code_array.length) {
                searchQuery = searchQuery.slice(0, 127)
                break
            }
        } else {
            searchQuery = searchQuery.slice(0, 127)
            break
        }
    }
    return searchQuery
}

module.exports = { codeSearchQuery, rawGithubLinkParserSingular };