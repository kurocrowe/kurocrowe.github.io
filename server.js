const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// Restrict CORS to frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());

// Parse credentials from ENV
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Sheet1";

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

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
        values: [[new Date(), name, email, message]]
      }
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save to sheet" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});