const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  
  try {
    const { rows: [user] } = client.query(`
      INSERT INTO users(username, password)
      VALUES($1,$2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `,[username, hashedPassword])

    return user;
  } catch (err) {
    throw err;
  }

}

async function getUser({ username, password }) {
  // const user = await getUserByUsername(username);
  // const hashedPassword = user.password;

  // const isValid = await bcrypt.compare(password, hashedPassword);
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
