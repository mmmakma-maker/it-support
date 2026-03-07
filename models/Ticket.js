const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  status: { type: String, default: "open" },
  createdBy: String,
  location: String,
  assignedTo: String
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);