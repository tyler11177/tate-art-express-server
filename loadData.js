const { Client } = require('pg');
const CONFIG = require('./config.json');
const { ART_TABLE_DEFINITION, USER_TABLE_DEFINITION, COMMENT_TABLE_DEFINITION } = require('./tableDefinitions');

/**
 * create new tables according to schema in tableDefinitions file
 */
async function createTables(client) {
    console.log("Creating tables");
    await client.query(ART_TABLE_DEFINITION);
    await client.query(USER_TABLE_DEFINITION);
    await client.query(COMMENT_TABLE_DEFINITION);
    console.log("Sucessfully created tables");
}

/**
 * drop existing tables
 */
async function deleteTables(client) {
    console.log("Deleting tables");
    await client.query(`DROP TABLE IF EXISTS users;`);
    await client.query(`DROP TABLE IF EXISTS art;`);
    await client.query(`DROP TABLE IF EXISTS comments;`);
    console.log("Sucessfully deleted tables");
}

/**
 * copy csv data into art table
 */
async function copyIntoArtTable(client) {
    //if the path has been updated in config file take that path.  Else assume the csv is in the application root directory. 
    const filePath = CONFIG.FILE_PATH_TO_TATE_CSV == "UPDATE WITH YOUR PATH" ? `${__dirname}/the-tate-collection.csv` : CONFIG.FILE_PATH_TO_TATE_CSV;
    const copyQuery = `COPY art(id,accession_number,artist,artistRole,artistId,title,dateText,medium,creditLine,year,acquisitionYear,dimensions,width,height,depth,units,inscription,thumbnailCopyright,thumbnailUrl,url)
                FROM '${filePath}' DELIMITER ';' CSV HEADER;`;
    await client.query(copyQuery);
    const countResult = await client.query(`SELECT COUNT(id) from art`);
    console.log(`There are ${countResult.rows[0].count} rows in the art table`);
}

/**
 * driver function to delete old tables, create new, and load csv into art table
 */
async function driveLoadData() {
    const client = new Client(CONFIG.PG_CONFIG);
    try {
        console.log("Starting load data");
        await client.connect();
        await deleteTables(client);
        await createTables(client);
        await copyIntoArtTable(client);
        await client.end();
    }
    catch (error) {
        console.log(`Error importing data into database ${error}`);
        client.end();
    }
}

driveLoadData();
