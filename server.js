const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "https://kurocrowe.github.io",
  "http://localhost:5173",
  "https://keria.live",
  "https://www.keria.live"
];

app.use(cors({
  origin: function(origin, callback) {

    // allow requests without origin (Postman / curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }

  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json());

/* =========================
   SERVE WEBSITE FILES
========================= */

app.use(express.static(__dirname));

/* =========================
   GOOGLE SHEETS AUTH
========================= */

if (!process.env.GOOGLE_CREDENTIALS) {
  console.error("Missing GOOGLE_CREDENTIALS environment variable");
}

if (!process.env.SPREADSHEET_ID) {
  console.error("Missing SPREADSHEET_ID environment variable");
}

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

  console.log("Incoming reservation:", req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {

    const client = await auth.getClient();

    const sheets = google.sheets({
      version: "v4",
      auth: client
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [new Date().toISOString(), name, email, message]
        ]
      }
    });

    res.json({ success: true });

  } catch (error) {

    console.error("Google Sheets Error:", error);

    res.status(500).json({
      error: "Failed to save reservation"
    });

  }

});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
