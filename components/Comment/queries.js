const Q = {
  GET_COMMENTS: `SELECT * FROM Comments 
    WHERE post_id = $1 
    ORDER BY created_on`,
  CREATE_COMMENT: `
    INSERT INTO Comments (post_id, comment, created_on, author_nick) 
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
  GET_COMMENT_BY_ID: `SELECT * FROM Comments WHERE id = $1`,
  DELETE_COMMENT_BY_ID: `DELETE FROM Comments WHERE id = $1`,
};

export default Q;
