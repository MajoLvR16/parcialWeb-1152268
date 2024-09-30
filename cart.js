let carts = [];

document.addEventListener('DOMContentLoaded', () => {
    const backToMainButton = document.getElementById('backToMainButton');
    const logoutButton = document.getElementById('logoutButton');

    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    backToMainButton.addEventListener('click', () => window.location.href = 'main.html');
    logoutButton.addEventListener('click', logout);

    fetchCarts();
});

async function fetchCarts() {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
        carts = await response.json();
        displayCarts(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
    }
}

function displayCarts(carts) {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    if (carts.length === 0) {
        cartList.innerHTML = '<p class="text-center">No hay carritos disponibles.</p>';
        return;
    }

    carts.forEach(cart => {
        const cartItem = document.createElement('div');
        cartItem.className = 'col';
        cartItem.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">Carrito #${cart.id}</h5>
                    <p class="card-text">Número de productos: ${cart.products.length}</p>
                    <p class="card-text">Fecha: ${formatDate(cart.date)}</p>
                    <button onclick="viewCartDetails(${cart.id})" class="btn btn-primary">Ver</button>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function viewCartDetails(cartId) {
    window.location.href = `order.html?id=${cartId}`;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Función para actualizar la lista de carritos
function updateCartList() {
    fetchCarts();
}

// Llamar a updateCartList cada vez que se añade un producto (desde main.js)
window.addEventListener('storage', function(e) {
    if (e.key === 'cartUpdated') {
        updateCartList();
    }
});