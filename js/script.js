// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('active');
    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    // Hamburger Animation
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        links.forEach(link => {
            link.style.animation = '';
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky Header on Scroll
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Portfolio Gallery
// Default fallback items (PNG photos) used if manifest.json is missing
const defaultPortfolioItems = [
    { image: 'images/portfolio/hair-styling-soft-waves.png', title: 'Hair Styling - Soft Waves', category: 'hairstyle' },
    { image: 'images/portfolio/bridal-makeup-traditional.png', title: 'Bridal Makeup - Traditional', category: 'makeup' },
    { image: 'images/portfolio/hair-styling-side-profile.png', title: 'Hair Styling - Side Profile', category: 'hairstyle' },
    { image: 'images/portfolio/bridal-hairstyle-jasmine-bun-plait.png', title: 'Bridal Hairstyle - Jasmine Bun & Plait', category: 'hairstyle' },
    { image: 'images/portfolio/bridal-makeup-elegant.png', title: 'Bridal Makeup - Elegant Look', category: 'makeup' },
    { image: 'images/portfolio/makeup-look-classic.png', title: 'Makeup Look - Classic', category: 'makeup' }
];

const portfolioGrid = document.querySelector('.portfolio-grid');

// Function to create portfolio items
function createPortfolioItems(items) {
    portfolioGrid.innerHTML = ''; // Clear existing items
    
    items.forEach((item, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.setAttribute('data-category', item.category);
        
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='images/portfolio/hair-styling-soft-waves.png';">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Load portfolio items from manifest.json if available, else use defaults
async function loadPortfolio() {
    try {
        const res = await fetch('images/portfolio/manifest.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('manifest not found');
        const data = await res.json();
        // Expecting an array of { image, title, category }
        const isValid = Array.isArray(data) && data.every(it => it && typeof it.image === 'string');
        if (!isValid) throw new Error('invalid manifest structure');
        createPortfolioItems(data);
    } catch (e) {
        // Fallback to default set (SVGs)
        createPortfolioItems(defaultPortfolioItems);
    }
}

// Initialize portfolio
loadPortfolio();

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(currentTestimonial);
}, 5000);

// Show first testimonial initially
showTestimonial(currentTestimonial);

// Form Submission (WhatsApp or Email)
const contactForm = document.getElementById('booking-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fd = new FormData(contactForm);
        const data = Object.fromEntries(fd.entries());

        const name = (data.name || '').trim();
        const email = (data.email || '').trim();
        const phone = (data.phone || '').trim();
        const service = data.service || '';
        const date = data.date || '';
        const notes = (data.notes || '').trim();
        const method = data.send_via || 'whatsapp';

        // Build message body
        const lines = [
            'New Booking Request',
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Service: ${service}`,
            `Preferred Date: ${date}`,
            notes ? `Notes: ${notes}` : null
        ].filter(Boolean);
        const message = lines.join('\n');
        const encoded = encodeURIComponent(message);

        if (method === 'email') {
            const subject = encodeURIComponent(`New Booking Request - ${name || 'Client'}`);
            const mailto = `mailto:soujanyateja1209@gmail.com?subject=${subject}&body=${encoded}`;
            window.location.href = mailto; // Opens email client
        } else {
            const waLink = `https://wa.me/918919406091?text=${encoded}`;
            window.open(waLink, '_blank');
        }

        // Optional: give feedback
        alert('Opening your selected app to send the booking details. If nothing opens, please ensure pop-ups are allowed.');
    });
}

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content > div, .testimonial, form, .contact-info');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content > div, .testimonial, form, .contact-info');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Initial check in case elements are already in view
    animateOnScroll();
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Add active class to current section in navigation
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});
