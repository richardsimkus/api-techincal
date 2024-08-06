## Api Challenge

I had a lot of fun doing this technical challenge!  

As I've not fully used mongoDB before I may have not done everything the most optimal way, so this has been a good learning
exercise for me. I would love to see how it's used in a professional environment at scale.

I've tried to apply what I know from SQL to mongoDB and my experience with Javascript & Node.

I've made a couple of assumptions:
- tasks must be assigned to a project
- you cannot set your own done date, it is automatically set when you set the status to done.
- project names must be unique
- projects cannot be restarted or have their start date changed(they have no done date as per spec, so no reset back to "to do")

I have validator checks to enforce those decisions.


### Routes

4 routes are available:

```
/tasks - GET, POST
/task/:id - GET, PATCH, DELETE

/projects - GET, POST
/project/:id - GET, PATCH, DELETE
```

Some of the requirements have been put together - for example in this you can both edit tasks details such as name, dueDate, the project it's assigned to and status 
at the same time from one request. It will still update the due / done date accordingly.

You can create tasks/ projects with a POST request to /tasks or /projects with the following example for a task:
```json
{
    "name": "task name",
    "project name": "project name",
    "status": "To do",
    "dueDate": "2022-12-12"
}
```

tasks have the following filters / sorts:
- name (REGEX)
- project name - exact match
- status (done / not done)
- startDateSort (ASC / DESC)
- dueDateSort (ASC / DESC)
- doneDateSort (ASC / DESC)

Projects have the following filters / sorts:
- name (REGEX)
- startDateSort (ASC / DESC)
- dueDateSort (ASC / DESC)
- doneDateSort (ASC / DESC)

Finally, you can delete either a task or project specifically by id.
Deleting a project will delete all tasks associated with that project.

You can even combine any single sort with any combination of filters (only one sort at a time). 
You could filter by all name, project name, status and sort by due date for example.

you can update tasks with a PATCH request to /task/:id with the following body:
```json
{
    "name": "new name",
    "project name": "new project name",
    "dueDate": "2022-12-12",
    "status": "done"
}
```

### How to run
Port is 3000 by default, feel free to change in .env :)

#### Pre-requisites
- mongoDB installed on your machine.
- NodeJS installed on your machine.


### How to run

if you're on mac/linux or have "makefile" setup, just run 
`make first`
or 
`make` for subsequent runs.

Alternatively, use the classic:
```shellscript
npm i
npm run seed
npm run dev
```

Having a bit more time I would have liked to split out some of the logic in the routes into separate functions, 
unfortunately I wasn't able to start until much later than planned.


## Thank you for the opportunity!

 
 
 
# . 