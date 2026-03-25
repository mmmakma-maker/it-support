const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: String,
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open"
  },
  createdBy: { type: String, required: true },
  location: String,
  assignedTo: String
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);