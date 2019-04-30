//require node packages
const mysql = require("mysql");
const path = require("path");
const express = require("express");

const app = express();
const PORT = 8080;

//global variable
let friends = [
    {
        name: "parker",
        scores: [1, 2, 3, 4, 5],
    },
    {
        name: "all zero",
        scores: [0,0,0,0,0]
    },
    {
        name: "all 5",
        scores: [5,5,5,5,5]
    }
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
    console.log(req.body)
    let newAnswers = [];
    newAnswers[0] = req.body.group1
    newAnswers[1] = req.body.group2
    newAnswers[2] = req.body.group3
    newAnswers[3] = req.body.group4
    newAnswers[4] = req.body.group5
    res.json(friends[findFriend(newAnswers)])
})

//double for loop indicates it could be done recursively (consider refactoring)
function findFriend(newAnswers) {
    let currentBestFriend = {
        name: "none",
        score: 1000,
    };
    console.log(friends)
    for(i = 0; i < friends.length; i++){
        let oldAnswers = friends[i].scores;
        let differenceScore = 0;
        for(j = 0; j < friends[i].scores.length; j++){
            console.log(friends[i])
            differenceScore = differenceScore + Math.abs(oldAnswers[j] - newAnswers[j]);
        }
        console.log(differenceScore, "difference score")
        if(differenceScore < currentBestFriend.score){
            console.log(currentBestFriend)
            currentBestFriend = {
                position: i,
                score: differenceScore,
            };
        }
    }
    return currentBestFriend.position
}

app.listen(PORT, function(){
    console.log("App listening on PORT " + PORT)
})