import React, { useState } from "react";
import { Loader2, UploadCloud, Download } from "lucide-react";
import { db, storage } from "../firebaseConfig"; // Import Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patient, setPatient] = useState({
    name: "",
    ic: "",
    age: "",
    gender: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("❌ Please upload a valid image file (JPG, PNG, etc.).");
      setFile(null);
      setPreview(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setMessage("❌ File is too large. Please upload an image under 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    // Revoke the previous preview to prevent memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(selectedFile)); // Set new preview
  };

  const handleUpload = async () => {
    if (!file) {
        setMessage("⚠️ Please select an image first.");
        return;
    }

    setLoading(true);
    setProgress(20);
    const formData = new FormData();
    formData.append("file", file); // Ensure key matches Flask backend

    try {
        setProgress(50);
        const response = await fetch("http://127.0.0.1:5001/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setProgress(80);
        const data = await response.json();
        setResult(data);
        setMessage("✅ Image uploaded successfully!");
        setProgress(100);
    } catch (error) {
        setMessage("❌ Error uploading image.");
        console.error("Upload error:", error);
    } finally {
        setLoading(false);
        setTimeout(() => setProgress(0), 1000);
    }
};


  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setMessage("");
    setResult(null);
  };

  const handleInputChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    // Ensure patient details are filled
    if (!patient.name || !patient.ic || !patient.age || !patient.gender) {
      setShowPatientForm(true);
      return;
    }

    try {
      setMessage("🔄 Generating report...");

      // Generate the classification report
      const report = `
    Patient Name: ${patient.name}
    IC: ${patient.ic}
    Age: ${patient.age}
    Gender: ${patient.gender}

    Diagnosis Classification: ${result.classification}
    `;

      // Create a Blob object and download the report as a text file
      const blob = new Blob([report], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Classification_Report_${patient.ic}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save the report in Firestore
      await addDoc(collection(db, "classificationReports"), {
        patientName: patient.name,
        patientIC: patient.ic,
        age: patient.age,
        gender: patient.gender,
        classification: result.classification,
        createdAt: new Date(),
      });
      setShowPatientForm(false);
      setMessage("✅ Report downloaded and saved to Firebase!");
    } catch (error) {
      setMessage("❌ Error generating or saving report.");
      console.error("Error generating or saving report:", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Diabetic Retinopathy Detection</h1>
        <p style={styles.heroText}>
          Upload your retinal image to analyze potential risks.
        </p>
      </header>

      <div style={styles.content}>
        <div style={styles.leftSide}>
          <h2 style={styles.title}>Upload Retinal Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.input}
          />

          {file && (
            <p style={{ fontSize: "14px", color: "#374151" }}>
              <strong>File:</strong> {file.name} (
              {(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          {preview && (
            <img src={preview} alt="Preview" style={styles.preview} />
          )}

          <div style={styles.buttonContainer}>
            <button
              onClick={handleUpload}
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <Loader2 style={styles.icon} className="animate-spin" />
              ) : (
                <UploadCloud style={styles.icon} />
              )}
              {loading ? "Uploading..." : "Diagnosis"}
            </button>

            <button
              onClick={handleClear}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "7px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          {progress > 0 && (
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          )}
          {message && <p style={styles.message}>{message}</p>}
        </div>

        <div style={styles.rightSide}>
          <h2 style={styles.title}>Detection Results</h2>
          {!result ? (
            <p style={styles.placeholder}>
              Please upload an image to see the detection results.
            </p>
          ) : (
            <div style={styles.resultBigContainer}>
              <div style={styles.resultContainer}>
                <p style={styles.resultText}>
                  <strong>Classification Level:</strong> {result.classification}
                </p>
                <p style={styles.resultText}>
                  <strong>Justification:</strong> {result.justification}
                </p>
                <p style={styles.resultText}>
                  <strong>Danger Level:</strong> {result.danger}
                </p>
                <button onClick={handleDownload} style={styles.button}>
                  <Download /> Download Report
                </button>
              </div>
              {showPatientForm && (
                <div style={styles.modalBackground}>
                  <div style={styles.formContainer}>
                    <h3 style={styles.formTitle}>Enter Patient Details</h3>
                    <input
                      type="text"
                      name="name"
                      placeholder="Patient Name"
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                    <input
                      type="text"
                      name="ic"
                      placeholder="IC Number"
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                    <select
                      name="gender"
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <div style={styles.buttonContainer}>
                      <button
                        onClick={handleDownload}
                        style={styles.buttonPrimary}
                      >
                        Submit & Download
                      </button>
                      <button
                        onClick={() => setShowPatientForm(false)}
                        style={styles.buttonSecondary}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div style={styles.resultContainer}>
                <h3 style={styles.subheading}>🩺 Treatment Plan</h3>
                <ul style={styles.list}>
                  {result?.detail ? (
                    result.detail
                      .split("\n")
                      .map((line, index) =>
                        line.trim() ? (
                          <li
                            key={index}
                            dangerouslySetInnerHTML={{ __html: line }}
                          />
                        ) : null
                      )
                  ) : (
                    <li>No details available.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer style={styles.footer}>
        <p>
          &copy; 2025 Diabetic Retinopathy Diagnosis System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  heroSection: {
    padding: "20px",
    background: "#3b82f6",
    color: "white",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: "10px",
    textAlign: "left",
  },

  list: {
    textAlign: "left",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#374151",
    paddingLeft: "20px",
  },

  heroTitle: { fontSize: "24px", fontWeight: "bold" },
  heroText: { fontSize: "16px" },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  leftSide: {
    textAlign: "center",
    paddingRight: "10px",
    borderRight: "2px solid #e5e7eb",
  },
  rightSide: { textAlign: "center", paddingLeft: "10px" },
  title: { fontSize: "18px", fontWeight: "bold", color: "#374151" },
  input: {
    width: "95%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  preview: {
    maxWidth: "100%",
    maxHeight: "200px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "8px",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "7px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginRight: "10px",
  },
  progressBar: {
    height: "5px",
    backgroundColor: "#2563eb",
    borderRadius: "5px",
    transition: "width 0.4s ease",
  },
  message: { fontSize: "14px", marginTop: "10px", fontWeight: "bold" },
  resultBigContainer: {
    display: "flex",
    flexDirection: "column",
  },
  resultContainer: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
    marginBottom: "30px",
  },
  detailContainer: {
    background: "grey",
  },
  placeholder: { fontSize: "14px", color: "#9ca3af" },
  footer: {
    padding: "20px",
    backgroundColor: "#003366",
    color: "white",
    textAlign: "center",
    marginTop: "auto",
  },
  modalBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay effect
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  formContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  },

  formTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "15px",
  },

  // buttonContainer: {
  //   display: "flex",
  //   marginTop: "10px",
  // },

  buttonPrimary: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    flex: 1,
    marginRight: "5px",
  },

  buttonSecondary: {
    backgroundColor: "#d1d5db",
    color: "#374151",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    flex: 1,
    marginLeft: "5px",
  },
};

export default UploadImage;
