Overview

This is a simple nodejs and express application made to create 3 tables (art, users, & comments) into Postgres Database, load the Tate Modern Art data set into the art, and an express server to implement API endpoints 

Usage

This guide will assume you have a working postgres database, npm, nvm, and node installed on your machine and are familiar with those tools

1. Git Pull or otherwise download this repository to your machine
2. Run “nvm use 16.20.1”
3. Run “npm install” 
4. Edit the config.json file
    PG_CONFIG is passed directly to pg’s client constructor.  Customize this object to connect to your postgres server.  Learn more here: https://node-postgres.com/apis/client
    
    FILE_PATH_TO_TATE_CSV is the absolute path to the Tate CSV file on your machine.  If this is not changed in the config.json file, the applicaiton will assume the csv is in the app root directory. Note: this data is loaded into the postgres database using a copy command so the file must be accessible to your postgres database
    
    API_SERVER_PORT is the port you’d like the express server to run on

5. Optional: run “npm run load”
    This command will connect to your postgres server based on the configuration you define in the config.json, drop any existing art, users, or comments tables, create new based on the schema defined in the app, and copy the tate csv into the art table.  You may skip this step if those tables are already defined in your database. 
6. Run “npm run start” this will start the express server and connect to the database to implement the endpoints discussed below

Endpoints

GET /api/art
    Returns the id, title, artist, year fields and related comments from the entire art table

GET /api/art/:id
    Returns the id, title, artist, year fields and related comments from the specified art object

POST /api/art/ID/comments
    Creates a new comment for the specified art object.  Only one comment per unique name is allowed.  
    However, users with a valid userID can create as many comments as they’d like.  Accepted fields in json form, in request body
    ​​● userID: STRING - optional
    ● name: STRING - required if there no user ID is sent,
    ● content: STRING, required

POST /api/users
    Creates a new user.  Accepted fields in json form, in request body
    ● name: STRING, required
    ● age: INTEGER, required
    ● location: STRING, required

GET  /api/users
    Returns id, name, age, and location fields from entire users table
 							
						 					