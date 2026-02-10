/* ============================================================
   PERSONAWEB — Dashboard CMS Logic
   Full CRUD for every portfolio section, image upload via
   localStorage, modal editing, toast notifications.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireAuth()) return;

    /* ---- Session info ---- */
    const session = Auth.getSession();
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl && session) userEmailEl.textContent = session.email;

    /* ========== Navigation ========== */
    const navItems = document.querySelectorAll('.sidebar-nav a');
    const panels = document.querySelectorAll('.dash-panel');

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const target = item.dataset.panel;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            panels.forEach(p => p.classList.toggle('active', p.id === target));
        });
    });

    /* Sidebar mobile toggle */
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dash-sidebar');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    /* ========== Toast ========== */
    function toast(msg) {
        let t = document.getElementById('toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast';
            t.className = 'toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }

    /* ========== Image helpers ========== */
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /* ========== Stats ========== */
    function updateStats() {
        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setText('stat-projects', StorageManager.getProjects().length);
        setText('stat-experiences', StorageManager.getExperiences().length);
        setText('stat-certificates', StorageManager.getCertificates().length);
        const skills = StorageManager.getSkills();
        const count = skills.categories ? skills.categories.reduce((a, c) => a + c.skills.length, 0) : 0;
        setText('stat-skills', count);
    }
    updateStats();

    /* ════════════════════════════════════════
       HERO SECTION PANEL
       ════════════════════════════════════════ */
    function loadHeroPanel() {
        const d = StorageManager.getHero();
        setVal('hero-name-input', d.name);
        setVal('hero-title-input', d.title);
        setVal('hero-subtitle-input', d.subtitle);
        setVal('hero-summary-input', d.summary);
        setVal('hero-resume-input', d.resumeLink);
        setVal('hero-typing-input', (d.typingTexts || []).join(', '));

        const profileImg = StorageManager.getProfileImage();
        const preview = document.getElementById('profile-img-preview');
        if (preview) {
            preview.innerHTML = profileImg
                ? `<img src="${profileImg}" alt="Profile">`
                : '<span class="placeholder-icon">👤</span>';
        }
    }
    loadHeroPanel();

    // Profile Image Upload
    const profileUpload = document.getElementById('profile-upload');
    if (profileUpload) {
        profileUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const b64 = await readFileAsBase64(file);
            StorageManager.setProfileImage(b64);
            const preview = document.getElementById('profile-img-preview');
            if (preview) preview.innerHTML = `<img src="${b64}" alt="Profile">`;
            toast('Profile image updated!');
        });
    }

    // Save Hero
    const heroForm = document.getElementById('hero-form');
    if (heroForm) {
        heroForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = {
                name: getVal('hero-name-input'),
                title: getVal('hero-title-input'),
                subtitle: getVal('hero-subtitle-input'),
                summary: getVal('hero-summary-input'),
                resumeLink: getVal('hero-resume-input'),
                typingTexts: getVal('hero-typing-input').split(',').map(s => s.trim()).filter(Boolean)
            };
            StorageManager.setHero(data);
            toast('Hero section saved!');
        });
    }

    /* ════════════════════════════════════════
       PROJECTS PANEL
       ════════════════════════════════════════ */
    function loadProjectsPanel() {
        const projects = StorageManager.getProjects();
        const list = document.getElementById('projects-list');
        if (!list) return;
        list.innerHTML = projects.map((p, i) => `
      <div class="item-card" data-index="${i}">
        <div class="item-card-body">
          <h4>${p.title}</h4>
          <p>${p.category} · ${(p.technologies || []).join(', ')}</p>
        </div>
        <div class="item-card-actions">
          <button class="icon-btn edit-project" data-index="${i}" title="Edit">✏️</button>
          <button class="icon-btn danger delete-project" data-index="${i}" title="Delete">🗑️</button>
        </div>
      </div>`).join('');

        // Bind edit/delete
        list.querySelectorAll('.edit-project').forEach(btn =>
            btn.addEventListener('click', () => openProjectEditor(parseInt(btn.dataset.index))));
        list.querySelectorAll('.delete-project').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Delete this project?')) return;
                const projects = StorageManager.getProjects();
                projects.splice(parseInt(btn.dataset.index), 1);
                StorageManager.setProjects(projects);
                loadProjectsPanel();
                updateStats();
                toast('Project deleted');
            }));
    }
    loadProjectsPanel();

    // Add Project
    document.getElementById('add-project')?.addEventListener('click', () => openProjectEditor(-1));

    function openProjectEditor(idx) {
        const projects = StorageManager.getProjects();
        const p = idx >= 0 ? projects[idx] : { id: 'proj_' + Date.now(), title: '', category: 'fullstack', description: '', technologies: [], liveUrl: '', githubUrl: '', featured: false };

        const overlay = document.getElementById('edit-modal');
        overlay.querySelector('.edit-modal').innerHTML = `
      <h3>${idx >= 0 ? 'Edit' : 'Add'} Project</h3>
      <div class="form-row"><div class="field"><label>Title</label><input id="ep-title" value="${esc(p.title)}"></div></div>
      <div class="form-row">
        <div class="field"><label>Category</label>
          <select id="ep-category">
            ${['fullstack', 'frontend', 'backend', 'mobile'].map(c => `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Featured</label>
          <select id="ep-featured"><option value="true" ${p.featured ? 'selected' : ''}>Yes</option><option value="false" ${!p.featured ? 'selected' : ''}>No</option></select>
        </div>
      </div>
      <div class="field" style="margin-bottom:20px"><label>Description</label><textarea id="ep-desc">${esc(p.description)}</textarea></div>
      <div class="field" style="margin-bottom:20px"><label>Technologies (comma separated)</label><input id="ep-techs" value="${(p.technologies || []).join(', ')}"></div>
      <div class="form-row">
        <div class="field"><label>Live URL</label><input id="ep-live" value="${esc(p.liveUrl)}"></div>
        <div class="field"><label>GitHub URL</label><input id="ep-github" value="${esc(p.githubUrl)}"></div>
      </div>
      <div class="image-upload">
        <div class="image-preview" id="ep-img-preview">
          ${StorageManager.getProjectImage(p.id) ? `<img src="${StorageManager.getProjectImage(p.id)}">` : '<span class="placeholder-icon">🖼️</span>'}
        </div>
        <label class="upload-btn">📁 Upload Image<input type="file" accept="image/*" id="ep-img-upload"></label>
      </div>
      <div class="edit-modal-actions">
        <button class="btn-cancel" id="ep-cancel">Cancel</button>
        <button class="btn-save" id="ep-save">Save Project</button>
      </div>`;
        overlay.classList.add('active');

        let tempImg = StorageManager.getProjectImage(p.id);
        document.getElementById('ep-img-upload').addEventListener('change', async (e) => {
            const file = e.target.files[0]; if (!file) return;
            tempImg = await readFileAsBase64(file);
            document.getElementById('ep-img-preview').innerHTML = `<img src="${tempImg}">`;
        });

        document.getElementById('ep-cancel').addEventListener('click', () => overlay.classList.remove('active'));
        document.getElementById('ep-save').addEventListener('click', () => {
            p.title = getVal('ep-title');
            p.category = getVal('ep-category');
            p.description = getVal('ep-desc');
            p.technologies = getVal('ep-techs').split(',').map(s => s.trim()).filter(Boolean);
            p.liveUrl = getVal('ep-live');
            p.githubUrl = getVal('ep-github');
            p.featured = getVal('ep-featured') === 'true';
            if (tempImg) StorageManager.setProjectImage(p.id, tempImg);

            if (idx >= 0) { projects[idx] = p; } else { projects.push(p); }
            StorageManager.setProjects(projects);
            overlay.classList.remove('active');
            loadProjectsPanel();
            updateStats();
            toast('Project saved!');
        });
    }

    /* ════════════════════════════════════════
       EXPERIENCE PANEL
       ════════════════════════════════════════ */
    function loadExperiencesPanel() {
        const exps = StorageManager.getExperiences();
        const list = document.getElementById('experiences-list');
        if (!list) return;
        list.innerHTML = exps.map((e, i) => `
      <div class="item-card">
        <div class="item-card-body">
          <h4>${e.position}</h4>
          <p>${e.company} · ${e.period}</p>
        </div>
        <div class="item-card-actions">
          <button class="icon-btn edit-exp" data-index="${i}" title="Edit">✏️</button>
          <button class="icon-btn danger delete-exp" data-index="${i}" title="Delete">🗑️</button>
        </div>
      </div>`).join('');

        list.querySelectorAll('.edit-exp').forEach(btn =>
            btn.addEventListener('click', () => openExperienceEditor(parseInt(btn.dataset.index))));
        list.querySelectorAll('.delete-exp').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Delete this experience?')) return;
                const data = StorageManager.getExperiences();
                data.splice(parseInt(btn.dataset.index), 1);
                StorageManager.setExperiences(data);
                loadExperiencesPanel();
                updateStats();
                toast('Experience deleted');
            }));
    }
    loadExperiencesPanel();

    document.getElementById('add-experience')?.addEventListener('click', () => openExperienceEditor(-1));

    function openExperienceEditor(idx) {
        const exps = StorageManager.getExperiences();
        const e = idx >= 0 ? exps[idx] : { id: 'exp_' + Date.now(), company: '', position: '', period: '', description: '', highlights: [] };

        const overlay = document.getElementById('edit-modal');
        overlay.querySelector('.edit-modal').innerHTML = `
      <h3>${idx >= 0 ? 'Edit' : 'Add'} Experience</h3>
      <div class="form-row">
        <div class="field"><label>Position</label><input id="ee-position" value="${esc(e.position)}"></div>
        <div class="field"><label>Company</label><input id="ee-company" value="${esc(e.company)}"></div>
      </div>
      <div class="field" style="margin-bottom:20px"><label>Period</label><input id="ee-period" value="${esc(e.period)}" placeholder="2023 — Present"></div>
      <div class="field" style="margin-bottom:20px"><label>Description</label><textarea id="ee-desc">${esc(e.description)}</textarea></div>
      <div class="field" style="margin-bottom:20px"><label>Highlights (one per line)</label><textarea id="ee-highlights">${(e.highlights || []).join('\n')}</textarea></div>
      <div class="edit-modal-actions">
        <button class="btn-cancel" id="ee-cancel">Cancel</button>
        <button class="btn-save" id="ee-save">Save Experience</button>
      </div>`;
        overlay.classList.add('active');

        document.getElementById('ee-cancel').addEventListener('click', () => overlay.classList.remove('active'));
        document.getElementById('ee-save').addEventListener('click', () => {
            e.position = getVal('ee-position');
            e.company = getVal('ee-company');
            e.period = getVal('ee-period');
            e.description = getVal('ee-desc');
            e.highlights = getVal('ee-highlights').split('\n').map(s => s.trim()).filter(Boolean);
            if (idx >= 0) { exps[idx] = e; } else { exps.push(e); }
            StorageManager.setExperiences(exps);
            overlay.classList.remove('active');
            loadExperiencesPanel();
            updateStats();
            toast('Experience saved!');
        });
    }

    /* ════════════════════════════════════════
       CERTIFICATES PANEL
       ════════════════════════════════════════ */
    function loadCertsPanel() {
        const certs = StorageManager.getCertificates();
        const list = document.getElementById('certs-list');
        if (!list) return;
        list.innerHTML = certs.map((c, i) => `
      <div class="item-card">
        <div class="item-card-body">
          <h4>${c.title}</h4>
          <p>${c.issuer} · ${c.date}</p>
        </div>
        <div class="item-card-actions">
          <button class="icon-btn edit-cert" data-index="${i}" title="Edit">✏️</button>
          <button class="icon-btn danger delete-cert" data-index="${i}" title="Delete">🗑️</button>
        </div>
      </div>`).join('');

        list.querySelectorAll('.edit-cert').forEach(btn =>
            btn.addEventListener('click', () => openCertEditor(parseInt(btn.dataset.index))));
        list.querySelectorAll('.delete-cert').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Delete this certificate?')) return;
                const data = StorageManager.getCertificates();
                data.splice(parseInt(btn.dataset.index), 1);
                StorageManager.setCertificates(data);
                loadCertsPanel();
                updateStats();
                toast('Certificate deleted');
            }));
    }
    loadCertsPanel();

    document.getElementById('add-cert')?.addEventListener('click', () => openCertEditor(-1));

    function openCertEditor(idx) {
        const certs = StorageManager.getCertificates();
        const c = idx >= 0 ? certs[idx] : { id: 'cert_' + Date.now(), title: '', issuer: '', date: '', credentialUrl: '' };

        const overlay = document.getElementById('edit-modal');
        overlay.querySelector('.edit-modal').innerHTML = `
      <h3>${idx >= 0 ? 'Edit' : 'Add'} Certificate</h3>
      <div class="form-row"><div class="field"><label>Title</label><input id="ec-title" value="${esc(c.title)}"></div></div>
      <div class="form-row">
        <div class="field"><label>Issuer</label><input id="ec-issuer" value="${esc(c.issuer)}"></div>
        <div class="field"><label>Date</label><input id="ec-date" value="${esc(c.date)}"></div>
      </div>
      <div class="field" style="margin-bottom:20px"><label>Credential URL</label><input id="ec-url" value="${esc(c.credentialUrl)}"></div>
      <div class="edit-modal-actions">
        <button class="btn-cancel" id="ec-cancel">Cancel</button>
        <button class="btn-save" id="ec-save">Save Certificate</button>
      </div>`;
        overlay.classList.add('active');

        document.getElementById('ec-cancel').addEventListener('click', () => overlay.classList.remove('active'));
        document.getElementById('ec-save').addEventListener('click', () => {
            c.title = getVal('ec-title');
            c.issuer = getVal('ec-issuer');
            c.date = getVal('ec-date');
            c.credentialUrl = getVal('ec-url');
            if (idx >= 0) { certs[idx] = c; } else { certs.push(c); }
            StorageManager.setCertificates(certs);
            overlay.classList.remove('active');
            loadCertsPanel();
            updateStats();
            toast('Certificate saved!');
        });
    }

    /* ════════════════════════════════════════
       SKILLS PANEL
       ════════════════════════════════════════ */
    function loadSkillsPanel() {
        const skills = StorageManager.getSkills();
        const container = document.getElementById('skills-panel-content');
        if (!container || !skills.categories) return;

        container.innerHTML = skills.categories.map((cat, ci) => `
      <div class="panel-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div class="panel-card-title" style="margin-bottom:0">${cat.name}</div>
          <div style="display:flex;gap:8px;">
            <button class="icon-btn add-skill" data-cat="${ci}" title="Add skill">➕</button>
            <button class="icon-btn danger delete-cat" data-cat="${ci}" title="Delete category">🗑️</button>
          </div>
        </div>
        <div class="item-list">
          ${cat.skills.map((s, si) => `
            <div class="item-card" style="padding:12px 16px;">
              <div class="item-card-body" style="display:flex;align-items:center;gap:12px;">
                <span style="color:var(--white);font-weight:500;">${s.name}</span>
                <span style="font-family:var(--font-mono);font-size:12px;color:var(--slime);">${s.level}%</span>
              </div>
              <div class="item-card-actions">
                <button class="icon-btn edit-skill" data-cat="${ci}" data-skill="${si}" title="Edit">✏️</button>
                <button class="icon-btn danger delete-skill" data-cat="${ci}" data-skill="${si}" title="Delete">🗑️</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`).join('');

        // Bind events
        container.querySelectorAll('.edit-skill').forEach(btn =>
            btn.addEventListener('click', () => openSkillEditor(parseInt(btn.dataset.cat), parseInt(btn.dataset.skill))));
        container.querySelectorAll('.delete-skill').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Delete this skill?')) return;
                const data = StorageManager.getSkills();
                data.categories[parseInt(btn.dataset.cat)].skills.splice(parseInt(btn.dataset.skill), 1);
                StorageManager.setSkills(data);
                loadSkillsPanel();
                updateStats();
                toast('Skill deleted');
            }));
        container.querySelectorAll('.add-skill').forEach(btn =>
            btn.addEventListener('click', () => openSkillEditor(parseInt(btn.dataset.cat), -1)));
        container.querySelectorAll('.delete-cat').forEach(btn =>
            btn.addEventListener('click', () => {
                if (!confirm('Delete this entire category?')) return;
                const data = StorageManager.getSkills();
                data.categories.splice(parseInt(btn.dataset.cat), 1);
                StorageManager.setSkills(data);
                loadSkillsPanel();
                updateStats();
                toast('Category deleted');
            }));
    }
    loadSkillsPanel();

    document.getElementById('add-skill-cat')?.addEventListener('click', () => {
        const name = prompt('Category name:');
        if (!name) return;
        const data = StorageManager.getSkills();
        data.categories.push({ name, skills: [] });
        StorageManager.setSkills(data);
        loadSkillsPanel();
        toast('Category added');
    });

    function openSkillEditor(ci, si) {
        const data = StorageManager.getSkills();
        const skill = si >= 0 ? data.categories[ci].skills[si] : { name: '', level: 80 };

        const overlay = document.getElementById('edit-modal');
        overlay.querySelector('.edit-modal').innerHTML = `
      <h3>${si >= 0 ? 'Edit' : 'Add'} Skill</h3>
      <div class="form-row">
        <div class="field"><label>Skill Name</label><input id="es-name" value="${esc(skill.name)}"></div>
        <div class="field"><label>Level (%)</label><input type="number" id="es-level" min="0" max="100" value="${skill.level}"></div>
      </div>
      <div class="edit-modal-actions">
        <button class="btn-cancel" id="es-cancel">Cancel</button>
        <button class="btn-save" id="es-save">Save Skill</button>
      </div>`;
        overlay.classList.add('active');

        document.getElementById('es-cancel').addEventListener('click', () => overlay.classList.remove('active'));
        document.getElementById('es-save').addEventListener('click', () => {
            skill.name = getVal('es-name');
            skill.level = parseInt(getVal('es-level')) || 0;
            if (si >= 0) { data.categories[ci].skills[si] = skill; }
            else { data.categories[ci].skills.push(skill); }
            StorageManager.setSkills(data);
            overlay.classList.remove('active');
            loadSkillsPanel();
            updateStats();
            toast('Skill saved!');
        });
    }

    /* ════════════════════════════════════════
       CONTACT PANEL
       ════════════════════════════════════════ */
    function loadContactPanel() {
        const d = StorageManager.getContact();
        setVal('contact-email-input', d.email);
        setVal('contact-phone-input', d.phone);
        setVal('contact-location-input', d.location);
        setVal('contact-linkedin-input', d.linkedin);
        setVal('contact-github-input', d.github);
        setVal('contact-twitter-input', d.twitter);
        setVal('contact-message-input', d.message);
    }
    loadContactPanel();

    const contactForm = document.getElementById('contact-panel-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = {
                email: getVal('contact-email-input'),
                phone: getVal('contact-phone-input'),
                location: getVal('contact-location-input'),
                linkedin: getVal('contact-linkedin-input'),
                github: getVal('contact-github-input'),
                twitter: getVal('contact-twitter-input'),
                message: getVal('contact-message-input')
            };
            StorageManager.setContact(data);
            toast('Contact info saved!');
        });
    }

    /* ════════════════════════════════════════
       SETTINGS PANEL
       ════════════════════════════════════════ */
    function loadSettingsPanel() {
        const auth = StorageManager.getAuth();
        setVal('settings-email', auth.email);
        setVal('settings-password', auth.password);
    }
    loadSettingsPanel();

    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = {
                email: getVal('settings-email'),
                password: getVal('settings-password')
            };
            StorageManager.setAuth(data);
            toast('Credentials updated! Use new credentials next time.');
        });
    }

    // Reset all data
    document.getElementById('reset-data')?.addEventListener('click', () => {
        if (!confirm('This will reset ALL portfolio data to defaults. Are you sure?')) return;
        Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        StorageManager.init();
        location.reload();
    });

    // Close modal on overlay click
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.addEventListener('click', e => {
            if (e.target === editModal) editModal.classList.remove('active');
        });
    }

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

    /* ========== Helpers ========== */
    function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
    function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
    function esc(str) { return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
});
