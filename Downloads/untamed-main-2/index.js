const express = require('express');
const app = express();
const axios = require('axios');
const fileUpload = require("express-fileupload");
const port = 3000;
// const mockPollution = require("./data/pollution.example.json");
const recommendations = require("./data/recommendations.json");

const cities = require("./data/cities.json");
// API Key Mine: 13f70422397ba950c4a47e4df979009c
const openWeatherBaseUrl = "https://api.openweathermap.org/data/3.0/onecall?appid=d586ba38523e055287ccafb1c575f84b&";
const pollutionBaseUrl = "http://api.openweathermap.org/data/2.5/air_pollution?appid=d586ba38523e055287ccafb1c575f84b";
// const supportedSkinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
// const supportedSkinConditions = ['Acne', 'Redness', 'Dullness', 'Wrinkles', 'Dark Spots', 'Uneven Skin Tone'];
const path = require('path');
const moment = require('moment');
const {
    getHumidityCondition,
    getPollutionCondition,
    getTemperatureCondition,
    getUVCondition,
    getWindCondition
} = require("./weather.utils")

const { MongoClient } = require("mongodb");
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const readClient = new MongoClient('mongodb://localhost:27017');
const database = readClient.db('untamed');
const skin_queries_collection = database.collection('skin_queries');
const weather_data_collection = database.collection('weather_data');


app.get('/typeform', (req, res) => {
    res.render('typeform');
});

app.get('/vc', (req, res) => {
    res.render('vc');
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/', (req, res) => {
    const homeData = {
        cities: cities.map(c => ({ city:  c.country + " - " + c.city, country: c.country + " - " + c.city, lat: c.lat, lng: c.lng, value: c.city })).sort((a, b) => a.country < b.country ? -1 : 1)
    };
    res.render('home', homeData);
});

app.post('/query', (req, res) => {
    console.log("Got post request", req.body);
    skin_queries_collection.insertOne(req.body);
    res.render('rec');
});

app.post('/skin-care-products-recommendation', async (req, res) => {
    try {
        console.log("Logging request", req.files);
        console.log("Logging body", req.body);

    const uploadedFile = req.files?.face_scan;
    if (uploadedFile) {
        const uploadPath = __dirname + "/uploads/" + JSON.stringify(req.body) + "___" + uploadedFile.name;
        // To save the file using mv() function
        uploadedFile.mv(uploadPath, function (err) {
          if (err) {
            console.log("Error while saving file");
            console.log(err);
          } else console.log("File saved");
        });
    }
    // Upload path


    skin_queries_collection.insertOne(req.body);
    /*
    Got post request {
            name: 'title_name',
            email: 'kantheda2@gmail.com',
            'skin-type': 'oily',
            'skin-conditions': 'acne',
            city: 'Mumbai'
        }
    */

    if (!cities.map(c => c.city).includes(req.query.city)) req.query.city = "Mumbai";
    const cityName = req.query.city;
    const cityWeather = cities.find(c => cityName === c.city);

    let weatherData = await weather_data_collection.findOne({ cityName });
    if (!weatherData || (moment().diff(moment(weatherData.createdAt), 'minutes') > 1440)) {
        console.log("Will call weather API");
        const weatherResponse = await axios.get(openWeatherBaseUrl+'lat='+cityWeather.lat+'&lon='+cityWeather.lng);
        weatherData = weatherResponse.data;
        weatherData.cityName = cityName;
        weatherData.createdAt = new Date();
        weather_data_collection.insertOne(weatherData);
    }

    let inputConditions = req.body;
    inputConditions.humidity = getHumidityCondition(weatherData.daily[0].humidity);
    const pollutionUrl = pollutionBaseUrl + `&lat=${cityWeather.lat}&lon=${cityWeather.lng}`;
    const pollutionResponse = await axios.get(pollutionUrl);
    const pollutionData = pollutionResponse.data;

    console.log("Got pollution data", JSON.stringify(pollutionData, null, 2));

    inputConditions.pollution = getPollutionCondition(pollutionData.list[0].main.aqi);
    inputConditions.temperature = getTemperatureCondition(weatherData.daily[0].temp.max);
    inputConditions.uv = getUVCondition(weatherData.daily[0].uvi);
    inputConditions.wind = getWindCondition(weatherData.daily[0].wind_speed);
    inputConditions.skin_type = req.body.skin_type || "combination";
    if (Array.isArray(req.body.skin_condition)) {
        inputConditions.skin_condition_1 = req.body.skin_condition[0];
        inputConditions.skin_condition_2 = req.body.skin_condition[1];
    } else {
        inputConditions.skin_condition_1 = req.body.skin_condition;
    }
    // inputConditions.skin_condition_2 = req.body.skin_condition_2;
    // inputConditions.city = req.body.city;
    console.log("Logging input conditions", inputConditions);
    let recommededProducts = recommendations.find(r =>
        r.humidity == inputConditions.humidity &&
        r.pollution == inputConditions.pollution &&
        r.temperature == inputConditions.temperature &&
        r.uv == inputConditions.uv &&
        r.wind == inputConditions.wind &&
        r.skin_type == inputConditions.skin_type &&
        r.skin_condition_1 == inputConditions.skin_condition_1 &&
        r.skin_condition_2 == (inputConditions.skin_condition_2 === '' ? undefined : inputConditions.skin_condition_2)
    );
    if (!recommededProducts) recommededProducts = {
        ...inputConditions,
        "cleanser_with_weather": "Not Found",
        "moisturiser_with_weather": "Not Found",
        "sunscreen": "Not Found",
        "night_treatment": "Not Found",
        "ingredients_to_avoid_for_your_face": "Not Found",
        "oral_supplements_that_might_help": "Not Found"
    };
    recommededProducts.city = cityName;
    // console.log("Logging input conditions and match", inputConditions, recommededProducts);

    const skin_query = {
        inputs: inputConditions,
        output: {
            recommendations: recommededProducts
        },
        createdAt: new Date(),
    };
    skin_queries_collection.insertOne(skin_query);
        res.render('recommendations', skin_query);
    } catch (error) {
        console.error("Error in skin-care-products-recommendation", error);
        res.status(500).send("Internal Server Error");
    }
    // res.send({ ...skin_query, success: "200" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// const bodyParser = require('body-parser');
// app.use(bodyParser);

/*
Show save data in db;
Send the recomended products in the app itself;
Send with the product ids;
https://untam3d.in/products/0-15-retinol-vit-c-face-serum?variant=48563220742427
W
*/