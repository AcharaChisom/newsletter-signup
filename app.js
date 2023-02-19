const express = require('express')
const bodyParser = require('body-parser')
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

mailchimp.setConfig({
    apiKey: "612c58c02d3f9c073fceb5b41fd0578b-us17",
    server: "us17",
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const mailAddress = req.body.email

    console.log(firstName, lastName, mailAddress)

    const listId = "4161768eb3"

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: mailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
        })
            res.sendFile(__dirname + '/success.html')
            console.log(`Successfully added ${firstName} as a member. ${firstName}'s id is ${response.id}`)
    
        } catch (err) {
            res.sendFile(__dirname + '/failure.html')
        }
    }

    run()
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})



app.listen(3000, () => console.log(`Server is running on port 3000`))

// API KEY - 612c58c02d3f9c073fceb5b41fd0578b-us17

// UNIQUE ID -> 4161768eb3