// Inicialización de AOS, GSAP, ScrollTrigger y VanillaTilt
document.addEventListener('DOMContentLoaded', () => {
  // 1) AOS
  AOS.init({ duration: 700, once: true });

  // 2) GSAP + ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 2.1) Animación del hero (texto y botón)
  gsap.from('.lead', {
    duration: 1.2,
    y: -30,
    opacity: 0,
    ease: 'power3.out'
  });
  gsap.from('.btn-primary', {
    duration: 1,
    scale: 0.5,
    opacity: 0,
    delay: 0.3,
    ease: 'back.out(1.7)'
  });

  // 2.2) Animación de las cards al hacer scroll
  gsap.utils.toArray('.card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // 3) Efecto tilt sobre las cards
  VanillaTilt.init(document.querySelectorAll('.card'), {
    max: 15,
    speed: 300,
    glare: true,
    'max-glare': 0.2
  });

  // 4) Bounce sutil al pasar por el botón de WhatsApp
  document.querySelectorAll('.btn-feedback').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power1.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power1.out' });
    });
  });
  

// Actualiza el mensaje de WhatsApp con el color seleccionado
  const colorSelect = document.getElementById('colorSelect');
  const waText = document.getElementById('wa_text');
  if (colorSelect && waText) {
    const baseText = waText.value;
    const updateText = () => {
      const color = colorSelect.value;
      waText.value = baseText.replace('COLOR_PLACEHOLDER', 'color ' + color);
    };
    colorSelect.addEventListener('change', updateText);
    updateText();
  }
});
