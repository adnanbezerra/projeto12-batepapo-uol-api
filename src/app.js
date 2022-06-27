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

// New user validation schema
const loginSchema = joi.object({
    name: joi.string().required()
});

// New message validation schema
const messageSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.any().valid('message', 'private_message')
})

const fromSchema = joi.object({

})

server.post('/participants', async (request, response) => {

    const newUser = request.body;

    if (validateUsername(newUser)) {
        response.sendStatus(422);
        return;
    }

    if (await validateNewname(newUser)) {
        response.sendStatus(409);
        return;
    }

    createNewUser(request.body.name);
    response.sendStatus(201);
})

function createNewUser(newUserName) {
    let now = dayjs();

    const newUser = {
        name: newUserName.name,
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
    try {
        const users = await db.collection('loggedUsers').find()
        response.send(users)
        
    } catch (error) {
        console.error(error)
    }
})

server.post('/messages', async (request, response) => {

    try {
        if (validateMessage(request.body)) {
            response.sendStatus(422);
            return;
        }

        if (await validateMessageSender(request.header.user)) {
            response.sendStatus(422);
            return;
        }

        const newMessage = {
            from: request.headers.user,
            to: request.body.to,
            text: request.body.text,
            type: request.body.type,
            time: dayjs().format('HH:mm:ss')
        }

        await db.collection('messages').insertOne(newMessage);
        response.sendStatus(201);

    } catch (error) {
        console.error(error)
    }
})

async function validateMessageSender(user) {
    try {

        const check = await db.collection('loggedUsers').find({ name: user })
        if (check) return false;
        return true;

    } catch (error) {
        console.error(error)
    }
}

function validateMessage(message) {
    const validate = messageSchema.validate(message, { abortEarly: true });

    if (validate.error) return true;
    return false;
}

// Falta verificar o usuário
server.get('/messages', async (request, response) => {
    try {
        const limit = request.query.limit;

        const messagesList = await db.collection('messages').find().toArray();

        if (limit) {
            messagesList.slice(0, limit - 1);
        }

        response.status(200).send(messagesList);
    } catch (error) {
        console.error(error)
    }
})

server.post('/status', (request, response) => {
    if ('oi') response.sendStatus(404)
    else response.sendStatus(200)
})

server.listen(5000);