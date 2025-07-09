const recommendation = require("./recommendations.json");

const unqiues = key => new Set(recommendation.map(v => v[key]));

console.log("Unique humidity", unqiues("humidity"));
console.log("Unique temperature", unqiues("temperature"));
console.log("Unique uv", unqiues("uv"));
console.log("Unique pollution", unqiues("pollution"));
console.log("Unique wind", unqiues("wind"));

console.log("Skin Types", unqiues("skin_type"), unqiues("skin_condition_1"), unqiues("skin_condition_2"));
