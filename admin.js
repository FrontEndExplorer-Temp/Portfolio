// Admin Panel JavaScript
class PortfolioAdmin {
    constructor() {
        this.initializeData();
        this.bindEvents();
        this.checkAuth();
    }

    checkAuth() {
        // Check if user is already authenticated
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        const loginTime = sessionStorage.getItem('loginTime');
        const sessionTimeout = window.PortfolioConfig.getSessionTimeout();
        
        if (isAuthenticated === 'true' && loginTime) {
            // Check if session has expired
            const currentTime = Date.now();
            const timeSinceLogin = currentTime - parseInt(loginTime);
            
            if (timeSinceLogin < sessionTimeout) {
                this.showAdminPanel();
            } else {
                // Session expired
                this.logout();
                this.showNotification('Session expired. Please login again.', 'error');
            }
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        this.loadData();
    }

    authenticate(password) {
        // Get password from secure configuration
        const correctPassword = window.PortfolioConfig.getAdminPassword();
        
        if (password === correctPassword) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('loginTime', Date.now().toString());
            this.showAdminPanel();
            this.showNotification('Login successful!', 'success');
            return true;
        } else {
            this.showNotification('Incorrect password!', 'error');
            return false;
        }
    }

    logout() {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('loginTime');
        this.showLoginScreen();
        this.showNotification('Logged out successfully!', 'success');
    }

    initializeData() {
        // Initialize localStorage with default data if empty
        if (!localStorage.getItem('portfolioData')) {
            const defaultData = {
                projects: [
                    {
                        id: 1,
                        title: "Expense Tracker",
                        description: "A web-based expense tracker using HTML, CSS, and JavaScript. It stores data in localStorage, visualizes expenses with Chart.js, and allows users to export reports as CSV or PDF via PapaParse and jsPDF.",
                        image: "src/images/p1.png",
                        skills: ["HTML/CSS", "JavaScript", "BootStrap", "Chart JS"],
                        github: "https://github.com/FrontEndExplorer-Temp/Expense-Tracker",
                        live: "https://spendly-dev.netlify.app/"
                    },
                    {
                        id: 2,
                        title: "Weather App",
                        description: "A sleek weather app built with HTML, CSS, JavaScript, and Webpack. It uses the OpenWeatherMap API to display real-time weather data, including temperature, humidity, and wind speed, in a responsive interface.",
                        image: "src/images/p5.png",
                        skills: ["HTML", "CSS", "JavaScript", "Webpack", "OpenWeatherMap API"],
                        github: "https://github.com/FrontEndExplorer-Temp/weather-app",
                        live: "https://breezynow.netlify.app/"
                    },
                    {
                        id: 3,
                        title: "Todo List App",
                        description: "A simple and intuitive Todo List web app built using vanilla HTML, CSS, and JavaScript with Webpack for module bundling. It allows users to add, delete, and manage their tasks efficiently.",
                        image: "src/images/p4.jpg",
                        skills: ["HTML", "CSS", "JavaScript", "Webpack"],
                        github: "https://github.com/FrontEndExplorer-Temp/todo-app",
                        live: ""
                    }
                ],
                skills: {
                    "Programming Languages": ["JavaScript", "HTML", "CSS"],
                    "Frontend Development": ["React", "BootStrap", "Tailwind CSS"],
                    "Backend Development": ["Node.js"],
                    "Databases": ["MongoDB", "Firebase", "PL/SQL"],
                    "Tools & Technologies": ["Git", "Agile/Scrum"]
                },
                certifications: [
                    {
                        id: 1,
                        title: "Android Application Development",
                        year: 2022,
                        description: "Completed specialized training in Android application development techniques.",
                        issuer: "Training Institute"
                    },
                    {
                        id: 2,
                        title: "Procedural Language In SQL",
                        year: 2022,
                        description: "Completed specialized training in procedural programming techniques using SQL.",
                        issuer: "Training Institute"
                    },
                    {
                        id: 3,
                        title: "Responsive Web Design",
                        year: 2025,
                        description: "Completed specialized training in responsive web design techniques.",
                        issuer: "FreeCodeCamp"
                    },
                    {
                        id: 4,
                        title: "JavaScript Algorithms and Data Structures",
                        year: 2025,
                        description: "Completed specialized training in JavaScript algorithms and data structures.",
                        issuer: "FreeCodeCamp"
                    },
                    {
                        id: 5,
                        title: "Front-end Development Libraries",
                        year: 2025,
                        description: "Completed specialized training in front-end development libraries.",
                        issuer: "FreeCodeCamp"
                    },
                    {
                        id: 6,
                        title: "Full Stack Development",
                        year: 2025,
                        description: "Completed specialized training in full stack development with JavaScript.",
                        issuer: "FreeCodeCamp"
                    }
                ]
            };
            localStorage.setItem('portfolioData', JSON.stringify(defaultData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem('portfolioData'));
    }

    saveData(data) {
        localStorage.setItem('portfolioData', JSON.stringify(data));
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            this.authenticate(password);
        });

        // Form submissions
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProject();
        });

        document.getElementById('skillForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSkill();
        });

        document.getElementById('certificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCertification();
        });
    }

    loadData() {
        this.loadProjects();
        this.loadSkills();
        this.loadCertifications();
    }

    // Projects Management
    loadProjects() {
        const data = this.getData();
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';

        data.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${project.title}</h4>
                <p>${project.description.substring(0, 100)}...</p>
                <small>Skills: ${project.skills.join(', ')}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-small" onclick="admin.editProject(${project.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="admin.deleteProject(${project.id})">Delete</button>
            </div>
        `;
        return card;
    }

    addProject() {
        const data = this.getData();
        const imageFile = document.getElementById('projectImage').files[0];
        
        // Validate required fields
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const skills = document.getElementById('projectSkills').value.trim();
        const github = document.getElementById('projectGithub').value.trim();
        const live = document.getElementById('projectLive').value.trim();
        
        // Check required fields
        if (!title) {
            this.showNotification('Project title is required!', 'error');
            return;
        }
        
        if (!description) {
            this.showNotification('Project description is required!', 'error');
            return;
        }
        
        if (!skills) {
            this.showNotification('Project skills are required!', 'error');
            return;
        }
        
        if (!github) {
            this.showNotification('GitHub link is required!', 'error');
            return;
        }
        
        // Check if we have either a new image or an existing image (when editing)
        if (!imageFile && !this.currentEditingImage) {
            this.showNotification('Please select a project image!', 'error');
            return;
        }

        const createProject = (imageData, imageName) => {
            const newProject = {
                id: Date.now(),
                title: title,
                description: description,
                image: imageData,
                imageName: imageName || 'project-image',
                skills: skills.split(',').map(s => s.trim()).filter(s => s),
                github: github,
                live: live // Optional field - can be empty
            };

            data.projects.push(newProject);
            this.saveData(data);
            this.loadProjects();
            this.clearProjectForm();
            this.showNotification('Project added successfully!', 'success');
        };

        if (imageFile) {
            // Convert new image to base64 for storage
            const reader = new FileReader();
            reader.onload = (e) => {
                createProject(e.target.result, imageFile.name);
            };
            reader.readAsDataURL(imageFile);
        } else if (this.currentEditingImage) {
            // Use existing image data
            createProject(this.currentEditingImage, 'existing-image');
        }
    }

    editProject(id) {
        const data = this.getData();
        const project = data.projects.find(p => p.id === id);
        if (project) {
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectSkills').value = project.skills.join(', ');
            document.getElementById('projectGithub').value = project.github;
            document.getElementById('projectLive').value = project.live;

            // Show existing image preview if it exists
            if (project.image) {
                document.getElementById('previewImg').src = project.image;
                document.getElementById('imagePreview').style.display = 'block';
                // Store the existing image data for the form
                this.currentEditingImage = project.image;
            }

            // Remove the old project and add the updated one
            data.projects = data.projects.filter(p => p.id !== id);
            this.saveData(data);
            this.loadProjects();
        }
    }

    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            const data = this.getData();
            data.projects = data.projects.filter(p => p.id !== id);
            this.saveData(data);
            this.loadProjects();
            this.showNotification('Project deleted successfully!', 'success');
        }
    }

    clearProjectForm() {
        document.getElementById('projectForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        this.currentEditingImage = null;
    }

    // Skills Management
    loadSkills() {
        const data = this.getData();
        const skillsGrid = document.getElementById('skillsGrid');
        skillsGrid.innerHTML = '';

        Object.entries(data.skills).forEach(([category, skills]) => {
            const categoryCard = this.createSkillCategoryCard(category, skills);
            skillsGrid.appendChild(categoryCard);
        });
    }

    createSkillCategoryCard(category, skills) {
        const card = document.createElement('div');
        card.className = 'skill-category';
        card.innerHTML = `
            <h4>${category}</h4>
            <ul class="skill-list">
                ${skills.map(skill => `
                    <li>
                        <span>${skill}</span>
                        <button class="btn btn-danger btn-small" onclick="admin.deleteSkill('${category}', '${skill}')">Delete</button>
                    </li>
                `).join('')}
            </ul>
        `;
        return card;
    }

    addSkill() {
        const data = this.getData();
        const skillName = document.getElementById('skillName').value;
        const category = document.getElementById('skillCategory').value;

        if (!data.skills[category]) {
            data.skills[category] = [];
        }

        if (!data.skills[category].includes(skillName)) {
            data.skills[category].push(skillName);
            this.saveData(data);
            this.loadSkills();
            this.clearSkillForm();
            this.showNotification('Skill added successfully!', 'success');
        } else {
            this.showNotification('Skill already exists in this category!', 'error');
        }
    }

    deleteSkill(category, skill) {
        if (confirm(`Are you sure you want to delete "${skill}" from "${category}"?`)) {
            const data = this.getData();
            data.skills[category] = data.skills[category].filter(s => s !== skill);
            this.saveData(data);
            this.loadSkills();
            this.showNotification('Skill deleted successfully!', 'success');
        }
    }

    clearSkillForm() {
        document.getElementById('skillForm').reset();
    }

    // Certifications Management
    loadCertifications() {
        const data = this.getData();
        const certificationsList = document.getElementById('certificationsList');
        certificationsList.innerHTML = '';

        data.certifications.forEach(cert => {
            const certCard = this.createCertificationCard(cert);
            certificationsList.appendChild(certCard);
        });
    }

    createCertificationCard(cert) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${cert.title}</h4>
                <p>${cert.description}</p>
                <small>Year: ${cert.year} | Issuer: ${cert.issuer || 'N/A'}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-small" onclick="admin.editCertification(${cert.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="admin.deleteCertification(${cert.id})">Delete</button>
            </div>
        `;
        return card;
    }

    addCertification() {
        const data = this.getData();
        const newCert = {
            id: Date.now(),
            title: document.getElementById('certTitle').value,
            year: parseInt(document.getElementById('certYear').value),
            description: document.getElementById('certDescription').value,
            issuer: document.getElementById('certIssuer').value
        };

        data.certifications.push(newCert);
        this.saveData(data);
        this.loadCertifications();
        this.clearCertificationForm();
        this.showNotification('Certification added successfully!', 'success');
    }

    editCertification(id) {
        const data = this.getData();
        const cert = data.certifications.find(c => c.id === id);
        if (cert) {
            document.getElementById('certTitle').value = cert.title;
            document.getElementById('certYear').value = cert.year;
            document.getElementById('certDescription').value = cert.description;
            document.getElementById('certIssuer').value = cert.issuer;

            // Remove the old certification and add the updated one
            data.certifications = data.certifications.filter(c => c.id !== id);
            this.saveData(data);
            this.loadCertifications();
        }
    }

    deleteCertification(id) {
        if (confirm('Are you sure you want to delete this certification?')) {
            const data = this.getData();
            data.certifications = data.certifications.filter(c => c.id !== id);
            this.saveData(data);
            this.loadCertifications();
            this.showNotification('Certification deleted successfully!', 'success');
        }
    }

    clearCertificationForm() {
        document.getElementById('certificationForm').reset();
    }

    // Export/Import Functions
    exportData() {
        const data = this.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }

    importData() {
        document.getElementById('importFile').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    this.loadData();
                    this.showNotification('Data imported successfully!', 'success');
                } catch (error) {
                    this.showNotification('Invalid file format!', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    // Utility Functions
    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Tab Management
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Global functions for form clearing
function clearProjectForm() {
    admin.clearProjectForm();
}

function clearSkillForm() {
    admin.clearSkillForm();
}

function clearCertificationForm() {
    admin.clearCertificationForm();
}

// Image handling functions
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    document.getElementById('projectImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    admin.currentEditingImage = null;
}

function logout() {
    admin.logout();
}

function exportData() {
    admin.exportData();
}

function importData() {
    admin.importData();
}

function handleFileImport(event) {
    admin.handleFileImport(event);
}

// Initialize admin panel after configuration loads
async function initializeAdmin() {
    // Wait for configuration to load
    await window.PortfolioConfig.init();
    
    // Initialize admin panel
    window.admin = new PortfolioAdmin();
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
} else {
    initializeAdmin();
} 