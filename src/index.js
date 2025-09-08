import path from "path";
import { fileURLToPath } from "url";
import {
  readDataSync,
  readDataAsync,
  writeDataSync,
  writeDataAsync,
} from "./utils/file.js";
import {
  cleanDataArray,
  cleanDataChunked,
  generateStats,
  topN,
} from "./utils/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const mode = args[0];
const isAsync = args.includes("--async");
const chunkArg = args.find((a) => a.startsWith("--chunk="));
const chunkSize = Number(chunkArg?.split("=")[1]) || 2000;

const inputArg = args.find((a) => a.startsWith("--input="));
const outputArg = args.find((a) => a.startsWith("--output="));
const inputFile =
  inputArg?.split("=")[1] || path.join(__dirname, "..", "data", "data.json");
const outputFile =
  outputArg?.split("=")[1] ||
  path.join(__dirname, "..", "data", "cleaned.json");

function printHelp() {
  console.log(`
Usage:
  node src/index.js <mode> [--async] [--chunk=2000] [--input=PATH] [--output=PATH]

Modes:
  clean         Read input JSON, clean & normalize, write to cleaned.json (sync)
  stats         Read input, clean in-memory, print summary stats (sync)
  --help        Show this help

Flags:
  --async       Use async fs I/O
  --chunk=NUM   Process data in chunks with for-loops (default: 2000)
  --input=PATH  Input JSON file (default: data/data.json)
  --output=PATH Output JSON file (default: data/cleaned.json)

Examples:
  npm run generate
  node src/index.js clean --chunk=5000
  node src/index.js stats --async --chunk=1000
`);
}

function printStatsReport(cleaned) {
  const { domainCount, cityCount } = generateStats(cleaned);
  const topDomains = topN(domainCount, 10);
  const topCities = topN(cityCount, 10);

  console.log("\nSUMMARY REPORT");
  console.log(`Total valid users: ${cleaned.length.toLocaleString()}`);

  console.log("\nTop Email Domains:");
  for (const [domain, count] of topDomains) {
    console.log(`- ${domain}: ${count}`);
  }

  console.log("\nTop Cities:");
  for (const [city, count] of topCities) {
    console.log(`- ${city}: ${count}`);
  }
  console.log("\n");
}

async function run() {
  if (!mode || mode === "--help" || mode === "-h") {
    printHelp();
    return;
  }

  console.time("Execution");

  if (mode === "clean") {
    const reader = isAsync ? readDataAsync : readDataSync;
    const writer = isAsync ? writeDataAsync : writeDataSync;

    console.time("ReadData");
    const raw = await reader(inputFile);
    console.timeEnd("ReadData");

    if (!raw.length) {
      console.warn("No records found in input or malformed JSON.");
      console.timeEnd("Execution");
      return;
    }

    console.time("CleanData");
    // Use chunked loop to avoid recursion & control memory
    const cleaned = cleanDataChunked(raw, chunkSize);
    console.timeEnd("CleanData");

    console.time("WriteData");
    await writer(outputFile, cleaned);
    console.timeEnd("WriteData");

    console.log(
      `Cleaned ${cleaned.length.toLocaleString()} records -> ${outputFile}`
    );
  } else if (mode === "stats") {
    const reader = isAsync ? readDataAsync : readDataSync;

    console.time("ReadData");
    const raw = await reader(inputFile);
    console.timeEnd("ReadData");

    if (!raw.length) {
      console.warn("No records found in input or malformed JSON.");
      console.timeEnd("Execution");
      return;
    }

    // Benchmark two approaches: array methods vs chunked loops
    console.time("Clean(ArrayMethods)");
    const cleanedArray = cleanDataArray(raw);
    console.timeEnd("Clean(ArrayMethods)");

    console.time("Clean(ChunkedLoops)");
    const cleanedChunked = cleanDataChunked(raw, chunkSize);
    console.timeEnd("Clean(ChunkedLoops)");

    // Choose the chunked result for downstream
    const cleaned = cleanedChunked.length ? cleanedChunked : cleanedArray;

    printStatsReport(cleaned);
  } else {
    console.log("Unknown mode.");
    printHelp();
  }

  console.timeEnd("Execution");
}

run();
