const axios = require('axios')
const cheerio = require('cheerio')
const urlencode = require('urlencode')

require('dotenv').config()

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${process.env.OAUTH_GITHUB}`
    }
}

SEARCH_GITHUB_API_URL = 'https://api.github.com/search/code?q='

function githubSearch(searchObject) {
    let promise = new Promise(async(resolve, reject) => {
        searchResults = {}
        for (const [file_url, searchQuery] of Object.entries(searchObject)) {
            url = await searchURL(SEARCH_GITHUB_API_URL + searchQuery)
            try {
                let res = await axios.get(url, config)
                searchResults[file_url] = res.data
            } catch (err) {

            }
        }
        resolve(searchResults)
    })
    return promise
}

async function searchURL(url) {
    try {
        let res = await axios.get(SEARCH_GITHUB_API_URL + searchQuery, config)
        if (res.response.status == 422) {
            url = url.trim().substring(0, url.length - 15)
            return url
        } else {
            return url
        }
    } catch (err) {
        url = url.trim().substring(0, url.length - 15)
        console.log(url)
        return url
    }
}

/* 
initalSearchObjectExample = {
    'file_url': [
        {
            repo: 'repo',
            file_path: 'file_path',
            file_download_url: 'url'
        },
        {

        }
    ],
    file_url: [{}]
}
*/

/*
async function githubSearch(duoObject) {
    initialSearchObject = {}
    let searchResultsArray = []
    for (const [file_url, searchableData] of Object.entries(duoObject)) {
        console.log(1)
        initialSearchObject[file_url] = await searchResultsArrayFunction(searchableData)
        console.log(initialSearchObject)
    }
}

function searchResultsArrayFunction(searchableData) {
    var promise = new Promise((resolve, reject) => {
        let searchResultsArray = []
        let i = searchableData.length
        searchableData.forEach(async(value, index) => {
            searchUrl = `https://github.com/search?q=${value}&type=code`
            let res = await axios.get(searchUrl, config)
            let data = res.data
            let searchableDataResultsArray = []
            for (let i = 0; i < 10; i++) {
                let repo = cheerio('.flex-shrink-0.text-small.text-bold', data)[i.toString()]['children'][1]['attribs']['href']
                let repoUrl = `https://github.com${repo}`
                let filePath = cheerio('.f4.text-normal', data)[i.toString()]['children'][1]['attribs']['title']
                let fileDownloadLink = `https://raw.githubusercontent.com${repo}/master/${filePath}`
                searchableDataResultsArray.push({
                    'repo': repo,
                    'repoUrl': repoUrl,
                    'filePath': filePath,
                    'fileDownloadLink': fileDownloadLink
                })
            }
            searchableDataResultsArray.forEach((value, index) => {
                searchResultsArray.push(value)
            })
            i = i - 1
            console.log(i)
            resolve(searchResultsArray)
        })
    })
    return promise
}
*/

module.exports = githubSearch