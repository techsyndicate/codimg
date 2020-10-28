const axios = require('axios')
const { codeSearchQuery, rawGithubLinkParserSingular } = require('./rawContentParser')
const stringSimilarity = require('string-similarity')

function resultsParser(searchResults) {
    let promise = new Promise(async(resolve, reject) => {
        results = {}
        for (const [file_url, search_Results] of Object.entries(searchResults)) {
            let value = await resultsArrayLoop(search_Results, file_url)
            results[file_url] = value
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
            result = {}
            repoUrl = value.repository.full_name
            filePath = value.path
            let fileDataUrl = await rawGithubLinkParserSingular(repoUrl, filePath)
            let fileRes = await axios.get(fileDataUrl)
            let sourceFileRes = await axios.get(file_url)
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
            similaritypercent =  similaritypercent.toFixed(2)
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
        })
    })
    return promise
}

module.exports = resultsParser;