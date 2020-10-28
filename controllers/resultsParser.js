const axios = require('axios')
const { codeSearchQuery, rawGithubLinkParserSingular } = require('./rawContentParser')
const stringSimilarity = require('string-similarity')

require('dotenv').config()

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${process.env.OAUTH_GITHUB}`
    }
}

function resultsParser(searchResults) {
    let promise = new Promise(async(resolve, reject) => {
        results = {}
        for (const [file_url, search_Results] of Object.entries(searchResults)) {
            try {
                let value = await resultsArrayLoop(search_Results, file_url)
                results[file_url] = value
                console.log(value)
            } catch (err) {
                console.log(err)
            }
        }
        resolve(results)
    })
    return promise
}

function charCount(sourceCode, similarity) {
    let totalSourceCodeCount = sourceCode.length
    let similarSourceCodeCount = similarity * totalSourceCodeCount
    return [similarSourceCodeCount, totalSourceCodeCount]
}

async function resultsArrayLoop(search_Results, file_url) {
    let promise = new Promise((resolve, reject) => {
        resultsArray = []
        items = search_Results.items
        i = 1
        items.forEach(async(value, index) => {
            try {
                result = {}
                repoUrl = value.repository.full_name
                filePath = value.path
                let fileDataUrl = await rawGithubLinkParserSingular(repoUrl, filePath)
                let fileRes = await axios.get(fileDataUrl, config)
                let sourceFileRes = await axios.get(file_url, config)
                let similarity = 0
                try {
                    similarity = stringSimilarity.compareTwoStrings(fileRes.data, sourceFileRes.data)
                } catch (error) {
                    similarity = 0
                }
                let repofullname = value.repository.full_name
                let splitted = repofullname.split('/')
                let userName = splitted[0]
                let repoName = splitted[1]
                let similaritypercent = similarity * 100
                similaritypercent = similaritypercent.toFixed(2)
                let commonChars = charCount(sourceFileRes.data, similarity)[0]
                commonChars = Math.trunc(commonChars)
                let repourl = `https://github.com/${repofullname}`
                result = [
                    userName,
                    repoName,
                    value.path,
                    similaritypercent,
                    commonChars,
                    charCount(sourceFileRes.data, similarity)[1],
                    repourl
                ]
                resultsArray.push(result)
                if (i == items.length) {
                    resolve(resultsArray)
                }
                i = i + 1
            } catch (err) {
                console.log(err)
            }
        })
    })
    return promise
}

module.exports = resultsParser;