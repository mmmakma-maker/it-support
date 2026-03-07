const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

// إنشاء طلب جديد
router.post("/ticket", async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    const io = req.app.get("io");
    io.emit("ticketAdded", ticket); // تحديث الجميع
    res.status(201).json(ticket);   // إعادة الطلب الجديد
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// جلب جميع الطلبات
router.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// استلام الطلب
router.put("/ticket/:id/assign", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.assignedTo, status: "in_progress" },
      { new: true }
    );
    req.app.get("io").emit("ticketUpdated", ticket);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إغلاق الطلب
router.put("/ticket/:id/close", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );
    req.app.get("io").emit("ticketUpdated", ticket);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;