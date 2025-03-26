import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaUserCircle, FaClipboardList, FaCalendarCheck, FaCommentDots } from "react-icons/fa";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle feedback click
  const handleFeedbackClick = () => {
    alert("Feedback & Review feature coming soon!");
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* User Info */}
      <div style={styles.userInfo}>
        <FaUserCircle style={styles.userIcon} />
        {loading ? (
          <p style={styles.loadingText}>Loading user data...</p>
        ) : user ? (
          <>
            <h2>Welcome, {user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p style={styles.errorText}>User not found.</p>
        )}
      </div>

      {/* Quick Access */}
      <div style={styles.quickAccess}>
        <h3>Quick Access</h3>
        <div style={styles.accessGrid}>
          <div style={styles.accessItem}>
            <FaClipboardList style={styles.accessIcon} />
            <p>Medical History</p>
          </div>
          <div style={styles.accessItem}>
            <FaCalendarCheck style={styles.accessIcon} />
            <p>Upcoming Appointments</p>
          </div>
        </div>
      </div>

      {/* Feedback & Review */}
      <div style={styles.feedback} onClick={handleFeedbackClick}>
        <h3 style={styles.feedbackTitle}>
          <FaCommentDots style={styles.feedbackIcon} /> Feedback & Review
        </h3>
        <p>Click here to provide feedback or review our service</p>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    maxWidth: "95%",
    margin: "auto",
    padding: "40px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  userInfo: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  userIcon: {
    fontSize: "60px",
    color: "#003366",
    marginBottom: "10px",
  },
  quickAccess: {
    background: "#eef5ff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  accessGrid: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  },
  accessItem: {
    textAlign: "center",
    cursor: "pointer",
  },
  accessIcon: {
    fontSize: "30px",
    color: "#007bff",
  },
  feedback: {
    background: "#f8d7da",
    padding: "15px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  feedbackTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  feedbackIcon: {
    fontSize: "20px",
    color: "#dc3545",
  },
  loadingText: {
    color: "#555",
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
};

export default UserDashboard;
