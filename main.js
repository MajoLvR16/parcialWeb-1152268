let products = [];
let categories = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cartButton');
    const logoutButton = document.getElementById('logoutButton');

    // Verificar si el usuario está autenticado
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    // Cargar productos y categorías
    fetchProducts();
    fetchCategories();

    // Event listeners
    cartButton.addEventListener('click', () => window.location.href = 'cart.html');
    logoutButton.addEventListener('click', logout);

    // Cargar carrito desde localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    categoryButtons.innerHTML = '<button onclick="filterProducts(\'all\')">Todas</button>';
    categories.forEach(category => {
        const button = document.createElement('button');
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
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add</button>
    `;
    return card;
}

function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Producto añadido al carrito');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}