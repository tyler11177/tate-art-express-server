/**
 * Class to interact with the art table in the database
 */
class ArtService {
  /**
  * @param client is a pg client that is used to run queries
  */
  constructor(client) {
    this.pgClient = client;
  }

  /**
  * gets the entire art table in the databse and formats in the following way
  * [{
    id: 10000,
    title: “Poppies”, artist: “Monet”, year: 1873, comments: []
  }]
  */
  async getAllWithComments() {
    const result = await this.pgClient.query(`SELECT art.id, title, artist, year, 
                                                comments.id as commentID, comments.name, comments.content, 
                                                comments.userID FROM art 
                                                LEFT JOIN comments ON art.id = comments.artID`);
    let toReturn = {};
    for (let row of result.rows) {
      if (toReturn[row.id] && row.commentid) {
        toReturn[row.id].comments.push({
          id: row.commentid,
          content: row.commentid,
          userID: row.userid,
          name: row.name
        });
      }
      else {
        let newArtObj = {
          id: row.id,
          title: row.title,
          artist: row.artist,
          year: row.year,
          comments: []
        }
        if (row.commentid) {
          newArtObj.comments.push({
            id: row.commentid,
            content: row.commentid,
            userID: row.userid,
            name: row.name
          });
        }
        toReturn[row.id] = newArtObj;
      }
    }
    return Object.values(toReturn);
  }
  
  /**
  * get the art object in the database with the corresponding ID and formats in the following way
  * {
    id: 10000,
    title: “Poppies”, artist: “Monet”, year: 1873, comments: []
  }
  * @param id of the art object that should be retrieved
  */
  async getWithComments(id) {
    const query = {
      text: `SELECT art.id, title, artist, year, comments.id as commentID, comments.name, comments.content, comments.userID
          FROM art
          LEFT JOIN comments ON art.id = comments.artID
          WHERE art.id = $1`,
      values: [id]
    }
    const result = await this.pgClient.query(query);
    if (result.rows.length > 0) {
      let toReturn = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        artist: result.rows[0].artist,
        year: result.rows[0].year,
        comments: []
      };
      for (let row of result.rows) {
        if (row.commentid) {
          toReturn.comments.push({
            id: row.commentid,
            content: row.commentid,
            userID: row.userid,
            name: row.name
          });
        }
      }
      return toReturn;
    }
    return {};
  }
}

module.exports = ArtService;
