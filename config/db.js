import pg from "pg";

const pool = new pg.Pool({
  user: "tjmzrdts",
  password: "4PeMCGDVyzKQim8i4cqzTy_RqoOaJ3fJ",
  host: "snuffleupagus.db.elephantsql.com",
  database: "tjmzrdts",
});

export const runPoolQuery = async (query, args = [], singleValue = true) => {
  try {
    const response = await pool.query(query, args);

    if (singleValue) {
      return response.rows.length ? response.rows[0] : null;
    }

    return response.rows;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default pool;
