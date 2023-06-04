/* 
If your module.exports from each of the other files is built as an object with 
keys equal to the function names, then when you require the file, we can use the 
spread operator (...) to both import and help build our export function simultaneously.

Then we can just import into our server/API using require('./db'), etc, rather than 
importing from the separate files.

*/

module.exports = {
  // ...require('./client'), // adds key/values from users.js
  ...require('./users'), // adds key/values from users.js
  ...require('./activities'), // adds key/values from activites.js
  ...require('./routines'), // etc
  ...require('./routine_activities') // etc
}