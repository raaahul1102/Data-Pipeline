import fs from "fs";
import fsp from "fs/promises";

export function readDataSync(file) {
  try {
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error("readDataSync error:", err.message);
    return [];
  }
}

export async function readDataAsync(file) {
  try {
    const raw = await fsp.readFile(file, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error("readDataAsync error:", err.message);
    return [];
  }
}

export function writeDataSync(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log("Wrote", file);
  } catch (err) {
    console.error("writeDataSync error:", err.message);
  }
}

export async function writeDataAsync(file, data) {
  try {
    await fsp.writeFile(file, JSON.stringify(data, null, 2));
    console.log("Wrote", file);
  } catch (err) {
    console.error("writeDataAsync error:", err.message);
  }
}
