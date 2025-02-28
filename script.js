document.addEventListener("DOMContentLoaded", () => {
  // Animation for blocks to appear with a slight delay
  const blocks = document.querySelectorAll(".block");

  blocks.forEach((block, index) => {
    setTimeout(() => {
      block.style.opacity = "1";
      block.style.transform = "translateY(0)";

      // Add data packets to connectors
      const connector = block.querySelector(".connector");
      if (connector) {
        for (let i = 0; i < 3; i++) {
          const dataPacket = document.createElement("div");
          dataPacket.className = "data-packet";
          dataPacket.style.animationDelay = `${i * 1}s`;
          connector.appendChild(dataPacket);
        }
      }
    }, 300 * index);
  });

  // Horizontal scrolling functionality
  const blockchain = document.querySelector(".blockchain");
  const blockchainContainer = document.querySelector(".blockchain-container");

  // Create scroll indicators
  const scrollIndicators = document.createElement("div");
  scrollIndicators.className = "scroll-indicators";

  const leftIndicator = document.createElement("div");
  leftIndicator.className = "scroll-indicator";
  leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';

  const rightIndicator = document.createElement("div");
  rightIndicator.className = "scroll-indicator";
  rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';

  scrollIndicators.appendChild(leftIndicator);
  scrollIndicators.appendChild(rightIndicator);

  blockchainContainer.after(scrollIndicators);

  // Variables for smooth scrolling
  let scrollPosition = 0;
  const scrollStep = 340; // Width of block + gap
  const maxScroll = -(blocks.length * scrollStep - window.innerWidth + 100);

  // Update scroll position with smooth animation
  function updateScrollPosition() {
    blockchain.style.transform = `translateX(${scrollPosition}px)`;
  }

  // Scroll left
  leftIndicator.addEventListener("click", () => {
    scrollPosition = Math.min(0, scrollPosition + scrollStep);
    updateScrollPosition();
  });

  // Scroll right
  rightIndicator.addEventListener("click", () => {
    scrollPosition = Math.max(maxScroll, scrollPosition - scrollStep);
    updateScrollPosition();
  });

  // Mouse wheel scrolling
  blockchainContainer.addEventListener("wheel", (e) => {
    e.preventDefault();

    // Determine scroll direction and amount
    const delta = e.deltaY || e.deltaX;
    const scrollAmount = delta > 0 ? -scrollStep / 3 : scrollStep / 3;

    // Apply scroll with limits
    scrollPosition = Math.max(
      maxScroll,
      Math.min(0, scrollPosition + scrollAmount)
    );
    updateScrollPosition();
  });

  // Touch scrolling
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startScrollPosition = 0;

  blockchainContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    startScrollPosition = scrollPosition;
    isDragging = true;
  });

  blockchainContainer.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    touchEndX = e.touches[0].clientX;
    const diff = touchEndX - touchStartX;

    // Apply scroll with limits
    scrollPosition = Math.max(
      maxScroll,
      Math.min(0, startScrollPosition + diff)
    );
    updateScrollPosition();
  });

  blockchainContainer.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Mouse drag scrolling
  blockchainContainer.addEventListener("mousedown", (e) => {
    touchStartX = e.clientX;
    startScrollPosition = scrollPosition;
    isDragging = true;
    blockchainContainer.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    touchEndX = e.clientX;
    const diff = touchEndX - touchStartX;

    // Apply scroll with limits
    scrollPosition = Math.max(
      maxScroll,
      Math.min(0, startScrollPosition + diff)
    );
    updateScrollPosition();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    blockchainContainer.style.cursor = "grab";
  });

  // Initialize cursor style
  blockchainContainer.style.cursor = "grab";

  // Add hover effect for blocks
  blocks.forEach((block) => {
    block.addEventListener("mouseenter", () => {
      block.style.transform = "translateY(-10px) scale(1.05)";
      block.style.zIndex = "10";
    });

    block.addEventListener("mouseleave", () => {
      block.style.transform = "translateY(0) scale(1)";
      block.style.zIndex = "1";
    });
  });

  // Resize handler
  window.addEventListener("resize", () => {
    // Recalculate max scroll on window resize
    const maxScroll = -(blocks.length * scrollStep - window.innerWidth + 100);

    // Ensure scroll position is still valid
    scrollPosition = Math.max(maxScroll, Math.min(0, scrollPosition));
    updateScrollPosition();
  });
});

// Add a subtle particle background effect with connected dots
function createParticleBackground() {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-background";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";
  canvas.style.opacity = "0.5";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Particle properties
  const particleCount = 50;
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = "#3d7aff";
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Draw connections between nearby particles
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = "#3d7aff";
    ctx.lineWidth = 0.5;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// Initialize particle background
createParticleBackground();
