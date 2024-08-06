//due to only needing two schemas I've put them in the same file, otherwise would have separate files.

export const projectSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "date"],
    properties: {
      name: {
        bsonType: "string",
        description: "must be a string and is required",
        minLength: 3,
      },
      date: {
        //needs to be an object that has a start and due property
        bsonType: "object",
        required: ["start", "due"],
        properties: {
          start: {
            bsonType: "date",
            description: "must be a date and is required",
          },
          due: {
            bsonType: "date",
            description: "must be a date and is required",
          },
        },
      },
    },
  },
};

// I wasn't sure if there should be another status called "In progress", as without it, it's difficult to determine a "start" date for a task.
// I would have included it, however I've left it out as per specification, and resetting the task from done to "to do" will set the date to whenever it was reset. (and remove the "done" date)
export const taskSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "status", "projectID"],
    properties: {
      name: {
        bsonType: "string",
        description: "must be a string and is required",
        minLength: 3,
      },
      status: {
        bsonType: "string",
        enum: ["To do", "Done"],
        description: "must be a valid status and is required",
      },
      date: {
        bsonType: "object",
        required: ["start", "due"],
        properties: {
          start: {
            bsonType: "date",
            description: "must be a date and is required",
          },
          due: {
            bsonType: "date",
            description: "must be a date and is required",
          },
          done: {
            oneOf: [{ bsonType: "date" }, { bsonType: "null" }],
            description: "must be a date and is required",
          },
        },
      },
      projectId: {
        bsonType: "objectId",
        description: "must be a objectId and is required",
      },
    },
  },
};
