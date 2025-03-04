document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Connect button interaction
  const connectButton = document.querySelector(".connect-button");
  if (connectButton) {
    connectButton.addEventListener("click", () => {
      const connectDot = connectButton.querySelector(".connect-dot");
      const isConnected =
        connectDot.style.backgroundColor === "var(--success-color)" ||
        getComputedStyle(connectDot).backgroundColor === "rgb(30, 185, 128)";

      if (isConnected) {
        connectDot.style.backgroundColor = "var(--error-color)";
        connectButton.innerHTML =
          '<span class="connect-dot"></span> Disconnected';
        setTimeout(() => {
          connectDot.style.backgroundColor = "var(--text-secondary)";
        }, 1500);
      } else {
        connectButton.innerHTML = '<span class="connect-dot"></span> Connected';
        connectDot.style.backgroundColor = "var(--success-color)";
      }
    });
  }

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".swap-panel, .project-card, .token-badge"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;

      if (elementPosition < screenPosition) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Set initial state for animation
  const setInitialAnimationState = () => {
    const elements = document.querySelectorAll(
      ".swap-panel, .project-card, .token-badge"
    );

    elements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
  };

  // Initialize animations
  setInitialAnimationState();
  animateOnScroll(); // Run once on load

  // Add scroll event listener
  window.addEventListener("scroll", animateOnScroll);

  // Form submission handling
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all fields");
        return;
      }

      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Reset form
        contactForm.reset();

        // Show success message
        submitButton.textContent = "Message Sent!";
        submitButton.style.backgroundColor = "var(--success-color)";

        // Reset button after delay
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          submitButton.style.backgroundColor = "";
        }, 3000);
      }, 1500);
    });
  }

  // Create interactive background particles
  const createParticles = () => {
    const canvas = document.createElement("canvas");
    canvas.id = "particles-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-2";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Resize canvas to match window size
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? "#4c82fb" : "#8c6dfd";
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    // Create particles
    const particlesArray = [];
    const particleCount = Math.min(50, (width * height) / 15000);

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      // Draw connections
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = "#4c82fb";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  // Create background blocks
  const createBackgroundBlocks = () => {
    const blocksContainer = document.createElement("div");
    blocksContainer.className = "background-blocks";
    document.body.appendChild(blocksContainer);

    // Create multiple block patterns across the screen
    const numBlocksX = Math.ceil(window.innerWidth / 300);
    const numBlocksY = Math.ceil(window.innerHeight / 300);

    for (let y = 0; y < numBlocksY; y++) {
      for (let x = 0; x < numBlocksX; x++) {
        const blockContainer = document.createElement("div");
        blockContainer.className = "block-container";
        blockContainer.style.left = `${x * 300 + Math.random() * 100}px`;
        blockContainer.style.top = `${y * 300 + Math.random() * 100}px`;

        // Create the 4 corner blocks
        const topLeft = document.createElement("div");
        topLeft.className = "block";
        topLeft.style.top = "0";
        topLeft.style.left = "0";

        const topRight = document.createElement("div");
        topRight.className = "block";
        topRight.style.top = "0";
        topRight.style.right = "0";

        const bottomLeft = document.createElement("div");
        bottomLeft.className = "block";
        bottomLeft.style.bottom = "0";
        bottomLeft.style.left = "0";

        const bottomRight = document.createElement("div");
        bottomRight.className = "block";
        bottomRight.style.bottom = "0";
        bottomRight.style.right = "0";

        // Create connecting lines
        const topLine = document.createElement("div");
        topLine.className = "block-line horizontal-line";
        topLine.style.top = "10px";
        topLine.style.left = "20px";

        const bottomLine = document.createElement("div");
        bottomLine.className = "block-line horizontal-line";
        bottomLine.style.bottom = "10px";
        bottomLine.style.left = "20px";

        const leftLine = document.createElement("div");
        leftLine.className = "block-line vertical-line";
        leftLine.style.left = "10px";
        leftLine.style.top = "20px";

        const rightLine = document.createElement("div");
        rightLine.className = "block-line vertical-line";
        rightLine.style.right = "10px";
        rightLine.style.top = "20px";

        blockContainer.appendChild(topLeft);
        blockContainer.appendChild(topRight);
        blockContainer.appendChild(bottomLeft);
        blockContainer.appendChild(bottomRight);
        blockContainer.appendChild(topLine);
        blockContainer.appendChild(bottomLine);
        blockContainer.appendChild(leftLine);
        blockContainer.appendChild(rightLine);

        blocksContainer.appendChild(blockContainer);
      }
    }
  };

  // Initialize particles
  createParticles();

  // Initialize background blocks
  createBackgroundBlocks();
});
