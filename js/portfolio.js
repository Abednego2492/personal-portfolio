/* ============================================================
   PERSONAWEB — Portfolio JS  (3D Carousel · Particles · Animations)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ===========================================
       0.  Preloader
       =========================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 600);
        });
        /* Fallback: hide preloader if load event takes too long */
        setTimeout(() => preloader.classList.add('hidden'), 3000);
    }

    /* ===========================================
       1.  Immersive Particle Field — Mouse-Reactive
           Abstract Geometric Pattern Engine
       =========================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const mouse = { x: -9999, y: -9999, active: false };
        let particles = [];
        let geometries = [];
        let trails = [];
        let time = 0;

        const CONFIG = {
            particleCount: 160,
            connectionDist: 160,
            mouseRadius: 250,
            mouseForce: 0.06,
            friction: 0.92,
            baseSpeed: 0.3,
            glowRings: 3,
            trailLength: 12,
            geometrySpawnRate: 0.04,
            maxGeometries: 8
        };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        /* Mouse tracking */
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        });
        window.addEventListener('mouseleave', () => { mouse.active = false; });

        /* ---- Particle Class ---- */
        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
                this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
                this.radius = Math.random() * 2.2 + 0.6;
                this.baseOpacity = Math.random() * 0.4 + 0.15;
                this.opacity = this.baseOpacity;
                this.phase = Math.random() * Math.PI * 2;
                this.driftSpeed = Math.random() * 0.002 + 0.001;
                this.orbitRadius = Math.random() * 40 + 10;
            }
            update() {
                this.phase += this.driftSpeed;
                const driftX = Math.sin(this.phase) * this.orbitRadius * 0.01;
                const driftY = Math.cos(this.phase * 0.7) * this.orbitRadius * 0.01;
                this.vx += driftX;
                this.vy += driftY;

                if (mouse.active) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONFIG.mouseRadius) {
                        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
                        const innerZone = CONFIG.mouseRadius * 0.2;
                        if (dist < innerZone) {
                            this.vx -= (dx / dist) * force * 2;
                            this.vy -= (dy / dist) * force * 2;
                        } else {
                            this.vx += (dx / dist) * force;
                            this.vy += (dy / dist) * force;
                        }
                        this.opacity = Math.min(1, this.baseOpacity + (1 - dist / CONFIG.mouseRadius) * 0.6);
                        this.radius = Math.min(4, this.radius + 0.02);
                    } else {
                        this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                        this.radius += (Math.random() * 2.2 + 0.6 - this.radius) * 0.02;
                    }
                }

                this.vx *= CONFIG.friction;
                this.vy *= CONFIG.friction;
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < -20) this.x = canvas.width + 20;
                if (this.x > canvas.width + 20) this.x = -20;
                if (this.y < -20) this.y = canvas.height + 20;
                if (this.y > canvas.height + 20) this.y = -20;
            }
            draw() {
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
                grad.addColorStop(0, `rgba(57, 255, 20, ${this.opacity})`);
                grad.addColorStop(0.4, `rgba(57, 255, 20, ${this.opacity * 0.3})`);
                grad.addColorStop(1, 'rgba(57, 255, 20, 0)');
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(57, 255, 20, ${this.opacity})`;
                ctx.fill();
            }
        }

        class Geometry {
            constructor(x, y) {
                this.x = x + (Math.random() - 0.5) * 80;
                this.y = y + (Math.random() - 0.5) * 80;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.02;
                this.size = Math.random() * 25 + 15;
                this.opacity = 0;
                this.maxOpacity = Math.random() * 0.25 + 0.08;
                this.life = 0;
                this.maxLife = Math.random() * 180 + 120;
                this.type = Math.floor(Math.random() * 4);
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5 - 0.2;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }
            update() {
                this.life++;
                this.rotation += this.rotSpeed;
                this.x += this.vx;
                this.y += this.vy;
                this.pulsePhase += 0.04;

                const fadeIn = Math.min(1, this.life / 30);
                const fadeOut = Math.max(0, 1 - (this.life - this.maxLife + 40) / 40);
                const pulse = 1 + Math.sin(this.pulsePhase) * 0.15;
                this.opacity = this.maxOpacity * fadeIn * fadeOut * pulse;

                return this.life < this.maxLife;
            }
            draw() {
                if (this.opacity <= 0) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.strokeStyle = `rgba(57, 255, 20, ${this.opacity})`;
                ctx.lineWidth = 1;
                if (this.type === 0) this.drawHexagon();
                else if (this.type === 1) this.drawTriangle();
                else if (this.type === 2) this.drawDiamond();
                else this.drawRing();
                ctx.restore();
            }
            drawHexagon() {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const px = Math.cos(angle) * this.size;
                    const py = Math.sin(angle) * this.size;
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();
            }
            drawTriangle() {
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
                    const px = Math.cos(angle) * this.size;
                    const py = Math.sin(angle) * this.size;
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();
            }
            drawDiamond() {
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size * 0.6, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size * 0.6, 0);
                ctx.closePath();
                ctx.stroke();
            }
            drawRing() {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let a = 0; a < particles.length; a++) {
                let connections = 0;
                for (let b = a + 1; b < particles.length; b++) {
                    if (connections >= 5) break;
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONFIG.connectionDist) {
                        const alpha = 0.12 * (1 - dist / CONFIG.connectionDist);
                        let boost = 0;
                        if (mouse.active) {
                            const midX = (particles[a].x + particles[b].x) / 2;
                            const midY = (particles[a].y + particles[b].y) / 2;
                            const mdist = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);
                            if (mdist < CONFIG.mouseRadius) {
                                boost = (1 - mdist / CONFIG.mouseRadius) * 0.25;
                            }
                        }
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(57, 255, 20, ${alpha + boost})`;
                        ctx.lineWidth = 0.6 + boost * 2;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                        connections++;
                    }
                }
            }
        }

        function animate() {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            if (mouse.active) spawnGeometries();
            geometries = geometries.filter(g => g.update());
            geometries.forEach(g => g.draw());
            requestAnimationFrame(animate);
        }

        function spawnGeometries() {
            if (Math.random() < CONFIG.geometrySpawnRate && geometries.length < CONFIG.maxGeometries) {
                geometries.push(new Geometry(mouse.x, mouse.y));
            }
        }
        animate();
    }

    /* ===========================================
       2.  Navbar & Navigation
       =========================================== */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        navbar && navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateActiveNav();
    });

    hamburger && hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks && navLinks.classList.toggle('open');
    });

    navAnchors.forEach(a => a.addEventListener('click', () => {
        hamburger && hamburger.classList.remove('active');
        navLinks && navLinks.classList.remove('open');
    }));

    function updateActiveNav() {
        const sections = document.querySelectorAll('.section, .hero');
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 120;
            if (window.scrollY >= top) current = s.getAttribute('id');
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    /* ===========================================
       3.  Data Loading Engine (Robust & Real-Time)
       =========================================== */
    let allProjects = [];
    let filteredProjects = [];
    let currentRotation = 0;
    let targetRotation = 0;
    let anglePerCard = 0;
    let carouselAnimFrame = null;
    let isSpinning = false;
    let typingInstance = null;

    /* Main initialization function */
    function loadAllData() {
        console.log("Initializing Portfolio Data...");
        loadHero();
        loadProjects();
        loadExperiences();
        loadCertificates();
        loadSkills();
        loadContact();

        /* Re-run scroll reveal after content injection */
        setTimeout(setupScrollReveal, 100);
    }

    /* Real-Time Update Listener */
    window.addEventListener('storage', (e) => {
        if (Object.values(STORAGE_KEYS).includes(e.key)) {
            console.log("Local Storage changed! Updating Landing Page...");
            loadAllData();
        }
    });

    function loadHero() {
        const d = StorageManager.getHero();
        setText('#hero-name', d.name);
        setText('#hero-summary', d.summary);

        const profileImg = StorageManager.getProfileImage();
        const imgEl = document.getElementById('profile-image');
        const phEl = document.getElementById('profile-placeholder');
        if (imgEl && phEl) {
            if (profileImg) {
                imgEl.src = profileImg;
                imgEl.style.display = 'block';
                phEl.style.display = 'none';
            } else {
                imgEl.style.display = 'none';
                phEl.style.display = 'flex';
            }
        }

        if (d.typingTexts && d.typingTexts.length) {
            initTyping(d.typingTexts);
        }
    }

    function initTyping(texts) {
        const el = document.getElementById('typing-text');
        if (!el) return;

        /* Clear existing typing loop if running */
        if (typingInstance) clearInterval(typingInstance);

        let textIdx = 0, charIdx = 0, deleting = false;

        const tick = () => {
            const current = texts[textIdx];
            if (deleting) {
                el.textContent = current.substring(0, charIdx--);
                if (charIdx < 0) {
                    deleting = false;
                    textIdx = (textIdx + 1) % texts.length;
                    setTimeout(tick, 400);
                    return;
                }
            } else {
                el.textContent = current.substring(0, charIdx++);
                if (charIdx > current.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    return;
                }
            }
            setTimeout(tick, deleting ? 40 : 80);
        };
        tick();
    }

    function loadProjects() {
        allProjects = StorageManager.getProjects() || [];
        filteredProjects = [...allProjects];
        renderCarousel();
        bindFilters();
    }

    function bindFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.filter;
                filteredProjects = cat === 'all'
                    ? [...allProjects]
                    : allProjects.filter(p => p.category === cat);
                currentRotation = 0;
                targetRotation = 0;
                renderCarousel();
            };
        });
    }

    function renderCarousel() {
        const track = document.getElementById('carousel-track');
        if (!track) return;
        track.innerHTML = '';

        if (!filteredProjects.length) {
            track.innerHTML = '<div style="color:var(--text-grey);font-family:var(--font-mono);text-align:center;padding:60px 20px;letter-spacing:2px;grid-column:1/-1;">No projects found</div>';
            return;
        }

        anglePerCard = 360 / Math.max(filteredProjects.length, 1);
        const radius = Math.max(300, filteredProjects.length * 50);

        filteredProjects.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            const img = StorageManager.getProjectImage(p.id);
            card.innerHTML = `
        <div class="carousel-card-img" style="${img ? `background-image:url(${img});background-size:cover;background-position:center;` : ''}">
          ${!img ? `<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>` : ''}
        </div>
        <div class="carousel-card-body">
          <div class="carousel-card-category">${p.category || 'General'}</div>
          <div class="carousel-card-title">${p.title || 'Untitled Project'}</div>
          <div class="carousel-card-desc">${p.description || 'No description provided.'}</div>
          <div class="carousel-card-techs">
            ${(p.technologies || []).map(t => `<span class="carousel-card-tech">${t}</span>`).join('')}
          </div>
        </div>`;
            card.addEventListener('click', () => openProjectModal(p));
            track.appendChild(card);

            /* Position Card */
            const cardAngle = anglePerCard * i;
            card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
        });

        currentRotation = 0;
        targetRotation = 0;
        applyCarouselRotation(currentRotation);
    }

    function applyCarouselRotation(angle) {
        const track = document.getElementById('carousel-track');
        if (track) track.style.transform = `rotateY(${angle}deg)`;
    }

    function animateCarousel() {
        const diff = targetRotation - currentRotation;
        if (Math.abs(diff) < 0.1) {
            currentRotation = targetRotation;
            applyCarouselRotation(currentRotation);
            isSpinning = false;
            return;
        }
        currentRotation += diff * 0.08;
        applyCarouselRotation(currentRotation);
        carouselAnimFrame = requestAnimationFrame(animateCarousel);
    }

    function spinCarousel(direction) {
        if (!filteredProjects.length) return;
        targetRotation += direction * anglePerCard;
        if (!isSpinning) {
            isSpinning = true;
            if (carouselAnimFrame) cancelAnimationFrame(carouselAnimFrame);
            animateCarousel();
        }
    }

    document.querySelector('.carousel-prev')?.addEventListener('click', () => spinCarousel(1));
    document.querySelector('.carousel-next')?.addEventListener('click', () => spinCarousel(-1));

    function loadExperiences() {
        const data = StorageManager.getExperiences() || [];
        const container = document.getElementById('timeline-container');
        if (!container) return;

        if (!data.length) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-grey);">No experience data available.</p>';
            return;
        }

        container.innerHTML = data.map(exp => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-period">${exp.period || ''}</div>
          <div class="timeline-position">${exp.position || ''}</div>
          <div class="timeline-company">${exp.company || ''}</div>
          <div class="timeline-desc">${exp.description || ''}</div>
          <ul class="timeline-highlights">
            ${(exp.highlights || []).map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>`).join('');
    }

    function loadCertificates() {
        const data = StorageManager.getCertificates() || [];
        const container = document.getElementById('certs-container');
        if (!container) return;

        if (!data.length) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-grey);width:100%;">No certificates recorded.</p>';
            return;
        }

        container.innerHTML = data.map(c => `
      <div class="cert-card">
        <div class="cert-icon">🏆</div>
        <div class="cert-title">${c.title || ''}</div>
        <div class="cert-issuer">${c.issuer || ''}</div>
        <div class="cert-date">${c.date || ''}</div>
        ${c.credentialUrl && c.credentialUrl !== '#' ? `<a href="${c.credentialUrl}" target="_blank" class="cert-link">View Credential →</a>` : '<span class="cert-link" style="opacity:.4">Credential Link →</span>'}
      </div>`).join('');
    }

    function loadSkills() {
        const data = StorageManager.getSkills() || { categories: [] };
        const container = document.getElementById('skills-container');
        if (!container) return;

        const categories = data.categories || [];
        if (!categories.length) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-grey);width:100%;">No skills defined.</p>';
            return;
        }

        container.innerHTML = categories.map(cat => `
      <div class="skill-category">
        <div class="skill-cat-name">${cat.name || 'General'}</div>
        ${(cat.skills || []).map(s => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${s.name || ''}</span>
              <span class="skill-percent">${s.level || 0}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" data-level="${s.level || 0}"></div>
            </div>
          </div>`).join('')}
      </div>`).join('');
    }

    function loadContact() {
        const d = StorageManager.getContact() || {};
        setText('#contact-message', d.message);
        setText('#contact-email', d.email);
        setText('#contact-phone', d.phone);
        setText('#contact-location', d.location);
        const linkedinEl = document.getElementById('contact-linkedin');
        const githubEl = document.getElementById('contact-github');
        if (linkedinEl) linkedinEl.href = d.linkedin || '#';
        if (githubEl) githubEl.href = d.github || '#';
    }

    /* Modal logic */
    function openProjectModal(p) {
        const overlay = document.getElementById('project-modal');
        if (!overlay) return;
        const img = StorageManager.getProjectImage(p.id);
        overlay.querySelector('.modal-body').innerHTML = `
      ${img ? `<img src="${img}" style="width:100%;border-radius:8px;margin-bottom:20px;">` : ''}
      <span class="carousel-card-category">${p.category || 'General'}</span>
      <h3 style="font-family:var(--font-display);font-size:24px;color:var(--white);margin:8px 0 14px;">${p.title || 'Untitled'}</h3>
      <p style="color:var(--text-grey);margin-bottom:18px;">${p.description || ''}</p>
      <div class="carousel-card-techs" style="margin-bottom:20px;">
        ${(p.technologies || []).map(t => `<span class="carousel-card-tech">${t}</span>`).join('')}
      </div>
      <div style="display:flex;gap:12px;">
        ${p.liveUrl && p.liveUrl !== '#' ? `<a href="${p.liveUrl}" target="_blank" class="btn btn-primary" style="font-size:13px;padding:10px 22px;">Live Demo</a>` : ''}
        ${p.githubUrl && p.githubUrl !== '#' ? `<a href="${p.githubUrl}" target="_blank" class="btn btn-outline" style="font-size:13px;padding:10px 22px;">GitHub</a>` : ''}
      </div>`;
        overlay.classList.add('active');
    }
    document.querySelector('.modal-close')?.addEventListener('click', () => {
        document.getElementById('project-modal')?.classList.remove('active');
    });

    /* ===========================================
       4.  Scroll Reveal Implementation
       =========================================== */
    function setupScrollReveal() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                        bar.style.width = (bar.dataset.level || 0) + '%';
                    });
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal, .timeline-item, .skill-category, .cert-card').forEach(el => {
            observer.observe(el);
        });

        /* Immediate Check for elements in viewport */
        document.querySelectorAll('.reveal, .timeline-item, .skill-category, .cert-card').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
                el.querySelectorAll('.skill-fill').forEach(bar => {
                    bar.style.width = (bar.dataset.level || 0) + '%';
                });
            }
        });
    }

    /* Helper Utilities */
    function setText(sel, val) {
        const el = document.querySelector(sel);
        if (el) el.textContent = val !== undefined ? val : '';
    }

    /* Run Initial Load */
    loadAllData();
});
