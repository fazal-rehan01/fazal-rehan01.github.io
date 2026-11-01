/* ============================================================
   Rehan Fazal — SOC Analyst Portfolio
   Navigation, reveal animations, GitHub API, and contact form
   ============================================================ */
(function () {
    'use strict';

    var GITHUB_USERNAME = 'fazal-rehan01';
    var CONTACT_EMAIL = 'kfazal.0000@gmail.com';
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initNavbarScroll();
        initSmoothScroll();
        initScrollSpy();
        initRevealAnimations();
        initTypewriter();
        initGitHubWidget();
        initContactForm();
        initYear();
    });

    /* --------------------------------------------------------
       Mobile navigation
       -------------------------------------------------------- */
    function initMobileNav() {
        var navToggle = document.getElementById('nav-toggle');
        var navMenu = document.getElementById('nav-menu');

        if (!navToggle || !navMenu) return;

        function closeMenu() {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation menu');
        }

        navToggle.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        });

        document.addEventListener('click', function (event) {
            if (!navMenu.classList.contains('active')) return;
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                closeMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 1024) closeMenu();
        });
    }

    /* --------------------------------------------------------
       Navbar scroll state
       -------------------------------------------------------- */
    function initNavbarScroll() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        var ticking = false;

        function update() {
            navbar.classList.toggle('scrolled', window.scrollY > 24);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    /* --------------------------------------------------------
       Smooth scrolling for in-page links
       -------------------------------------------------------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                var href = link.getAttribute('href');
                if (!href || href === '#') return;

                // Let the skip link move keyboard focus naturally.
                if (link.classList.contains('skip-link')) return;

                var target;
                try {
                    target = document.querySelector(href);
                } catch (error) {
                    return;
                }

                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });

                if (history.replaceState) {
                    try {
                        history.replaceState(null, '', href);
                    } catch (error) {
                        // Some file:// contexts disallow history updates.
                    }
                }
            });
        });
    }

    /* --------------------------------------------------------
       Highlight the nav link for the section in view
       -------------------------------------------------------- */
    function initScrollSpy() {
        var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
        if (!links.length) return;

        var sections = links.map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        }).filter(Boolean);

        if (!sections.length) return;

        var ticking = false;

        function updateActive() {
            var marker = window.scrollY + (window.innerHeight * 0.32);
            var current = sections[0];

            sections.forEach(function (section) {
                if (section.offsetTop <= marker) current = section;
            });

            links.forEach(function (link) {
                var isActive = link.getAttribute('href') === '#' + current.id;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateActive);
                ticking = true;
            }
        }, { passive: true });

        updateActive();
    }

    /* --------------------------------------------------------
       Reveal-on-scroll animations
       -------------------------------------------------------- */
    function initRevealAnimations() {
        var elements = document.querySelectorAll('.reveal');

        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            elements.forEach(function (element) {
                element.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        elements.forEach(function (element) {
            observer.observe(element);
        });
    }

    /* --------------------------------------------------------
       Terminal typewriter
       -------------------------------------------------------- */
    function initTypewriter() {
        var target = document.getElementById('terminal-type');
        if (!target) return;

        var commands = ['whoami', 'cat projects/*', 'ls -la certifications/', 'ssh home-lab'];

        if (prefersReducedMotion) {
            target.textContent = 'cat projects/*';
            return;
        }

        var commandIndex = 0;
        var charIndex = 0;
        var deleting = false;

        function tick() {
            var command = commands[commandIndex];

            if (deleting) {
                charIndex -= 1;
            } else {
                charIndex += 1;
            }

            target.textContent = command.slice(0, charIndex);

            if (!deleting && charIndex === command.length) {
                deleting = true;
                window.setTimeout(tick, 1800);
                return;
            }

            if (deleting && charIndex === 0) {
                deleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
                window.setTimeout(tick, 450);
                return;
            }

            window.setTimeout(tick, deleting ? 38 : 85);
        }

        window.setTimeout(tick, 1400);
    }

    /* --------------------------------------------------------
       GitHub — latest public repositories
       -------------------------------------------------------- */
    function initGitHubWidget() {
        var container = document.getElementById('github-content');
        if (!container) return;
        if (!window.fetch) {
            showGitHubError(container, 'GitHub repositories are unavailable in this browser.');
            return;
        }

        var endpoint = 'https://api.github.com/users/' +
            encodeURIComponent(GITHUB_USERNAME) +
            '/repos?sort=updated&per_page=6';

        fetch(endpoint, {
            headers: { Accept: 'application/vnd.github+json' }
        })
            .then(function (response) {
                if (response.status === 403) {
                    throw new Error('rate-limited');
                }
                if (!response.ok) {
                    throw new Error('request-failed');
                }
                return response.json();
            })
            .then(function (repos) {
                if (!Array.isArray(repos)) {
                    throw new Error('unexpected-response');
                }

                var publicRepos = repos.filter(function (repo) {
                    return repo && !repo.fork;
                }).slice(0, 6);

                container.innerHTML = '';
                container.setAttribute('aria-busy', 'false');

                if (!publicRepos.length) {
                    showGitHubError(container, 'No public repositories found yet. Check back soon.');
                    return;
                }

                publicRepos.forEach(function (repo) {
                    container.appendChild(createRepoCard(repo));
                });
            })
            .catch(function (error) {
                if (window.console && console.warn) {
                    console.warn('GitHub widget:', error.message);
                }
                showGitHubError(
                    container,
                    error.message === 'rate-limited'
                        ? 'GitHub API rate limit reached. Visit the GitHub profile directly.'
                        : 'Unable to load repositories right now. Visit the GitHub profile directly.'
                );
            });
    }

    function createRepoCard(repo) {
        var card = document.createElement('div');
        card.className = 'github-repo';

        var link = document.createElement('a');
        link.href = String(repo.html_url || 'https://github.com/' + GITHUB_USERNAME);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        var icon = document.createElement('i');
        icon.className = 'fab fa-github';
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
        link.appendChild(document.createTextNode(repo.name || 'Untitled repository'));
        card.appendChild(link);

        var description = document.createElement('p');
        description.textContent = repo.description || 'No description provided.';
        card.appendChild(description);

        var meta = document.createElement('div');
        meta.className = 'github-repo-meta';

        if (repo.language) {
            var language = document.createElement('span');
            language.className = 'language';
            language.textContent = repo.language;
            meta.appendChild(language);
        }

        if (typeof repo.stargazers_count === 'number') {
            meta.appendChild(createMetaItem('fas fa-star', repo.stargazers_count + ' stars'));
        }

        if (repo.updated_at) {
            var updated = new Date(repo.updated_at);
            if (!isNaN(updated.getTime())) {
                meta.appendChild(createMetaItem(
                    'fas fa-clock',
                    'Updated ' + updated.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                ));
            }
        }

        if (meta.childNodes.length) {
            card.appendChild(meta);
        }

        return card;
    }

    function createMetaItem(iconClass, text) {
        var item = document.createElement('span');
        var icon = document.createElement('i');
        icon.className = iconClass;
        icon.setAttribute('aria-hidden', 'true');
        item.appendChild(icon);
        item.appendChild(document.createTextNode(text));
        return item;
    }

    function showGitHubError(container, message) {
        container.innerHTML = '';
        container.setAttribute('aria-busy', 'false');
        var error = document.createElement('div');
        error.className = 'github-error';
        var icon = document.createElement('i');
        icon.className = 'fas fa-triangle-exclamation';
        icon.setAttribute('aria-hidden', 'true');
        error.appendChild(icon);
        error.appendChild(document.createTextNode(message));
        container.appendChild(error);
    }

    /* --------------------------------------------------------
       Contact form
       -------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contact-form');
        var messageBox = document.getElementById('form-message');
        if (!form || !messageBox) return;

        var submitButton = form.querySelector('button[type="submit"]');
        var defaultButtonMarkup = submitButton ? submitButton.innerHTML : 'Send Message';

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var honeypot = form.querySelector('input[name="honeypot"]');
            if (honeypot && honeypot.value !== '') {
                return; // silently reject bots
            }

            var data = new FormData(form);
            var name = String(data.get('name') || '').trim();
            var email = String(data.get('email') || '').trim();
            var subject = String(data.get('subject') || '').trim();
            var message = String(data.get('message') || '').trim();

            clearFieldErrors(form);

            if (!name || !email || !subject || !message) {
                markInvalid(form, [
                    { value: name, id: 'name' },
                    { value: email, id: 'email' },
                    { value: subject, id: 'subject' },
                    { value: message, id: 'message' }
                ]);
                showFormMessage(messageBox, 'Please complete every field before sending.', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                markInvalid(form, [{ value: '', id: 'email' }]);
                showFormMessage(messageBox, 'Please enter a valid email address.', 'error');
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Opening email app…';
            }

            // No backend is required: hand the message to the visitor's email
            // client. Replace this block with a Formspree/Netlify fetch call if
            // you prefer server-side delivery.
            var subjectLine = 'Portfolio contact: ' + subject;
            var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
            var mailto = 'mailto:' + CONTACT_EMAIL +
                '?subject=' + encodeURIComponent(subjectLine) +
                '&body=' + encodeURIComponent(body);

            showFormMessage(messageBox, 'Opening your email app…', 'success');
            window.location.href = mailto;

            window.setTimeout(function () {
                showFormMessage(
                    messageBox,
                    'If your email app did not open, email ' + CONTACT_EMAIL + ' directly.',
                    'success'
                );
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = defaultButtonMarkup;
                }
            }, 1200);
        });

        form.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                field.removeAttribute('aria-invalid');
            });
        });
    }

    function markInvalid(form, fields) {
        var firstInvalid = null;
        fields.forEach(function (field) {
            if (field.value) return;
            var element = form.querySelector('#' + field.id);
            if (!element) return;
            element.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = element;
        });
        if (firstInvalid) firstInvalid.focus();
    }

    function clearFieldErrors(form) {
        form.querySelectorAll('[aria-invalid]').forEach(function (field) {
            field.removeAttribute('aria-invalid');
        });
    }

    function showFormMessage(element, message, type) {
        element.textContent = message;
        element.className = 'form-message ' + type;
        element.style.display = 'block';
    }

    /* --------------------------------------------------------
       Footer year
       -------------------------------------------------------- */
    function initYear() {
        var year = document.getElementById('year');
        if (year) year.textContent = String(new Date().getFullYear());
    }
}());
