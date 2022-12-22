import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";
import connectDatabase from "./configs/db.config.js";
import importData from "./utils/importData.js";
import productRoute from "./routes/product.route.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import swaggerDocs from "./data/swaggerDocs.js";
import authRoute from "./routes/auth.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// API
app.use("/api/docs", swaggerUi.serve);
app.use("/api/import", importData);

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/auth/otp", authRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
app.get("/api/docs", swaggerUi.setup(swaggerDocs));


// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server = app.listen(PORT, async () => {
  try {
    await connectDatabase();
    console.log(`Server running in port ${PORT}...`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: "*",
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (receivedMessage) => {
    let chat = receivedMessage.chat;
    chat.users.forEach((user) => {
      if (user == receivedMessage.sender._id) return;
      socket.in(user).emit("message received", receivedMessage);
    });
  });

  socket.off("setup", (userData) => {
    socket.leave(userData._id);
  });
});


