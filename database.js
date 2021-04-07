const { Client } = require('pg')

async function getWatchList(finished = undefined) {
  const client = new Client()
  await client.connect()
  let query = "SELECT * FROM watchlist WHERE deleted = False"
  if (finished !== undefined) {
     query += " AND " + (finished ? "" : "NOT ") + "finished"
  }
  query += " ORDER BY updated_at DESC"
  const res = await client.query(query)
  const rows = res.rows
  client.end()
  return rows
}

async function getFinished() {
  const client = new Client()
  await client.connect()
  const res = await client.query("SELECT * FROM watchlist WHERE finished AND deleted = False ORDER BY updated_at DESC")
  const rows = res.rows
  client.end()
  return rows
}

async function addWatch(title, season = 0, episode = 0, finished = false) {
  const client = new Client()
  await client.connect()
  const res = await client.query(
    "INSERT INTO watchlist(title, season, episode, finished) VALUES($1, $2, $3, $4) RETURNING *",
    [title, season, episode, finished]
  )
  const rows = res.rows
  client.end()
  return rows
}

async function setFinished(id, finished = true) {
  const client = new Client()
  await client.connect()
  const res = await client.query(
    "UPDATE watchlist SET finished = $1 WHERE id = $2 RETURNING *",
    [finished, id]
  )
  const rows = res.rows
  client.end()
  return rows
}

async function setWatched(id, season, episode) {
  const client = new Client()
  await client.connect()
  const res = await client.query(
    "UPDATE watchlist SET season = $1, episode = $2 WHERE id = $3 RETURNING *",
    [season, episode, id]
  )
  const rows = res.rows
  client.end()
  return rows
}

async function createTable() {
  const client = new Client()
  await client.connect()
  await client.query(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`
  )
  await client.query(
    `CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      title varchar(255) NOT NULL,
      season integer NOT NULL DEFAULT 1,
      episode integer NOT NULL DEFAULT 0,
      finished boolean NOT NULL DEFAULT False,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted boolean NOT NULL DEFAULT False
    )`
  )
  await client.query(`
    DROP TRIGGER IF EXISTS set_timestamp ON watchlist;
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON watchlist
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();`
  )
}

async function getWatch(id) {
  const client = new Client()
  await client.connect()
  const res = await client.query("SELECT * FROM watchlist WHERE id = $1", [id])
  const rows = res.rows
  client.end()
  return rows.length > 0 ? rows[0] : undefined
}

module.exports = { getWatchList, getFinished, addWatch, setFinished, setWatched, createTable, getWatch }
