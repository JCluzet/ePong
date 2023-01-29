const particlesConfig = {
  background: {
    color: {
      value: "#FFFFFF",
    },
  },
  FullScreen: {
    enable: true,
    zIndex: -1,
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 10,
      },
      push: {
        quantity: 1,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#000000",
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 25,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 1,
    },
    opacity: {
      value: 1,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: false,
      value: 50,
    },
  },
  detectRetina: true,
};

export default particlesConfig;
