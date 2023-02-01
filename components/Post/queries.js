const Q = {
  GET_POST_BY_ID: `SELECT * FROM Posts WHERE id = $1`,
  GET_LIKES_COUNT: `SELECT COUNT(*) FROM Likes WHERE post_id = $1`,
  GET_IS_LIKED: `SELECT * FROM Likes WHERE post_id = $1 AND nick = $2`,
  CREATE_POST: `
    INSERT INTO Posts (description, tags, created_on, author_nick) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id`,
  UPDATE_POST_BY_ID: `UPDATE Posts 
    SET description = $1, tags = $2 
    WHERE id = $3 
    RETURNING *`,
  DELETE_POST_BY_ID: "DELETE FROM Posts WHERE id = $1",
  LIKE: "INSERT INTO Likes (post_id, nick) VALUES ($1, $2)",
  UNLIKE: "DELETE FROM Likes WHERE post_id = $1 AND nick = $2",
  SEARCH: `SELECT id, author_nick FROM Posts WHERE tags ~ $1 OR $1 = ''`,
};

export default Q;
