require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 6600;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6avkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const menuCollections = client.db("bistroDB").collection("menu");
    const reviewCollections = client.db("bistroDB").collection("reviews");
    const cartCollections = client.db("bistroDB").collection("carts");
    const userCollections = client.db("bistroDB").collection("users");

    // create get api for menu
    app.get("/menu", async (req, res) => {
      const result = await menuCollections.find().toArray();
      res.send(result);
    });

    // create get api for reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollections.find().toArray();
      res.send(result);
    });

    // create post api for cart
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollections.insertOne(cartItem);
      res.send(result);
    });

    // create get api for carts
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollections.find(query).toArray();
      res.send(result);
    });

    // create delete api for carts
    app.delete('/carts/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollections.deleteOne(query)
      res.send(result)
    })

    // create post api for user
    app.post('/users', async (req, res)=>{
      const user = req.body;
      const query = {email: user?.email}
      const existingUser = await userCollections.findOne(query)
      if(existingUser){
        return res.send({message: 'user already exist', insertedId: null})
      }
      const result = await userCollections.insertOne(user)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro server is sitting....");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
