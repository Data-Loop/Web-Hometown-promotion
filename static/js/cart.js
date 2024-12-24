document.addEventListener('DOMContentLoaded', function() {
    // 绑定数量调整按钮事件
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const change = this.classList.contains('plus') ? 1 : -1;
            updateQuantity(productId, change);
        });
    });

    // 绑定删除按钮事件
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeFromCart(productId);
        });
    });

    // 绑定复选框事件
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotal);
    });

    // 绑定全选事件
    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            document.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateTotal();
        });
    }

    // 初始计算总价
    updateTotal();
});

function updateQuantity(productId, change) {
    fetch(`/cart/update/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ change: change })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
            if (itemElement) {
                // 更新数量
                const quantityElement = itemElement.querySelector('.quantity-value');
                if (quantityElement) {
                    quantityElement.textContent = data.new_quantity;
                }
                // 更新小计
                const subtotalElement = itemElement.querySelector('.subtotal');
                if (subtotalElement) {
                    subtotalElement.textContent = `￥${data.subtotal.toFixed(2)}`;
                }
                // 更新总价
                updateTotal();
                // 更新购物车图标数量
                updateCartCount(data.cart_count);
            }

            // 如果数量为0，移除商品
            if (data.new_quantity === 0) {
                itemElement.remove();
                checkEmptyCart();
            }
        }
    });
}

function removeFromCart(productId) {
    if (confirm('确定要删除这个商品吗？')) {
        fetch(`/cart/remove/${productId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
                if (itemElement) {
                    itemElement.remove();
                }
                updateTotal();
                updateCartCount(data.cart_count);
                checkEmptyCart();
            }
        });
    }
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const checkbox = item.querySelector('.item-checkbox');
        if (checkbox && checkbox.checked) {
            const subtotalText = item.querySelector('.subtotal').textContent;
            const subtotal = parseFloat(subtotalText.replace('￥', ''));
            if (!isNaN(subtotal)) {
                total += subtotal;
            }
        }
    });
    
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `￥${total.toFixed(2)}`;
    }
}

function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <p>购物车是空的</p>
                    <a href="/products" class="continue-shopping">继续购物</a>
                </div>
            `;
        }
    }
}

function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const selectedItems = document.querySelectorAll('.cart-item .item-checkbox:checked');
    
    if (selectedItems.length === 0) {
        alert('请选择要结算的商品');
        return;
    }
    
    // 显示模态框
    modal.style.display = 'block';
    
    // 填充选中的商品信息
    const selectedItemsContainer = modal.querySelector('.selected-items');
    selectedItemsContainer.innerHTML = '';
    let modalTotal = 0;
    
    selectedItems.forEach(checkbox => {
        const item = checkbox.closest('.cart-item');
        const name = item.querySelector('.item-info h3').textContent;
        const quantity = item.querySelector('.quantity-value').textContent;
        const subtotal = parseFloat(item.querySelector('.subtotal').textContent.replace('￥', ''));
        
        selectedItemsContainer.innerHTML += `
            <div class="selected-item">
                <span>${name}</span>
                <span>x${quantity}</span>
                <span>￥${subtotal.toFixed(2)}</span>
            </div>
        `;
        
        modalTotal += subtotal;
    });
    
    // 更新模态框中的总价
    document.getElementById('modal-total').textContent = `￥${modalTotal.toFixed(2)}`;
    
    // 获取并填充用户信息
    fetch('/get_user_info')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('receiver').value = data.user_info.real_name;
                document.getElementById('phone').value = data.user_info.phone;
                document.getElementById('address').value = data.user_info.address;
            }
        });
}

// 关闭模态框
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('checkoutModal').style.display = 'none';
});

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 处理订单提交
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // 这里添加提交订单的逻辑
    alert('订单提交成功！');
    document.getElementById('checkoutModal').style.display = 'none';
}); 