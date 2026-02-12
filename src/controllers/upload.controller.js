import fs from "fs";
import { supabase } from "../Services/supabaseClient.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Read file from temp folder
    const fileBuffer = fs.readFileSync(file.path);

    // Upload to Supabase bucket (e.g., "uploads")
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`files/${file.filename}`, fileBuffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from("uploads")
      .getPublicUrl(data.path);

    // Optionally delete temp file after upload
    fs.unlinkSync(file.path);

    res.json({ message: "File uploaded successfully", url: publicUrl.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
