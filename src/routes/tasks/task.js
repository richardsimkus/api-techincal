import express from "express";
import dbConnector from "../../util/dbConnector.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//get task
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { tasks } = await dbConnector(["tasks"]);
    const foundItem = await tasks.findOne({ _id: new ObjectId(id) });
    return res.status(200).json(foundItem);
  } catch (e) {
    next(e);
  }
});

// patch task
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { tasks, projects } = await dbConnector(["tasks", "projects"]);
    const project = await projects.findOne({ name: req.body["projectName"] });
    // check if project exists
    if (req.body["projectName"] && !project) {
      return res.status(404).json({ message: "Project not found" });
    }
    //check the due date is valid if there is one to update
    if (req.body["dueDate"] && !Date.parse(req.body["dueDate"])) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    //check the task exists
    const existingTask = await tasks.findOne({ _id: new ObjectId(id) });
    if (!existingTask) {
      return res.status(404).send("Task not found");
    }

    // Initialize changes object
    const changes = {
      date: {
        start: existingTask["date"]["start"],
        due: existingTask["date"]["due"],
        done: existingTask["date"]["done"],
      },
    };

    // Loop over the body and if the existing task info isn't the same already, add it to the changes object.
    Object.keys(req.body).forEach((key) => {
      if (existingTask[key] !== req.body[key]) {
        if (key === "projectName" && project) {
          changes["projectID"] = new ObjectId(project._id);
        } else if (key === "dueDate") {
          changes.date["due"] = new Date(req.body[key]);
        } else if (key in existingTask) {
          changes[key] = req.body[key];
        }
      }
    });

    // If the new status is "To do" update startDate and doneDate
    if (changes.status === "To do") {
      changes.date.start = new Date();
      changes.date.done = null;
    } // complete done Date if done
    if (changes.status === "Done") {
      changes.date.done = new Date();
    }

    const result = await tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: changes },
    );
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const id = req.body["id"];
    const { tasks } = await dbConnector(["tasks"]);
    const deletedItem = await tasks.findOneAndDelete({ _id: new ObjectId(id) });
    return res.status(200).json(deletedItem);
  } catch (e) {
    next(e);
  }
});

export default router;
