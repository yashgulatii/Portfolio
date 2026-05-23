import { useEffect, useRef } from 'react';

export default function StarfieldVortex() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    const starCount = 200;

    // Track mouse coordinates
    const mouse = {
      x: window.innerWidth * 0.3,
      y: window.innerHeight * 0.5,
      targetX: window.innerWidth * 0.3,
      targetY: window.innerHeight * 0.5,
      isActive: false,
    };

    // Current vortex center
    const center = {
      x: window.innerWidth * 0.3,
      y: window.innerHeight * 0.5,
    };

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update default targets when window resizes
      if (!mouse.isActive) {
        mouse.targetX = window.innerWidth * 0.3;
        mouse.targetY = window.innerHeight * 0.5;
      }
    };

    // Helper to generate a single star
    const createStar = (isFirstTime = false) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Distribute stars outwards in a vortex radius
      const maxRadius = Math.max(width, height) * 0.85;
      // Exponential distribution to have more stars closer to the center
      const distance = Math.pow(Math.random(), 1.5) * maxRadius + 30;
      
      const angle = Math.random() * Math.PI * 2;
      
      // Keplerian-like orbital speed: closer stars orbit faster
      // Formula: speed = base_speed / distance^0.5 (or similar approximation)
      const speedFactor = 150 / (distance * 0.12 + 35);
      const angularSpeed = (0.0008 + Math.random() * 0.0016) * speedFactor;
      
      const radius = 0.5 + Math.random() * 1.5;
      
      // Palette selection: mostly white/blue stars, with some gold and brand accent green/yellow
      const rand = Math.random();
      let color;
      let isAccent = false;

      if (rand < 0.55) {
        color = 'rgba(240, 244, 255, '; // Pure bright white
      } else if (rand < 0.78) {
        color = 'rgba(165, 243, 252, '; // Celestial sky blue
      } else if (rand < 0.90) {
        color = 'rgba(254, 240, 138, '; // Soft pale gold
      } else {
        color = 'rgba(200, 245, 66, ';  // Brand lime-yellow (#c8f542)
        isAccent = true;
      }

      // Drag/elasticity factor when center moves
      const followSpeed = 0.02 + Math.random() * 0.06;
      
      // Initial calculated coordinates
      const startX = center.x + Math.cos(angle) * distance;
      const startY = center.y + Math.sin(angle) * distance;

      // Populate history trail
      const trail = [];
      const trailLength = 6 + Math.floor(Math.random() * 6);
      
      for (let i = 0; i < trailLength; i++) {
        trail.push({ x: startX, y: startY });
      }

      return {
        distance,
        angle,
        angularSpeed,
        radius,
        color,
        isAccent,
        followSpeed,
        twinkleSpeed: 0.008 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
        x: startX,
        y: startY,
        trail,
        trailLength,
      };
    };

    // Initialize starfield
    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(createStar(true));
      }
    };

    // Set up canvas and stars
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initStars();

    // Event handlers for mouse interaction
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = window.innerWidth * 0.3;
      mouse.targetY = window.innerHeight * 0.5;
      mouse.isActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Main animation loop
    const animate = () => {
      // 1. Draw solid black canvas background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Smoothly ease the vortex center towards mouse/default target coordinates
      const centerEasing = mouse.isActive ? 0.04 : 0.02;
      center.x += (mouse.targetX - center.x) * centerEasing;
      center.y += (mouse.targetY - center.y) * centerEasing;

      // 3. Update and draw stars
      stars.forEach((star) => {
        // Orbit update
        star.angle += star.angularSpeed;

        // Calculate ideal coordinates based on the current vortex center
        const idealX = center.x + Math.cos(star.angle) * star.distance;
        const idealY = center.y + Math.sin(star.angle) * star.distance;

        // Apply smooth lag interpolation for an organic fluid stretch feel
        star.x += (idealX - star.x) * star.followSpeed;
        star.y += (idealY - star.y) * star.followSpeed;

        // Manage coordinate trail history
        star.trail.push({ x: star.x, y: star.y });
        if (star.trail.length > star.trailLength) {
          star.trail.shift();
        }

        // Smooth sinusoidal twinkling
        star.phase += star.twinkleSpeed;
        const baseOpacity = 0.25 + Math.sin(star.phase) * 0.45;
        const opacity = Math.max(0.1, Math.min(0.9, baseOpacity));

        // Draw the curved motion blur trail (poly-line)
        if (star.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          for (let i = 1; i < star.trail.length; i++) {
            ctx.lineTo(star.trail[i].x, star.trail[i].y);
          }
          ctx.strokeStyle = star.color + opacity * 0.35 + ')';
          ctx.lineWidth = star.radius * 0.7;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw the bright glowing star head
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Add subtle radial glowing effects to larger and brand accent stars
        if (star.radius > 1.2 || star.isAccent) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.isAccent ? '#c8f542' : '#ffffff';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = star.color + opacity + ')';
        ctx.fill();
      });

      // Reset shadow blur to avoid affecting other drawing operations
      ctx.shadowBlur = 0;

      // Request next frame
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start rendering
    animate();

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
