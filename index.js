const express = require('express');
const { createTodo, updateTodo } = require('./types');
const { todo } = require('./db'); // Import the todo model correctly
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post("/todo", async function(req, res) {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    if (!parsedPayload.success) {
        res.status(400).json({
            msg: "You sent the wrong inputs",
        });
        return;
    }
    await todo.create({
        title: createPayload.title,
        description: createPayload.description,
        completed: false
    });

    res.json({
        msg: "Todo created"
    });
});

app.get("/todos", async function(req, res) {
    try {
        const todos = await todo.find({});
        res.json(todos);
    } catch (error) {
        res.status(500).json({
            msg: "Error retrieving todos",
            error: error.message
        });
    }
});

app.put("/completed", async function(req, res) {
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);
    if (!parsedPayload.success) {
        res.status(400).json({
            msg: "You sent the wrong inputs",
        });
        return;
    }
    await todo.updateOne({
        _id: req.body.id
    }, {
        completed: true
    });
    res.json({
        msg: "Todo marked as completed"
    });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
