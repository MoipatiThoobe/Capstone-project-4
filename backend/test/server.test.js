let expect = require('chai').expect;
let request = require('request');

//test that when we make the request it returns the correct data
describe('Status and content', function() {
    describe ('Search page', function(){
        it('content', function(done){
            request('http://localhost:3001/search/moipatithoobe', 
                    function(error, response, body){
                expect(body).to.equal('{"Hub":{"login":"MoipatiThoobe","id":86411094,"node_id":"MDQ6VXNlcjg2NDExMDk0","avatar_url":"https://avatars.githubusercontent.com/u/86411094?v=4","gravatar_id":"","url":"https://api.github.com/users/MoipatiThoobe","html_url":"https://github.com/MoipatiThoobe","followers_url":"https://api.github.com/users/MoipatiThoobe/followers","following_url":"https://api.github.com/users/MoipatiThoobe/following{/other_user}","gists_url":"https://api.github.com/users/MoipatiThoobe/gists{/gist_id}","starred_url":"https://api.github.com/users/MoipatiThoobe/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/MoipatiThoobe/subscriptions","organizations_url":"https://api.github.com/users/MoipatiThoobe/orgs","repos_url":"https://api.github.com/users/MoipatiThoobe/repos","events_url":"https://api.github.com/users/MoipatiThoobe/events{/privacy}","received_events_url":"https://api.github.com/users/MoipatiThoobe/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":4,"public_gists":0,"followers":0,"following":0,"created_at":"2021-06-24T11:04:42Z","updated_at":"2021-11-18T09:14:06Z"}}');
                done();
            });
        });
    });
});