const api = {
    getUser(username) {

        const queryUrl = `https://api.github.com/users/${username}`;
        const { data } = axios.get(queryUrl);
    
        const email = data.email;
        const avatar = data.avatar_url;
  
    }
  };
  
  module.exports = api;
  



//   async function getUser() {

//     const { username } = await inquirer.prompt({
//         message: "Enter your GitHub username:",
//         name: "username"
//     });

//     const queryUrl = `https://api.github.com/users/${username}`;
//     const { data } = await axios.get(queryUrl);

//     const email = data.email;
//     const avatar = data.avatar_url;

// }