import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/note.routes';

dotenv.config();

const app = express();

// --- CORRECT MIDDLEWARE ORDER ---

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get("/", (req, res) => {
    res.send({ success: true, message: "server up!" });
});
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(
        `App listening on port http://localhost:${process.env.PORT}/ -> db connected.`
      );
    });

  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();