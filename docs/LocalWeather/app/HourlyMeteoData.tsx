import { JSX } from "react";
import { Typography } from "@mui/material";
import { MeteoData, PointData } from "./getHourlyMeteoData";
import HourlyForecast from "./HourlyForecast";

export default function HourlyMeteoData(props: {
  pointData: PointData;
  meteoData: MeteoData;
}): JSX.Element {
  const s: string =
    `Forecast for ${props.pointData.relativeLocation.distance.toFixed(2)} miles ${props.pointData.relativeLocation.direction}` +
    ` of ${props.pointData.relativeLocation.city}, ${props.pointData.relativeLocation.state}` +
    ` created at ${props.meteoData.updateTime}`;
  console.log(`HourlyMeteoData: ${s}`);
  return (
    <>
      <div>
        <Typography sx={{ marginLeft: "8px", marginTop: "8px" }}>
          {s}
        </Typography>
        <Typography sx={{ marginLeft: "8px" }}>
          {`Elevation: ${props.meteoData.elevation.toFixed()} feet`}
        </Typography>
        <Typography sx={{ marginLeft: "8px" }}>
          Local time:{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            timeZone: props.pointData.timeZone,
            timeZoneName: "short"
          })}
        </Typography>
        <Typography sx={{ marginLeft: "8px" }}>
          Sunrise: {props.pointData.astronomicalData.sunrise} | Sunset:{" "}
          {props.pointData.astronomicalData.sunset}
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {props.meteoData.periods.map((period, index) => (
            <HourlyForecast
              period={period}
              timeZone={props.pointData.timeZone}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}
