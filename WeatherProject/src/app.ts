import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "../public")));

type WeatherResp = {
  coord: { lon: number; lat: number };
  main: { temp: number };
  weather: { description: string; icon: string }[];
};

type PollutionResp = {
  list: {
    main: { aqi: number };
    components: { pm2_5: number; pm10: number };
  }[];
};

app.get("/api/weather", async (req: Request, res: Response) => {
  const city = (req.query.city as string) || "London";
  const appKey = process.env.OPENWEATHER_KEY;

  if (!appKey) {
    return res.status(500).json({ message: "Missing OPENWEATHER_KEY" });
  }

  try {
    // 1. Weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=aab99919b19d55440c7beae6502294e1&units=metric`
    );
    const weatherData = (await weatherRes.json()) as WeatherResp;

    const { lat, lon } = weatherData.coord;
    const temp = weatherData.main.temp;
    const desc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;

    // 2. Pollution
    const pollutionRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=51.5085&lon=-0.1257&appid=aab99919b19d55440c7beae6502294e1`
    );
    const pollutionData = (await pollutionRes.json()) as PollutionResp;

    const aqi = pollutionData.list[0].main.aqi;
    const pm25 = pollutionData.list[0].components.pm2_5;
    const pm10 = pollutionData.list[0].components.pm10;

    res.json({
      city,
      temp,
      desc,
      iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      aqi,
      pm25,
      pm10,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
