const express = require("express");
require('dotenv').config();
const axios = require("axios");

const app = express();
const token = process.env.TOKEN;
const port = process.env.PORT
const coingecko = process.env.COIN;
const tel = `https://api.telegram.org/bot${token}/sendMessage`;


app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

const returnAssInUsd = (data)=>{
    assInXrp = data["australian-safe-shepherd"].xrp;
    xrpInUsd = data.ripple.usd;
    return assInXrp * xrpInUsd
}

const getAssInUsd = (tel, message, res)=>{
    axios.get(coingecko)
    .then(function (response) {
        // handle success
        reply = `The Price of ASS rn is: $ ${returnAssInUsd(response.data).toFixed(12)}`;
        sendMessage(tel, message, reply, res);
    })
    .catch(function (error) {
        console.log(error)
    })
}

app.post("/start_bot", (req, res)=>{
    const { message } = req.body;
    sendMessage(tel, message, "Welcome to the Coin Price Bot", res);
});

app.get("/", (req, res)=>{
    res.send("Welcome to Price bot");
});

app.post("/price", (req, res)=>{
    const { message } = req.body;
    getAssInUsd(tel, message, res);
});

function sendMessage(url, message, reply, res){
    axios.post(url, {
        'chat_id': message.chat.id,
        'text': reply
        }).then(response => {
            console.log("Message posted");
            res.end("ok");
        }).catch(error =>{
        console.log(error);
    });
 }

 app.listen(port, () => console.log(`Telegram bot is listening on port ${port}!`));