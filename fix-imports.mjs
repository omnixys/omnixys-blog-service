import fs from "node:fs";
import path from "node:path";

function fix(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);

    if (fs.statSync(p).isDirectory()) {
      fix(p);
      continue;
    }

    if (p.endsWith(".ts")) {
      let c = fs.readFileSync(p, "utf8");

      c = c.replace(/from ['"](\.\/[^'"]+)(?<!\.js)['"]/g, 'from "$1.js"');
      c = c.replace(/from ['"](\.\.\/[^'"]+)(?<!\.js)['"]/g, 'from "$1.js"');

      fs.writeFileSync(p, c);
    }
  }
}

fix("./src");

console.log("✅ Imports fixed");
