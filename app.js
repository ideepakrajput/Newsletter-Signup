const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const https = require("https");
const { request } = require("http");

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function (req, res) {
    const fisrtName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fisrtName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonDATA = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;
    const options = {
        method: "POST",
        auth: "ideepakrajput:" + process.env.API_KEY
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonDATA);
    request.end();

    console.log(fisrtName, lastName, email)
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
})