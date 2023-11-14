const express = require('express');
const bodyParser = require('body-parser');
const { UserService, ArtService, CommentService } = require('./services/index.js');
const CONFIG = require('./config.json');
const { Client } = require('pg');


const app = express();
const client = new Client(CONFIG.PG_CONFIG);

let userService;
let artService;
let commentService;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * GET art endpoint
 * On success, returns the entire art database with associcated comments
 */
app.get('/api/art', async (req, res) => {
    try {
        console.log(`Got get all art request`);
        let result = await artService.getAllWithComments();
        return res.status(200).json(result);
    } catch (error) {
        console.log(`Error getting all art ${error}`);
        res.status(500).json({error : error.message});
    }
});

/**
 * GET art endpoint
 * On success, returns the requested art object with associcated comments
 */
app.get('/api/art/:id', async (req, res) => {
    if(!req.params?.id) {
        return res.status(404).json({error : "id is not provided in request path"});
    }
    try {
        console.log(`Got get art ID request`);
        const artId = req.params.id;
        let result = await artService.getWithComments(artId);
        if(result.id) {
            return res.status(200).json(result);
        }
        return res.status(404).json({error : "not found"});
    } catch (error) {
        console.log(`Error getting art by ID ${error}`);
        res.status(500).json({error : error.message});
    }
});


/**
 * POST comment endpoint
 * Checks for userID and if present validates and then creates comment
 * If userID is not present, only one comment per name is allowed
 * On success, creates and returns the created comment
 */
app.post('/api/art/:artId/comments', async (req, res) => {
    try {
        console.log(`Got create comment request`);
        const body = req.body;
        if (!body.content) {
            return res.status(400).json({ error: `content is required` });
        }
        else if (!body.userID && !body.name) {
            return res.status(400).json({ error: `userId or name is required` });
        }
        let artId = req.params.artId;
        body.artId = req.params.artId;
        if(body.userID) { //if the userID is present and valid the user can create as many comments as they want
            let users = await userService.get(body.userID);
            if(users.length > 0) {
                let createResponse = await commentService.create(body);
                return res.status(200).json(body);
            }
            else {
                return res.status(400).json({error: "userId is not valid"});
            }

        }
        else { //if the userID is not present only one comment per name is allowed
            let currentComments = await commentService.getCommentsByArtIdAndName(artId, body.name);
            if(currentComments.length > 0) {
                return res.status(400).json({ error: "comment with this name exists already" }); 
            }
            else {
                let createResponse = await commentService.create(body);
                return res.status(200).json(body); 
            }
        }
    } catch (error) {
        console.log(`Error creating new comment ${error}`);
        res.status(500).json({error : error.message});
    }
});

/**
 * GET users endpoint
 * On success, creates and returns the created comment
 */
app.get('/api/users', async (req, res) => {
    try {
        console.log(`Got get users request`);
        const result = await userService.getAll();
        res.status(200).json(result);
    } catch (error) {
        console.log(`Error getting users ${error}`);
        res.status(500).json({error : error.message});
    }
});

/**
 * POST user endpoint
 * On success, creates and returns the created user
 */
app.post('/api/users', async (req, res) => {
    try {
        console.log(`Got create user request`);
        const body = req.body;
        if (!body.name) {
            return res.status(400).json({ error: `name is required` });
        }
        else if (!body.location) {
            return res.status(400).json({ error: `location is required` });
        }
        const result = await userService.create(body);
        res.status(200).json(body); //since postgres doens't return a newly created row and to avoid unnecessary DB trips, we return the request body
    } catch (error) {
        console.log(`Error creating new user ${error}`);
        res.status(500).json({error : error.message});
    }
});

/**
 * This is a function to connect the PQ client to the database and
 * inject that PQ client into the services so they can share one client
 */
async function initializeConnection() {
    await client.connect();
    userService = new UserService(client);
    artService = new ArtService(client);
    commentService = new CommentService(client);
}

initializeConnection();

app.listen(CONFIG.API_SERVER_PORT, () => {
    console.log(`Server running on port ${CONFIG.API_SERVER_PORT}`);
});
