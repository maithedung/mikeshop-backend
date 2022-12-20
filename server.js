import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import connectDatabase from "./configs/db.config.js";
import importData from "./utils/importData.js";
import productRoute from "./routes/product.route.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.router.js";
import swaggerDocs from "./swagger_output.js";
import authRoute from "./routes/auth.route.js";


dotenv.config();
connectDatabase().then(r => console.log(r));
const app = express();

app.use(express.json());
app.use(cors());

// API
app.use("/api/docs", swaggerUi.serve);
app.use("/api/import", importData);

app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth/otp", authRoute)

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
app.get("/api/docs", swaggerUi.setup(swaggerDocs));


// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}...`);
  });
} catch (error) {
  console.log(`Error: ${error.message}`);
  process.exit(1);
}



