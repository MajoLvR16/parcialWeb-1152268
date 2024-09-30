let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const backToMainButton = document.getElementById('backToMainButton');
    const logoutButton = document.getElementById('logoutButton');
    const updateCartButton = document.getElementById('updateCartButton');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    const continueShopping = document.getElementById('continueShopping');

    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    backToMainButton.addEventListener('click', () => window.location.href = 'main.html');
    logoutButton.addEventListener('click', logout);
    updateCartButton.addEventListener('click', updateCart);
    confirmOrderButton.addEventListener('click', confirmOrder);
    continueShopping.addEventListener('click', () => window.location.href = 'main.html');

    loadCart();
});

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById('cartList');
    const cartItems = document.getElementById('cartItems');
    const cartDetails = document.getElementById('cartDetails');
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-center">El carrito está vacío</p>';
        cartDetails.style.display = 'none';
        return;
    }

    cartList.innerHTML = '';
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'col';
        cartItemElement.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">Precio: $${item.price.toFixed(2)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <input type="number" value="${item.quantity}"
                               min="1" onchange="updateQuantity(${item.id}, this.value)"
                               class="form-control w-25">
                        <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        cartList.appendChild(cartItemElement);

        const cartItemDetail = document.createElement('div');
        cartItemDetail.className = 'mb-2';
        cartItemDetail.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${item.title} (x${item.quantity})</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
        `;
        cartItems.appendChild(cartItemDetail);
    });

    updateTotal(total);
    cartDetails.style.display = 'block';
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function updateTotal(total) {
    const cartTotal = document.getElementById('cartTotal');
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Carrito actualizado');
}

async function confirmOrder() {
    try {
        const response = await fetch('https://fakestoreapi.com/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1, // Asumimos un usuario fijo para este ejemplo
                date: new Date(),
                products: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            }),
        });

        if (response.ok) {
            alert('Compra confirmada');
            localStorage.removeItem('cart');
            window.location.href = 'main.html';
        } else {
            throw new Error('Error al confirmar la compra');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al confirmar la compra');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}