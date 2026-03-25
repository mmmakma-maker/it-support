const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const auth = require("../middleware/auth");


// =======================
// إنشاء طلب جديد
// =======================
router.post("/ticket", auth, async (req, res) => {
  try {

    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user.id
    });

    const io = req.app.get("io");
    io.emit("ticketAdded", ticket);

    res.status(201).json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// جلب كل التذاكر
// =======================
router.get("/tickets", auth, async (req, res) => {
  try {

    const tickets = await Ticket.find();
    res.json(tickets);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// تعيين الطلب
// =======================
router.put("/ticket/:id/assign", auth, async (req, res) => {
  try {

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: req.body.assignedTo,
        status: "in-progress"   // ✅ تصحيح
      },
      { new: true }
    );

    req.app.get("io").emit("ticketUpdated", ticket);

    res.json(ticket);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// إغلاق الطلب
// =======================
router.put("/ticket/:id/close", auth, async (req, res) => {
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