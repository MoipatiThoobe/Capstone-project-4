
//import the express module
const express = require('express');
//create express object called app
const app = express();
//declare the port
const port = process.env.PORT || 3001
//import isomoporhic fetch
const fetch = require('isomorphic-fetch');
//import body parsing middleware
const bodyParser = require('body-parser');
//import cors to allow access control
const cors = require('cors');
//import helmet for security purposes
const helmet = require('helmet');

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(cors());
app.use(helmet());

//route handler to get information about the user by using their username
app.get('/search/:userName', async (req, res) => {
    //the username the user inputs
    const userName = req.params.userName;
    //fetch the user's information from Github's api
    const ghResponse = await fetch(`https://api.github.com/users/${userName}`)
    //check if the user exists if not throw an error
    if(!ghResponse.ok){
        throw new Error(`HTTP Error status: ${ghResponse.status}`)
    }
    //store the user's information and convert to json
    const ghResponseResult = await ghResponse.json();

    //fetch the user's information from Gitlab
    const glResponse = await fetch(`https://gitlab.com/api/v4/users?username=${userName}`)
    //check if the user exists if not throw an error
    if(!glResponse.ok){
        throw new Error(`HTTP Error Status: ${glResponse.status}`)
    }
    //store the user's information and convert it to json
    const glResponseResult = await glResponse.json();

    //respond with the user's information from Github and Gitlab
    res.send({Hub: ghResponseResult, Lab:glResponseResult[0]});
})

//get the user's respos from Github and Gitlab
app.get('/repo/:username', async (req, res) => {
    //the username the user inputs
    const username = req.params.username;
    //array to store the repo information
    let repoDetails = [];
    //fetch the repo information from Github's Api
    const ghRepo = await fetch('https://api.github.com/users/' + username + '/repos?per_page=5&sort=create')
    //check if the repo exists if not throw an error
    if(!ghRepo.ok){
        throw new Error(`Http Error status: ${ghRepo.status}`)
    }
    //store repo information and convert to JSON
    const ghRepoResult = await ghRepo.json();

    //loop through the Github repo and fetch the commits
    for(let i = 0; i < ghRepoResult.length; i++){
        let ghCommits;
        //fetch the commits
        let ghCommitResponse = await fetch(`https://api.github.com/repos/${username}/${ghRepoResult[i].name}/commits?per_page=5`);
        //check if the commits exist
        if(!ghCommitResponse.ok){
            throw new Error(`Http Error status: ${ghCommitResponse.status}`)
        }
        //store the commits and covert to json
        ghCommits = await ghCommitResponse.json();

        //store the repo information in an object
        let ghRepoContent = {};
        ghRepoContent["repoName"] = ghRepoResult[i].name;
        ghRepoContent["repoLastCommit"] = ghCommits[0].commit.author.date.substr(0, 10);
        ghRepoContent["repoBirth"] = ghRepoResult[i].created_at.substr(0, 10);
        ghRepoContent["repoDesc"] = ghRepoResult[i].description;
        ghRepoContent['commitMsg'] = [];

        for(let x=0; x < ghCommits.length; x++){
            ghRepoContent.commitMsg.push(ghCommits[x].commit.message);
        }
        //push the object to the array
        repoDetails.push(ghRepoContent);
    }


    let glRepo;
    let glRepoResult;
    try{
        //fetch the repo from Gitlab
        glRepo = await fetch(`https://gitlab.com/api/v4/users/${username}/projects`)
        glRepoResult = await glRepo.json()
    }
    catch{
        throw new Error(`Http Error status: ${glRepo.status}`)
    }

    //loop through the Gitlab repo and get the commits
    for(let j=0; glRepoResult.length; j++){
        let glCommits;
        let glCommitsResponse = await fetch(`https://gitlab.com/api/v4/projects/${glRepoResult[j].id}/repository/commits`);
        if(!glCommitsResponse.ok){
            throw new Error(`HTTP Error status: ${glCommitsResponse.status}`)
        }

        //convert the commits to json
        glCommits = await glCommitsResponse.json();

        //store the repo information in an object
        let glContent = {};
        glContent["gl_lastCommit"] = glRepoResult[j].last_activity_at.substr(0, 10);
        glContent["gl_repoBirth"] = glRepoResult[j].created_at.substr(0, 10);
        glContent["gl_repoDesc"] = glRepoResult[j].description;

        //push the object to the array
        repoDetails.push(glContent);
    }
    
    //response with the user's repo information
    res.send({repoDetails});

})

//listen to http requests and return a server object
app.listen(port, () => console.log(`Listening on port ${port}`));