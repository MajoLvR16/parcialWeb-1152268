let products = [];
let categories = [];

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

async function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch('https://fakestoreapi.com/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    date: new Date(),
                    products: [{productId: product.id, quantity: 1}]
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Nuevo carrito creado:', result);
                alert('Producto añadido a un nuevo carrito');
                
                // Notificar que se ha creado un nuevo carrito
                localStorage.setItem('cartUpdated', Date.now().toString());
            } else {
                throw new Error('Error al crear el carrito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al añadir el producto al carrito');
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}