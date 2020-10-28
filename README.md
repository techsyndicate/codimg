# Codimg
A re-modelled approach to plagiarism detection which enables software owners to generate a report for themselves on where, how and what piece of code written by them has been used by developers around the world, and whether it has been used in an ethical way or not.

In addition to this, our app also enables a developer to know whether he/she is violating a license agreement while also indicating how much of the code written by them is copied or sourced from another repository.

## Features
* File based report generation: Codimg gives you the option to select particular files and check where and by whom has that piece of code been used elsewhere.
* Real-time checker: We start running the checks at the very moment of input, thus making sure of always checking the latest version.
* Free and open-source: We are an open-source community and do not intend to charge for using our products.

## Getting Started
1. Clone the source code and install all the dependencies.
```bash
$ git clone https://github.com/techsyndicate/codimg
$ cd codimg && npm install
```
2. Enter your GitHub OAuth token in a `.env`.
3. Run the server using `npm run dev`.
