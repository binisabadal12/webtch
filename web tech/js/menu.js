// Mock Menu Data
const menuItems = [
    {
        id: 1,
        name: "Classic Pancakes",
        category: "breakfast",
        price: 450,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Fluffy pancakes served with maple syrup and fresh berries."
    },
    {
        id: 2,
        name: "Avocado Toast",
        category: "breakfast",
        price: 550,
        image: "https://images.unsplash.com/photo-1588137372308-15f75323a6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Toasted sourdough topped with smashed avocado and poached egg."
    },
    {
        id: 3,
        name: "Grilled Chicken Salad",
        category: "lunch",
        price: 750,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Fresh greens, grilled chicken breast, cherry tomatoes, and vinaigrette."
    },
    {
        id: 4,
        name: "Beef Burger",
        category: "lunch",
        price: 850,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Juicy beef patty with cheese, lettuce, and secret sauce."
    },
    {
        id: 5,
        name: "Steak Frites",
        category: "dinner",
        price: 1500,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Premium steak served with crispy french fries and herb butter."
    },
    {
        id: 6,
        name: "Salmon Fillet",
        category: "dinner",
        price: 1600,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Pan-seared salmon with roasted vegetables and lemon sauce."
    },
    {
        id: 7,
        name: "Mojito",
        category: "drinks",
        price: 400,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Refreshing cocktail with mint, lime, and rum."
    },
    {
        id: 8,
        name: "Iced Latte",
        category: "drinks",
        price: 300,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Chilled espresso with milk and ice."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('menu-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Initial Render
    renderMenu(menuItems);

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');
            if (category === 'all') {
                renderMenu(menuItems);
            } else {
                const filtered = menuItems.filter(item => item.category === category);
                renderMenu(filtered);
            }
        });
    });
});

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-sm-6 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img class="card-img-top" src="${item.image}" alt="${item.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <p class="card-text text-muted small">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="h5 mb-0 text-primary">NRP ${item.price}</span>
                        <button class="btn btn-outline-primary btn-sm add-to-cart" data-id="${item.id}">
                            <i class="fas fa-plus me-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-attach event listeners for "Add to Cart" buttons
    attachCartListeners();
}

function attachCartListeners() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').getAttribute('data-id'));
            addToCart(id);
        });
    });
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update UI
    updateCartCount(); // Function from main.js

    // Optional: Show feedback
    alert(`${item.name} added to cart!`);
}
