import dbConnector from "../util/dbConnector.js";
import { projectSchema, taskSchema } from "./schemas/index.js";

const seedDB = async () => {
  const { client } = await dbConnector();
  try {
    const db = client.db("toDoList");
    const projectCollection = await db.createCollection("projects", {
      validator: projectSchema,
      validationLevel: "strict",
    });

    const taskCollection = await db.createCollection("tasks", {
      validator: taskSchema,
      validationLevel: "strict",
    });
    await taskCollection.createIndex({ projectID: 1 }); //create index on project ID for faster queries as this will be used to find tasks by project
    await projectCollection.createIndex({ name: 1 }, { unique: true }); // create index on name and make unique to prevent duplicate project names
    const date = new Date();
    const projectA = await db.collection("projects").insertOne({
      name: "Project A",
      date: {
        start: date,
        due: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });
    const projectB = await db.collection("projects").insertOne({
      name: "Project B",
      date: {
        start: new Date(date.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        due: new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
    });

    await db.collection("tasks").insertMany([
      {
        name: "Task 1",
        status: "Done",
        projectID: projectB.insertedId,
        date: {
          //make start date 1 day ago
          start: new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          due: new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          done: new Date(), // now
        },
      },
      {
        name: "Task 2",
        status: "To do",
        projectID: projectA.insertedId,
        date: {
          start: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          due: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          done: null,
        },
      },
      {
        name: "Task 3",
        status: "To do",
        projectID: projectB.insertedId,
        date: {
          start: new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          due: new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          done: null,
        },
      },
      {
        name: "Task 4",
        status: "To do",
        projectID: projectB.insertedId,
        date: {
          start: new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          due: new Date(), // now
          done: null,
        },
      },
    ]);
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
};

seedDB();
