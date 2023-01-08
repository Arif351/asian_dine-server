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
        const allFoodCollection = client.db('asian_dine').collection('allFoodCollections')
        const timeSlotsCollection = client.db('asian_dine').collection('timeSlots')

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