// sample urls

// https://raw.githubusercontent.com/laxyapahuja/font-in/master/fontin/__main__.py (py link)

// https://raw.githubusercontent.com/corelan/mona/master/mona.py (py link)

// https://raw.githubusercontent.com/techsyndicate/platform/master/pages/views.py (py link)

// https://raw.githubusercontent.com/techsyndicate/codimg/main/controllers/rawContentParser.js (js link)

// https://raw.githubusercontent.com/Jai-17/FP-Player-Movement/main/Movement_WASD.cs (c# link)


const axios = require('axios')

const jsLink = 'https://raw.githubusercontent.com/techsyndicate/codimg/main/controllers/rawContentParser.js'

const pyLink = 'https://raw.githubusercontent.com/laxyapahuja/font-in/master/fontin/__main__.py'

const cLink = 'https://raw.githubusercontent.com/Jai-17/FP-Player-Movement/main/Movement_WASD.cs'


function getAllFunctionNames(x, keyword, character) {
    let promise = new Promise(async(resolve, reject) => {
        functions = []
        let response = await axios.get(x)
        let code = response.data
        let startIndex = code.indexOf(`${keyword} `)
        while (startIndex > 0) {
            let length = code.length
            const endIndex = startIndex + 150
            let functionName = ''
            for (let i = startIndex; i <= endIndex; i++) {
                functionName += code[i]
            }
            functionName = functionName.split(character)[0]
            code = code.slice(endIndex, length)
            startIndex = code.indexOf(`${keyword} `)
            functions.push(functionName)
        }
        resolve(functions)
    })
    return promise
}

function functionQueryConverter(functionSearchArray) {
    try {
        searchQuery = functionSearchArray[0]
        ind = 0
        for (let i = 1; i < 15; i++) {
            if (searchQuery.length < 128) {
                ind = ind + 1
                try {
                    searchQuery = `${searchQuery} ${functionSearchArray[ind].trim()}`
                } catch (err) {}
                if (ind == functionSearchArray.length) {
                    searchQuery = searchQuery.slice(0, 127)
                    break
                }
            } else {
                searchQuery = searchQuery.slice(0, 127)
                break
            }
        }
        return searchQuery
    } catch (err) {
        console.log(err)
    }
}

function functionSearchObjectParser(searchObject) {
    let promise = new Promise(async(resolve, reject) => {
        functionSearchObject = {}
        for (const [file_url, codeQuery] of Object.entries(searchObject)) {
            let functionSearchArray = []
            if (file_url.endsWith('.py')) {
                functionSearchArray = await getAllFunctionNames(file_url, 'def', ':')
            } else if (file_url.endsWith('.js')) {
                functionSearchArray = await getAllFunctionNames(file_url, 'function', '{')
            } else if (file_url.endsWith('.cs')) {
                functionSearchArray = await getAllFunctionNames(file_url, 'void', '{')
            }
            let searchQuery = functionQueryConverter(functionSearchArray)
            functionSearchObject[file_url] = searchQuery
        }
        resolve(functionSearchObject)
    })
    return promise
}

//getAllFunctionNames(jsLink, 'function', '{')

//getAllFunctionNames(pyLink, 'def', ':')

//getAllFunctionNames(cLink, 'void', '{')

module.exports = functionSearchObjectParser;