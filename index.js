const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port  = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcb6faa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeeList");
    const coffee = database.collection("coffee");

    
    app.get('/coffee',async(req,res)=>{
      const cursor = coffee.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await coffee.findOne(query);
      res.send(result)
    })

    app.post('/newCoffee',async(req,res)=>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffee.insertOne(newCoffee);
      res.send(result)

    })
    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const doc = req.body;
      const filter = { _id:new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc ={
        $set:{
          name:doc.name,
          quantity:doc.quantity,
          chef:doc.chef,
          supplier:doc.supplier,
          taste:doc.taste,
          category:doc.category,
          photo:doc.photo,
          details:doc.details,
        }
      }
      const result = await coffee.updateOne(filter, updateDoc, options);
      res.send(result)
    })
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id:new ObjectId(id)}
      const result = await coffee.deleteOne(query);
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


app.get('/',(req,res)=>{
    res.send('hello');
})

app.listen(port,()=>{
    console.log(`server is running ${port}`);
})