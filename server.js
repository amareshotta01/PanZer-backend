import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
connectDB();

// Define a Mongoose schema and model
const passwordSchema = new mongoose.Schema({
    // Define the schema fields here
    // Example: 
    site: String,
    username: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Password = mongoose.model('Password', passwordSchema);

// App & Database
const dbName = process.env.DB_NAME;
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const passwords = await Password.find({});
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching passwords' });
    }
});

// Save a password
app.post('/', async (req, res) => { 
    try {
        const password = new Password(req.body);
        const savedPassword = await password.save();
        res.send({ success: true, result: savedPassword });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the password' });
    }
});

// Delete a password by id
app.delete('/', async (req, res) => { 
    try {
        const { id } = req.body;
        const result = await Password.findByIdAndDelete(id);
        res.send({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the password' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
});
















// const express = require('express');
// const dotenv = require('dotenv');
// // const { MongoClient } = require('mongodb');
// const mongoose = require('mongoose'); 
// const bodyparser = require('body-parser')
// const cors = require('cors')

// dotenv.config()


// // Connecting to the MongoDB Client
// const url = process.env.MONGO_URI;
// // const client = new MongoClient(url);
// // client.connect();

// const connectDB = () => {
//     mongoose.connect(url);
// }
// connectDB();

// // App & Database
// const dbName = process.env.DB_NAME 
// const app = express()
// const port = 3000 

// // Middleware
// app.use(bodyparser.json())
// app.use(express.json());
// app.use(cors())


// // Get all the passwords
// app.get('/', async (req, res) => {
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.find({}).toArray();
//     res.json(findResult)
// })

// // Save a password
// app.post('/', async (req, res) => { 
//     const password = req.body
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.insertOne(password);
//     res.send({success: true, result: findResult})
// })

// // Delete a password by id
// app.delete('/', async (req, res) => { 
//     const password = req.body
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.deleteOne(password);
//     res.send({success: true, result: findResult})
// })


// app.listen(port, () => {
//     console.log(`Example app listening on  http://localhost:${port}`)
// })