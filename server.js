require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Submission = require("./models/Submission");
const session = require("express-session");
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Error:");
        console.log(err);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false
}));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Save Form Data
app.post("/submit", async (req, res) => {

    console.log("Received:", req.body);

    try {

        const newSubmission = new Submission(req.body);

        await newSubmission.save();

        console.log("Saved Successfully");

        res.send("Form Submitted");

    } catch (error) {

        console.log("Mongo Error:");
        console.log(error);

        res.send("Error Saving Data");

    }

});

// Check Saved Data
app.get("/check", async (req, res) => {

    try {

        const data = await Submission.find();

        res.json(data);

    } catch (error) {

        res.send(error);

    }

});

// Start Server
app.get("/login", (req, res) => {

    res.send(`
        <h1>Admin Login</h1>

        <form method="POST" action="/login">

            <input
                type="password"
                name="password"
                placeholder="Enter Password"
            >

            <button type="submit">
                Login
            </button>

        </form>
    `);

});

app.post("/login", (req, res) => {

    if (req.body.password === "Tirth1234") {

        req.session.loggedIn = true;

        res.redirect("/admin");

    } else {

        res.send("Wrong Password");

    }

});

app.get("/admin", async (req, res) => {

    if (!req.session.loggedIn) {
        return res.redirect("/login");
    }

    const submissions = await Submission.find();

    let rows = "";

    submissions.forEach((item) => {

        rows += `
        <tr>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>${item.message}</td>
        </tr>
        `;
    });

    res.send(`
    <!DOCTYPE html>
    <html>

    <head>

        <title>Admin Dashboard</title>

        <style>

            body{
                font-family: Arial;
                background:#f4f6f9;
                padding:30px;
            }

            .top{
                display:flex;
                justify-content:space-between;
                align-items:center;
            }

            .card{
                background:white;
                padding:20px;
                border-radius:10px;
                box-shadow:0 0 10px rgba(0,0,0,0.1);
                margin-top:20px;
            }

            table{
                width:100%;
                border-collapse:collapse;
            }

            th{
                background:#2563eb;
                color:white;
            }

            th,td{
                padding:12px;
                border:1px solid #ddd;
            }

            a{
                text-decoration:none;
                background:red;
                color:white;
                padding:10px 15px;
                border-radius:5px;
            }

        </style>

    </head>

    <body>

        <div class="top">

            <h1>Admin Dashboard</h1>

            <a href="/logout">Logout</a>

        </div>

        <div class="card">

            <h3>
                Total Submissions:
                ${submissions.length}
            </h3>

        </div>

        <div class="card">

            <table>

                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                </tr>

                ${rows}

            </table>

        </div>

    </body>

    </html>
    `);

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});