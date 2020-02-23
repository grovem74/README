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
  
  module.exports = generateMarkdown;