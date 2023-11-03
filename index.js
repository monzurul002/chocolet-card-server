const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config()
app.get('/', (req, res) => {
    res.send("Welcome to chocolet management server.")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	
        await client.connect();
        const coffedetails = client.db("coffeDatabse").collection("coffeCollection")


        app.post('/newCoffe', async (req, res) => {
            const newCoffe = req.body;
            const result = await coffedetails.insertOne(newCoffe);
            res.send(result)
        })

        app.get('/coffes', async (req, res) => {
            const query = {}
            const coffes = await coffedetails.find(query).toArray();
            res.send(coffes)
        })

        app.get("/coffes/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffedetails.findOne(query);
            res.send(result)
        })

        app.put('/coffes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const newData = req.body;
            const options = { upsert: true }
            const updatedInfo = {
                $set: {
                    name: newData.name, country: newData.country, value: newData.value
                }
            }

            const result = await coffedetails.updateOne(query, updatedInfo, options);
            res.send(result)
        })

        app.delete("/coffes/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffedetails.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => {
    console.log("server is running");
})