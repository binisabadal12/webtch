document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard
    checkAuth();

    updateCartCount();
});

/**
 * Checks if user is logged in. 
 * If not, and not on login page, redirects to login.html.
 */
function checkAuth() {
    const isLogin = window.location.pathname.includes('login.html');
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');

    if (!isLogin && !userLoggedIn && !adminLoggedIn) {
        // Not logged in and trying to access internal pages
        window.location.href = 'login.html';
    }
}

/**
 * Updates the cart count badge in the navigation bar
 * based on the number of items in localStorage.
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
    }
}

/**
 * Utility to format currency
 */
function formatCurrency(amount) {
    return 'NRP ' + parseFloat(amount).toFixed(2);
}
