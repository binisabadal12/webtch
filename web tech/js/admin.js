// Mock Data (Shared source of truth would ideally be an API, but for frontend-only we duplicate or simulate)
// In a real app, this would fetch from the same source as menu.js, or menu.js would fetch from here.
// For this demo, we'll initialize with the same data if localStorage is empty.

const initialMenuItems = [
    { id: 1, name: "Classic Pancakes", category: "breakfast", price: 450, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Avocado Toast", category: "breakfast", price: 550, image: "https://images.unsplash.com/photo-1588137372308-15f75323a6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Grilled Chicken Salad", category: "lunch", price: 750, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Beef Burger", category: "lunch", price: 850, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Steak Frites", category: "dinner", price: 1500, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Salmon Fillet", category: "dinner", price: 1600, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Mojito", category: "drinks", price: 400, image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Iced Latte", category: "drinks", price: 300, image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the menu management page
    if (document.getElementById('admin-menu-table')) {
        renderAdminTable();
        setupAddItem();
    }
});

function getMenuItems() {
    // In a real app, this comes from a DB. Here we simulate persistence with localStorage for valid CRUD.
    const stored = localStorage.getItem('adminMenuItems');
    if (stored) {
        return JSON.parse(stored);
    } else {
        localStorage.setItem('adminMenuItems', JSON.stringify(initialMenuItems));
        return initialMenuItems;
    }
}

function saveMenuItems(items) {
    localStorage.setItem('adminMenuItems', JSON.stringify(items));
}

function renderAdminTable() {
    const items = getMenuItems();
    const tbody = document.getElementById('admin-menu-table');
    tbody.innerHTML = '';

    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-4"><img src="${item.image}" alt="${item.name}" class="rounded" style="width: 40px; height: 40px; object-fit: cover;"></td>
            <td>${item.name}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td>NRP ${item.price}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachDeleteListeners();
}

function attachDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to delete this item?')) {
                const id = parseInt(e.target.closest('button').dataset.id);
                const items = getMenuItems().filter(i => i.id !== id);
                saveMenuItems(items);
                renderAdminTable();
            }
        });
    });
}

function setupAddItem() {
    document.getElementById('save-item-btn').addEventListener('click', () => {
        const form = document.getElementById('add-item-form');
        const name = form.querySelector('input[type="text"]').value;
        const category = form.querySelector('select').value;
        const price = form.querySelector('input[type="number"]').value;
        const image = form.querySelector('input[type="url"]').value;

        if (name && price && image) {
            const items = getMenuItems();
            const newItem = {
                id: Date.now(), // simple unique id
                name,
                category,
                price: parseFloat(price),
                image
            };

            items.push(newItem);
            saveMenuItems(items);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
            modal.hide();

            // Reset form
            form.reset();

            renderAdminTable();
        } else {
            alert('Please fill in all fields');
        }
    });
}
