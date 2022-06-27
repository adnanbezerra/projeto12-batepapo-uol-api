import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config()
import joi from 'joi';
import dayjs from 'dayjs';
dayjs().format()

// Backend server basic configs
const server = express();
server.use(cors());
server.use(express.json());

// Database connection basic configs
const mongoClient = new MongoClient(process.env.MONGO_CONNECTION);
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("batepapo_uol")
})

// Validation schema
const loginSchema = joi.object({
    name: joi.string().required()
});

server.post('/participants', async (request, response) => {

    const newUser = request.body;

    if (await validateUsername(newUser)) {
        response.sendStatus(422);
        return;
    }

    if (await validateNewname(newUser)) {
        response.sendStatus(409);
        return;
    }

    createNewUser(request.body);
    response.sendStatus(201);
})

function createNewUser(newUserName) {
    let now = dayjs();

    const newUser = {
        name: newUserName,
        lastStatus: Date.now()
    }

    const loginMessage = {
        from: newUserName,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: now.format("HH:mm:ss")
    }

    db.collection('loggedUsers').insertOne(newUser)
    db.collection('messages').insertOne(loginMessage)
}

function validateUsername(name) {
    const validate = loginSchema.validate(name, { abortEarly: true });

    if (validate.error) return true;
    return false;
}

async function validateNewname(username) {
    try {
        const loggedName = await db.collection('loggedUsers').findOne({ name: username });
        if (loggedName) return true;
        return false;
    } catch (error) {
        console.log("Por que, meu Deus?")
    }
}

server.get('/participants', async (request, response) => {
    await db.collection('loggedUsers').find().toArray().then(users => {
        response.send(users)
    })
})

server.post('/messages', (request, response) => {

})

server.get('/messages', (request, response) => {

})

server.post('/status', (request, response) => {

})


server.listen(5000);
const anotacoes = '48 de alexsandro, 100 de André, 53 de Renata, pagar água e a Caixa'