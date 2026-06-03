import { Card, CardMedia, Stack, Typography } from "@mui/material";
import { PeriodForecast } from "./getHourlyMeteoData";
import { JSX } from "@emotion/react/jsx-dev-runtime";

export default function HourlyForecast(props: {
  period: PeriodForecast;
  timeZone: string;
}): JSX.Element | null {
  const now = new Date();
  if (new Date(props.period.startTime) < now) {
    return null;
  }
  return (
    <Card
      variant="outlined"
      sx={{
        padding: "12px",
        margin: "4px",
        width: "380px",
        align: "center",
        backgroundColor: props.period.isDaytime ? "#a0c4dd" : "#8c98a2"
      }}
      raised={true}
      key={props.period.startTime}
    >
      <Typography variant="h6">
        {new Date(props.period.startTime).toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          timeZone: props.timeZone,
          timeZoneName: "short"
        })}{" "}
        - {props.period.shortForecast}
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack
          direction="column"
          sx={{ justifyContent: "flex-start", alignContent: "space-between" }}
        >
          <Typography>
            Temperature:{" "}
            {Math.round((9 * props.period.temperature.value) / 5 + 32)}°F
          </Typography>
          <Typography>
            Precipitation Probability:{" "}
            {props.period.probabilityOfPrecipitation.value}%
          </Typography>
          <Typography>
            Humidity: {props.period.relativeHumidity.value}%
          </Typography>
          <Typography>
            Wind: {Math.round(0.6213712 * props.period.windSpeed.value)}
            {props.period.windGust &&
              ` (gust: ${Math.round(0.6213712 * props.period.windGust!.value)})`}
            {" mph "}
            {props.period.windDirection}
          </Typography>
        </Stack>
        <CardMedia
          component="img"
          src={props.period.icon.replace("small", "large")}
          title={props.period.icon}
          sx={{ width: "100px" }}
        />
      </Stack>
    </Card>
  );
}
