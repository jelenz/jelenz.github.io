import HourlyForecast from "./HourlyForecast";
import HourlyMeteoData from "./HourlyMeteoData";
import TitleBar from "./TitleBar";

export type Location = {
  latitude: number;
  longitude: number;
};

export default function Page() {
  console.log("****** Generating Page");
  return (
    <div>
      <TitleBar />
    </div>
  );
}
