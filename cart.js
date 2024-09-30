let cart = { products: [] };

document.addEventListener('DOMContentLoaded', () => {
    const backToMainButton = document.getElementById('backToMainButton');
    const logoutButton = document.getElementById('logoutButton');

    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    backToMainButton.addEventListener('click', () => window.location.href = 'main.html');
    logoutButton.addEventListener('click', logout);

    displayCart();
});

function displayCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    // Leer carrito desde el localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || { products: [] };

    if (cart.products.length === 0) {
        cartList.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
        return;
    }

    const cartItem = document.createElement('div');
    cartItem.className = 'col';
    cartItem.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">Carrito actual</h5>
                <p class="card-text">Número de productos: ${cart.products.length}</p>
                <button onclick="viewCartDetails()" class="btn btn-primary">Ver</button>
            </div>
        </div>
    `;
    cartList.appendChild(cartItem);
}

function viewCartDetails() {
    window.location.href = 'order.html';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}
