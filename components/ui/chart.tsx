"use client";
import { BarChartProps } from "@/types/indes";
import ReactApexChart from "react-apexcharts";

const Chart: React.FC<BarChartProps> = ({ data, activeKeyIndex = 0 }) => {
  const categories = data.map((item) => item.year);
  console.log(data);

  const getColor = (seriesName: string) => {
    if (seriesName.includes("Revenue") || seriesName.includes("Keuntungan")) {
      return "#63AE1D";
    }
    if (seriesName === "Bright") {
      return "#E1222B";
    }
    return "#005CAB";
  };

  const series = Object.keys(data[0])
    .filter((key) => key !== "year")
    .map((key) => ({
      name: key,
      data: data.map((item) => item[key] as number),
    }));

  const colors = series.map((s) => getColor(s.name));

  const totalBars = data.reduce((acc, item) => {
    return acc + Object.keys(item).length - 1; // Exclude "year"
  }, 0);

  const chartWidth = totalBars * 70 + "px";

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: false,
    },
    xaxis: {
      categories: categories,
    },
    colors: colors,
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50px",
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    legend: {
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (value) =>
          activeKeyIndex > 0 ? `${value} unit` : `Rp${value} T`,
      },
    },
  };

  return (
    <section id="chart" style={{ minWidth: chartWidth }}>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="bar"
        height={350}
      />
    </section>
  );
};

export default Chart;
