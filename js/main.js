/**
 * SQL Learning Theme - Main JavaScript
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeTheme();
    });

    function initializeTheme() {
        // Initialize all components
        initMobileMenu();
        initSmoothScrolling();
        initAnimations();
        initProgressTracking();
        initCodeCopyButtons();
        initTableOfContents();
        initThemeToggle();
    }

    /**
     * Mobile Navigation Menu
     */
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileMenuBtn || !navMenu) return;

        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth Scrolling for Anchor Links
     */
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Scroll Animations
     */
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.page-card, .info-box, .diff-box, .mermaid');
        animateElements.forEach(el => observer.observe(el));
    }

    /**
     * Progress Tracking
     */
    function initProgressTracking() {
        const progressFill = document.querySelector('.progress-fill');
        const chapterLinks = document.querySelectorAll('.chapter-link');
        
        if (!progressFill || !chapterLinks.length) return;

        // Calculate reading progress based on scroll position
        function updateReadingProgress() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            const readingProgressBar = document.querySelector('.reading-progress');
            if (readingProgressBar) {
                readingProgressBar.style.width = scrolled + '%';
            }
        }

        // Add reading progress bar to articles
        if (document.querySelector('.article')) {
            const header = document.querySelector('.header');
            const readingProgress = document.createElement('div');
            readingProgress.className = 'reading-progress-container';
            readingProgress.innerHTML = '<div class="reading-progress"></div>';
            readingProgress.style.cssText = `
                position: fixed;
                top: ${header?.offsetHeight || 70}px;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(0,0,0,0.1);
                z-index: 99;
            `;
            readingProgress.querySelector('.reading-progress').style.cssText = `
                height: 100%;
                background: var(--primary-blue);
                width: 0%;
                transition: width 0.3s ease;
            `;
            
            document.body.appendChild(readingProgress);
            
            window.addEventListener('scroll', updateReadingProgress);
        }
    }

    /**
     * Code Copy Buttons
     */
    function initCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach(block => {
            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.375A2.25 2.25 0 014.125 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                <span>コピー</span>
            `;
            copyBtn.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 3rem;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #e2e8f0;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                transition: all 0.3s ease;
            `;
            
            copyBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.2)';
            });
            
            copyBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255,255,255,0.1)';
            });
            
            copyBtn.addEventListener('click', function() {
                const code = block.querySelector('code');
                const text = code ? code.textContent : block.textContent;
                
                navigator.clipboard.writeText(text).then(() => {
                    const span = this.querySelector('span');
                    const originalText = span.textContent;
                    span.textContent = 'コピー済み';
                    this.style.background = 'rgba(34, 197, 94, 0.2)';
                    
                    setTimeout(() => {
                        span.textContent = originalText;
                        this.style.background = 'rgba(255,255,255,0.1)';
                    }, 2000);
                }).catch(() => {
                    console.error('コピーに失敗しました');
                });
            });
            
            copyBtn.querySelector('svg').style.cssText = 'width: 1em; height: 1em;';
            
            // Add to code block
            block.style.position = 'relative';
            block.appendChild(copyBtn);
        });
    }

    /**
     * Table of Contents Enhancement
     */
    function initTableOfContents() {
        const toc = document.querySelector('.table-of-contents');
        const headings = document.querySelectorAll('.article-content h2, .article-content h3, .article-content h4');
        
        if (!toc || !headings.length) return;

        // Add IDs to headings if they don't have them
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
        });

        // Highlight current section in TOC
        const tocLinks = toc.querySelectorAll('a[href^="#"]');
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;

        function highlightCurrentSection() {
            let current = '';
            
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= headerHeight + 50) {
                    current = heading.id;
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', highlightCurrentSection);
        highlightCurrentSection(); // Initial call
    }

    /**
     * Theme Toggle (Dark/Light Mode)
     */
    function initThemeToggle() {
        // Create theme toggle button if it doesn't exist
        let themeToggle = document.querySelector('.theme-toggle');
        
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.setAttribute('aria-label', 'テーマを切り替え');
            themeToggle.innerHTML = `
                <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
            `;
            
            themeToggle.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--primary-blue);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: var(--shadow-lg);
                transition: all 0.3s ease;
                z-index: 1000;
            `;
            
            document.body.appendChild(themeToggle);
        }

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            
            if (theme === 'dark') {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        }
    }

    /**
     * Enhanced Chapter Navigation
     */
    function initChapterNavigation() {
        const chapterLinks = document.querySelectorAll('.chapter-link');
        
        chapterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Remove active class from all links
                chapterLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Save progress to localStorage
                const chapterUrl = this.getAttribute('href');
                const chapterProgress = JSON.parse(localStorage.getItem('chapterProgress') || '{}');
                chapterProgress[chapterUrl] = Date.now();
                localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
            });
        });
    }

    /**
     * Keyboard Navigation
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Navigation with arrow keys
            if (e.altKey) {
                const prevLink = document.querySelector('.nav-link.prev-link');
                const nextLink = document.querySelector('.nav-link.next-link');
                
                if (e.key === 'ArrowLeft' && prevLink) {
                    window.location.href = prevLink.href;
                } else if (e.key === 'ArrowRight' && nextLink) {
                    window.location.href = nextLink.href;
                }
            }
            
            // Toggle TOC with 't' key
            if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
                const toc = document.querySelector('.table-of-contents');
                if (toc) {
                    toc.style.display = toc.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
    }

    /**
     * Search Functionality (if needed)
     */
    function initSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (query.length > 2) {
                    performSearch(query);
                } else {
                    clearSearchResults();
                }
            }, 300);
        });

        function performSearch(query) {
            // Basic client-side search implementation
            // In a real implementation, you might want to use a search service
            const searchableElements = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content p');
            const results = [];
            
            searchableElements.forEach(element => {
                if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        title: element.textContent,
                        url: window.location.href + '#' + element.id,
                        context: element.textContent.substring(0, 150) + '...'
                    });
                }
            });
            
            displaySearchResults(results);
        }

        function displaySearchResults(results) {
            if (!searchResults) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
            } else {
                const resultsHTML = results.map(result => `
                    <div class="search-result">
                        <h4><a href="${result.url}">${result.title}</a></h4>
                        <p>${result.context}</p>
                    </div>
                `).join('');
                
                searchResults.innerHTML = resultsHTML;
            }
            
            searchResults.style.display = 'block';
        }

        function clearSearchResults() {
            if (searchResults) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
        }
    }

    // Initialize additional features
    initChapterNavigation();
    initKeyboardNavigation();
    initSearch();

})();