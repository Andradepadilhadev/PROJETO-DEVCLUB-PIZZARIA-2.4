// Seleciona elementos do DOM
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abre o modal do carrinho ao clicar no botão
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fecha o modal quando clicar fora dele
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fecha o modal ao clicar no botão de fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Adiciona itens ao carrinho ao clicar nos botões do menu
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("date-price"));
    addToCart(name, price);
  }
});

// Função para adicionar itens ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    // Se o item já existir, aumenta apenas a quantidade
    existingItem.quantity += 1;
  } else {
    // Se não existir, adiciona o item ao carrinho
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

// Atualiza o modal do carrinho com os itens atualizados
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    // Cria um elemento para cada item no carrinho
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "felx-col",
      "text-yellow-300"
    );

    // Adiciona informações do item ao elemento criado
    cartItemElement.innerHTML = `
    <div class="mt-2">
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(3)}</p>
      </div>
      <button class="remove-btn" date-name="${item.name}">
        Remover 
      </button>
    </div>
    `;

    // Calcula o total do carrinho
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  // Exibe o total do carrinho
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  // Atualiza o contador de itens no carrinho
  cartCounter.innerHTML = cart.length;
}

// Remove item do carrinho ao clicar no botão "Remover"
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("date-name");
    removeItemCart(name);
  }
});

// Função para remover item do carrinho
function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

// Atualiza a interface do endereço do carrinho ao digitar
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// Finaliza o pedido e envia mensagem pelo WhatsApp
checkoutBtn.addEventListener("click", function () {
  const isopen = checkRestaurantOpen();
  if (!isopen) {
    Toastify({
      text: "DevClub Pizzaria está fechada no momento. Horário de funcionamento a partir das 08:00hs.",
      duration: 7000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right,#b7d930, #440257, #b7d930)",
        color: "#FF0000",
        "font-size": "bold",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // Calcula o total do carrinho
  const total = cart
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2);

  // Cria uma mensagem para enviar via WhatsApp
  const cartItems = cart
    .map((item) => {
      return `${item.name} - Quantidade: (${
        item.quantity
      }) - Preço unitário: R$${item.price.toFixed(2)}`;
    })
    .join("\n");

  const message = encodeURIComponent(`${cartItems}\nTotal: R$${total}`);

  // Abre o link para enviar a mensagem pelo WhatsApp
  const phone = "41998780867";
  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  // Limpa o carrinho e atualiza a interface
  cart = [];
  updateCartModal();
});

// Verifica o horário e manipula o card horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 8 && hora < 23; // true = restaurante está aberto
}

// Atualiza a interface do card horário com base no horário atual
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
