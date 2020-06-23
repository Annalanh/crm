const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const LeadModel = require('./models/lead')

app.use(cors());
app.options('*', cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true}, (err) => {
    if(err) console.log(err)
    else {
        console.log('connected to mongodb')
        LeadModel.create({name: 'my', email: 'thao@gmail.com'}, (err, data) => {
            if(err) console.log(err)
            else console.log(data)
            
        })
    }
});

app.get('/', (req, res) => {
    res.send("alo")
})
app.post('/login', (req, res) => {
    res.send('success')
})
//get data
app.get('/data/:current/:pageSize', (req, res) => {
    LeadModel.find({}, function(err, data){
        if(err) console.log(err)
        else {
            let current = Number(req.params.current)
            let pageSize = Number(req.params.pageSize)

            let firstRecordIndex = pageSize*(current - 1)

            let returnData = data.slice(firstRecordIndex, firstRecordIndex + pageSize)

            res.send({results: returnData, totalCount: data.length})

        }
    })


})

app.post("/update", (req, res) => {
    let { name, email, status, currentName } = req.body

    LeadModel.update({ name: currentName }, { $set: { name, email, status } }, (err, res) => {
        if(err) console.log(err)
        else console.log(res)
    })

    res.send({ name, email, status })
})

app.listen(8000)