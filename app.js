const mtg = require('mtgsdk');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

const cardListUGL = [];
const cardListUST = [];
const cardListUND = [];

//Sets pages up for grabbing content and renders home page
function setUp() {
    app.set('view engine', 'ejs');

    //grabs the body content
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    app.get("/", (req, res) => {
        res.render("home");
    });
}

function urlFormat(word) {
    return word.toLowerCase().split(" ").join("-");
}

//refer to cards in sets: Unglued (UGL), Unstable (UST), and Unsanctioned (UND), Unifity?
//store card info on load
function setCards(setName, setArr) {
    mtg.card.all({ set: setName }).on('data', card => {
        setArr.push(card);
    });
}

//Takes the route currently on and then redirects to card searched page
function handleRedirectSearch(route) {
    app.post(route, (req, res) => {
        const cardSearch = req.body.searchCard;
        res.redirect("/card/" + urlFormat(cardSearch));
    });
}

//Takes the route and card set name and renders the current set onto a new page
function handleSetRender(route, setName) {
    app.get(route, (req, res) => {
        res.render("unSet", { cardList: cardListUGL, setName: setName });
    });
}

//Search for a card by name with the search bar
function findCardByName() {
    app.get("/card/:cardName", (req, res) => {
        //url check and converted so we can search for the actual card
        const cardTitle = req.params.cardName;
        const cardSearch = cardTitle.split("-").join(" ");

        //search for card name
        mtg.card.where({ name: cardSearch })
            .then(cards => {
                //filter out the array of cards
                const card = cards.filter(card => cardSearch === card.name.toLowerCase());
                if (card.length < 1) {
                    res.render("cardError");
                } else {
                    res.render("card", { wantedCard: card[0] })
                }
            });
    });
}

function openPort() {
    app.listen("3000", () => {
        console.log("Listening on port 3000");
    });
}

//Set up resources needed 
setUp();

//UGL
setCards("UGL", cardListUGL);

//UST
setCards("UST", cardListUST);

//UND
setCards("UND", cardListUND);

//Unglued set
handleSetRender("/unglued", "ugl");

//Unstable set
handleSetRender("/unstable", "ust")

//Unsactionedd set
handleSetRender("/unsanctioned", "und");

//Get specific card
findCardByName();

//Card search redirect
handleRedirectSearch("/");
handleRedirectSearch("/unglued");
handleRedirectSearch("/unstable");
handleRedirectSearch("/unsanctioned");
handleRedirectSearch("/card/:cardName");

//Listen to port 3000
openPort();