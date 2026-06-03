"use server";

export type PointData = {
  timeZone: string;
  astronomicalData: { sunrise: string; sunset: string };
  relativeLocation: {
    city: string;
    state: string;
    distance: number;
    direction: string;
  };
};

export type UnitVaue = {
  unitCode: string;
  value: number;
};

export type PeriodForecast = {
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: UnitVaue;
  probabilityOfPrecipitation: UnitVaue;
  relativeHumidity: UnitVaue;
  windSpeed: UnitVaue;
  windGust: UnitVaue | null;
  windDirection: string;
  icon: string;
  shortForecast: string;
};

export type MeteoData = {
  generatedAt: string;
  updateTime: string;
  elevation: number;
  periods: PeriodForecast[];
};

function getCardinalDirection(degrees: number): string {
  const cd: string[] = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
  ];
  return cd[Math.floor((11.25 + degrees) / 22.5) % 16];
}

export default async function getHourlyMeteoData(
  latitude: number,
  longitude: number
): Promise<{ pointData: PointData; meteoData: MeteoData }> {
  let pointData: PointData;
  let resp: any;
  if (isNaN(latitude) || isNaN(longitude)) {
    return null as unknown as { pointData: PointData; meteoData: MeteoData };
  }
  console.log(`******* Fetching data for: ${latitude}, ${longitude}`);
  try {
    const astro = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/geo+json"
        }
      }
    );
    if (astro.ok) {
      resp = (await astro.json()).properties;
      pointData = {
        timeZone: resp.timeZone,
        astronomicalData: {
          sunrise: resp.astronomicalData.sunrise,
          sunset: resp.astronomicalData.sunset
        },
        relativeLocation: {
          city: resp.relativeLocation.properties.city,
          state: resp.relativeLocation.properties.state,
          distance:
            resp.relativeLocation.properties.distance.value * 0.000621371, // Convert m to miles
          direction: getCardinalDirection(
            resp.relativeLocation.properties.bearing.value
          )
        }
      };
      console.log("******* Fetch point response: ", resp.forecastHourly);
    } else {
      throw new Error(`Fetch response: ${astro.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching point data: ", error);
    throw new Error(`Error fetching point data: ${error}`);
  }

  pointData.astronomicalData.sunrise = new Date(
    pointData.astronomicalData.sunrise
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: resp.timeZone,
    timeZoneName: "short"
  });
  pointData.astronomicalData.sunset = new Date(
    pointData.astronomicalData.sunset
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: resp.timeZone,
    timeZoneName: "short"
  });

  let meteoData: MeteoData;
  let timeofForecast: string;
  try {
    const meteo = await fetch(resp.forecastHourly, {
      method: "GET",
      headers: {
        "Content-Type": "application/geo+json",
        "Feature-Flags": "forecast_temperature_qv,forecast_wind_speed_qv"
      }
    });
    if (meteo.ok) {
      timeofForecast = new Date(meteo.headers.get("date")!).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          timeZone: resp.timeZone,
          timeZoneName: "short"
        }
      );
      resp = (await meteo.json()).properties;
      meteoData = {
        generatedAt: new Date(resp.generatedAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          timeZone: resp.timeZone,
          timeZoneName: "short"
        }),
        updateTime: new Date(resp.updateTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          timeZone: resp.timeZone,
          timeZoneName: "short"
        }),
        elevation: resp.elevation.value * 3.28084,
        periods: resp.periods
      };
      console.log(
        `******* Fetch meteo: {genetatedAt: ${meteoData.generatedAt}, updateTime: ${meteoData.updateTime}, elevation: ${meteoData.elevation}}`
      );
    } else {
      throw new Error(`Fetch response: ${meteo.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching weather data: ", error);
    throw new Error(`Error fetching weather data: ${error}`);
  }
  const s: string = `getHourlyMeteoData: Forecast for ${pointData.relativeLocation.distance.toFixed(2)} miles ${pointData.relativeLocation.direction} of ${pointData.relativeLocation.city}, ${pointData.relativeLocation.state} at ${timeofForecast}`;
  console.log(s);
  return { pointData, meteoData };
}
