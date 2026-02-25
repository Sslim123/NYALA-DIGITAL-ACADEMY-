const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/free-course-structure", async (req, res) => {
  try {

    const courseFolder = "course-1";
    const basePath = path.join(__dirname, "..", "uploads", courseFolder);

    const unitFolders = fs.readdirSync(basePath);

    const structuredData = [];

    for (const unitFolder of unitFolders) {

      const unitPath = path.join(basePath, unitFolder);
      if (!fs.statSync(unitPath).isDirectory()) continue;

      const itemsInsideUnit = fs.readdirSync(unitPath);

      let unitFinalFiles = [];
      const lessons = [];

      for (const item of itemsInsideUnit) {

        const itemPath = path.join(unitPath, item);

        // ===== Unit Final File =====
        if (
          fs.statSync(itemPath).isFile() &&
          item.toLowerCase().includes("final")
        ) {
          unitFinalFiles.push(
            `/uploads/${courseFolder}/${unitFolder}/${item}`
          );
        }

        // ===== Lesson Folder =====
        if (
          fs.statSync(itemPath).isDirectory() &&
          item.toLowerCase().startsWith("lesson")
        ) {

          const lessonPath = itemPath;
          const lessonFiles = fs.readdirSync(lessonPath);

          let lessonPdf = null;
          let labFile = null;
          let homeworkFile = null;
          let assessmentFile = null;

          for (const file of lessonFiles) {

            const filePath = path.join(lessonPath, file);

            if (!fs.statSync(filePath).isFile()) continue;

            const lowerName = file.toLowerCase();

            if (lowerName.includes("content")) {
              lessonPdf =
                `/uploads/${courseFolder}/${unitFolder}/${item}/${file}`;
            }

            if (lowerName.includes("lab")) {
              labFile =
                `/uploads/${courseFolder}/${unitFolder}/${item}/${file}`;
            }

            if (lowerName.includes("homework")) {
              homeworkFile =
                `/uploads/${courseFolder}/${unitFolder}/${item}/${file}`;
            }

            if (lowerName.includes("assessment")) {
              assessmentFile =
                `/uploads/${courseFolder}/${unitFolder}/${item}/${file}`;
            }

          }

          lessons.push({
            lessonName: item,
            lessonPdf,
            labFile,
            homeworkFile,
            assessmentFile
          });
        }
      }

      structuredData.push({
        unitName: unitFolder,
        unitFinalFiles,
        lessons
      });
    }

    res.json(structuredData);

  } catch (err) {
    console.error("Structure error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
