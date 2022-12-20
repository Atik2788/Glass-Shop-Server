const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ev4byy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        glassProductsCollection = client.db('glassStore').collection('productsGlass')
        ordersCollection = client.db('glassStore').collection('orders')
        tableDataCollection = client.db('glassStore').collection('tableData')


        // get products glass***************************************
        app.get('/productsGlass', async (req, res) => {
            const query = {};
            const options = await glassProductsCollection.find(query).toArray();
            res.send(options)
        })

        // add/post products
        app.post('/productsGlass', async (req, res) => {
            const addProducts = req.body;
            const result = await glassProductsCollection.insertOne(addProducts)
            res.send(result)
        })

        // delete products ***************************
        app.delete('/productsGlass/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await glassProductsCollection.deleteOne(filter)
            res.send(result)
        })


        // add/post order products****************************************
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })



        // get table data **************************************
        app.get('/tableData', async (req, res) => {
            const query = {}
            const option = await tableDataCollection.find(query).toArray()
            res.send(option)
        })

        // Delete Tabel Row
        app.delete('/tableData/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await tableDataCollection.deleteOne(filter)
            res.send(result)
        })

        // edit or put table data
        app.put('/tableData/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const filter = { _id: ObjectId(id) }
            const newRow = req.body;
            // console.log(newRow)
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    row: newRow,
                    // transactionId: payment.transactionId
                }
            }
            const updatedResult = await tableDataCollection.updateOne(filter, updatedDoc, options)

            res.send(updatedResult)
        })
    }

    finally {

    }
}

run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('glass shop server is running')
})



app.listen(port, () => console.log(`glass shop running on portal ${port}`))