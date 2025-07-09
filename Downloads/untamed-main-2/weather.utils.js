/*
Humidity Range:
•  High Humidity:Above 70% RH
•  Normal Humidity: 30% to 70% RH
•  Low Humidity:Below 30% RH
Pollution Range:
•⁠  ⁠Low Pollution: AQI 0-50
•⁠  ⁠Normal Pollution: AQI 51-100
•⁠  ⁠High Pollution: AQI 101 and above
Temperature Range :
 High Temp ~ Above 27C 
 Normal 12C to 27C
 Low Beloow 10C
Wind :
 Strong ~31kmph and aboove
 Normal~ 6 to 31
 Calm ~ less than 6

UV Range:
•  Low UV Exposure: Less than 3
•  Moderate UV Exposure: UV Index 3-5
•  High UV Exposure: Above 5
*/

function getHumidityCondition(humidity) {
    if (humidity > 70) return "high";
    if (humidity >= 30 && humidity <= 70) return "normal";
    return "low";
}

function getPollutionCondition(aqi) {
    if (aqi >= 4) return "high";
    // if (aqi >= 51 && aqi <= 100) return "normal";
    return "low";
}

function getTemperatureCondition(temp) {
    if (temp > 27) return "high";
    if (temp >= 12 && temp <= 27) return "normal";
    return "low";
}

function getWindCondition(windSpeed) {
    if (windSpeed >= 31) return "high";
    // if (windSpeed >= 6 && windSpeed < 31) return "normal";
    return "low";
}

function getUVCondition(uvIndex) {
    if (uvIndex > 5) return "high";
    // if (uvIndex >= 3 && uvIndex <= 5) return "moderate";
    return "low";
}

module.exports = {
    getHumidityCondition,
    getPollutionCondition,
    getTemperatureCondition,
    getUVCondition,
    getWindCondition
};
