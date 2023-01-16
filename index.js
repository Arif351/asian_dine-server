const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.uvhk0wp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allFoodCollection = client.db('asian_dine').collection('allFoodCollections');
        const timeSlotsCollection = client.db('asian_dine').collection('timeSlots');
        const bookingCollection = client.db('asian_dine').collection('bookings');
        const usersCollection = client.db('asian_dine').collection('users');




        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jsonwebtoken.sign({ email }, process.env.ACCESS_TOKEN)
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: 'Aunothorized Access!' })
        });

        app.get('/foodList', async (req, res) => {
            const query = {};
            const foodList = await allFoodCollection.find(query).toArray();
            // console.log(foodList);
            res.send(foodList)
        });

        app.get('/foodList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allFoodCollection.find(query).toArray();
            console.log(result);
            res.send(result)
        });

        app.get('/time', async (req, res) => {
            const query = {};
            const timeList = await timeSlotsCollection.find(query).toArray();
            console.log(timeList);
            res.send(timeList)
        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const bookings = await bookingCollection.find(query).toArray();
            console.log(bookings);
            res.send(bookings)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const bookings = await usersCollection.find(query).toArray();
            console.log(bookings);
            res.send(bookings)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.send(result)
        })


    }
    finally {

    }

}
run().catch(console.log())





app.get('/', async (req, res) => [
    res.send('Asian Dine server is running')
])
app.listen(port, () => {
    console.log(`Asian Dine server is runing on ${port}`);
})