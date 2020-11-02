function searchResultsUnifier(searchResults, functionSearchResults) {
    for (const [file_url, function_SearchResults] of Object.entries(functionSearchResults)) {
        functionSearchResults[file_url]['items'].forEach((value, index) => {
            searchResults[file_url]['items'].push(value)
        })
    }
    return searchResults
}

module.exports = searchResultsUnifier;