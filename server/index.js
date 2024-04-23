import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { messagesRoutes } from "./routes/messages-routes.js";
import { smppService } from "./services/smpp-service.js";

const PORT = process.env.PORT || 5001;

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use("/messages", messagesRoutes);

const start = async () => {
  try {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.DB_URL, { maxPoolSize: 10 });
      mongoose.connection.on("connected", () => {
        console.log("Connected to database");
        resolve();
      });
      mongoose.connection.on("error", (err) => reject(err));
    });
    smppService();
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
