const fs = require("fs");
const path = require("path");

const ghostDir = path.join(__dirname, "public/assets/ghosts");

fs.readdirSync(ghostDir).forEach((file) => {
  if (!file.endsWith(".json")) return;

  const fullPath = path.join(ghostDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

  if (!data.length) return;

  const offset = data[0].time;

  const normalized = data.map((entry) => ({
    ...entry,
    time: Number((entry.time - offset).toFixed(6)),
  }));

  fs.writeFileSync(fullPath, JSON.stringify(normalized, null, 2));
  console.log(`Normalized ${file}`);
});
