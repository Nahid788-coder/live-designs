/* ============================================
   ORGANICK - Organic Food Website
   Main JavaScript File
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // CART SYSTEM
    // ============================================
    let cart = JSON.parse(localStorage.getItem('organickCart')) || [];

    // Cart Elements
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartTotalEl = document.querySelector('.cart-total strong');
    const cartCountEl = document.querySelector('.cart-count');
    const btnCheckout = document.querySelector('.btn-checkout');

    // Checkout Elements
    const checkoutModal = document.querySelector('.checkout-modal');
    const closeCheckoutBtn = document.querySelector('.close-checkout');
    const checkoutItemsContainer = document.querySelector('.checkout-items');
    const subtotalEl = document.querySelector('.subtotal-amount');
    const totalAmountEl = document.querySelector('.total-amount');
    const finalAmountEl = document.querySelector('.final-amount');
    const btnContinuePayment = document.querySelector('.btn-continue-payment');
    const btnBackSummary = document.querySelector('.btn-back-summary');
    const btnPayNow = document.querySelector('.btn-pay-now');
    const btnGoHome = document.querySelector('.btn-go-home');
    const paymentOptions = document.querySelectorAll('input[name="payment"]');

    // Product Database for images
    const productImages = {
        'Fresh Broccoli': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=100&h=100&fit=crop',
        'Organic Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop',
        'Raw Almonds': 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=100&h=100&fit=crop',
        'Farm Fresh Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100&h=100&fit=crop',
        'Fresh Strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&h=100&fit=crop',
        'Organic Carrots': 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=100&h=100&fit=crop',
        'Pure Honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop',
        'Red Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop',
        'Fresh Tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop',
        'Fresh Oranges': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=100&h=100&fit=crop',
        'Fresh Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop',
        'Organic Walnuts': 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=100&h=100&fit=crop',
        'Green Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop',
        'Organic Tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop',
        'Organic Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82efa432?w=100&h=100&fit=crop',
        'Fresh Mangoes': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=100&fit=crop',
        'Green Capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=100&h=100&fit=crop',
        'Organic Cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=100&h=100&fit=crop',
        'Fresh Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=100&h=100&fit=crop'
    };

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('organickCart', JSON.stringify(cart));
    }

    // Update cart count in navbar
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }

    // Calculate cart total
    function getCartTotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Add item to cart
    function addToCart(name, price, quantity = 1, image = null) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                name,
                price,
                quantity,
                image: image || productImages[name] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop'
            });
        }

        saveCart();
        updateCartCount();
        renderCart();
    }

    // Remove item from cart
    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
        updateCartCount();
        renderCart();
    }

    // Update item quantity
    function updateQuantity(name, change) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(name);
            } else {
                saveCart();
                renderCart();
            }
        }
    }

    // Render cart items
    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.classList.remove('has-items');
            cartItemsContainer.innerHTML = '';
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartTotalEl) cartTotalEl.textContent = '$0.00';
            if (btnCheckout) btnCheckout.disabled = true;
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        cartItemsContainer.classList.add('has-items');

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-name="${item.name}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-decrease"><i class="bi bi-dash"></i></button>
                        <span>${item.quantity}</span>
                        <button class="qty-increase"><i class="bi bi-plus"></i></button>
                    </div>
                </div>
                <button class="cart-item-remove"><i class="bi bi-trash"></i></button>
            </div>
        `).join('');

        // Add event listeners
        cartItemsContainer.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.closest('.cart-item').dataset.name;
                updateQuantity(name, -1);
            });
        });

        cartItemsContainer.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.closest('.cart-item').dataset.name;
                updateQuantity(name, 1);
            });
        });

        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.closest('.cart-item').dataset.name;
                removeFromCart(name);
            });
        });

        // Update total
        const total = getCartTotal();
        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
        if (btnCheckout) btnCheckout.disabled = false;
    }

    // Open cart sidebar
    function openCart() {
        if (cartOverlay) cartOverlay.classList.add('active');
        if (cartSidebar) cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close cart sidebar
    function closeCart() {
        if (cartOverlay) cartOverlay.classList.remove('active');
        if (cartSidebar) cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Cart icon click
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }

    // Close cart button
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Close on overlay click
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Checkout button
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function() {
            closeCart();
            openCheckout();
        });
    }

    // Open checkout modal
    function openCheckout() {
        renderCheckoutItems();
        if (checkoutModal) {
            checkoutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        showStep('summary');
    }

    // Close checkout modal
    function closeCheckout() {
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeCheckout);
    }

    // Render checkout items
    function renderCheckoutItems() {
        if (!checkoutItemsContainer) return;

        checkoutItemsContainer.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        const subtotal = getCartTotal();
        const delivery = 5.00;
        const total = subtotal + delivery;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalAmountEl) totalAmountEl.textContent = `$${total.toFixed(2)}`;
        if (finalAmountEl) finalAmountEl.textContent = `$${total.toFixed(2)}`;
    }

    // Show checkout step
    function showStep(step) {
        document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.step-${step}`)?.classList.add('active');
    }

    // Continue to payment
    if (btnContinuePayment) {
        btnContinuePayment.addEventListener('click', function() {
            showStep('payment');
        });
    }

    // Back to summary
    if (btnBackSummary) {
        btnBackSummary.addEventListener('click', function() {
            showStep('summary');
        });
    }

    // Payment option change
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            document.querySelectorAll('.payment-detail').forEach(d => d.classList.remove('active'));
            const detail = document.querySelector(`.${this.value}-detail`);
            if (detail) detail.classList.add('active');
        });
    });

    // Pay Now button
    if (btnPayNow) {
        btnPayNow.addEventListener('click', function() {
            const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;

            // Validate UPI if selected
            if (selectedPayment === 'upi') {
                const upiId = document.getElementById('upiId')?.value;
                if (!upiId || !upiId.includes('@')) {
                    alert('Please enter a valid UPI ID');
                    return;
                }
            }

            // Generate order ID
            const orderId = '#ORG' + Math.random().toString(36).substr(2, 8).toUpperCase();
            document.querySelector('.order-id').textContent = orderId;

            // Save order to history
            saveOrderToHistory(orderId, selectedPayment);

            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();

            // Show success
            showStep('success');
        });
    }

    // Save order to history
    function saveOrderToHistory(orderId, paymentMethod) {
        const orders = JSON.parse(localStorage.getItem('organickOrders')) || [];

        const subtotal = getCartTotal();
        const delivery = 5.00;
        const total = subtotal + delivery;

        const paymentLabels = {
            'upi': 'UPI Payment',
            'qr': 'QR Code',
            'cod': 'Cash on Delivery'
        };

        const order = {
            orderId: orderId,
            date: new Date().toISOString(),
            items: [...cart],
            subtotal: subtotal,
            delivery: delivery,
            total: total,
            paymentMethod: paymentLabels[paymentMethod] || paymentMethod,
            status: paymentMethod === 'cod' ? 'Pending' : 'Paid'
        };

        orders.unshift(order); // Add to beginning
        localStorage.setItem('organickOrders', JSON.stringify(orders));
    }

    // Go Home button
    if (btnGoHome) {
        btnGoHome.addEventListener('click', function() {
            closeCheckout();
            window.location.href = 'index.html';
        });
    }

    // ============================================
    // ORDER HISTORY
    // ============================================
    const orderHistoryContainer = document.querySelector('.order-history-list');
    const noOrdersMessage = document.querySelector('.no-orders-message');

    function renderOrderHistory() {
        if (!orderHistoryContainer) return;

        const orders = JSON.parse(localStorage.getItem('organickOrders')) || [];

        if (orders.length === 0) {
            orderHistoryContainer.innerHTML = '';
            if (noOrdersMessage) noOrdersMessage.style.display = 'block';
            return;
        }

        if (noOrdersMessage) noOrdersMessage.style.display = 'none';

        orderHistoryContainer.innerHTML = orders.map(order => {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const itemsHTML = order.items.map(item => `
                <div class="order-history-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-history-item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-qty">x${item.quantity}</span>
                    </div>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');

            const statusClass = order.status === 'Paid' ? 'status-paid' : 'status-pending';

            return `
                <div class="order-history-card">
                    <div class="order-history-header">
                        <div class="order-id-date">
                            <strong>${order.orderId}</strong>
                            <span>${formattedDate}</span>
                        </div>
                        <span class="order-status ${statusClass}">${order.status}</span>
                    </div>
                    <div class="order-history-items">
                        ${itemsHTML}
                    </div>
                    <div class="order-history-footer">
                        <div class="payment-method">
                            <i class="bi bi-credit-card"></i> ${order.paymentMethod}
                        </div>
                        <div class="order-total">
                            Total: <strong>$${order.total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Initialize order history if on that page
    renderOrderHistory();

    // Order History Modal
    const orderHistoryModal = document.querySelector('.order-history-modal');
    const closeOrderHistoryBtn = document.querySelector('.close-order-history');
    const btnViewOrders = document.querySelector('.btn-view-orders');

    function openOrderHistory() {
        renderOrderHistory();
        if (orderHistoryModal) {
            orderHistoryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeOrderHistory() {
        if (orderHistoryModal) {
            orderHistoryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (btnViewOrders) {
        btnViewOrders.addEventListener('click', function() {
            closeCheckout();
            setTimeout(openOrderHistory, 300);
        });
    }

    if (closeOrderHistoryBtn) {
        closeOrderHistoryBtn.addEventListener('click', closeOrderHistory);
    }

    // Close on clicking outside
    if (orderHistoryModal) {
        orderHistoryModal.addEventListener('click', function(e) {
            if (e.target === orderHistoryModal) {
                closeOrderHistory();
            }
        });
    }

    // Add order history link click handler (for navbar)
    document.querySelectorAll('.open-order-history').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openOrderHistory();
        });
    });

    // Initialize cart on page load
    updateCartCount();
    renderCart();

    // ============================================
    // 0. SHOP PAGE FILTER FROM URL
    // ============================================
    function filterShopProducts() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');

        if (searchQuery && window.location.pathname.includes('shop.html')) {
            const query = searchQuery.toLowerCase().trim();
            const productCards = document.querySelectorAll('.products-section .product-card');
            const filterInfo = document.querySelector('.products-section .row.mb-5 .col-md-6 p');
            let visibleCount = 0;

            productCards.forEach(card => {
                const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
                const productCategory = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
                const productBadge = card.querySelector('.product-badge')?.textContent.toLowerCase() || '';

                const matches = productName.includes(query) ||
                               productCategory.includes(query) ||
                               productBadge.includes(query);

                const cardContainer = card.closest('.col-lg-3');
                if (cardContainer) {
                    if (matches) {
                        cardContainer.style.display = '';
                        visibleCount++;
                    } else {
                        cardContainer.style.display = 'none';
                    }
                }
            });

            // Update the showing text
            if (filterInfo) {
                if (visibleCount > 0) {
                    filterInfo.innerHTML = `Showing <strong>${visibleCount}</strong> products for "<strong>${searchQuery}</strong>"`;
                } else {
                    filterInfo.innerHTML = `No products found for "<strong>${searchQuery}</strong>" <a href="shop.html" class="text-primary">Clear filter</a>`;
                }
            }

            // Add clear filter button if not exists
            const filterBar = document.querySelector('.products-section .row.mb-5');
            if (filterBar && !document.querySelector('.clear-filter-btn')) {
                const clearBtn = document.createElement('a');
                clearBtn.href = 'shop.html';
                clearBtn.className = 'btn btn-sm btn-outline-secondary clear-filter-btn ms-2';
                clearBtn.innerHTML = '<i class="bi bi-x"></i> Clear Filter';
                filterInfo?.parentNode.appendChild(clearBtn);
            }
        }
    }

    filterShopProducts();

    // ============================================
    // 1. NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on page load

    // ============================================
    // 2. BACK TO TOP BUTTON
    // ============================================
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 4. QUANTITY SELECTOR
    // ============================================
    const quantityInputs = document.querySelectorAll('.quantity-input');

    quantityInputs.forEach(container => {
        const minusBtn = container.querySelector('button:first-child');
        const plusBtn = container.querySelector('button:last-child');
        const input = container.querySelector('input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                if (value > 1) {
                    input.value = value - 1;
                }
            });

            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                input.value = value + 1;
            });

            input.addEventListener('change', function() {
                let value = parseInt(this.value) || 1;
                if (value < 1) value = 1;
                this.value = value;
            });
        }
    });

    // ============================================
    // 5. NEWSLETTER FORM SUBMISSION
    // ============================================
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    });

    // ============================================
    // 6. CONTACT FORM SUBMISSION
    // ============================================
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // ============================================
    // 7. PASSWORD PROTECTED FORM
    // ============================================
    const passwordForm = document.querySelector('.password-form');

    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passwordInput = this.querySelector('input[type="password"]');
            if (passwordInput && passwordInput.value) {
                alert('Password submitted. Please wait...');
            }
        });
    }

    // ============================================
    // 8. MOBILE MENU CLOSE ON LINK CLICK
    // ============================================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // ============================================
    // 9. COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || parseInt(counter.innerText);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    }

    function checkCounters() {
        if (countersAnimated) return;

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                countersAnimated = true;
                animateCounters();
            }
        }
    }

    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Check on page load

    // ============================================
    // 10. IMAGE LAZY LOADING
    // ============================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('img-loading');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // ============================================
    // 11. TESTIMONIAL CAROUSEL (if using)
    // ============================================
    const testimonialCarousel = document.querySelector('#testimonialCarousel');

    if (testimonialCarousel) {
        new bootstrap.Carousel(testimonialCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // ============================================
    // 12. ADD TO CART BUTTON (Old - kept for compatibility)
    // ============================================
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card, .product-single-info')?.querySelector('h3, h2, .product-name')?.innerText || 'Product';
            alert(`${productName} has been added to your cart!`);

            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let count = parseInt(cartCount.innerText) || 0;
                cartCount.innerText = count + 1;
            }
        });
    });

    // ============================================
    // 12.1 SHOP PAGE CART WITH QUANTITY
    // ============================================
    const shopProductCards = document.querySelectorAll('.product-card');

    shopProductCards.forEach(card => {
        const minusBtn = card.querySelector('.product-quantity .qty-minus');
        const plusBtn = card.querySelector('.product-quantity .qty-plus');
        const qtyInput = card.querySelector('.product-quantity .qty-input');
        const addCartBtn = card.querySelector('.btn-add-cart');

        if (minusBtn && plusBtn && qtyInput) {
            minusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                let value = parseInt(qtyInput.value) || 1;
                if (value > 1) {
                    qtyInput.value = value - 1;
                }
            });

            plusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                let value = parseInt(qtyInput.value) || 1;
                if (value < 99) {
                    qtyInput.value = value + 1;
                }
            });

            qtyInput.addEventListener('change', function() {
                let value = parseInt(this.value) || 1;
                if (value < 1) value = 1;
                if (value > 99) value = 99;
                this.value = value;
            });
        }

        if (addCartBtn) {
            addCartBtn.addEventListener('click', function(e) {
                e.preventDefault();

                const quantity = parseInt(qtyInput?.value) || 1;
                const productName = this.getAttribute('data-product');
                const productPrice = parseFloat(this.getAttribute('data-price'));
                const totalPrice = (productPrice * quantity).toFixed(2);

                // Add to cart using global function
                addToCart(productName, productPrice, quantity);

                // Show success on button
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-check"></i> Added!';
                this.classList.add('added');

                // Show toast notification
                showShopCartToast(productName, quantity, totalPrice);

                // Reset button after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('added');
                    if (qtyInput) qtyInput.value = 1;
                }, 2000);
            });
        }
    });

    // Shop Cart Toast Function
    function showShopCartToast(productName, quantity, totalPrice) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.cart-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `
            <div class="cart-toast-content">
                <i class="bi bi-cart-check"></i>
                <div class="cart-toast-text">
                    <strong>${quantity}x ${productName}</strong>
                    <span>Added to cart - $${totalPrice}</span>
                </div>
                <button class="cart-toast-btn open-cart-btn">View Cart</button>
            </div>
        `;
        document.body.appendChild(toast);

        // Add click handler to open cart
        toast.querySelector('.open-cart-btn').addEventListener('click', function() {
            toast.remove();
            openCart();
        });

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============================================
    // 13. PRODUCT TABS
    // ============================================
    const productTabLinks = document.querySelectorAll('.product-tabs .nav-link');

    productTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('href');

            // Remove active class from all tabs and content
            document.querySelectorAll('.product-tabs .nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.product-tabs .tab-pane').forEach(p => p.classList.remove('show', 'active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.querySelector(tabId)?.classList.add('show', 'active');
        });
    });

    // ============================================
    // 14. SEARCH TOGGLE WITH LIVE SEARCH
    // ============================================
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');

    // Products Database for Search
    const productsDatabase = [
        {
            id: 1,
            name: 'Fresh Broccoli',
            category: 'Vegetable',
            price: 18.00,
            oldPrice: 24.00,
            image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        },
        {
            id: 2,
            name: 'Organic Bananas',
            category: 'Fruit',
            price: 12.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
            rating: 4,
            link: 'shop-single.html'
        },
        {
            id: 3,
            name: 'Raw Almonds',
            category: 'Nuts',
            price: 22.00,
            oldPrice: 28.00,
            image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        },
        {
            id: 4,
            name: 'Farm Fresh Eggs',
            category: 'Fresh',
            price: 8.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop',
            rating: 4.5,
            link: 'shop-single.html'
        },
        {
            id: 5,
            name: 'Fresh Strawberries',
            category: 'Fruit',
            price: 15.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        },
        {
            id: 6,
            name: 'Organic Carrots',
            category: 'Vegetable',
            price: 10.00,
            oldPrice: 14.00,
            image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=300&h=300&fit=crop',
            rating: 4,
            link: 'shop-single.html'
        },
        {
            id: 7,
            name: 'Pure Honey',
            category: 'Health',
            price: 25.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        },
        {
            id: 8,
            name: 'Red Apples',
            category: 'Fruit',
            price: 12.00,
            oldPrice: 16.00,
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
            rating: 4.5,
            link: 'shop-single.html'
        },
        {
            id: 9,
            name: 'Green Spinach',
            category: 'Vegetable',
            price: 6.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop',
            rating: 4,
            link: 'shop-single.html'
        },
        {
            id: 10,
            name: 'Organic Tomatoes',
            category: 'Vegetable',
            price: 9.00,
            oldPrice: 12.00,
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        },
        {
            id: 11,
            name: 'Fresh Oranges',
            category: 'Fruit',
            price: 14.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
            rating: 4,
            link: 'shop-single.html'
        },
        {
            id: 12,
            name: 'Organic Potatoes',
            category: 'Vegetable',
            price: 7.00,
            oldPrice: 10.00,
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82efa432?w=300&h=300&fit=crop',
            rating: 4.5,
            link: 'shop-single.html'
        },
        {
            id: 13,
            name: 'Fresh Mangoes',
            category: 'Fruit',
            price: 20.00,
            oldPrice: 25.00,
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        },
        {
            id: 14,
            name: 'Green Capsicum',
            category: 'Vegetable',
            price: 8.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop',
            rating: 4,
            link: 'shop-single.html'
        },
        {
            id: 15,
            name: 'Organic Cucumber',
            category: 'Vegetable',
            price: 5.00,
            oldPrice: 7.00,
            image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop',
            rating: 4,
            link: 'shop-single.html'
        },
        {
            id: 16,
            name: 'Fresh Grapes',
            category: 'Fruit',
            price: 18.00,
            oldPrice: null,
            image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&h=300&fit=crop',
            rating: 5,
            link: 'shop-single.html'
        }
    ];

    if (searchToggle && searchOverlay) {
        const searchInput = searchOverlay.querySelector('#searchInput');
        const resultsContainer = searchOverlay.querySelector('.search-results-container');
        const resultsTrack = searchOverlay.querySelector('.search-results-track');
        const resultsCount = searchOverlay.querySelector('.results-count');
        const noResultsMsg = searchOverlay.querySelector('.no-results-message');
        const sliderPrev = searchOverlay.querySelector('.slider-prev');
        const sliderNext = searchOverlay.querySelector('.slider-next');
        const searchTags = searchOverlay.querySelectorAll('.search-tags a');

        let currentSlide = 0;
        let totalSlides = 0;
        let slidesPerView = 4;

        // Update slides per view based on screen size
        function updateSlidesPerView() {
            if (window.innerWidth < 576) {
                slidesPerView = 1;
            } else if (window.innerWidth < 768) {
                slidesPerView = 2;
            } else if (window.innerWidth < 992) {
                slidesPerView = 3;
            } else {
                slidesPerView = 4;
            }
        }

        // Generate star rating HTML
        function generateRating(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    stars += '<i class="bi bi-star-fill"></i>';
                } else if (i - 0.5 <= rating) {
                    stars += '<i class="bi bi-star-half"></i>';
                } else {
                    stars += '<i class="bi bi-star"></i>';
                }
            }
            return stars;
        }

        // Create product card HTML
        function createProductCard(product) {
            const priceHTML = product.oldPrice
                ? `<span class="search-price-old">$${product.oldPrice.toFixed(2)}</span>
                   <span class="search-price-new">$${product.price.toFixed(2)}</span>`
                : `<span class="search-price-new">$${product.price.toFixed(2)}</span>`;

            return `
                <div class="search-result-card" data-product-id="${product.id}">
                    <div class="search-result-image">
                        <span class="search-result-badge">${product.category}</span>
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="search-result-info">
                        <p class="search-result-category">${product.category}</p>
                        <h5 class="search-result-name">${product.name}</h5>
                        <div class="search-result-price">${priceHTML}</div>
                        <div class="search-result-rating">${generateRating(product.rating)}</div>
                    </div>
                    <div class="search-cart-section">
                        <div class="search-quantity-selector">
                            <button type="button" class="qty-btn qty-minus">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="qty-input" value="1" min="1" max="99">
                            <button type="button" class="qty-btn qty-plus">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <button class="search-add-to-cart" data-product="${product.name}" data-price="${product.price}">
                            <i class="bi bi-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
        }

        // Search products
        function searchProducts(query) {
            query = query.toLowerCase().trim();
            if (query.length < 2) {
                resultsContainer.classList.remove('active');
                return;
            }

            const results = productsDatabase.filter(product => {
                return product.name.toLowerCase().includes(query) ||
                       product.category.toLowerCase().includes(query);
            });

            displayResults(results);
        }

        // Display search results
        function displayResults(results) {
            updateSlidesPerView();
            currentSlide = 0;

            if (results.length === 0) {
                resultsTrack.innerHTML = '';
                noResultsMsg.style.display = 'block';
                resultsCount.textContent = '0 products found';
                resultsContainer.classList.add('active');
                return;
            }

            noResultsMsg.style.display = 'none';
            resultsCount.textContent = `${results.length} product${results.length > 1 ? 's' : ''} found`;

            resultsTrack.innerHTML = results.map(product => createProductCard(product)).join('');
            totalSlides = Math.ceil(results.length / slidesPerView);

            updateSlider();
            resultsContainer.classList.add('active');

            // Quantity selector functionality
            resultsTrack.querySelectorAll('.search-result-card').forEach(card => {
                const minusBtn = card.querySelector('.qty-minus');
                const plusBtn = card.querySelector('.qty-plus');
                const qtyInput = card.querySelector('.qty-input');

                minusBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let value = parseInt(qtyInput.value) || 1;
                    if (value > 1) {
                        qtyInput.value = value - 1;
                    }
                });

                plusBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let value = parseInt(qtyInput.value) || 1;
                    if (value < 99) {
                        qtyInput.value = value + 1;
                    }
                });

                qtyInput.addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                qtyInput.addEventListener('change', function() {
                    let value = parseInt(this.value) || 1;
                    if (value < 1) value = 1;
                    if (value > 99) value = 99;
                    this.value = value;
                });
            });

            // Re-attach add to cart listeners
            resultsTrack.querySelectorAll('.search-add-to-cart').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const card = this.closest('.search-result-card');
                    const qtyInput = card.querySelector('.qty-input');
                    const quantity = parseInt(qtyInput.value) || 1;
                    const productName = this.getAttribute('data-product');
                    const productPrice = parseFloat(this.getAttribute('data-price'));
                    const totalPrice = (productPrice * quantity).toFixed(2);

                    // Add to cart using global function
                    addToCart(productName, productPrice, quantity);

                    // Show success message
                    this.innerHTML = '<i class="bi bi-check"></i> Added!';
                    this.style.backgroundColor = 'var(--primary-green)';

                    // Show toast notification
                    showCartToast(productName, quantity, totalPrice);

                    // Reset button after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = '<i class="bi bi-cart-plus"></i> Add';
                        this.style.backgroundColor = '';
                        qtyInput.value = 1;
                    }, 2000);
                });
            });
        }

        // Cart toast notification
        function showCartToast(productName, quantity, totalPrice) {
            // Remove existing toast if any
            const existingToast = document.querySelector('.cart-toast');
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement('div');
            toast.className = 'cart-toast';
            toast.innerHTML = `
                <div class="cart-toast-content">
                    <i class="bi bi-cart-check"></i>
                    <div class="cart-toast-text">
                        <strong>${quantity}x ${productName}</strong>
                        <span>Added to cart - $${totalPrice}</span>
                    </div>
                    <button class="cart-toast-btn open-cart-toast">View Cart</button>
                </div>
            `;
            document.body.appendChild(toast);

            // Add click handler to open cart
            toast.querySelector('.open-cart-toast').addEventListener('click', function() {
                toast.remove();
                // Close search overlay first
                const searchOverlay = document.querySelector('.search-overlay');
                if (searchOverlay) {
                    searchOverlay.classList.remove('active');
                    document.body.classList.remove('search-open');
                }
                openCart();
            });

            // Animate in
            setTimeout(() => toast.classList.add('show'), 10);

            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Update slider position
        function updateSlider() {
            const cardWidth = 100 / slidesPerView;
            resultsTrack.style.transform = `translateX(-${currentSlide * cardWidth}%)`;

            // Update nav buttons visibility
            sliderPrev.style.opacity = currentSlide === 0 ? '0.5' : '1';
            sliderNext.style.opacity = currentSlide >= totalSlides - 1 ? '0.5' : '1';
        }

        // Slider navigation
        if (sliderPrev && sliderNext) {
            sliderPrev.addEventListener('click', function() {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateSlider();
                }
            });

            sliderNext.addEventListener('click', function() {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateSlider();
                }
            });
        }

        // Live search on input
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                searchProducts(this.value);
            }, 300));
        }

        // Search tag clicks
        searchTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const searchTerm = this.getAttribute('data-search');
                if (searchInput && searchTerm) {
                    searchInput.value = searchTerm;
                    searchProducts(searchTerm);
                }
            });
        });

        // Window resize handler
        window.addEventListener('resize', debounce(function() {
            updateSlidesPerView();
            updateSlider();
        }, 200));

        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.classList.add('search-open');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });

        const closeSearch = searchOverlay.querySelector('.close-search');
        if (closeSearch) {
            closeSearch.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
                document.body.classList.remove('search-open');
                resultsContainer.classList.remove('active');
                if (searchInput) searchInput.value = '';
            });
        }

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.classList.remove('search-open');
                resultsContainer.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        });

        // Close on clicking outside
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.classList.remove('search-open');
                resultsContainer.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        });
    }

    // ============================================
    // 15. ANIMATE ON SCROLL (Simple version)
    // ============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            animateObserver.observe(el);
        });
    }

    // ============================================
    // 16. PRELOADER
    // ============================================
    const preloader = document.querySelector('.preloader');

    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // ============================================
    // 17. YEAR IN FOOTER
    // ============================================
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
