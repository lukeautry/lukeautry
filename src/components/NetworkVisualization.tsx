import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  originalX: number;
  originalY: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  color: string;
}

const NetworkVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({ x: 0, y: 0, isHovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse interaction handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Color palette: blue/cyan/magenta
    const colors = [
      '#06b6d4', // cyan-500
      '#22d3ee', // cyan-400
      '#0891b2', // cyan-600
      '#ec4899', // pink-500
      '#f472b6', // pink-400
      '#db2777', // pink-600
      '#3b82f6', // blue-500
      '#60a5fa', // blue-400
      '#2563eb', // blue-600
    ];

    // Create a more structured network layout
    const nodeCount = 15;
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const maxRadius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.4;

    // Create nodes in a more organized pattern
    for (let i = 0; i < nodeCount; i++) {
      let x, y;

      if (i === 0) {
        // Center node
        x = centerX;
        y = centerY;
      } else if (i <= 6) {
        // Inner ring
        const angle = (i - 1) * (Math.PI * 2) / 6;
        const radius = maxRadius * 0.4;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      } else {
        // Outer ring with some randomness
        const angle = (i - 7) * (Math.PI * 2) / 8 + Math.random() * 0.3;
        const radius = maxRadius * (0.7 + Math.random() * 0.3);
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      }

      nodes.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: i === 0 ? 5 : Math.random() * 2.5 + 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Create structured connections
    // Connect center to inner ring
    for (let i = 1; i <= 6; i++) {
      connections.push({
        from: 0,
        to: i,
        strength: 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Connect inner ring nodes to each other (some)
    for (let i = 1; i <= 6; i++) {
      const next = i === 6 ? 1 : i + 1;
      if (Math.random() > 0.3) {
        connections.push({
          from: i,
          to: next,
          strength: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    // Connect some inner ring to outer ring
    for (let i = 1; i <= 6; i++) {
      const outerConnections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < outerConnections; j++) {
        const target = 7 + Math.floor(Math.random() * 8);
        connections.push({
          from: i,
          to: target,
          strength: 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    // Some outer ring connections
    for (let i = 7; i < nodeCount; i++) {
      if (Math.random() > 0.6) {
        const target = 7 + Math.floor(Math.random() * 8);
        if (target !== i) {
          connections.push({
            from: i,
            to: target,
            strength: 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // Update nodes with gentle floating motion and mouse interaction
      nodes.forEach((node, index) => {
        const mouse = mouseRef.current;
        // Gentle attraction back to original position
        const attractionStrength = 0.02;
        let targetX = node.originalX;
        let targetY = node.originalY;

        // Mouse interaction: nodes are attracted to or repelled by cursor
        if (mouse.isHovering) {
          const mouseDistance = Math.sqrt(
            Math.pow(mouse.x - node.x, 2) + Math.pow(mouse.y - node.y, 2)
          );

          if (mouseDistance < 150) {
            // Close nodes: subtle attraction to cursor
            const mouseForce = (150 - mouseDistance) / 150;
            const mouseDx = (mouse.x - node.x) * mouseForce * 0.015;
            const mouseDy = (mouse.y - node.y) * mouseForce * 0.015;

            targetX = node.originalX + mouseDx * 20;
            targetY = node.originalY + mouseDy * 20;
          }
        }

        const dx = targetX - node.x;
        const dy = targetY - node.y;

        node.vx += dx * attractionStrength;
        node.vy += dy * attractionStrength;

        // Add some floating motion (faster and more pronounced)
        const time = Date.now() * 0.003;
        const floatIntensity = mouse.isHovering ? 0.02 : 0.03;
        node.vx += Math.sin(time + index) * floatIntensity;
        node.vy += Math.cos(time + index * 1.3) * floatIntensity;

        // Apply damping (less damping for more movement)
        node.vx *= 0.95;
        node.vy *= 0.95;

        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw connections with varied colors and mouse-based intensity
      ctx.lineWidth = 1.5;

      connections.forEach((connection) => {
        const mouse = mouseRef.current;
        const from = nodes[connection.from];
        const to = nodes[connection.to];

        // Calculate connection intensity based on mouse proximity
        let connectionIntensity = connection.strength * 0.7;

        if (mouse.isHovering) {
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const mouseDistance = Math.sqrt(
            Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2)
          );

          if (mouseDistance < 120) {
            const proximityBoost = (120 - mouseDistance) / 120;
            connectionIntensity += proximityBoost * 0.4;
          }
        }

        ctx.globalAlpha = Math.min(connectionIntensity, 1);
        ctx.strokeStyle = connection.color;

        // Add gradient for more visual interest
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, connection.color);
        gradient.addColorStop(1, connection.color + '40'); // Add transparency
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Draw nodes with enhanced glow effects
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      nodes.forEach((node) => {
        const mouse = mouseRef.current;
        // Calculate mouse proximity for enhanced glow
        let glowMultiplier = 1;
        if (mouse.isHovering) {
          const mouseDistance = Math.sqrt(
            Math.pow(mouse.x - node.x, 2) + Math.pow(mouse.y - node.y, 2)
          );

          if (mouseDistance < 100) {
            glowMultiplier = 1 + (100 - mouseDistance) / 100;
          }
        }

        // Outer glow layer (largest) - enhanced by mouse proximity
        ctx.globalAlpha = 0.2 * glowMultiplier;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 30 * glowMultiplier;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2 * glowMultiplier, 0, Math.PI * 2);
        ctx.fill();

        // Middle glow layer
        ctx.globalAlpha = 0.4 * glowMultiplier;
        ctx.shadowBlur = 20 * glowMultiplier;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow layer
        ctx.globalAlpha = 0.7;
        ctx.shadowBlur = 10;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Main node (solid) - slightly larger when hovered
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        const nodeRadius = node.radius * (glowMultiplier > 1 ? Math.min(glowMultiplier * 0.2 + 1, 1.3) : 1);
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright spot for depth
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(node.x - nodeRadius * 0.25, node.y - nodeRadius * 0.25, nodeRadius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default NetworkVisualization;