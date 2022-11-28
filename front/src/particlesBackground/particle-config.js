const particlesConfig = {
    background: {
        color: {
            value: '#e7e7e7'
        }
    },
    FullScreen: {
        enable: true,
        zIndex: -1
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 10
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: '#000000'
        },
        collisions: {
            enable: true
        },
        move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 15,
            straight: true
        },
        number: {
            density: {
                enable: true,
                area: 800
            },
            value: 2
        },
        opacity: {
            value: 1
        },
        shape: {
            type: 'circle'
        },
        size: {
            random: false,
            value: 50
        }
    },
    detectRetina: true
  };

export default particlesConfig