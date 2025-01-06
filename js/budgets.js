import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";

const ctx = document.getElementById("pieChart").getContext("2d");
const pieChart = new Chart(ctx, {
  type: "doughnut", // Change the chart type to 'doughnut'
  data: {
    labels: ["Food", "Transport", "Entertainment", "Others"],
    datasets: [
      {
        data: [338, 200, 300, 137], // Adjust values to match the image example
        backgroundColor: ["#00A9CE", "#005F73", "#94D2BD", "#FFDDD2"], // Use colors similar to the image
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    cutout: "70%", // Creates the inner hollow circle for a donut look
    plugins: {
      legend: {
        display: false, // Hides legend to focus on the center label
      },
      tooltip: {
        enabled: true,
      },
    },
  },
});

// Central Text for the Doughnut Chart
const centerText = {
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

    ctx.fillText("$338", centerX, centerY - 10);
    ctx.font = "15px Arial";
    ctx.fillText("of $975 limit", centerX, centerY + 30);
  },
};

Chart.register(centerText);

const expenseOptions = Options.expenseCategories.map(
  (cat) => `<option value=${cat}>${cat}</option>`
);

document.getElementById("category").innerHTML = expenseOptions;
