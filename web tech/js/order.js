document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    setupCheckoutForm();
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.getElementById('cart-table-body');
    const totalEl = document.getElementById('cart-total');
    const placeOrderBtn = document.getElementById('place-order-btn');

    tbody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Your cart is empty. <a href="menu.html">Browse Menu</a></td></tr>`;
        placeOrderBtn.disabled = true;
        totalEl.textContent = 'NRP 0.00';
        return;
    }

    placeOrderBtn.disabled = false;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0 text-dark">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                </div>
            </td>
            <td>NRP ${item.price}</td>
            <td>
                <div class="input-group input-group-sm" style="width: 100px;">
                    <button class="btn btn-outline-secondary btn-sm change-qty" data-index="${index}" data-action="decrease">-</button>
                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary btn-sm change-qty" data-index="${index}" data-action="increase">+</button>
                </div>
            </td>
            <td>NRP ${itemTotal}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    totalEl.textContent = `NRP ${total.toFixed(2)}`;

    attachCartActions();
}

function attachCartActions() {
    // Quantity Changes
    document.querySelectorAll('.change-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('button').dataset.index);
            const action = e.target.closest('button').dataset.action;
            let cart = JSON.parse(localStorage.getItem('cart'));

            if (action === 'increase') {
                cart[index].quantity++;
            } else if (action === 'decrease') {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                }
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount(); // from main.js
        });
    });

    // Remove Items
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('button').dataset.index);
            let cart = JSON.parse(localStorage.getItem('cart'));

            cart.splice(index, 1);

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount(); // from main.js
        });
    });
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            // Form is valid
            processOrder();
        }

        form.classList.add('was-validated');
    });
}

function processOrder() {
    // Simulate API call
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    placeOrderBtn.disabled = true;

    setTimeout(() => {
        // Clear Cart
        localStorage.removeItem('cart');
        updateCartCount();
        renderCart(); // Will show empty state

        // Reset Form
        document.getElementById('checkout-form').reset();
        document.getElementById('checkout-form').classList.remove('was-validated');

        // Restore Button
        placeOrderBtn.innerHTML = 'Place Order';

        // Show Success Modal
        const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
        successModal.show();

    }, 1500);
}
