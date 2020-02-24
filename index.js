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
        default: false
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
        default: false,
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
        type: "list",
        name: "license",
        message: "License information:",
        choices: ["MIT License", "Other License", "No License"],
        default: "MIT License"
    },
    {
        type: "input",
        name: "otherLicense",
        message: "Enter License text:",
        when: function (answers) {
            return answers.license === "Other License";
        }
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
        let license = answers.license;
        const otherLicense = answers.otherLicense;
        const MIT = `MIT License  

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

const open = `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`;

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

        if (license == "MIT License") {
            licenseText = MIT;
        } else if (license === "Other License") {
            licenseText = `${otherLicense}`;
        } else {
            licenseText = open;
        }

        info = `
     
# ${answers.title}

${projectStatus} ${newBadge} ${newBadge2}   

### Project Description
${answers.description}

### Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [License](#tests)
* [Contributors](#contributors)
* [Tests](#tests)

### Installation
${answers.installation}

### Usage
${answers.usage}

### License
${licenseText}

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


