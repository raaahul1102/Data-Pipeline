export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function parseName(fullName = "") {
  const m = String(fullName)
    .trim()
    .match(/^(?:([\p{L}]+\.))?\s*([\p{L}]+)(?:\s+(.*))?$/u);

  if (!m) return { firstName: "", lastName: "" };

  const [, title = "", coreFirst, rest = ""] = m;
  const firstName = title ? `${title} ${coreFirst}` : coreFirst;
  const lastName = rest.trim();

  return { firstName, lastName };
}

export function normalizeUser(user = {}) {
  const email = String(user.email || "")
    .trim()
    .toLowerCase();

  const name = String(user.name || "");
  const address = String(user.address || "").trim();

  const { firstName, lastName } = parseName(name);

  return { firstName, lastName, email, address };
}

// Clean with array methods (map/filter)
export function cleanDataArray(users = []) {
  return users
    .map(normalizeUser)
    .filter(
      (u) => u.firstName && u.email && u.address && isValidEmail(u.email)
    );
}

// Clean with chunked for-loops — faster & memory-friendly on very large arrays
export function cleanDataChunked(users = [], chunkSize = 1000) {
  const out = [];
  const n = users.length;

  for (let i = 0; i < n; i += chunkSize) {
    const end = Math.min(i + chunkSize, n);
    for (let j = i; j < end; j++) {
      const u = normalizeUser(users[j]);
      if (u.firstName && u.email && u.address && isValidEmail(u.email)) {
        out.push(u);
      }
    }
  }
  return out;
}

export function generateStats(users = []) {
  const domainCount = users.reduce((acc, u) => {
    const domain = (u.email.split("@")[1] || "").trim();
    if (domain) acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});

  const cityCount = users.reduce((acc, u) => {
    const parts = String(u.address || "").split(",");
    const city = parts.length ? parts[parts.length - 1].trim() : "";
    if (city) acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  return { domainCount, cityCount };
}

export function topN(countObj = {}, n = 10) {
  return Object.entries(countObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}
