import Chart from "react-apexcharts";
import { useState } from "react";
import { useEffect } from "react";
import { format } from "date-fns";

function ForecastChart({ filteredForecast }) {
  const [chartOption, setChartOption] = useState(null);

  useEffect(() => {
    if (filteredForecast.length) {
      const initialOption = {
        series: [
          {
            name: "5 Day Weather",
            data: [],
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "area",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: [],
          },
          title: {
            text: "Weather Forecast",
            align: "left",
          },
          subtitle: {
            text: "5 Day Weather Forcast Analysis",
            align: "left",
          },
        },
      };

      const categories = filteredForecast.map((forecast) => {
        return format(new Date(forecast.dt_txt), "eeee");
      });

      const data = filteredForecast.map((forecast) => {
        return forecast.main.feels_like;
      });

      initialOption.options.xaxis.categories = categories;
      initialOption.series[0].data = data;

      setChartOption(initialOption);
    }
  }, [filteredForecast]);

  let chartHtml = chartOption ? (
    <div className="apex-chart" style={{ marginTop: "20px" }}>
      <Chart
        options={chartOption.options}
        series={chartOption.series}
        type="area"
        width="100%"
        height="300"
      />
    </div>
  ) : null;

  return <section>{chartHtml}</section>;
}

export default ForecastChart;
