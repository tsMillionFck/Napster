import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Song from "../models/Song.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "audio") {
    if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3") {
      cb(null, true);
    } else {
      cb(new Error("Only MP3 files allowed for audio"), false);
    }
  } else if (file.fieldname === "cover") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed for cover"), false);
    }
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// GET all songs
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new song with file uploads
router.post(
  "/",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, artist } = req.body;

      if (!req.files?.audio || !req.files?.cover) {
        return res
          .status(400)
          .json({ error: "Audio and cover files are required" });
      }

      const song = new Song({
        name,
        artist,
        path: `/uploads/${req.files.audio[0].filename}`,
        cover: `/uploads/${req.files.cover[0].filename}`,
      });

      await song.save();
      res.status(201).json(song);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE song
router.delete("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.json({ message: "Song deleted", song });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
