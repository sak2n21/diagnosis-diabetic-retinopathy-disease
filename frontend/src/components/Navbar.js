import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Hide Navbar on Login and Signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>DRD</h1>
      <div style={styles.navLinks}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/upload" style={styles.link}>Diagnosis</Link>
        <Link to="/chatbot" style={styles.link}>Retrieval</Link>
        <Link to="/account" style={styles.link}>Account</Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#003366",
    padding: "15px 20px",
    color: "white"
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold"
  },
  navLinks: {
    display: "flex",
    gap: "15px"
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "16px",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
  linkHover: {
    backgroundColor: "#34495e"
  }
};

export default Navbar;
