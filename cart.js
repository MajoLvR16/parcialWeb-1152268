let carts = [];
let currentCart = null;

document.addEventListener('DOMContentLoaded', () => {
    const backToMainButton = document.getElementById('backToMainButton');
    const logoutButton = document.getElementById('logoutButton');
    const updateCartButton = document.getElementById('updateCartButton');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    const continueShopping = document.getElementById('continueShopping');

    // Verificar si el usuario está autenticado
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    backToMainButton.addEventListener('click', () => window.location.href = 'main.html');
    logoutButton.addEventListener('click', logout);
    updateCartButton.addEventListener('click', updateCart);
    confirmOrderButton.addEventListener('click', confirmOrder);
    continueShopping.addEventListener('click', () => window.location.href = 'main.html');

    fetchCarts();
});

async function fetchCarts() {
    try {
        const response = await fetch('https://fakestoreapi.com/carts');
        carts = await response.json();
        displayCarts(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
    }
}

function displayCarts(carts) {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    carts.forEach(cart => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>Número de productos: ${cart.products.length}</p>
            <p>Fecha: ${new Date(cart.date).toLocaleDateString()}</p>
            <button onclick="viewCartDetails(${cart.id})">Ver</button>
        `;
        cartList.appendChild(cartItem);
    });
}

async function viewCartDetails(cartId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/carts/${cartId}`);
        currentCart = await response.json();
        displayCartDetails(currentCart);
    } catch (error) {
        console.error('Error fetching cart details:', error);
    }
}

async function displayCartDetails(cart) {
    const cartDetails = document.getElementById('cartDetails');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';
    let total = 0;

    for (const item of cart.products) {
        const productResponse = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
        const product = await productResponse.json();
        const subtotal = product.price * item.quantity;
        total += subtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${product.title}</p>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.productId}, this.value)">
            <p>$${product.price.toFixed(2)}</p>
            <p>$${subtotal.toFixed(2)}</p>
        `;
        cartItems.appendChild(itemElement);
    }

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartDetails.style.display = 'block';
    document.getElementById('cartList').style.display = 'none';
}

function updateQuantity(productId, newQuantity) {
    const product = currentCart.products.find(p => p.productId === productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
    }
}

function updateCart() {
    // En una aplicación real, aquí se enviaría la actualización al servidor
    alert('Carrito actualizado');
}

function confirmOrder() {
    // En una aplicación real, aquí se confirmaría la orden en el servidor
    alert('Compra confirmada');
    window.location.href = 'main.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}