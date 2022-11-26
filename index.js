const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port=process.env.PORT || 5000;
const app=express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_password}@cluster0.vgokw2y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoriesCollection = client.db('bbookss').collection('categories');
        const usersCollection = client.db('bbookss').collection('users');
        
        // categories
        app.get('/categories', async(req,res)=>{
            const query={};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        })

        // users
        app.post('/users', async(req,res)=>{
            const userInfo=req.body;
            const result=await usersCollection.insertOne(userInfo);
            res.send(result);

        })
        app.get('/users/:email', async(req,res)=>{
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })
    }
    finally{

    }
}
run().catch(console.log);

app.get('/',(req,res)=>{
    res.send('bbookss server is running');
})

app.listen(port,()=>console.log(`bbookss server running on port: ${port}`))
