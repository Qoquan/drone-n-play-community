import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = (process.env.PORT as string) || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});