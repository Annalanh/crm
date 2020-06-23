const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const LeadModel = require('./models/lead')
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv').config()

app.use(cors());
app.options('*', cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, (err) => {
    if (err) console.log(err)
    else {
        console.log('connected to mongodb')
        // LeadModel.create({name: 'chi3', email: 'thao@gmail.com', status: 'L1'}, (err, data) => {
        //     if(err) console.log(err)
        //     else console.log(data)
        // })
    }
});

//get data
app.get('/data/:current/:pageSize', (req, res) => {
    LeadModel.find({}, function (err, data) {
        if (err) console.log(err)
        else {
            let current = Number(req.params.current)
            let pageSize = Number(req.params.pageSize)

            let firstRecordIndex = pageSize * (current - 1)

            let returnData = data.slice(firstRecordIndex, firstRecordIndex + pageSize)

            res.send({ results: returnData, totalCount: data.length })

        }
    })
})

//update lead
app.post("/update", (req, res) => {
    let { name, email, status, currentName } = req.body

    LeadModel.update({ name: currentName }, { $set: { name, email, status } }, (err, res) => {
        if (err) console.log(err)
        else console.log(res)
    })

    res.send({ name, email, status })
})

//get lead by name
app.get('/getLead/:name', (req, res) => {
    let name = req.params.name

    LeadModel.find({ name }, function (err, data) {
        if (err) console.log(err)
        else {
            res.send(data)
        }
    })
})

//send email
app.post("/sendMail", (req, res) => {
    let { email, name } = req.body
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'thaonp041099@gmail.com',
        subject: 'Welcome to MindX',
        templateId: 'd-1a74bf657b384599b6d7ea3783d370ae',
        dynamic_template_data: {
            user: name
        },
    };
    sgMail
    .send(msg)
    .then(() => { }, error => {
        console.error(error);
    });

    res.send({status: 1})
})

app.listen(8000)