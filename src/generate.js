import { faker } from "@faker-js/faker";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const nArg = args.find((a) => a.startsWith("--n="));
const N = nArg ? Number(nArg.split("=")[1]) : Number(args[0]) || 10_000;

const outFile = path.join(__dirname, "..", "data", "data.json");
mkdirSync(path.dirname(outFile), { recursive: true });

console.time("GenerateData");
const users = [];
for (let i = 0; i < N; i++) {
  users.push({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
  });
}
writeFileSync(outFile, JSON.stringify(users, null, 2));
console.timeEnd("GenerateData");
console.log(
  `Generated ${N.toLocaleString()} users → ${path.relative(
    process.cwd(),
    outFile
  )}`
);
