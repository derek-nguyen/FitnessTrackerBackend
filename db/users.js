const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  
  // const hashedPassword = //need to add hash function here
  
  // try {
  //   const { rows: [user] } = client.query(`
  //     INSERT INTO users(username, password)
  //     VALUES($1,$2)
  //     ON CONFLICT (username) DO NOTHING
  //     RETURNING *;
  //   `,[username, hashedPassword])
  // } catch (err) {
  //   throw err;
  // }
}

async function getUser({ username, password }) {

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
