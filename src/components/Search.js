//For help with this app I used Youtube 
//Here is a link to the video: https://www.youtube.com/watch?v=aGiPMygfMM4&t=22s
//For help getting the repos I used Youtube
//Here is a link to the video: https://www.youtube.com/watch?v=QSzTx2y-Wys
import React, { useState, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css'
import '../App.css';
import { Form, Card, Image, Icon } from 'semantic-ui-react';
import axios from 'axios';


function Search(){
    //declare state using usestate
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');

    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState('');
    
  
    const [repos, setRepos] = useState([]);

    //fetch the information from Github's example Api and display it as default
    useEffect(() => {
        fetch(`https://api.github.com/users/example`)
        .then(res => res.json())
        .then(data => {
            setData(data)
        });
    }, []);

    //function to set the data
    const setData = ({ name, login, followers, following,  avatar_url, bio  }) => {
        setName(name);
        setUserName(login);
        setFollowers(followers);
        setFollowing(following);
        setAvatar(avatar_url);
        setBio(bio)
    }

    //function to get the username that is inputted
    const handleSearch = (e) => {
        setUserInput(e.target.value);
    }

    //function to hendle the submit
    const handleSubmit = (e) => {
        //fetch information from our api and set the data
        fetch(`http://localhost:3001/search/${userInput}`)
            .then(res => res.json())
            .then(data => {
                if(data.message){
                    setError(data.message)
                }
                else{
                    setData(data.Hub);
                    setError(null);
                }
               
            })
            searchRepos();
    }

    //function to search for the repos
    function searchRepos(){
        //fetch the data from the api we created set the repos
        axios({
            method: "get",
            url: `http://localhost:3001/repo/${userInput}`,
        }).then(res => {
            setRepos(res.data.repoDetails);
        });
    }

    //function to render the repo with the data from our api
    function renderRepo(repo){
        return (
            <div className="row" key={repo.id}>
                <h4>Repository Name: {repo.repoName}</h4>
                <h4>Repository Last Commit Date: {repo.repoLastCommit}</h4>
                <h4>Repository Date Created: {repo.repoBirth}</h4>
                <h4>Repository Description: {repo.repoDesc}</h4>
                <h4>Repository Commit messages: {repo.commitMsg}</h4>
            </div>
        )
    }

    //the search bar and information diplayed on the page
    return (
        <div>
            <div className="navbar">Git Search</div>
            <div className="search">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Input placeholder="Git User" name="git user" onChange={handleSearch}/>
                        <Form.Button content="Search"/>
                    </Form.Group>
                </Form>
            </div>
            {error ? (<h1>{error}</h1>) : (<div className="card">
                <Card>
                    <Image src={avatar} wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        <Card.Header>{userName}</Card.Header>
                        <Card.Header>{bio}</Card.Header>
                    </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='user' />
                                {followers} Followers
                            </a>
                        </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='user' />
                                {following} Following
                            </a>
                        </Card.Content>
                </Card>

            </div>
            )}
            <div className="repo-results">
                <h2>Repositories</h2>
                {repos.map(renderRepo)}
            </div>
        </div>
    );


    
}




  
export default Search;