'use client';

import { useEffect } from 'react';

export default function ScrollRevealClient() {
  useEffect(() => {
    // Initialize IntersectionObserver for scroll reveal animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after revealing for performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
