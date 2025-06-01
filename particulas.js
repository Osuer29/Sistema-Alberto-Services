tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    background: {
        color: { value: "#f4f4f9" }
    },
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                area: 800
            }
        },
        color: {
            value: ["#a5b4fc", "#f9a8d4", "#6ee7b7", "#fcd34d", "#93c5fd"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.4,
            random: true
        },
        size: {
            value: { min: 2, max: 4 },
            random: true
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: {
                default: "bounce"
            },
            attract: {
                enable: false
            }
        },
        collisions: {
            enable: true
        }
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "attract"
            },
            onClick: {
                enable: true,
                mode: "repulse"
            },
            resize: true
        },
        modes: {
            attract: {
                distance: 200,
                duration: 0.4,
                speed: 1.5
            },
            repulse: {
                distance: 200,
                duration: 0.6
            }
        }
    },
    detectRetina: true
});
