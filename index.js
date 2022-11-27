const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const productsCollection = client.db('bbookss').collection('Products');

        //products
        app.put('/myProducts/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    advertise: 'advertise' 
                }
            }
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/myProducts/:advertise', async (req, res) => {
            const advertise = req.params.advertise;
            const query = { advertise }
            const books = await productsCollection.find(query).toArray();
            res.send(books);
        })
        app.get('/myProducts/:email', async (req, res) => {
            const email = req.params.email;
            const query = { sellerEmail:email}
            const books = await productsCollection.find(query).toArray();
            res.send(books);
        })
        
        app.post('/addproducts', async (req, res) => {
            const book = req.body;
            const result = await productsCollection.insertOne(book);
            res.send(result);

        })
        app.delete(`/products/delete/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
        
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

        app.get('/allusers/:userType', async (req, res) => {
            const userType = req.params.userType;
            const query = { userType }
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        app.delete('/allusers/delete/:id', async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await usersCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/allusers/makeadmin/:id', async (req,res)=>{
            const id=req.params.id;
            const filter={_id:ObjectId(id)};
            const options={upsert:true};
            const updateDoc={
                $set:{
                    userType:'admin'
                }
            }
            const result=await usersCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        })
        app.put('/allusers/verify/:id', async (req,res)=>{
            const id=req.params.id;
            const filter={_id:ObjectId(id)};
            const options={upsert:true};
            const updateDoc={
                $set:{
                    status:'Verified'
                }
            }
            const result=await usersCollection.updateOne(filter,updateDoc,options);
            res.send(result);
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
