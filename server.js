const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CORS CONFIGURATION
========================= */

app.use(cors({
  origin: [
    "https://kurocrowe.github.io",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// Handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());

/* =========================
   GOOGLE SHEETS AUTH
========================= */

// Parse credentials safely from environment
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Sheet1";

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* =========================
   RESERVATION ROUTE
========================= */

app.post("/reserve", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[new Date().toISOString(), name, email, message]]
      }
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Sheet Error:", error);
    return res.status(500).json({ error: "Failed to save to sheet" });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
