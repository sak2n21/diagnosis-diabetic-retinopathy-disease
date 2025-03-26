import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Chatbot = () => {
  const [reports, setReports] = useState([]);
  const [icNumber, setIcNumber] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  // Fetch reports from Firestore
  const fetchReports = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "classificationReports"));
      const reportsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsList);
      setFilteredReports(reportsList);
    } catch (error) {
      console.error("Error fetching reports: ", error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle search function
  const handleSearch = () => {
    setFilteredReports(
      icNumber ? reports.filter(report => report.patientIC.includes(icNumber)) : reports
    );
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">Patient Diagnosis History</h2>

      {/* Search Bar */}
      <div className="chatbot-search-container">
        <input
          type="text"
          placeholder="Enter IC Number"
          value={icNumber}
          onChange={(e) => setIcNumber(e.target.value)}
          className="chatbot-input"
        />
        <button onClick={handleSearch} className="chatbot-button">Search</button>
      </div>

      {/* Table Display */}
      {filteredReports.length > 0 ? (
        <div className="chatbot-table-container">
          <table className="chatbot-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>IC Number</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Diagnosis</th>
                <th>Report Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={report.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{report.patientName}</td>
                  <td>{report.patientIC}</td>
                  <td>{report.age}</td>
                  <td>{report.gender}</td>
                  <td>{report.classification}</td>
                  <td>{new Date(report.createdAt.seconds * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="chatbot-no-results">No reports found for the given IC number.</p>
      )}
    </div>
  );
};

export default Chatbot;

/* Styling */

const styles = `
.chatbot-container {
  max-width: 95%;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.chatbot-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.chatbot-search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.chatbot-input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chatbot-button {
  padding: 10px 20px;
  border-radius: 5px;
  background: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.chatbot-table-container {
  overflow-x: auto;
}

.chatbot-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  background: white;
}

.chatbot-table thead {
  background: #007BFF;
  color: white;
}

.chatbot-table th, .chatbot-table td {
  padding: 10px;
  text-align: left;
}

.even-row {
  background: #f2f2f2;
}

.odd-row {
  background: white;
}

.chatbot-no-results {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
