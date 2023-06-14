const mtg = require('mtgsdk');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

//grabs the body content
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const cardList = [];
const wantedCard = [];

//refer to cards in sets: Unglued (UGL), Unstable (UST), and Unsanctioned (UND), Unifity?
mtg.card.all({ set: "UGL" }).on('data', card => {
    cardList.push(card);
});

//set up the home page
app.get("/", (req, res) => {
    res.render("home", { cardList: cardList });
});

//respond to search options
//see 243 at 10 min
app.post("/", (req, res) => {

});

//set up the home page
app.get("/unglued", (req, res) => {
    res.render("unglued", { cardList: cardList });
});

app.post("/unglued", (req, res) => {

});

//get specific card - check 282
app.get("/card/:cardName", (req, res) => {
    //url check and converted so we can search for the actual card
    const cardTitle = req.params.cardName.toLowerCase().split(" ").join("-");
    const cardSearch = cardTitle.split("-").join(" ")

    mtg.card.all({ name: cardSearch }).on('data', card => {
        if (cardTitle === card.name.toLowerCase().toLowerCase().split(" ").join("-")) {
            console.log("/////////");
            wantedCard.push(card);
            res.render("card", { wantedCard: card });
        }
    });

    //console.log(wantedCard[0]);
})

app.listen("3000", () => {
    console.log("Listening on port 3000");
});
