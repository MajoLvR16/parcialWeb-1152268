let currentOrder = null;
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

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    if (orderId) {
        fetchOrderDetails(orderId);
    } else {
        alert('No se especificó un ID de pedido');
        window.location.href = 'cart.html';
    }
});

async function fetchOrderDetails(orderId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/carts/${orderId}`);
        currentOrder = await response.json();
        await fetchProductDetails(currentOrder.products);
        displayOrderDetails();
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

async function fetchProductDetails(orderProducts) {
    const productPromises = orderProducts.map(item => 
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

    currentOrder.products.forEach(item => {
        const product = products[item.productId];
        const subtotal = product.price * item.quantity;
        total += subtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'mb-3 d-flex align-items-center';
        itemElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="me-3" style="width: 50px; height: 50px; object-fit: contain;">
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

    updateTotal(total);
}

function updateQuantity(productId, newQuantity) {
    const item = currentOrder.products.find(item => item.productId === productId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        const product = products[productId];
        const subtotal = product.price * item.quantity;
        
        // Actualizar solo el subtotal del producto específico
        const productElement = document.querySelector(`input[onchange="updateQuantity(${productId}, this.value)"]`).closest('.mb-3');
        const subtotalElement = productElement.querySelector('span:last-child');
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

        // Recalcular y actualizar el total
        const total = currentOrder.products.reduce((sum, item) => sum + (products[item.productId].price * item.quantity), 0);
        updateTotal(total);
    }
}

function updateTotal(total) {
    const orderTotal = document.getElementById('orderTotal');
    orderTotal.textContent = `Total: $${total.toFixed(2)}`;
}

async function updateOrder() {
    try {
        const response = await fetch(`https://fakestoreapi.com/carts/${currentOrder.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentOrder),
        });

        if (response.ok) {
            alert('Pedido actualizado correctamente');
        } else {
            throw new Error('Error al actualizar el pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al actualizar el pedido');
    }
}

function finishOrder() {
    // Aquí iría la lógica para finalizar el pedido
    alert('Pedido finalizado. Gracias por su compra!');
    // Después de finalizar, podríamos redirigir al usuario a la página principal o a una página de confirmación
    window.location.href = 'main.html';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}