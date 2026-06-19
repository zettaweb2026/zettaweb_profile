import React, { useEffect } from 'react';

export const ParticleBackground = () => {
  useEffect(() => {
    let retries = 0;
    const maxRetries = 30; // up to 3 seconds

    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 45,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: '#3fa7e6', // Logo blue
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.3,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#3fa7e6',
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'grab',
              },
              onclick: {
                enable: true,
                mode: 'push',
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 100,
                line_linked: {
                  opacity: 0.5,
                },
              },
              push: {
                particles_nb: 4,
              },
            },
          },
          retina_detect: true,
        });
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(initParticles, 100);
      }
    };

    initParticles();
  }, []);

  return <div id="particles-js" />;
};

export default ParticleBackground;