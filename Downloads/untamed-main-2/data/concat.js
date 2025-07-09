const fs = require('fs');
const recommendations = require("./sc1.formated.json").concat(require("./sc2.formated.json"));
const recommendations_corrected = recommendations.map(r => ({
    ...r,
    pollution: r.pollution === 'low_moderate' ? 'low' : r.pollution,
    wind: r.wind === 'calm_moderate' ? 'low' : r.wind === 'strong' ? 'high' : r.wind,
}));

fs.writeFileSync('./data/recommendations.json', JSON.stringify(recommendations_corrected, null, 2));
