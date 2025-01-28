// public/js/main.js

// Função auxiliar para animar a abertura do modal
function animateModalOpen(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.querySelector('div').classList.remove('scale-95', 'opacity-0');
        modal.querySelector('div').classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Função auxiliar para animar o fechamento do modal
function animateModalClose(modalId) {
    const modal = document.getElementById(modalId);
    modal.querySelector('div').classList.remove('scale-100', 'opacity-100');
    modal.querySelector('div').classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

function openAddModal() {
    animateModalOpen('addModal');
    // Reset form
    document.getElementById('name').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('unit').value = 'QTD';
    updateUnitLabel(document.getElementById('unit'), 'unitLabel');
}

function closeAddModal() {
    animateModalClose('addModal');
}

function openEditModal(id, name, quantity, unit) {
    animateModalOpen('editModal');
    document.getElementById('editForm').action = `/products/edit/${id}`;
    document.getElementById('editName').value = name;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editUnit').value = unit;
    updateUnitLabel(document.getElementById('editUnit'), 'editUnitLabel');
}

function closeEditModal() {
    animateModalClose('editModal');
}

function openDeleteModal(productId) {
    deleteFormAction = `/products/delete/${productId}`;
    document.getElementById('deleteForm').action = deleteFormAction;
    animateModalOpen('deleteModal');
}

function closeDeleteModal() {
    animateModalClose('deleteModal');
}


// Inicialização: escuta a submissão do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Ação do formulário já está configurada pela função openDeleteModal
});



function updateUnitLabel(selectElement, labelId) {
    const unit = selectElement.value;
    const label = document.getElementById(labelId);
    label.textContent = unit === 'KG' ? 'kg' : 'unid.';
    
    // Atualiza o step do input de quantidade
    const quantityInput = selectElement.closest('form').querySelector('[name="quantity"]');
    quantityInput.step = unit === 'KG' ? '0.01' : '1';
    if (unit === 'QTD') {
        quantityInput.value = Math.floor(quantityInput.value);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura os listeners iniciais para os selects de unidade
    const addUnitSelect = document.getElementById('unit');
    const editUnitSelect = document.getElementById('editUnit');
    
    if (addUnitSelect) {
        updateUnitLabel(addUnitSelect, 'unitLabel');
    }
    
    if (editUnitSelect) {
        updateUnitLabel(editUnitSelect, 'editUnitLabel');
    }
});


function searchProducts() {
    const searchQuery = document.getElementById('search').value;
    
    // Envia a requisição para o servidor com a busca
    fetch(`/products/search?query=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            // Atualiza a lista de produtos com o resultado da busca
            updateProductList(data.products);
        });
}

function updateProductList(products) {
    const productContainer = document.querySelector('.grid');
    productContainer.innerHTML = '';  // Limpa os produtos atuais

    if (products.length === 0) {
        productContainer.innerHTML = '<div class="text-center text-gray-600 py-8">Nenhum produto encontrado</div>';
    } else {
        products.forEach(product => {
            const productElement = `
                <div class="bg-gray-100 rounded-lg p-10 shadow-md hover:shadow-lg transition">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">${product.name}</h3>
                    <p class="text-gray-600 mb-4">
                        ${product.quantity.toLocaleString('pt-BR', { minimumFractionDigits: product.unit === 'KG' ? 2 : 0, maximumFractionDigits: product.unit === 'KG' ? 2 : 0 })}
                        ${product.unit === 'KG' ? 'kg' : 'unidades'}
                    </p>
                    <div class="flex gap-3">
                        <button onclick="openEditModal('${product.id}', '${product.name}', '${product.quantity}', '${product.unit}')"
                                class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex-1">
                            Editar
                        </button>
                        <form action="/products/delete/${product.id}" method="POST" class="flex-1">
                            <button type="button" onclick="openDeleteModal('${product.id}')"
                                    class="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                Deletar
                            </button>
                        </form>
                    </div>
                </div>
            `;
            productContainer.insertAdjacentHTML('beforeend', productElement);
        });
    }
}
