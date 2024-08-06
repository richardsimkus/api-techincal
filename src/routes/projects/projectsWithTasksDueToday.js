import express from "express";
import dbConnector from "../../util/dbConnector.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { projects } = await dbConnector(["projects"]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const data = [
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "projectID",
        as: "tasks",
      },
    },
    {
      $match: {
        "tasks.date.due": {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        "date.start": 1,
        "date.due": 1,
        tasksCount: { $size: "$tasks" },
        taskIDs: "$tasks._id",
      },
    },
  ];
  try {
    const result = await projects.aggregate(data).toArray();
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
