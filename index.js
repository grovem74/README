const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const client_id = "e453eff3c6172e2529ca";
const client_secret = "5a8417850e7a13ec164e50364b4c6fabf0ba5523";

const questions = [
    {
        type: "input",
        name: "title",
        message: "What is the name of your project?"
    },
    {
        type: "input",
        name: "description",
        message: "Describe your project:"
    },
    {
        type: "input",
        name: "installation",
        message: "Are there any installation instructions?",
        default: "N/A"
    },
    {
        type: "input",
        name: "usage",
        message: "How is your application used?"
    },
    {
        type: "input",
        name: "license",
        message: "Is there any licensing information?",
        default: "N/A"
    },
    {
        type: "input",
        name: "contributors",
        message: "Contributors:"
    },
    {
        type: "input",
        name: "tests",
        message: "Tests:",
        default: "N/A"
    },
];

// prompt user for each question and log the answers
function getInfo() {
    inquirer.prompt(questions).then(answers => {
        console.log(answers);

        info = `
# ${answers.title}
  
## Project Description
${answers.description}

## Installation
${answers.installation}

## Usage
${answers.usage}

## Licence
${answers.license}

## Contributors
${answers.contributors}

## Tests
${answers.tests}`;

        fs.appendFile("newREADME.md", info, function (err) {

            if (err) {
                return console.log(err);
            }
        });
    });
}

// api call to GitHub
async function getUser() {

    const { username } = await inquirer.prompt({
        name: "username",
        message: "Enter your GitHub username:"
    });
    const queryUrl = `https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`;
    // const queryUrl = `https://api.github.com/login/oauth/authorize?scope=${username}:email&client_id=${client_id}&client_secret=${client_secret}`;
    const { data } = await axios.get(queryUrl);
    const email = data.email;
    const avatar = data.avatar_url;
    const profile = `![Profile Pic](${avatar}) 
  
Username: ${username}<br>
Email: ${email}<br>`;

    fs.writeFile(`newREADME.md`, profile, function (err) {

        if (err) {
            return console.log(err);
        }
    });
}

getUser().then(() => getInfo());


