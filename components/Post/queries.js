const Q = {
  GET_POST_BY_ID: `SELECT * FROM Posts WHERE id = $1`,
  GET_LIKES_COUNT: `SELECT COUNT(*) FROM Likes WHERE post_id = $1`,
  GET_IS_LIKED: `SELECT * FROM Likes WHERE post_id = $1 AND nick = $2`,
  GET_POSTS_BY_NICK: `
    SELECT id FROM Posts 
    WHERE author_nick = $1 
    ORDER BY created_on`,
  CREATE_POST: `
    INSERT INTO Posts (location, description, tags, created_on, author_nick) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id`,
  UPDATE_POST_BY_ID: `UPDATE Posts 
    SET description = $1, tags = $2 
    WHERE id = $3 
    RETURNING *`,
  DELETE_POST_BY_ID: "DELETE FROM Posts WHERE id = $1",
  LIKE: "INSERT INTO Likes (post_id, nick) VALUES ($1, $2)",
  UNLIKE: "DELETE FROM Likes WHERE post_id = $1 AND nick = $2",
  SEARCH: `SELECT id FROM Posts 
    WHERE location ~ $1 OR description ~ $1 OR tags ~ $2`,
};

export default Q;
