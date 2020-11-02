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
  axios.get(x)
  .then(response => {
    let code = response.data
    let startIndex = code.indexOf(`${keyword} `)
    while(startIndex > 0) {
      let length = code.length
      const endIndex = startIndex + 150
      let functionName = ''
      for (let i = startIndex; i <= endIndex; i++) {
        functionName += code[i]
      }
      functionName = functionName.split(character)[0]
      code = code.slice(endIndex, length)
      startIndex = code.indexOf(`${keyword} `)
      console.log(functionName)
    }
  })
  .catch((err) => {
      console.log(err)
  })
}


getAllFunctionNames(jsLink, 'function', '{')

getAllFunctionNames(pyLink, 'def', ':')

getAllFunctionNames(cLink, 'void', '{')