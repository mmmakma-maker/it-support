// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
<<<<<<< Updated upstream
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const http = require("http");
=======
const ticketRoutes = require("./routes/ticketRoutes");
const authRoutes = require("./routes/authRoutes");
>>>>>>> Stashed changes

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/auth", authRoutes);

// Socket.io
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", socket => {
  console.log("عميل متصل: " + socket.id);
});

// ========================
// MONGOOSE MODELS
// ========================

// استخدم رابط Atlas الذي أعطيتك إياه
mongoose.connect(
  "mongodb://admin:99283644Mm@cluster2-shard-00-00.5t2ymm.mongodb.net:27017,cluster2-shard-00-01.5t2ymm.mongodb.net:27017,cluster2-shard-00-02.5t2ymm.mongodb.net/it_support?ssl=true&replicaSet=atlas-pfscsf-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(()=>console.log("MongoDB Atlas Connected"))
.catch(err=>console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  priority: { type: String, default: "low" },
  createdBy: String,
  assignedTo: String,
  status: { type: String, default: "open" },
  location: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Ticket = mongoose.model("Ticket", ticketSchema);

// ========================
// AUTH ROUTES
// ========================
const SECRET = "MYSECRETKEY";

app.post("/api/auth/register", async (req,res)=>{
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash });
  res.json({ message:"User created", user:{ username: user.username } });
});

app.post("/api/auth/login", async (req,res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if(!user) return res.status(400).json({ error:"Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({ error:"Invalid credentials" });
  const token = jwt.sign({ username }, SECRET, { expiresIn:"8h" });
  res.json({ token, user: username });
});

// Middleware للتحقق من التوكن
function authMiddleware(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ error:"No token" });
  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  }catch(err){ res.status(401).json({ error:"Invalid token" }); }
}

// ========================
// TICKET ROUTES
// ========================

// إضافة تذكرة جديدة
app.post("/api/ticket", authMiddleware, async (req,res)=>{
  const data = req.body;
  const ticket = await Ticket.create(data);
  io.emit("ticketAdded", ticket);
  res.json(ticket);
});

// جميع التذاكر
app.get("/api/tickets", authMiddleware, async (req,res)=>{
  const tickets = await Ticket.find().sort({ createdAt:-1 });
  res.json(tickets);
});

// استلام الطلب
app.put("/api/ticket/:id/assign", authMiddleware, async (req,res)=>{
  const { assignedTo } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assignedTo, status:"in_progress" }, { new:true });
  io.emit("ticketUpdated", ticket);
  res.json(ticket);
});

// إغلاق الطلب
app.put("/api/ticket/:id/close", authMiddleware, async (req,res)=>{
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status:"closed" }, { new:true });
  io.emit("ticketUpdated", ticket);
  res.json(ticket);
});

// Root test
app.get("/", (req,res)=>res.send("IT Support Server Running"));

server.listen(5000, ()=>console.log("Server running on port 5000"));
