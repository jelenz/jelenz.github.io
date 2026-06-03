"use client";
import {
  AppBar,
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { JSX, useState, useTransition } from "react";
import { Location } from "./page";
import HourlyMeteoData from "./HourlyMeteoData";
import getHourlyMeteoData from "./getHourlyMeteoData";
import { PointData, MeteoData } from "./getHourlyMeteoData";

type Forecast = { pointData: PointData; meteoData: MeteoData };

const initialLocation: Location = {
  latitude: 43.54776,
  longitude: -72.26287
};
export default function TitleBar(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [latitude, setLatInput] = useState<number>(initialLocation.latitude);
  const [longitude, setLonInput] = useState<number>(initialLocation.longitude);
  const [nextForecast, setNextForecast] = useState<Forecast | null>(null);

  function onClick(): void {
    startTransition(async () => {
      getHourlyMeteoData(latitude, longitude).then(
        (forecast) => {
          console.log("****** onClick", forecast);
          setNextForecast(forecast);
        },
        () => setNextForecast(null)
      );
    });
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Local Weather Forcast
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <TextField
              id="latitude-input"
              label="Latitude"
              defaultValue="43.54776"
              size="small"
              disabled={isPending}
              style={{ marginRight: "8px", color: "white", width: "100px" }}
              onChange={(e) => {
                const lat: number = parseFloat(e.target.value);
                if (isNaN(lat)) return;
                setLatInput(lat);
              }}
            />
            <TextField
              id="longitude-input"
              label="Longitude"
              defaultValue="-72.26287"
              size="small"
              disabled={isPending}
              style={{ marginRight: "8px", color: "white", width: "100px" }}
              onChange={(e) => {
                const lon: number = parseFloat(e.target.value);
                if (isNaN(lon)) return;
                setLonInput(lon);
              }}
            />
            <Button
              variant="contained"
              style={{ fontSize: 12, padding: 4 }}
              disabled={isPending}
              onClick={onClick}
            >
              Get forecast
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      {/* <Typography variant="h6" sx={{ margin: "12px" }}>
        Weather forecast for ({latitude}, {longitude})
      </Typography> */}
      {nextForecast ? (
        <HourlyMeteoData
          pointData={nextForecast.pointData}
          meteoData={nextForecast.meteoData}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
