const conn = require("../../../../config/database");
const taskValidators = require("./validators")

const taskController = {}


taskController.addTasks = async (req, res, next) => {
    const { error } = taskValidators.createTaskSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    try {
      const { task_name, description, user_id } = req.body;
  
      let queryString = `insert into tasks
        (task_name, description ,user_id)
         values (?, ?, ?)`;
      const [result] = await conn
        .promise()
        .execute(queryString, [task_name,description , user_id]);
  
      return res.status(201).send({
        statusCode: 201,
        message: "task added successfully",
        result,
      });
    } catch (error) {
      // console.log(error);
      return res.status(500).send({
        statusCode:500,
        message: "Error while adding task",
        error,
      });
    }
  };


taskController.getTasks = async (req, res, next) => {
    try {
      const { user_id } = req.params;
      // console.log(req.params)
    if (!user_id) {
      res.status(400).send({
        statusCode:400,
        message: "userId not found",
      });
    }

    let { filter, status,sort_by, sort_order, page, limit } = req.query;
    // console.log(req.query)

        // Default values for pagination
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;

        let queryString = `SELECT
            t.task_id,
            t.task_name,
            t.description,
            t.start_date,
            t.end_date,
            t.status,
            t.is_active
        FROM
            tasks AS t
        JOIN users AS u ON
            u.user_id = t.user_id WHERE u.user_id = ?`;

        // Apply filter if provided
        if (filter) {
            queryString += ` AND (t.task_name LIKE '%${filter}%' OR t.description LIKE '%${filter}%')`;
        }

        if(status){
          queryString += ` AND status = ${status}`
        }

        // Apply sorting if provided
        if (sort_by && sort_order) {
            queryString += ` ORDER BY ${sort_by} ${sort_order}`;
        }

        // Apply pagination
        const offset = (page - 1) * limit;
        queryString += ` LIMIT ${limit} OFFSET ${offset}`;

        // console.log(queryString)
      
      const [result] = await conn
        .promise()
        .execute(queryString, [user_id]);

        if (result.length === 0) {
          return res.status(404).send({
            statusCode:400,
            message: "Nothing in a tasklist",
          });
        }

        let countQueryString = `select count(u.user_id) as count from tasks as t
        join users as u on u.user_id = t.user_id where u.user_id = ?`;
      const [countResult] = await conn
        .promise()
        .execute(countQueryString, [user_id]);
  
      return res.status(200).send({
        statusCode:200,
        message: "Successfully got taskList",
        list: result,
        count: countResult[0].count,
      });
    } catch (error) {
      // console.log(error);
      return res.status(500).send({
        statusCode:500,
        message: "Error while getting tasklist",
        error,
      });
    }
  };

  taskController.updateTask = async (req, res, next) => {
    try {
        const { task_id } = req.params;
        const { status, start_date, end_date } = req.body;
        // console.log(task_id)

        if (!task_id) {
            return res.status(400).send({
              statusCode:400,
                message: "taskId not found",
            });
        }

        // Construct the SQL update query based on provided fields
        let updateFields = [];
        let updateValues = [];

        if (status !== undefined) {
            updateFields.push("status = ?");
            updateValues.push(status);
        }

        if (start_date !== undefined) {
            updateFields.push("start_date = ?");
            updateValues.push(start_date);
        }

        if (end_date !== undefined) {
            updateFields.push("end_date = ?");
            updateValues.push(end_date);
        }

        if (updateFields.length === 0) {
            return res.status(400).send({
                statusCode:400,
                message: "No fields provided for update",
            });
        }

        // Construct the update query
        const updateQueryString = `UPDATE tasks SET ${updateFields.join(', ')} WHERE task_id = ?`;
        
        // Add task_id to updateValues array
        updateValues.push(task_id);
        
        // console.log("query=>",updateQueryString)
        // console.log("values",updateValues)

        // Execute the update query
        const [result] = await conn.promise().execute(updateQueryString, updateValues);
        // console.log(result)

        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: "Task not found",
            });
        }

        return res.status(200).send({
            statusCode:200,
            message: "Task updated successfully",
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
          statusCode:500,
            message: "Error while updating task",
            error,
        });
    }
};

taskController.deleteTask = async (req, res, next) => {
  try {
      const { task_id } = req.params;

      if (!task_id) {
          return res.status(400).send({
              statusCode: 400,
              message: "taskId not found",
          });
      }

      const updateQueryString = `UPDATE tasks SET is_active = 0 WHERE task_id = ?`;

      const [result] = await conn.promise().execute(updateQueryString, [task_id]);

      if (result.affectedRows === 0) {
          return res.status(404).send({
              statusCode: 404,
              message: "Task not found",
          });
      }

      return res.status(200).send({
          statusCode: 200,
          message: "Task deleted successfully",
      });
  } catch (error) {
      // console.log(error);
      return res.status(500).send({
          statusCode: 500,
          message: "Error while deleting task",
          error,
      });
  }
};



module.exports = taskController