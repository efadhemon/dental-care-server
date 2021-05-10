const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = process.env.PORT || 4000

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0ugz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentsCollection = client.db(process.env.DB_NAME).collection("appointments");

    if (err) {
        console.log('Database Not Connected');
    }
    else {

        app.get('/appointments', (req, res) => {
            appointmentsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
        })

        app.post('/addAppointment', (req, res) => {
            const appointment = req.body;
            appointmentsCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount)
            })
        })

        app.post('/appointmentsByDate', (req, res) => {
            const date = req.body;
            appointmentsCollection.find({appointmentDate: date.appointmentDate})
            .toArray((err, documents) => {
                res.send(documents)
            })
        })
    }

});

app.listen(port)