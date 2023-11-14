/**
 * Class to interact with the comments table in the database
 */
class UserService {
  /**
  * @param client is a pg client that is used to run queries
  */
  constructor(client) {
    this.pgClient = client;
  }

  /**
  * create a user in the users table in the database
  * @param toBeCreated the new user to be made, similar to 
  * {
  *  "name" : "tyler",
  *  "location" : "sf"
  }
  */
  async create(toBeCreated) {
    const query = {
      text: `INSERT INTO users ( ${Object.keys(toBeCreated).join(",")} ) 
        VALUES ${this.constructValuesString(Object.keys(toBeCreated).length)}`,
      values: Object.values(toBeCreated)
    };
    const result = await this.pgClient.query(query);
    return result.rowCount; // Returns the number of rows affected
  }
  /**
  * gets the entire user table in the databse and formats in the following way
  * returns
  * [
  *  {
  *      "id": 1,
  *      "name": "tyler",
  *      "age": null,
  *      "location": "sf"
  *  },
  *]
  */
  async getAll() {
    const result = await this.pgClient.query(`SELECT id, name, age, location from users`);
    return result.rows;
  }

  /**
  * gets the row user table in the databse with the corresponding ID 
  * returns
  * [
  *  {
  *      "id": 1,
  *      "name": "tyler",
  *      "age": null,
  *      "location": "sf"
  *  }
  *]
  *@param id of the user to be fetched
  */
  async get(id) {
    const query = {
      text : `SELECT id, name, age, location from users where id = $1`,
      values : [id]
    }
    const result = await this.pgClient.query(`SELECT id, name, age, location from users`);
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

module.exports = UserService;
