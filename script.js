// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Toggle del menú móvil
    mobileNavToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        const isActive = sidebar.classList.contains('active');
        mobileNavToggle.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Cerrar sidebar al hacer clic en un enlace (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Smooth scroll para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight de la sección activa en el scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remover clase activa de todos los enlaces
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Agregar clase activa al enlace correspondiente
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Cerrar menú móvil al hacer click fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggle = mobileNavToggle.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });

    // Protección contra scroll durante la animación del menú móvil
    sidebar.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: true });

    // Agregar efecto de hover al sidebar
    let prevMouseY = 0;
    let isScrolling = false;

    sidebar.addEventListener('mousemove', (e) => {
        if (!isScrolling) {
            const currentMouseY = e.clientY;
            const scrollDirection = currentMouseY > prevMouseY ? 1 : -1;
            const scrollSpeed = Math.abs(currentMouseY - prevMouseY) * 0.5;

            if (Math.abs(currentMouseY - prevMouseY) > 10) {
                isScrolling = true;
                sidebar.scrollBy({
                    top: scrollDirection * scrollSpeed,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            }

            prevMouseY = currentMouseY;
        }
    });

    // Botón "Volver arriba" dinámico
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'back-to-top';
        button.style.display = 'none';
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    createBackToTopButton();

    // Agregar tooltips a los iconos
    const addTooltips = () => {
        const icons = document.querySelectorAll('.section h2 i');
        
        icons.forEach(icon => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = icon.parentElement.textContent.trim();
            
            icon.addEventListener('mouseenter', () => {
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.bottom + 5}px`;
                document.body.appendChild(tooltip);
            });

            icon.addEventListener('mouseleave', () => {
                if (document.body.contains(tooltip)) {
                    document.body.removeChild(tooltip);
                }
            });
        });
    };

    addTooltips();

    // Manejar errores de carga de recursos
    const handleResourceError = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
            });
        });
    };

    handleResourceError();
});