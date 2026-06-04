const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String
});

module.exports = mongoose.model(
    "Submission",
    submissionSchema
);