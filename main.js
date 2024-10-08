let products = [];
let categories = [];
let cart = { products: [] };

document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cartButton');
    const logoutButton = document.getElementById('logoutButton');
    const sortSelect = document.getElementById('sortSelect');

    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    fetchProducts();
    fetchCategories();

    cartButton.addEventListener('click', () => window.location.href = 'cart.html');
    logoutButton.addEventListener('click', logout);
    sortSelect.addEventListener('change', sortProducts);

    // Recuperar el carrito del localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || { products: [] };
});

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        categories = await response.json();
        createCategoryButtons(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function createCategoryButtons(categories) {
    const categoryButtons = document.getElementById('categoryButtons');
    categoryButtons.innerHTML = '<button class="btn btn-outline-primary" onclick="filterProducts(\'all\')">Todas</button>';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary';
        button.textContent = category;
        button.onclick = () => filterProducts(category);
        categoryButtons.appendChild(button);
    });
}

function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
        <div class="card h-100 product-card">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text flex-grow-1">${product.description.substring(0, 100)}...</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="h5 mb-0">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" class="btn btn-primary">Añadir</button>
                </div>
            </div>
        </div>
    `;
    return card;
}

function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

function sortProducts() {
    const sortBy = document.getElementById('sortSelect').value;
    let sortedProducts = [...products];

    switch (sortBy) {
        case 'priceAsc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'priceDesc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'nameAsc':
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'nameDesc':
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    displayProducts(sortedProducts);
}

function addToCart(productId) {
    // Recuperar el carrito actual del localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || { products: [] };

    const product = products.find(p => p.id === productId);
    if (product) {
        const existingProduct = cart.products.find(p => p.productId === productId);
        if (existingProduct) {
            // Si el producto ya está en el carrito, incrementar cantidad
            existingProduct.quantity += 1;
        } else {
            // Si no está en el carrito, añadirlo con cantidad 1
            cart.products.push({ productId: productId, quantity: 1 });
        }

        // Guardar el carrito actualizado en el localStorage
        updateCartInLocalStorage();
        alert('Producto añadido al carrito');
    }
}

function updateCartInLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}
