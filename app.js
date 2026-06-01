/* homdito E-commerce Landing Page Logic */

// Product Database
const PRODUCTS = [
  {
    id: 'aurelia-sofa',
    title: 'Aurelia Modular Sofa',
    category: 'living',
    price: 84999,
    image: 'assets/hero_furniture.png',
    rating: 4.9,
    reviews: 48,
    badge: 'Signature',
    description: 'A gorgeous, architecturally inspired modular sofa. Upholstered in premium stain-resistant velvet fabric with a solid-wood seasoned frame and elegant brushed champagne gold legs. Comfort meets sophistication.'
  },
  {
    id: 'kensington-bed',
    title: 'Kensington Teak Bed Frame',
    category: 'bedroom',
    price: 62500,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 32,
    badge: 'Popular',
    description: 'Exquisite royal craftsmanship using sustainable Grade-A plantation teak. Designed with smooth clean curves and an upholstered velvet headboard for premium back support.'
  },
  {
    id: 'nordic-table',
    title: 'Nordic Oak Dining Table',
    category: 'dining',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 19,
    badge: null,
    description: 'A minimalist 6-seater dining table crafted from light white oak. Treated with protective matte sealants to emphasize the organic growth rings of solid premium timber.'
  },
  {
    id: 'siena-chair',
    title: 'Siena Velvet Accent Chair',
    category: 'dining', // categorised as dining/decor accent
    price: 18999,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 64,
    badge: 'Best Seller',
    description: 'Ergonomic comfort wrapped in luxurious terracotta velvet. Structured on sturdy black metal legs with brass tips, making it an perfect statement piece for any room.'
  },
  {
    id: 'monolith-sideboard',
    title: 'Monolith Solid Wood Sideboard',
    category: 'living',
    price: 34500,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 21,
    badge: null,
    description: 'Featuring elegantly fluted doors and a rich walnut-tinted coating. Perfect storage density that keeps media consoles clean while standing tall as a designer highlight.'
  },
  {
    id: 'solas-pendant',
    title: 'Solas Architectural Pendant',
    category: 'dining', // decor
    price: 9999,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviews: 15,
    badge: 'New',
    description: 'Sleek brushed brass hanging lamp designed with dual hand-blown frosted glass spheres. Projects clean, diffused ambient illumination across dining tables and lounge halls.'
  }
];

// Shopping Cart State
let cart = [];

// Room Visualizer State
let currentVisualizerItem = 'sofa';

// DOM Elements
const productGridContainer = document.getElementById('productGridContainer');
const filterTabs = document.querySelectorAll('.filter-tab');
const mainHeader = document.getElementById('mainHeader');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Cart DOM Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlayBg = document.getElementById('cartOverlayBg');
const cartOpenBtn = document.getElementById('cartOpenBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartBadgeCount = document.getElementById('cartBadgeCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Quick View Modal DOM Elements
const quickViewModal = document.getElementById('quickViewModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalReviews = document.getElementById('modalReviews');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

// Toast DOM Container
const toastContainer = document.getElementById('toastContainer');

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initCartListeners();
  initModalListeners();
  initVisualizerListeners();
  initTestimonialSlider();
  initScrollEffects();
  initNewsletterListener();
});

/* ==========================================================================
   PRODUCT CATALOG LOGIC
   ========================================================================== */
function renderProducts(filter) {
  if (!productGridContainer) return;
  productGridContainer.innerHTML = '';
  
  const filtered = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);
    
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card hover-lift';
    
    let badgeHTML = '';
    if (product.badge) {
      badgeHTML = `<span class="badge badge-terracotta product-tags">${product.badge}</span>`;
    }
    
    card.innerHTML = `
      <div class="product-img-wrapper">
        ${badgeHTML}
        <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
        <div class="product-actions">
          <button class="product-action-btn btn-cart" onclick="handleAddToCart('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
          </button>
          <button class="product-action-btn" onclick="openQuickView('${product.id}')" title="Quick View">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category.toUpperCase()} ROOM</span>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-footer">
          <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
          <div class="product-rating">
            <i class="fa-solid fa-star"></i>
            <span>${product.rating}</span>
          </div>
        </div>
      </div>
    `;
    productGridContainer.appendChild(card);
  });
}

// Category filter selection listener
if (filterTabs) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filterValue = tab.getAttribute('data-filter');
      renderProducts(filterValue);
    });
  });
}

function filterCatalog(category) {
  const matchingTab = document.querySelector(`.filter-tab[data-filter="${category}"]`);
  if (matchingTab) {
    matchingTab.click();
    // Scroll smoothly to catalog
    const catalogHeader = document.querySelector('.filter-tabs');
    if (catalogHeader) {
      catalogHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

/* ==========================================================================
   CART SYSTEM LOGIC
   ========================================================================== */
function initCartListeners() {
  cartOpenBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlayBg.addEventListener('click', closeCart);
  checkoutBtn.addEventListener('click', handleCheckout);
  
  // Mobile menu action
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isOpened = navMenu.classList.contains('active');
    menuToggle.innerHTML = isOpened ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
  });

  // Close mobile menu on links click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    });
  });
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlayBg.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlayBg.classList.remove('active');
}

function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCart();
  showToast(`${product.title} added to your selection.`);
  bumpCartBadge();
}

function handleRemoveFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    handleRemoveFromCart(productId);
  } else {
    updateCart();
  }
}

function updateCart() {
  renderCartItems();
  updateCartTotals();
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-couch cart-empty-icon"></i>
        <p>Your design selection is empty.</p>
        <button class="btn btn-secondary" onclick="closeCart()">Browse Collection</button>
      </div>
    `;
    return;
  }
  
  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
          </div>
          <button class="cart-item-remove" onclick="handleRemoveFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });
}

function updateCartTotals() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartBadgeCount.innerText = totalCount;
  cartSubtotal.innerText = `₹${totalPrice.toLocaleString('en-IN')}`;
}

function bumpCartBadge() {
  cartBadgeCount.classList.add('bump');
  setTimeout(() => {
    cartBadgeCount.classList.remove('bump');
  }, 300);
}

function handleCheckout() {
  if (cart.length === 0) {
    showToast("Please add items to your cart before checking out.");
    return;
  }
  
  showToast("Design selection sent! Loading secure homdito Bangalore checkout...", "fa-circle-check");
  setTimeout(() => {
    alert(`Thank you for demonstrating homdito! We are simulating a payment interface for a total of ₹${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString('en-IN')}. In a production scenario, you would proceed to Razorpay/UPI gateway here.`);
    cart = [];
    updateCart();
    closeCart();
  }, 1000);
}

/* ==========================================================================
   QUICK VIEW MODAL LOGIC
   ========================================================================== */
function initModalListeners() {
  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  
  modalAddToCartBtn.addEventListener('click', () => {
    const activeProductId = modalAddToCartBtn.getAttribute('data-product-id');
    handleAddToCart(activeProductId);
    closeModal();
    openCart();
  });
}

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  modalImage.src = product.image;
  modalImage.alt = product.title;
  modalCategory.innerText = `${product.category.toUpperCase()} ROOM`;
  modalTitle.innerText = product.title;
  modalReviews.innerText = `(${product.reviews} Indian Customer Reviews)`;
  modalPrice.innerText = `₹${product.price.toLocaleString('en-IN')}`;
  modalDescription.innerText = product.description;
  modalAddToCartBtn.setAttribute('data-product-id', product.id);
  
  quickViewModal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock body scroll
}

function closeModal() {
  quickViewModal.classList.remove('open');
  document.body.style.overflow = ''; // Unlock body scroll
}

/* ==========================================================================
   ROOM VISUALIZER LOGIC
   ========================================================================== */
function initVisualizerListeners() {
  const visAddToCartBtn = document.getElementById('visAddToCartBtn');
  const visQuickViewBtn = document.getElementById('visQuickViewBtn');
  
  visAddToCartBtn.addEventListener('click', () => {
    let targetProductId = 'aurelia-sofa'; // Sofa
    if (currentVisualizerItem === 'table') targetProductId = 'nordic-table';
    if (currentVisualizerItem === 'chair') targetProductId = 'siena-chair';
    
    handleAddToCart(targetProductId);
    openCart();
  });
  
  visQuickViewBtn.addEventListener('click', () => {
    let targetProductId = 'aurelia-sofa';
    if (currentVisualizerItem === 'table') targetProductId = 'nordic-table';
    if (currentVisualizerItem === 'chair') targetProductId = 'siena-chair';
    
    openQuickView(targetProductId);
  });
}

function activateVisualizerOption(type) {
  currentVisualizerItem = type;
  
  // Highlight active option card
  document.getElementById('visOptionSofa').classList.remove('active');
  document.getElementById('visOptionTable').classList.remove('active');
  document.getElementById('visOptionChair').classList.remove('active');
  
  let targetOptionId = 'visOptionSofa';
  let targetImageSrc = 'assets/visualizer_living.png'; // default
  
  if (type === 'table') {
    targetOptionId = 'visOptionTable';
    targetImageSrc = 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800';
  } else if (type === 'chair') {
    targetOptionId = 'visOptionChair';
    targetImageSrc = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800';
  } else {
    // sofa (which is the main showcase sofa on visualizer base)
    targetImageSrc = 'assets/visualizer_living.png';
  }
  
  document.getElementById(targetOptionId).classList.add('active');
  
  // Crossfade images
  const baseImg = document.getElementById('visualizerBase');
  baseImg.style.opacity = 0.4;
  
  setTimeout(() => {
    baseImg.src = targetImageSrc;
    baseImg.style.opacity = 1;
  }, 200);
}

/* ==========================================================================
   TESTIMONIAL CAROUSEL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const container = document.getElementById('testimonialContainer');
  const dots = document.querySelectorAll('.control-dot');
  if (!container || dots.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  
  function goToSlide(index) {
    currentSlide = index;
    // Translate the container
    container.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  }
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval); // stop auto rotation if clicked
      const slideIndex = parseInt(dot.getAttribute('data-slide'));
      goToSlide(slideIndex);
      startAutoSlide(); // resume
    });
  });
  
  function startAutoSlide() {
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % dots.length;
      goToSlide(currentSlide);
    }, 6000);
  }
  
  startAutoSlide();
}

/* ==========================================================================
   TOAST NOTIFICATION LOGIC
   ========================================================================== */
function showToast(message, iconClass = "fa-bag-shopping") {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

/* ==========================================================================
   SCROLL EFFECTS & COUNT UP
   ========================================================================== */
function initScrollEffects() {
  // Navigation Background Shift on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // Reveal Elements on Scroll using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Customer Count-up Animation
  const customerStatEl = document.getElementById('statCustomers');
  if (customerStatEl) {
    const statObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateValue(customerStatEl, 0, 50000, 2000);
        statObserver.unobserve(customerStatEl);
      }
    }, { threshold: 0.5 });
    
    statObserver.observe(customerStatEl);
  }
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    obj.innerHTML = value.toLocaleString('en-IN') + "+";
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   NEWSLETTER NEWSLETTER LOGIC
   ========================================================================== */
function initNewsletterListener() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;
      
      showToast("Thank you for subscribing to homdito alerts!", "fa-circle-check");
      emailInput.value = '';
    });
  }
}
