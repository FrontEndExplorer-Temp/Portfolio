document.addEventListener("DOMContentLoaded", () => {
  const openMenuBtn = document.querySelector(".open-menu");
  const mobileMenu = document.querySelector(".mobile-menu");

  openMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.classList.remove("theme-blue", "theme-dark", "theme-purple");
    html.classList.add(savedTheme);
  } else {
    html.classList.add("theme-blue"); // default
  }

  // Get all theme toggle buttons and menus
  const toggleButtons = document.querySelectorAll('[id^="radix-"]');
  const themeMenus = document.querySelectorAll(".theme-menu");

  toggleButtons.forEach((btn, index) => {
    const menu = themeMenus[index];

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");

      // Hide other menus
      themeMenus.forEach((m, i) => {
        if (i !== index) m.classList.add("hidden");
      });
    });
  });

  // Theme option click
  document.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.getAttribute("data-theme");
      html.classList.remove("theme-blue", "theme-dark", "theme-purple");
      html.classList.add(selectedTheme);
      localStorage.setItem("theme", selectedTheme);

      // Hide all theme menus
      themeMenus.forEach((menu) => menu.classList.add("hidden"));
    });
  });

  // Hide dropdown if clicked outside
  document.addEventListener("click", (e) => {
    themeMenus.forEach((menu) => menu.classList.add("hidden"));
  });
});

// Initialize Notyf
const notyf = new Notyf({
  duration: 2000,
  position: { x: "right", y: "bottom" },
  ripple: true,
  dismissible: true,
});

document.querySelectorAll(".resume-btn, .d-resume").forEach((el) => {
  el.addEventListener("click", function () {
    const fileName = this.getAttribute("download") || "Resume";
    setTimeout(() => {
      notyf.success(`${fileName} downloaded successfully!`);
    }, 500);
  });
});

const form = document.querySelector(".contact-card");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  let isValid = true;

  // Clear existing popups
  document.querySelectorAll(".error-popup").forEach((popup) => popup.remove());

  function showError(input, message) {
    const popup = document.createElement("div");
    popup.classList.add("error-popup");
    popup.textContent = message;
    input.parentElement.appendChild(popup);
    popup.style.display = "block";
    setTimeout(() => popup.remove(), 2000);
  }

  // Validation checks
  if (name.value.trim() === "") {
    showError(name, "Name is required");
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showError(email, "Enter a valid email");
    isValid = false;
  }

  if (subject.value.trim() === "") {
    showError(subject, "Subject is required");
    isValid = false;
  }

  if (message.value.trim() === "") {
    showError(message, "Message is required");
    isValid = false;
  }

  // If valid, proceed with async submission
  if (isValid) {
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        notyf.success("Message sent successfully! Thank you 🙌");
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      notyf.error("Oops! Something went wrong. Please try again.");
    }
  }
});

let swiper;

function initSwiper() {
  const isMobile = window.innerWidth <= 768;

  // Destroy Swiper if on mobile
  if (isMobile && swiper) {
    swiper.destroy(true, true);
    swiper = null;
    return;
  }

  // Initialize Swiper on desktop only
  if (!isMobile) {
    swiper = new Swiper(".achievement-swiper", {
      direction: "horizontal",
      slidesPerView: "auto",
      spaceBetween: 20,
      freeMode: true,
      navigation: {
        nextEl: ".next-achievement",
        prevEl: ".prev-achievement",
      },
      mousewheel: true,
      grabCursor: true,
    });
  }
}

// Initialize on load
window.addEventListener("load", initSwiper);
// Re-initialize on resize
window.addEventListener("resize", initSwiper);

// Projects Management
class ProjectsManager {
    constructor() {
        this.projectsPerPage = 3;
        this.currentPage = 1;
        this.allProjects = [];
        this.visibleProjects = [];
        this.init();
    }

    init() {
        try {
            this.loadProjects();
            this.bindEvents();
        } catch (error) {
            console.error('Error initializing ProjectsManager:', error);
        }
    }

    loadProjects() {
        try {
            // Get projects from localStorage or use default
            const portfolioData = localStorage.getItem('portfolioData');
            if (portfolioData) {
                const data = JSON.parse(portfolioData);
                this.allProjects = data.projects || [];
                console.log('Loaded projects from localStorage:', this.allProjects.length);
            } else {
                // Fallback to default projects if no data exists
                this.allProjects = [
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
                ];
                console.log('Using default projects:', this.allProjects.length);
            }
            
            this.renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.allProjects = [];
            this.renderProjects();
        }
    }

    renderProjects() {
        try {
            const projectsGrid = document.getElementById('projectsGrid');
            const showMoreContainer = document.getElementById('showMoreContainer');
            
            if (!projectsGrid) {
                console.error('Projects grid element not found');
                return;
            }

            // Clear existing projects
            projectsGrid.innerHTML = '';

            // Show only first 3 projects initially
            this.visibleProjects = this.allProjects.slice(0, this.projectsPerPage);

            // Render visible projects
            this.visibleProjects.forEach((project, index) => {
                const projectCard = this.createProjectCard(project, index);
                projectsGrid.appendChild(projectCard);
            });

            // Show/hide "Show More" button
            if (this.allProjects.length > this.projectsPerPage) {
                showMoreContainer.style.display = 'flex';
                this.updateShowMoreButton();
                console.log('Show more button displayed - total projects:', this.allProjects.length);
            } else {
                showMoreContainer.style.display = 'none';
                console.log('Show more button hidden - total projects:', this.allProjects.length);
            }
        } catch (error) {
            console.error('Error rendering projects:', error);
        }
    }

    createProjectCard(project, index) {
        try {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`;

            const skillsHtml = project.skills.map(skill => 
                `<span class="project-skill">${skill}</span>`
            ).join('');

            const liveDemoHtml = project.live ? `
                <a href="${project.live}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title}" class="external-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link">
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    </svg>
                    <span>Live Demo</span>
                </a>
            ` : '';

            card.innerHTML = `
                <div class="project-pics">
                    <div class="pic-overflow">
                        <span class="span-pic" style="color: transparent; display: inline-block">
                            <img src="${project.image}" alt="${project.title}" class="project-img lazyload" />
                        </span>
                    </div>
                    <div class="project-overlay">
                        <div class="project-link">
                            <a href="${project.github}" class="project-link-a" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository for ${project.title}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="pj-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="skills">
                        ${skillsHtml}
                    </div>
                    <div class="external-link-div">
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} code" class="external-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                <path d="M9 18c-4.51 2-5-2-7-2"></path>
                            </svg>
                            <span>GitHub</span>
                        </a>
                        ${liveDemoHtml}
                    </div>
                </div>
            `;

            return card;
        } catch (error) {
            console.error('Error creating project card:', error);
            return document.createElement('div');
        }
    }

    updateShowMoreButton() {
        try {
            const showMoreBtn = document.getElementById('showMoreBtn');
            if (!showMoreBtn) return;
            
            const isShowingAll = this.visibleProjects.length >= this.allProjects.length;
            
            if (isShowingAll) {
                showMoreBtn.innerHTML = `
                    <span>Show Less</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="show-more-icon" style="transform: rotate(180deg);">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                `;
            } else {
                showMoreBtn.innerHTML = `
                    <span>Show More Projects</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="show-more-icon">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                `;
            }
        } catch (error) {
            console.error('Error updating show more button:', error);
        }
    }

    toggleProjects() {
        try {
            const projectsGrid = document.getElementById('projectsGrid');
            const isShowingAll = this.visibleProjects.length >= this.allProjects.length;

            if (isShowingAll) {
                // Show only first 3 projects
                this.visibleProjects = this.allProjects.slice(0, this.projectsPerPage);
                console.log('Showing first 3 projects');
            } else {
                // Show all projects
                this.visibleProjects = this.allProjects;
                console.log('Showing all projects');
            }

            // Re-render projects with animation
            projectsGrid.innerHTML = '';
            this.visibleProjects.forEach((project, index) => {
                const projectCard = this.createProjectCard(project, index);
                if (isShowingAll && index >= this.projectsPerPage) {
                    // Add animation for newly shown projects
                    projectCard.style.opacity = '0';
                    projectCard.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        projectCard.style.transition = 'all 0.6s ease';
                        projectCard.style.opacity = '1';
                        projectCard.style.transform = 'translateY(0)';
                    }, index * 100);
                }
                projectsGrid.appendChild(projectCard);
            });

            this.updateShowMoreButton();
        } catch (error) {
            console.error('Error toggling projects:', error);
        }
    }

    bindEvents() {
        try {
            const showMoreBtn = document.getElementById('showMoreBtn');
            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', () => {
                    this.toggleProjects();
                });
                console.log('Show more button event bound');
            } else {
                console.log('Show more button not found');
            }
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }
}

// Initialize Projects Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing ProjectsManager...');
    new ProjectsManager();
});
