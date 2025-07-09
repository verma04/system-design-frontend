const fs = require("fs");
const data = require("./recommendations.json");

console.log("data len", data.length, data.filter(d => d.humidity).length);
fs.writeFileSync("recommendations.json", JSON.stringify(data.filter(d => d.humidity), null, 2));
