const express = require("express");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./server/todolist.db');
const app = express();
const port = 4000;

app.use(express.static('client'));
app.use(express.json());


app.get('/api', (req, res) => {
    // Query to display everything in the database
    let sql = 'SELECT * FROM todo';

    // Display everything in the database and return it as JSON
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);
        res.json(rows);
    });
})

app.post("/api", (req, res) => {
    const { todo_item } = req.body;

    const sql = 'INSERT INTO todo (todo_items, is_checked) VALUES (?, ?)';
    db.run(sql, [todo_item, "false"], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to add todo item');
        }
        // Respond with the ID of the newly inserted row
        res.status(201).json({ id: this.lastID, todo_item });
    });
})

app.put("/api", (req, res) => {
    const { id, newItem } = req.body;

    if (!id) {
        return res.status(400).send("Missing ID in request body");
    }

    const sql = 'UPDATE todo SET todo_items = ? WHERE id = ?';

    db.run(sql, [newItem, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to add todo item');
        }

        res.status(200).send("Edited!");
    })
})

app.delete("/api", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("Missing ID in request body");
    }

    const sql = 'DELETE FROM todo WHERE id=?';

    db.run(sql, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to delete the todo item");
        }

        if (this.changes === 0) {
            return res.status(404).send("Todo item not found");
        }

        res.status(200).send(`Todo item with ID ${id} deleted successfully`);
    })
})

app.put("/api/toggle", (req, res) => {
    const { id, isChecked } = req.body;

    if (typeof id === "undefined" || typeof isChecked === "undefined") {
        return res.status(400).send("Missing ID or isChecked in request body");
    }

    const sql = "UPDATE todo SET is_checked = ? WHERE id = ?";
    db.run(sql, [isChecked ? "true" : "false", id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to update the checkbox state");
        }

        if (this.changes === 0) {
            return res.status(404).send("Todo item not found");
        }

        res.status(200).send("Checkbox state updated successfully");
    });
});


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})