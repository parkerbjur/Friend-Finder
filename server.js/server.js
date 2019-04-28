//require node packages
const mysql = require("mysql");
const path = require("path");
const express = require("express");

const app = express();
const PORT = 8080;

//global variable
let friends = [
    {name: "parker",
     scores: [1, 2, 3, 4, 5],
    },
];

//MySql
// const connection = mysql.createConnection({
//     //make environment variables
//     host: "localhost",
//     port: 3306,
//     user: "webuser",
//     password: "password",
//     database: "friend_finder_db"
// })

// connection.query("select * from friends", function(err, res){
//     if(err) throw err;
//     frineds = res;
// })

//Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")))


app.get("/", function(req, res){
    console.log("accessed home.html");
    console.log(__dirname)
    res.sendFile(path.join(__dirname, "../app/public/home.html"));
})

//accessing the survey isn't sending the right path and 
app.get("/survey", function(req, res){
    console.log("accessed");
    res.sendFile(path.join(__dirname, "../app/public/survey.html"));
})

app.get("/api/friends", function(req, res){
    res.json(friends);
})

app.post("/api/friends", function(req, res){
    findFriend(req.body.scores);
})

//double for loop indicates it could be done recursively (consider refactoring)
function findFriend(newAnswers) {
    let currentBestFriend;
    for(i = 0; i < friends.length; i++){
        let oldAnswers = friends[i].scores;
        let differenceScore;
        for(i = 0; i < friends[i].scores.length; i++){
            differenceScore = differenceScore + Math.abs(oldAnswers[i] - newAnswers[i]);
        }
        if(differenceScore < currentBestFriend.score){
            currentBestFriend = {
                position: i,
                score: differenceScore,
            };
        }
    }
    return currentBestFriend
}

app.listen(PORT, function(){
    console.log("App listening on PORT " + PORT)
})