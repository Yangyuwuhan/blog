// Colorful mouse trail and click fireworks effect
(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Style canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';

    // Trail points
    const trail = [];
    const trailLength = 15;

    // Fireworks particles
    const particles = [];

    // Generate random color
    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 100%, 50%)`;
    }

    // Mouse move event
    document.addEventListener('mousemove', function (e) {
        trail.push({
            x: e.clientX,
            y: e.clientY,
            opacity: 1,
            color: getRandomColor()
        });

        // Limit trail length
        if (trail.length > trailLength) {
            trail.shift();
        }
    });

    // Mouse click event for fireworks
    document.addEventListener('click', function (e) {
        // Create fireworks particles
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 4 + 2;

            particles.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                opacity: 1,
                color: getRandomColor(),
                size: Math.random() * 3 + 1,
                gravity: 0.1
            });
        }
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trail
        for (let i = 0; i < trail.length; i++) {
            const point = trail[i];

            // Calculate size based on position in trail
            const size = (i + 1) * 6 / trail.length;

            // Draw circle
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.globalAlpha = point.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Fade out
            point.opacity -= 0.05;
        }

        // Draw fireworks particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Fade out
            particle.opacity -= 0.02;

            // Remove invisible particles
            if (particle.opacity <= 0) {
                particles.splice(i, 1);
            }
        }

        // Remove invisible trail points
        while (trail.length > 0 && trail[0].opacity <= 0) {
            trail.shift();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();