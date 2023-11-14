/**
 * Class to interact with the comments table in the database
 */
class CommentService {
  
  /**
  * @param client is a pg client that is used to run queries
  */
  constructor(client) {
    this.pgClient = client;
  }

  /**
  * creates a row in the comments database
  * @param toBeCreated object that should be inserted into database, similar to
  * {
  * "content" : "mycontent",
  *  "name" : "tyler4",
  *  "userID" : 2
  *  }
  */
  async create(toBeCreated) {
    const query = {
      text: `INSERT INTO comments ( ${Object.keys(toBeCreated).join(",")} ) 
        VALUES ${this.constructValuesString(Object.keys(toBeCreated).length)}`,
      values: Object.values(toBeCreated)
    };
    const result = await this.pgClient.query(query);
    return result.rowCount;
  }
  
  /**
   * function to check for existing comments for a given artId and name
  * @param artId id of the art object to check
  * @param name name of the commentor to look for
  */
  async getCommentsByArtIdAndName(artId, name) {
    const query = {
      text: 'SELECT * FROM comments WHERE artId = $1 and name = $2',
      values: [artId, name],
    };
    const result = await this.pgClient.query(query);
    return result.rows;
  }

  /**
   * utility function to create the values string for a given length
   * @param length of the string to be created
   * @returns a string like ($1,$2,$3) for a param of 3
  */
  constructValuesString(length) {
    let toReturnString = '(';
    for (let i = 1; i <= length; i++) {
      toReturnString += `$${i},`
    }
    return toReturnString.replace(/.$/, ")"); //replace last comma with )
  }
}

module.exports = CommentService;
