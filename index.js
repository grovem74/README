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
        type: "list",
        name: "status",
        message: "What is the status of your project?",
        choices: ["Complete", "In progress"]
    },
    {
        type: "confirm",
        name: "badge",
        message: "Would you like to add a badge? (see https://shields.io/ for info on badges)",
        default: "No"
    },
    {
        type: "input",
        name: "badgeName",
        message: "Enter a badge name:",
        when: function (answers) {
            return answers.badge === true;
        }
    },
    {
        type: "input",
        name: "badgeUrl",
        message: "Enter the badge url:",
        when: function (answers) {
            return answers.badge === true;
        }
    },
    {
        type: "confirm",
        name: "badge2",
        message: "Would you like to add another badge?",
        default: "No",
        when: function (answers) {
            return answers.badge === true;
        }
    },

    {
        type: "input",
        name: "badgeName2",
        message: "Enter a badge name:",
        when: function (answers) {
            return answers.badge2 === true;
        }
    },
    {
        type: "input",
        name: "badgeUrl2",
        message: "Enter the badge url:",
        when: function (answers) {
            return answers.badge2 === true;
        }
    },
    {
        type: "input",
        name: "description",
        message: "Describe your project:",
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
        message: "How is your application used?",
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
        let projectStatus;
        let addBadge = answers.badge;
        let addBadge2 = answers.badge2;
        let newBadge;
        let newBadge2;
        let badgeName = answers.badgeName;
        let badgeUrl = answers.badgeUrl;
        let badgeName2 = answers.badgeName2;
        let badgeUrl2 = answers.badgeUrl2;
    
        if (answers.status === "Complete") {
            projectStatus = `![Project Status](https://img.shields.io/badge/status-complete-green)&nbsp; `;
        } else {
            projectStatus = `![Project Status](https://img.shields.io/badge/status-in_progress-orange)&nbsp;`;
        }

        if (addBadge === true) {
            newBadge = `![${badgeName}](${badgeUrl})&nbsp;`;
        } else {
            newBadge = "";
        }

        if (addBadge2 === true) {
            newBadge2 = `![${badgeName2}](${badgeUrl2})&nbsp;`;
        } else {
            newBadge2 = "";
        }


        info = `
     
# ${answers.title}

${projectStatus} ${newBadge} ${newBadge2}   

### Project Description
${answers.description}

### Installation
${answers.installation}

### Usage
${answers.usage}

### License
${answers.license}

### Contributors
${answers.contributors}

### Tests
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


