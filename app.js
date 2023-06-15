const mtg = require('mtgsdk');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

//grabs the body content
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const cardListUGL = [];
const cardListUST = [];
const cardListUND = [];

//refer to cards in sets: Unglued (UGL), Unstable (UST), and Unsanctioned (UND), Unifity?
//UGL
mtg.card.all({ set: "UGL" }).on('data', card => {
    cardListUGL.push(card);
});

//UST
mtg.card.all({ set: "UST" }).on('data', card => {
    cardListUST.push(card);
});

//UND
mtg.card.all({ set: "UND" }).on('data', card => {
    cardListUND.push(card);
});

//set up the home page
app.get("/", (req, res) => {
    res.render("home");
});

//respond to search options
//see 243 at 10 min
app.post("/", (req, res) => {

});

//Unglued set
app.get("/unglued", (req, res) => {
    res.render("unSet", { cardList: cardListUGL, setName: "ugl" });
});

//Unstable set
app.get("/unstable", (req, res) => {
    res.render("unSet", { cardList: cardListUST, setName: "ust" });
});

//Unsactionedd set
app.get("/unsanctioned", (req, res) => {
    res.render("unSet", { cardList: cardListUND, setName: "und" });
});


//get specific card - check 282
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
})

app.listen("3000", () => {
    console.log("Listening on port 3000");
});
