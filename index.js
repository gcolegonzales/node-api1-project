const db = require('./data/db');
const express = require('express');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
        db.find()
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            res.status(500).json({ 'error': 'The users could not be retrieved.' })
        })
})

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then((user) => {
        if(!user) {
            res.status(404).json({ error: 'That user does not exist.' })
        } else {
            res.status(200).json(user)
        }
    })
    .catch((err) => {
        res.status(404).json({ 'error': 'The user with the specified ID does not exist.' })
    })
})

server.post('/api/users', (req, res) => {
    console.log(req.body);
    if(req.body.name && req.body.bio) {
    db.insert(req.body)
        .then((user) => {
            res.status(201).json(user)
        })
        .catch((err) => {
            res.status(500).json({ 'error': 'Bad request.' })
        })
    } else if (!req.body.name || !req.body.bio) {
        res.status(400).json({ 'error': 'User must have a username and bio.' })
    }
})

server.delete('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then((user) => {
        if (!user) {
            res.status(404).json({ error: 'No user found matching this ID.' })
        } else {
            db.remove(req.params.id)
            .then((response) => {
                res.status(201).json(response);
            })
            .catch((err) => {
                res.status(500).json({ error: "The user could not be deleted." })
            })
        }
    })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.find(id)
    .then((user) => {
        if(!user) {
            res.status(404).json({ message: 'No user found matching this ID.' })
        } else {
            db.update(id, req.body)
            if(!req.body.name || !req.body.bio) {
                res.status(400).json({ error: 'Please provide a name AND bio for the user.' })
            } else {
                db.update(id, req.body)
                .then((update) => {
                    res.status(200).json(update)
                })
                .catch((err) => {
                    res.status(500).json({ message: 'The user info could not be modified.' })
                })
            }
        }
    })
})

server.use('/', (req, res) => {
    res.json({ 
        message: "Hello world!",
        port: process.env.PORT
    })
})

const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 8000

server.listen(7000, () => console.log(`Server is listening on port ${port}...`));