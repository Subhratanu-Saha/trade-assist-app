import React from "react";

const CustomerRecord = ({ customer }) => {
  if (!customer) return <p>Loading...</p>;

  const items = [
    {
      label: "Phone Number",
      value: customer.phone,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M6.6 4.8h10.8a1.8 1.8 0 0 1 1.8 1.8v10.8a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8V6.6a1.8 1.8 0 0 1 1.8-1.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M6.6 7.8h10.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M9 15.6h6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Email Address",
      value: customer.email,
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M5 7.2h14a1.2 1.2 0 0 1 1.2 1.2v7.2a1.2 1.2 0 0 1-1.2 1.2H5A1.2 1.2 0 0 1 3.8 15.6V8.4A1.2 1.2 0 0 1 5 7.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="m4.8 8.4 7.2 5.4 7.2-5.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.border} />
      <div style={styles.content}>
        <p style={styles.eyebrow}>Customer Record</p>
        <h2 style={styles.name}>{customer.name}</h2>

        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.label} style={styles.row}>
              <div style={styles.icon}>{item.icon}</div>
              <div>
                <p style={styles.label}>{item.label}</p>
                <p style={styles.value}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    maxWidth: "620px",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: "24px",
    background: "linear-gradient(135deg,#0f172a,#111827)",
    boxShadow: "0 18px 45px rgba(2,6,23,0.35)",
    padding: "22px",
    position: "relative",
    overflow: "hidden",
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "3px",
    background: "linear-gradient(90deg,#38bdf8,#818cf8,#f472b6)",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  eyebrow: {
    margin: "0 0 8px",
    fontSize: "12px",
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "#7dd3fc",
    fontWeight: 700,
  },
  name: {
    margin: "0 0 16px",
    fontSize: "28px",
    color: "#f8fafc",
    fontWeight: 700,
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(148,163,184,0.18)",
  },
  icon: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    background: "rgba(125,211,252,0.12)",
    color: "#7dd3fc",
    flexShrink: 0,
  },
  label: {
    margin: "0 0 4px",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#94a3b8",
    fontWeight: 600,
  },
  value: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "15px",
    fontWeight: 600,
  },
};

export default CustomerRecord;