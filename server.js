const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const dataFile = path.join(__dirname, "data", "users.json");

function readData() {
    if (!fs.existsSync(dataFile)) {
        return { users: [] };
    }
    const content = fs.readFileSync(dataFile, "utf-8");
    if (!content) {
        return { users: [] };
    }
    return JSON.parse(content);
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/register", (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const data = readData();

    if (data.users.find(u => u.username === username)) {
        return res.json({ message: "User already exists" });
    }

    data.users.push({
        username,
        password,
        tasks: []
    });

    writeData(data);
    res.json({ message: "Registration successful" });
});

app.post("/login", (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const data = readData();

    const user = data.users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", username });
});

app.post("/addTask", (req, res) => {
    const username = req.body.username.toLowerCase();
    const { title, deadline } = req.body;
    const data = readData();

    const user = data.users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    user.tasks.push({
        title,
        deadline,
        status: "Pending"
    });

    writeData(data);
    res.json({ message: "Task added" });
});

app.post("/tasks", (req, res) => {
    const username = req.body.username.toLowerCase();
    const data = readData();

    const user = data.users.find(u => u.username === username);
    if (!user) {
        return res.json([]);
    }

    res.json(user.tasks);
});

app.post("/updateTask", (req, res) => {
    const username = req.body.username.toLowerCase();
    const index = req.body.index;
    const data = readData();

    const user = data.users.find(u => u.username === username);
    if (!user || !user.tasks[index]) {
        return res.status(400).json({ message: "Task not found" });
    }

    user.tasks[index].status = "Completed";
    writeData(data);
    res.json({ message: "Task updated" });
});

app.post("/deleteTask", (req, res) => {
    const username = req.body.username.toLowerCase();
    const index = req.body.index;
    const data = readData();

    const user = data.users.find(u => u.username === username);
    if (!user || !user.tasks[index]) {
        return res.status(400).json({ message: "Task not found" });
    }

    user.tasks.splice(index, 1);
    writeData(data);
    res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
