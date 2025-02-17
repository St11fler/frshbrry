// Данни за продуктите
const productsData = {
  strawberry: {
    title: 'Продукти от категория „Ягоди“',
    items: [
      {
        id: 'strawberry-1kg',
        name: 'Пресни Ягоди 1 кг',
        image: 'images/qgoda.jpg',
        description: 'Идеални за директна консумация или за сладкиши.',
        price: 6.99
      },
      {
        id: 'strawberry-3kg',
        name: 'Пресни Ягоди 3 кг',
        image: 'images/qgoda.jpg',
        description: 'За по-големи нужди – по-добра цена на едро.',
        price: 18.99
      }
    ]
  },
  raspberry: {
    title: 'Продукти от категория „Малини“',
    items: [
      {
        id: 'raspberry-1kg',
        name: 'Пресни Малини 1 кг',
        image: 'images/malina.webp',
        description: 'Наситен цвят и неповторим аромат.',
        price: 7.99
      },
      {
        id: 'raspberry-2kg',
        name: 'Пресни Малини 2 кг',
        image: 'images/malina.webp',
        description: 'За любителите на малините – по-изгодна оферта.',
        price: 14.99
      }
    ]
  },
  jam: {
    title: 'Продукти от категория „Домашно Сладко“',
    items: [
      {
        id: 'jam-strawberry-300g',
        name: 'Домашно Сладко Ягода 300г',
        image: 'images/sladko.png',
        description: 'Сладко от ягоди, без консерванти и оцветители.',
        price: 4.50
      },
      {
        id: 'jam-raspberry-300g',
        name: 'Домашно Сладко Малина 300г',
        image: 'images/sladko.png',
        description: 'Истински малинов вкус, приготвен по стара рецепта.',
        price: 5.00
      }
    ]
  }
};

// Количка (масив от обекти { id, name, price, qty })
let cart = [];

// Показване на под-продуктите в секцията
function showProducts(category) {
  const section = document.getElementById('dynamic-products');
  const title = document.getElementById('category-title');
  const productList = document.getElementById('product-list');

  // Задаваме заглавие
  title.textContent = productsData[category].title;
  // Изчистваме списъка
  productList.innerHTML = '';

  // Обхождаме артикулите и генерираме картите
  productsData[category].items.forEach(item => {
    const productCard = document.createElement('div');
    productCard.classList = 'bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow flex flex-col';

    productCard.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
      <div class="p-4 flex flex-col flex-1">
        <h4 class="text-lg font-semibold">${item.name}</h4>
        <p class="text-gray-600 mt-2 flex-grow">${item.description}</p>
        <p class="font-bold text-primary mb-2">${item.price.toFixed(2)} лв</p>
        <button class="bg-secondary text-white py-2 px-4 rounded hover:bg-green-700"
                onclick="addToCart('${item.id}')">
          Добави в количката
        </button>
      </div>
    `;
    productList.appendChild(productCard);
  });

  // Показваме скритата секция
  section.classList.remove('hidden');
  // Скролваме до списъка с продукти
  section.scrollIntoView({ behavior: 'smooth' });
}

// Добавяне на продукт в количката
function addToCart(productId) {
  // Намери продукта по ID
  let foundProduct;
  Object.values(productsData).forEach(cat => {
    cat.items.forEach(item => {
      if (item.id === productId) {
        foundProduct = item;
      }
    });
  });

  if(!foundProduct) return;

  // Проверка дали продуктът вече е в количката
  const existingItem = cart.find(c => c.id === productId);
  if(existingItem) {
    existingItem.qty++;
  } else {
    cart.push({
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price,
      qty: 1
    });
  }
  updateCartUI();
  toggleCart(true); // отваряме количката при добавяне
}

// Обновява визуализацията на количката (брой, обща сума, списък)
function updateCartUI() {
  // Брой
  const cartCountEl = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if(totalItems > 0) {
    cartCountEl.style.display = 'inline';
    cartCountEl.textContent = totalItems;
  } else {
    cartCountEl.style.display = 'none';
  }

  // Списък с продукти
  const cartItemsEl = document.getElementById('cart-items');
  cartItemsEl.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList = 'flex justify-between items-center mb-4';

    div.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-600">${item.price.toFixed(2)} лв</p>
      </div>
      <div class="flex items-center">
        <button class="px-2 py-1 text-sm bg-gray-200 rounded-l"
                onclick="changeQty('${item.id}', -1)">-</button>
        <span class="px-3 border-t border-b">${item.qty}</span>
        <button class="px-2 py-1 text-sm bg-gray-200 rounded-r"
                onclick="changeQty('${item.id}', 1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  // Обща сума
  const cartTotalEl = document.getElementById('cart-total');
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotalEl.textContent = totalPrice.toFixed(2);
}

// Промяна на количеството (+/-)
function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if(!item) return;

  item.qty += delta;
  if(item.qty <= 0) {
    // Премахваме артикула, ако qty става 0
    cart = cart.filter(c => c.id !== productId);
  }
  updateCartUI();
}

// Показване/скриване на количката
function toggleCart(forceOpen = false) {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');

  // Ако forceOpen е true, винаги отваряме
  if(forceOpen) {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    return;
  }

  // При клик или натискане – toggle
  if (cartSidebar.classList.contains('translate-x-full')) {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
  } else {
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
  }
}

// Показване на формата за финализиране
function showCheckout() {
  if(cart.length === 0) {
    alert('Количката е празна.');
    return;
  }
  toggleCart(); // затваряме количката
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('hidden');
}

// Скриване на формата за финализиране
function hideCheckout() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('hidden');
}

// Смяна на полета за доставка
function toggleDeliveryFields() {
  const addressFields = document.getElementById('address-fields');
  const officeFields = document.getElementById('office-fields');

  const toAddress = document.getElementById('deliveryToAddress').checked;
  if(toAddress) {
    addressFields.classList.remove('hidden');
    officeFields.classList.add('hidden');
  } else {
    addressFields.classList.add('hidden');
    officeFields.classList.remove('hidden');
  }
}

// Смяна на полета за плащане
function togglePaymentFields() {
  const cardFields = document.getElementById('card-fields');
  const payCard = document.getElementById('paymentCard').checked;
  if(payCard) {
    cardFields.classList.remove('hidden');
  } else {
    cardFields.classList.add('hidden');
  }
}

// При потвърждаване на поръчката
function submitOrder(e) {
  e.preventDefault();

  // Тук може да обработите поръчката, да я изпратите към сървър и т.н.
  // За демонстрация – само показваме данните в alert
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const email = document.getElementById('customerEmail').value;

  const deliveryMethod = document.getElementById('deliveryToAddress').checked ? 'Адрес' : 'Офис';
  let addressInfo = '';
  if (deliveryMethod === 'Адрес') {
    addressInfo = 'Адрес: ' + document.getElementById('deliveryAddress').value + 
                  ', Град: ' + document.getElementById('deliveryCity').value;
  } else {
    addressInfo = 'Офис: ' + document.getElementById('officeLocation').value;
  }

  const paymentMethod = document.getElementById('paymentCOD').checked ? 'Наложен платеж' : 'Карта';

  // Примерно извеждане:
  alert(`
Поръчка от: ${name}
Телефон: ${phone}
Имейл: ${email}

Доставка: ${deliveryMethod}
${addressInfo}

Плащане: ${paymentMethod}

Благодарим за Вашата поръчка!
  `);

  // Изчистваме формата, затваряме модала
  e.target.reset();
  hideCheckout();

  // Изчистваме количката
  cart = [];
  updateCartUI();
}
