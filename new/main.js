   // Main function to initialize the application
        function initApp() {
            // Slide navigation functionality
            let currentSlide = 0;
            const slides = document.querySelectorAll('.slide');
            const totalSlides = slides.length;
            const prevArrow = document.getElementById('prevArrow');
            const nextArrow = document.getElementById('nextArrow');
            const navLinks = document.querySelectorAll('.nav-link');
            const progressBar = document.getElementById('progressBar');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const sidebar = document.getElementById('sidebar');
            const slideIndicators = document.getElementById('slideIndicators');
            let isTransitioning = false;
            let slideDirection = 'right';
            
            // Slide names for tooltips
            const slideNames = [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
            ];

            // Generate slide indicators
            function generateSlideIndicators() {
                slideIndicators.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const indicator = document.createElement('div');
                    indicator.classList.add('indicator');
                    if (i === 0) indicator.classList.add('active');
                    indicator.setAttribute('role', 'button');
                    indicator.setAttribute('tabindex', '0');
                    indicator.setAttribute('aria-label', `اسلاید ${i + 1}: ${slideNames[i]}`);
                    indicator.setAttribute('aria-current', i === 0 ? 'true' : 'false');
                    indicator.setAttribute('title', slideNames[i]);
                
                    // Create tooltip element
                    const tooltip = document.createElement('div');
                    tooltip.classList.add('tooltip');
                    tooltip.textContent = slideNames[i];
                    indicator.appendChild(tooltip);
                
                    // Click handler
                    indicator.addEventListener('click', () => {
                        if (!isTransitioning) {
                            slideDirection = i > currentSlide ? 'right' : 'left';
                            showSlide(i);
                        }
                    });
                    
                    // Keyboard handler
                    indicator.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!isTransitioning) {
                                slideDirection = i > currentSlide ? 'right' : 'left';
                                showSlide(i);
                            }
                        }
                    });
                    
                    slideIndicators.appendChild(indicator);
                }
            }

            // Update slide indicators
            function updateSlideIndicators() {
                const indicators = slideIndicators.querySelectorAll('.indicator');
                indicators.forEach((indicator, index) => {
                    if (index === currentSlide) {
                        indicator.classList.add('active');
                        indicator.setAttribute('aria-current', 'true');
                    } else {
                        indicator.classList.remove('active');
                        indicator.setAttribute('aria-current', 'false');
                    }
                });
            }

            function showSlide(index) {
                if (isTransitioning || index === currentSlide) return;
                
                isTransitioning = true;
                
                // Hide all slides
                slides.forEach((slide, i) => {
                    slide.style.display = 'none';
                    slide.classList.remove('slide-in-right', 'slide-in-left');
                    slide.setAttribute('aria-hidden', 'true');
                    slide.setAttribute('tabindex', '-1');
                });
                
                // Show current slide with animation
                if (slides[index]) {
                    slides[index].style.display = 'block';
                    slides[index].classList.add(slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left');
                    slides[index].setAttribute('aria-hidden', 'false');
                    slides[index].setAttribute('tabindex', '0');
                    
                    currentSlide = index;
                    
                    // Update navigation
                    updateNavigation();
                    updateProgressBar();
                    updateSlideIndicators();
                    
                    // Add interactive class to elements
                    addInteractiveElements();
                    
                    // Focus management for accessibility
                    slides[index].focus();
                    
                    // Auto-scroll to top of screen when slide loads
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    // Announce slide change to screen readers
                    announceSlideChange(index);
                    
                    // Reset transition state after animation
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 800);
                }
            }

            // Announce slide change to screen readers
            function announceSlideChange(index) {
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.style.width = '1px';
                announcement.style.height = '1px';
                announcement.style.overflow = 'hidden';
                announcement.textContent = `اسلاید ${index + 1} از ${totalSlides} نمایش داده شد`;
                
                document.body.appendChild(announcement);
                setTimeout(() => {
                    document.body.removeChild(announcement);
                }, 1000);
            }

            // Add interactive elements to current slide
            function addInteractiveElements() {
                const currentSlideElement = slides[currentSlide];
                const interactiveElements = currentSlideElement.querySelectorAll('h3, p, li, .card');
                
                interactiveElements.forEach((element, index) => {
                    element.classList.add('interactive-element');
                    // Stagger animation
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }

            function updateNavigation() {
                // Update navigation arrows
                prevArrow.disabled = currentSlide === 0;
                nextArrow.disabled = currentSlide === totalSlides - 1;
                
                // Update sidebar navigation
                navLinks.forEach((link, index) => {
                    link.classList.toggle('active', index === currentSlide);
                });
            }

            function updateProgressBar() {
                const progress = ((currentSlide + 1) / totalSlides) * 100;
                progressBar.style.width = `${progress}%`;
            }

            function nextSlide() {
                if (currentSlide < totalSlides - 1 && !isTransitioning) {
                    slideDirection = 'right';
                    showSlide(currentSlide + 1);
                }
            }

            function prevSlide() {
                if (currentSlide > 0 && !isTransitioning) {
                    slideDirection = 'left';
                    showSlide(currentSlide - 1);
                }
            }

            // Event listeners for navigation arrows
            prevArrow.addEventListener('click', prevSlide);
            nextArrow.addEventListener('click', nextSlide);
            
            // Event listeners for sidebar navigation links
            navLinks.forEach((link, index) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (!isTransitioning && index !== currentSlide) {
                        slideDirection = index > currentSlide ? 'right' : 'left';
                        showSlide(index);
                    }
                });
                
                // Add keyboard support for sidebar links
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!isTransitioning && index !== currentSlide) {
                            slideDirection = index > currentSlide ? 'right' : 'left';
                            showSlide(index);
                        }
                    }
                });
            });

            // Add hover effect to navigation links with enhanced feedback
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', function(e) {
                    createParticle(
                        e.clientX,
                        e.clientY,
                        document.body
                    );
                });
            });

            // Enhanced keyboard navigation
            document.addEventListener('keydown', function(e) {
                // Don't interfere with user typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        nextSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        prevSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        slideDirection = 'right';
                        showSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        slideDirection = 'right';
                        showSlide(totalSlides - 1);
                        break;
                    case 'PageUp':
                        e.preventDefault();
                        if (currentSlide > 0) {
                            slideDirection = 'left';
                            showSlide(currentSlide - 1);
                        }
                        break;
                    case 'PageDown':
                        e.preventDefault();
                        if (currentSlide < totalSlides - 1) {
                            slideDirection = 'right';
                            showSlide(currentSlide + 1);
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        sidebar.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        break;
                }
            });

            // Add ripple effect to navigation arrows
            function createRipple(event) {
                const button = event.currentTarget;
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }

            // Note: Ripple effects are already handled by the CSS classes

            // Add smooth scroll behavior to sidebar
            sidebar.addEventListener('wheel', function(e) {
                e.preventDefault();
                sidebar.scrollTop += e.deltaY;
            });

            // Mobile menu toggle functionality
            
            mobileMenuToggle.addEventListener('click', function() {
                const isActive = sidebar.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');
                
                // Update ARIA attributes
                mobileMenuToggle.setAttribute('aria-expanded', isActive);
                
                if (isActive) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    // Focus first navigation link when menu opens
                    const firstNavLink = sidebar.querySelector('.nav-link');
                    if (firstNavLink) {
                        setTimeout(() => firstNavLink.focus(), 100);
                    }
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    // Return focus to toggle button when menu closes
                    mobileMenuToggle.focus();
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !mobileMenuToggle.contains(e.target) &&
                    sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Note: Sidebar navigation and mobile menu toggle are already handled above with proper event listeners

            // Initialize the application
            generateSlideIndicators();
            showSlide(0);
            
            // Initialize modern UI components
            initializeModernComponents();
            
            // Add particle effects
            addParticleEffects();
            
            // Initialize tooltips
            initializeTooltips();
            
            // Initialize modern UI components
            function initializeModernComponents() {
                // Add glass-card class to existing cards
                const cards = document.querySelectorAll('.modern-card');
                cards.forEach(card => {
                    card.classList.add('glass-card');
                });
                
                // Add neon text effect to titles
                const titles = document.querySelectorAll('.slide-title');
                titles.forEach(title => {
                    title.classList.add('neon-text');
                });
                
                // Add badges to important elements
                addBadgesToElements();
            }
            
            // Add badges to important elements
            function addBadgesToElements() {
                const importantElements = document.querySelectorAll('.slide-content h3');
                importantElements.forEach((element, index) => {
                    if (index % 3 === 0) { // Add badge to every third heading
                        const badge = document.createElement('span');
                        badge.className = 'badge badge-primary';
                        badge.textContent = 'مهم';
                        element.appendChild(badge);
                    }
                });
            }
            
            // Add particle effects
            function addParticleEffects() {
                const slides = document.querySelectorAll('.slide');
                
                slides.forEach(slide => {
                    slide.addEventListener('click', function(e) {
                        createParticle(e.clientX, e.clientY, slide);
                    });
                });
            }
            
            // Create particle effect
            function createParticle(x, y, container) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random particle properties
                const size = Math.random() * 6 + 2;
                const color = `hsl(${Math.random() * 60 + 230}, 70%, 60%)`; // Blue to purple range
                
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.backgroundColor = color;
                particle.style.borderRadius = '50%';
                particle.style.left = (x - container.getBoundingClientRect().left) + 'px';
                particle.style.top = (y - container.getBoundingClientRect().top) + 'px';
                particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
                
                container.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }
            
            // Initialize tooltips
            function initializeTooltips() {
                const tooltipElements = document.querySelectorAll('[data-tooltip]');
                tooltipElements.forEach(element => {
                    element.classList.add('tooltip');
                });
            }
            
            // Add loading animation to interactive elements
            function addLoadingAnimation(element) {
                const loadingDots = document.createElement('div');
                loadingDots.className = 'loading-dots';
                loadingDots.innerHTML = '<span></span><span></span><span></span>';
                
                element.appendChild(loadingDots);
                
                setTimeout(() => {
                    if (loadingDots.parentNode) {
                        loadingDots.parentNode.removeChild(loadingDots);
                    }
                }, 2000);
            }
            
            // Enhanced ripple effect with particles
            function createEnhancedRipple(event) {
                const button = event.currentTarget;
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                button.appendChild(ripple);

                // Create particles around the ripple
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        createParticle(
                            event.clientX + (Math.random() - 0.5) * 50,
                            event.clientY + (Math.random() - 0.5) * 50,
                            document.body
                        );
                    }, i * 100);
                }

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
            
            // Replace existing ripple with enhanced version
            if (typeof createRipple === 'function') {
                window.createRipple = createEnhancedRipple;
            }
            
            // Add smooth reveal animation for elements
            function addRevealAnimation() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, {
                    threshold: 0.1
                });
                
                const animatedElements = document.querySelectorAll('.interactive-element');
                animatedElements.forEach(element => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'all 0.6s ease';
                    observer.observe(element);
                });
            }
            
            // Initialize reveal animations
            setTimeout(addRevealAnimation, 500);

            // Note: Smooth scrolling and hover effects are already handled above with proper event listeners
            
            // Show keyboard shortcuts help
            function showKeyboardShortcuts() {
                const shortcuts = [
                    { key: '←', action: 'اسلاید بعدی' },
                    { key: '→', action: 'اسلاید قبلی' },
                    { key: 'Home', action: 'اولین اسلاید' },
                    { key: 'End', action: 'آخرین اسلاید' },
                    { key: 'Page Up', action: 'اسلاید قبلی' },
                    { key: 'Page Down', action: 'اسلاید بعدی' },
                    { key: 'Esc', action: 'بستن منوی موبایل' },
                    { key: 'Ctrl + ?', action: 'نمایش راهنما' }
                ];
                
                let helpHTML = '<div class="keyboard-help" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)); backdrop-filter: blur(15px); padding: 2rem; border-radius: 16px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2); z-index: 1000; max-width: 400px; direction: rtl;">';
                helpHTML += '<h3 style="margin: 0 0 1rem 0; color: #2d3748;">راهنمای کلیدهای میانبر</h3>';
                helpHTML += '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
                
                shortcuts.forEach(shortcut => {
                    helpHTML += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">`;
                    helpHTML += `<span style="font-weight: 600; color: #667eea;">${shortcut.key}</span>`;
                    helpHTML += `<span style="color: #4a5568;">${shortcut.action}</span>`;
                    helpHTML += '</div>';
                });
                
                helpHTML += '</div>';
                helpHTML += '<button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">بستن</button>';
                helpHTML += '</div>';
                
                document.body.insertAdjacentHTML('beforeend', helpHTML);
            }
            
            // Add smooth scrolling (exclude navigation links)
            document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Initialize reveal animations
            setTimeout(addRevealAnimation, 500);
        }
    
    // Initialize the application when DOM is loaded
    document.addEventListener('DOMContentLoaded', initApp);
