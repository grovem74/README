const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const client_id= "Iv1.486146f10968a550";
const client_secret ="c266cb826eb011a94b1df89d78afa74f20cbb72e";
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
    });
}

// api call to GitHub
async function getUser() {

    const { username } = await inquirer.prompt({
        name: "username",
        message: "Enter your GitHub username:"
    });
    const queryUrl = `https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`;
    const { data } = await axios.get(queryUrl);
    const email = data.email;
    const avatar = data.avatar_url;
    console.log(queryUrl);
    console.log(`email: ${email} avatar: ${avatar}`);
}

// create layout for readme file  
function generateMarkdown(answers) {
    return `
  # ${answers.title}
  
  # ${answers.description}

  # ${answers.installation}

  # ${answers.usage}

  # ${answers.license}

  # ${answers.contributors}

  # ${answers.tests}
  `;
}

// create readme file

// fs.writeFile("README.md", "test", function (err) {

//     if (err) {
//         return console.log(err);
//     }
//     console.log("Success!");

// });

getUser().then(() => getInfo());


