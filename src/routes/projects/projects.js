import express from "express";
import dbConnector from "../../util/dbConnector.js";

const router = express.Router();

// get projects
router.get("/", async (req, res, next) => {
  try {
    const { projects } = await dbConnector(["projects"]);
    let query = {};

    // find by name / status
    if (req.query["name"]) {
      query.name = { $regex: req.query["name"], $options: "i" };
    }

    // sort queries
    let sort = {};
    if (req.query["startDateSortBy"]) {
      sort["date.start"] = req.query["startDateSortBy"] === "asc" ? 1 : -1;
    } else if (req.query["dueDateSortBy"]) {
      sort["date.due"] = req.query["dueDateSortBy"] === "asc" ? 1 : -1;
    }

    const foundItems = await projects.find(query).sort(sort).toArray();
    return res.status(200).json(foundItems);
  } catch (e) {
    next(e);
  }
});

// post project
router.post("/", async (req, res, next) => {
  try {
    const { projects } = await dbConnector(["projects"]);

    //check all required fields are present
    const requiredFields = ["name", "dueDate"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // check if project exists
    const project = await projects.findOne({
      name: req.body["name"],
    });
    if (project) {
      return res.status(400).json({
        message: `Project already exists with this name: ID:${project._id}`,
      });
    }

    const { name, dueDate } = req.body;

    if (!Date.parse(dueDate)) {
      return res.status(400).json({ message: "Invalid due date" });
    }
    const dateNow = new Date();
    const date = {
      start: dateNow,
      due: new Date(dueDate),
    };

    const newProject = {
      name,
      date,
    };
    const result = await projects.insertOne(newProject);
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
