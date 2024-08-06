import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// basic db connector, this would otherwise reference a .env file with auth keys etc.
/**
 * Connects to the MongoDB database and returns a collection.
 *  * @param {Array<'tasks' | 'projects' >} collection - The name of collection to connect to.
 */
const dbConnector = async (collections) => {
  try {
    if (!client) {
      await client.connect();
    }
    const foundCollections = {
      client,
    };
    if (!collections) {
      return foundCollections;
    }
    for (const collection of collections) {
      foundCollections[collection] = await client
        .db("toDoList")
        .collection(collection);
    }
    return foundCollections;
  } catch (e) {
    console.error(e);
  }
};

export default dbConnector;
