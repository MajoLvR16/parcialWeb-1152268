let cart = { products: [] };
let products = {};

document.addEventListener('DOMContentLoaded', () => {
    const backToCartsButton = document.getElementById('backToCartsButton');
    const backToCartsButton2 = document.getElementById('backToCartsButton2');
    const logoutButton = document.getElementById('logoutButton');
    const updateOrderButton = document.getElementById('updateOrderButton');
    const finishOrderButton = document.getElementById('finishOrderButton');
    const continueShoppingButton = document.getElementById('continueShoppingButton');

    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    backToCartsButton.addEventListener('click', () => window.location.href = 'cart.html');
    backToCartsButton2.addEventListener('click', () => window.location.href = 'cart.html');
    logoutButton.addEventListener('click', logout);
    updateOrderButton.addEventListener('click', updateOrder);
    finishOrderButton.addEventListener('click', finishOrder);
    continueShoppingButton.addEventListener('click', () => window.location.href = 'main.html');

    fetchCartDetails();
});

async function fetchCartDetails() {
    cart = JSON.parse(localStorage.getItem('cart')) || { products: [] };
    await fetchProductDetails(cart.products);
    displayOrderDetails();
}

async function fetchProductDetails(cartProducts) {
    const productPromises = cartProducts.map(item => 
        fetch(`https://fakestoreapi.com/products/${item.productId}`)
            .then(res => res.json())
    );
    const productDetails = await Promise.all(productPromises);
    productDetails.forEach(product => {
        products[product.id] = product;
    });
}

function displayOrderDetails() {
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = '';
    let total = 0;

    cart.products.forEach(item => {
        const product = products[item.productId];
        const subtotal = product.price * item.quantity;
        total += subtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'mb-3 d-flex align-items-center';
        itemElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image me-3">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                    <span>${product.title}</span>
                    <div>
                        <input type="number" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.productId}, this.value)"
                               class="form-control d-inline-block" style="width: 60px;">
                        <span class="ms-2">$${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        orderItems.appendChild(itemElement);
    });

    updateTotalDisplay(total);
}

function updateTotalDisplay(total) {
    const totalElement = document.getElementById('orderTotal');
    if (totalElement) {
        totalElement.innerHTML = `<strong>Total del pedido:</strong> $${total.toFixed(2)}`;
    } else {
        console.error('Elemento con ID "orderTotal" no encontrado');
    }
    console.log('Total actualizado:', total); // Para debugging
}

function updateQuantity(productId, newQuantity) {
    const productInCart = cart.products.find(p => p.productId === productId);
    if (productInCart) {
        productInCart.quantity = parseInt(newQuantity);
        updateCartInLocalStorage();
        recalculateTotal();
    }
}

function recalculateTotal() {
    let total = 0;
    cart.products.forEach(item => {
        const product = products[item.productId];
        total += product.price * item.quantity;
    });
    updateTotalDisplay(total);
}

function updateCartInLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateOrder() {
    alert('El pedido ha sido actualizado.');
    recalculateTotal();
}

function finishOrder() {
    alert('Pedido finalizado. Gracias por tu compra.');
    cart = { products: [] };
    updateCartInLocalStorage();
    displayOrderDetails();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}