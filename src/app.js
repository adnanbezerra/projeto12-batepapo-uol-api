import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config()
import joi from 'joi';
import dayjs from 'dayjs';

// Backend server basic configs
const server = express();
server.use(cors());
server.use(express.json());

// Database connection basic configs
const mongoClient = new MongoClient(process.env.MONGO_CONNECTION);
let db;
mongoClient.connect().then( () => {
    db = mongoClient.db("batepapo_uol")
})

const loginSchema = joi.object({
    name: joi.string().required()
});

server.post('/participants', (request, response) => {

})

server.get('/participants', (request, response) => {

})

server.post('/messages', (request, response) => {

})

server.get('/messages', (request, response) => {

})

server.post('/status', (request, response) => {

})


server.listen(5000);
const anotacoes = '48 de alexsandro, 100 de André, 53 de Renata, pagar água e a Caixa'