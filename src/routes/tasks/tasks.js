import express from "express";
import dbConnector from "../../util/dbConnector.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// get tasks

router.get("/", async (req, res, next) => {
  try {
    const { tasks, projects } = await dbConnector(["tasks", "projects"]);
    let query = {};

    //find task by project name
    if (req.query["projectName"]) {
      const project = await projects.findOne({
        name: req.query["projectName"],
      });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      query.projectID = project._id;
    }

    // find by name / status
    if (req.query["name"]) {
      query.name = { $regex: req.query["name"], $options: "i" };
    }
    if (req.query["status"]) {
      query.status = req.query["status"];
    }

    // sort queries
    let sort = {};
    if (req.query["startDateSortBy"]) {
      sort["date.start"] = req.query["startDateSortBy"] === "asc" ? 1 : -1;
    } else if (req.query["dueDateSortBy"]) {
      sort["date.due"] = req.query["dueDateSortBy"] === "asc" ? 1 : -1;
    } else if (req.query["doneDateSortBy"]) {
      sort["date.done"] = req.query["doneDateSortBy"] === "asc" ? 1 : -1;
    }

    const foundItems = await tasks.find(query).sort(sort).toArray();
    return res.status(200).json(foundItems);
  } catch (e) {
    next(e);
  }
});

// post tasks
router.post("/", async (req, res, next) => {
  try {
    const { tasks, projects } = await dbConnector(["tasks", "projects"]);

    //check all required fields are present
    const requiredFields = ["name", "status", "dueDate", "projectName"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // check if project exists
    const project = await projects.findOne({ name: req.body["projectName"] });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // done date is optional, as it can just be filled with the current date if status is done
    const { name, status, dueDate, doneDate } = req.body;

    // In a full project I would avoid hardcoding "Done", as the name might change - It's unlikely given this scope. However, this could be improved with
    // an env / config file to store these values or a lookup table in the database.

    if (!Date.parse(dueDate)) {
      return res.status(400).json({ message: "Invalid due date" });
    }
    const dateNow = new Date();
    const date = {
      start: dateNow,
      due: new Date(dueDate),
      done: doneDate || status === "Done" ? dateNow : null,
    };

    const newTask = {
      name,
      status,
      projectID: new ObjectId(project._id),
      date,
    };
    const result = await tasks.insertOne(newTask);
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
