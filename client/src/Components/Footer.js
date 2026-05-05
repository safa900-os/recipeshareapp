const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        recipeshare@gmail.com | ©2026 | RecipeShare | All Rights Reserved.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#8a6a3a",  // warm brown — food theme
    padding: "18px",
    textAlign: "center",
    marginTop: "auto",
  },
  text: {
    color: "#fff",
    fontSize: "13px",
    margin: 0,
    fontFamily: "Arial, sans-serif",
    fontWeight: "600",
  },
};

export default Footer;