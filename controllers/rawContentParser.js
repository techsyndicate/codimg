const axios = require('axios')

function rawGithubLinkParser(username, repo, files) {
    let links = []
    files.forEach((file, index) => {
        link = `https://raw.githubusercontent.com/${username}/${repo}/master/${file}`
        links.push(link)
    })
}