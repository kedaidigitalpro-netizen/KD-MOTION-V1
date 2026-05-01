export default async function handler(req, res) {
  try {
    const { email } = req.body;

    const cleanEmail = (email || "")
      .toLowerCase()
      .replace(/['"]/g, "")
      .trim();

    const url =
      "https://docs.google.com/spreadsheets/d/1lrE1HFbsJcFU4C2MpC_psgoSJjTGSCqsp3opm_rPQDA/export?format=csv";

    const response = await fetch(url);
    const text = await response.text();

    const emails = text
      .split("\n")
      .map((row) => row.split(",")[0].toLowerCase().trim());

    const allowed = emails.includes(cleanEmail);

    res.status(200).json({ allowed });
  } catch (err) {
    res.status(500).json({ allowed: false, error: "server error" });
  }
}