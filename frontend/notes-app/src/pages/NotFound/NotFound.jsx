import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Désolé, la page que vous recherchez n&apos;existe pas.
      </p>
      <Link to="/" style={styles.link}>
        Retour à la page d&apos;accueil
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
  },
  message: {
    fontSize: "1rem",
    color: "#666",
  },
  link: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default NotFound;
