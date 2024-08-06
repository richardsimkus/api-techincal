import "dotenv/config";
import express from "express";
import indexRouter from "./src/routes/index.js";
import tasksRouter from "./src/routes/tasks/tasks.js";
import taskRouter from "./src/routes/tasks/task.js";
import projectsRouter from "./src/routes/projects/projects.js";
import projectRouter from "./src/routes/projects/project.js";
import projectsWithTasksDueTodayRouter from "./src/routes/projects/projectsWithTasksDueToday.js";
import tasksWithProjectsDueToday from "./src/routes/tasks/tasksWithProjectsDueToday.js";

const app = express();
const port = process.env.PORT || 3000;

const start = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use("/", indexRouter);
  app.use("/tasks", tasksRouter);
  app.use("/task", taskRouter);
  app.use("/projects", projectsRouter);
  app.use("/project", projectRouter);
  app.use("/projectsWithTasksDueToday", projectsWithTasksDueTodayRouter);
  app.use("/tasksWithProjectsDueToday", tasksWithProjectsDueToday);

  // catch 404
  app.use((req, res) => {
    res.status(404).send("Resource not found");
  });

  //error handler
  app.use((err, req, res) => {
    console.error(err);
    res
      .status(err.status || 500)
      .send(err.errorResponse || "Something went wrong");
  });

  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}/`),
  );
};

start();

export default app;
