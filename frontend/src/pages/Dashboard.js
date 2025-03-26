import React from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import bgImage from "../components/bg6.jpg";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();

  const barChartData = {
    labels: ["Diagnosed", "Recovered", "At Risk"],
    datasets: [
      {
        label: "Number of Cases",
        data: [150, 80, 50],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Diagnosed", "Recovered", "At Risk"],
    datasets: [
      {
        data: [150, 80, 50],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <section style={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={styles.heroContent}
        >
          <div style={styles.textContent}>
            <p style={styles.subTitle}>PURPOSE OF DRD</p>
            <h1 style={styles.mainTitle}>
              Non-Proliferative Diabetic Retinopathy Diagnosis System
            </h1>
            <p style={styles.description}>
              AI-powered retinal image analysis for early detection and better
              outcomes.
            </p>
            <motion.button
              style={styles.ctaButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/upload')}
            >
              GET STARTED
            </motion.button>
          </div>
          <div style={styles.imageContainer}>
            <img
              src={bgImage}
              alt="AI Retinal Analysis"
              style={styles.heroImage}
            />
          </div>
        </motion.div>
      </section>

      <motion.section
        id="how-it-works"
        style={styles.howItWorksSection}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionDescription}>
          Our AI-driven system simplifies diabetic retinopathy detection in
          three easy steps.
        </p>
        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              style={styles.stepBox}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.stepIcon}>{step.icon}</div>
              <div style={styles.stepDetail}>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.description}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section style={styles.statsSection}>
        <h2 style={styles.sectionTitle}>Diabetic Retinopathy Statistics</h2>
        <div style={styles.chartsContainer}>
          <div style={styles.chartBox}>
            <h3>Case Distribution</h3>
            <Bar data={barChartData} />
          </div>
          <div style={styles.chartBox}>
            <h3>Percentage Breakdown</h3>
            <Pie data={pieChartData} />
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>
          &copy; 2025 Diabetic Retinopathy Diagnosis System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

const steps = [
  {
    icon: "01",
    title: "Upload Your Image",
    description:
      "Submit a high-quality retinal image for AI analysis with secure processing.",
  },
  {
    icon: "02",
    title: "AI-Powered Analysis",
    description:
      "Our AI examines the image to detect potential signs of diabetic retinopathy.",
  },
  {
    icon: "03",
    title: "Receive Your Report",
    description:
      "Get a detailed diagnostic report with insights and recommended actions.",
  },
];

const styles = {
  container: { fontFamily: "Arial, sans-serif" },
  heroSection: { height: "100vh", padding: "8% 10%" },
  heroContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textContent: { width: "50%", textAlign: "left" },
  imageContainer: { width: "50%", display: "flex", justifyContent: "center" },
  heroImage: { width: "100%", maxWidth: "500px", borderRadius: "12px" },
  subTitle: { fontWeight: "semibold", fontSize: "25px" },
  mainTitle: { fontSize: "50px", fontWeight: "bold", marginBottom: "55px" },
  description: { marginBottom: "50px", fontSize: "16px" },
  ctaButton: {
    padding: "14px 28px",
    fontSize: "15px",
    background: "#003366",
    color: "white",
    borderRadius: "25px",
    cursor: "pointer",
    border: "none",
  },
  howItWorksSection: {
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  sectionTitle: { fontSize: "30px", fontWeight: "bold" },
  sectionDescription: { fontSize: "18px", marginBottom: "30px" },
  stepsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "50px",
  },
  stepBox: {
    width: "80%",
    padding: "25px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #d5d5d5",
    backgroundColor: "#f9f9f9",
  },
  stepIcon: {
    fontSize: "50px",
    fontWeight: "bold",
    padding: "20px",
    marginRight: "50px",
  },
  stepDetail: { textAlign: "left" },
  statsSection: {
    padding: "60px 20px",
    backgroundColor: "#f3f4f6",
    textAlign: "center",
  },
  chartsContainer: { display: "flex", justifyContent: "center", gap: "40px" },
  chartBox: { width: "40%" },
  footer: {
    padding: "20px",
    backgroundColor: "#003366",
    color: "white",
    textAlign: "center",
  },
};

export default Dashboard;
