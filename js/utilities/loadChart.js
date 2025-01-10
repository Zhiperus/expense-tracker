let pieChart;

export const loadChart = (chartInfo, Options) => {
  const ctx = document.getElementById("pieChart").getContext("2d");

  // Destroy the existing chart if it exists
  if (pieChart) {
    pieChart.destroy();
  }

  // Create a new chart
  pieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: chartInfo.labels,
      datasets: [
        {
          data: chartInfo.data,
          backgroundColor: ["#00A9CE", "#005F73", "#94D2BD", "#FFDDD2"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
    plugins: [
      {
        id: "centerText",
        beforeDraw(chart) {
          const { width } = chart;
          const { height } = chart;
          const ctx = chart.ctx;
          ctx.save();
          ctx.font = "bold 40px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#333";

          const centerX = width / 2;
          const centerY = height / 2;

          ctx.fillText(
            `${Options.currency}${chartInfo.total}`,
            centerX,
            centerY - 10
          );
          ctx.font = "15px Arial";
          ctx.fillText(
            `of ${Options.currency}${chartInfo.limit} limit`,
            centerX,
            centerY + 30
          );
        },
      },
    ],
  });
};
