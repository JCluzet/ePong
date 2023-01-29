import Header from "../components/Header";
import ParticleBackground from "../particlesBackground/ParticleBackground";
import Button from "@mui/material/Button";

export default function NotFound() {
  return (
    <div>
      <Header />
      <ParticleBackground />

      <br />
      <div className="center">
        <div className="error-404-container">
          <h1>404</h1>
          <h2>Are you lost?</h2>
          <Button
            variant="outlined"
            size="large"
            color="error"
            href="/"
            sx={{ width: "100%", marginTop: "20px" }}
          >
            Go back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
