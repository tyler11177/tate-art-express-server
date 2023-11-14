const ART_TABLE_DEFINITION = `CREATE TABLE art (
    id INTEGER PRIMARY KEY,
    accession_number VARCHAR(50),
    artist VARCHAR(255),
    artistRole VARCHAR(100),
    artistId INTEGER,
    title VARCHAR(500),
    dateText VARCHAR(255),
    medium VARCHAR(255),
    creditLine TEXT,
    year INTEGER,
    acquisitionYear INTEGER,
    dimensions VARCHAR(255),
    width INTEGER,
    height INTEGER,
    depth DECIMAL,
    units VARCHAR(100),
    inscription VARCHAR(255),
    thumbnailCopyright TEXT,
    thumbnailUrl VARCHAR(500),
    url VARCHAR(500))`;

const USER_TABLE_DEFINITION = `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER,
    location VARCHAR(255))`;

const COMMENT_TABLE_DEFINITION = `CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    artId INTEGER NOT NULL,
    name TEXT,
    userID INTEGER,
    content TEXT)`;

module.exports = {ART_TABLE_DEFINITION, USER_TABLE_DEFINITION,COMMENT_TABLE_DEFINITION };
