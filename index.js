const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

//blankzihad
//FB4F1zlEUVSIMVp6

const uri =
  "mongodb+srv://blankzihad:FB4F1zlEUVSIMVp6@cluster0.hu9qazf.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("usersDB").collection("users");
    // const database = client.db("userDB");
    // const haiku = database.collection("haiku");

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("please this user", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      console.log(id, updateUser);
      
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const userUpdate = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        userUpdate,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple CRUD server is running");
});
app.listen(port, () => {
  console.log(`Simple CRUD is running on port : ${port}`);
});
