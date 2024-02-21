import formidable from "formidable";
import fs from "fs";
import xlsx from "xlsx";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const { timetable } = files;

    if (!timetable) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const workbook = xlsx.readFile(timetable.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Extract individual periods from the sheet
      const periods = xlsx.utils.sheet_to_json(sheet);

      return res.status(200).json({ periods });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Error processing the file" });
    } finally {
      // Remove the temporary file
      fs.unlinkSync(timetable.path);
    }
  });
}
