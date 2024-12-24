document.addEventListener('DOMContentLoaded', function() {
    // 添加 cart.css 引用
    if (!document.querySelector('link[href="/static/css/cart.css"]')) {
        const cartStyles = document.createElement('link');
        cartStyles.rel = 'stylesheet';
        cartStyles.href = '/static/css/cart.css';
        document.head.appendChild(cartStyles);
    }
    
    // 只使用 /get_cart_count
    fetch('/get_cart_count')
        .then(response => response.json())
        .then(data => {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = data.count;
            }
        });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const buyNowButtons = document.querySelectorAll('.buy-now');
    const modal = document.getElementById('purchaseModal');
    const closeBtn = document.querySelector('.close');
    const purchaseForm = document.getElementById('purchaseForm');

    // 更新购物车数量
    function updateCartCount() {
        fetch('/cart/count')
            .then(response => response.json())
            .then(data => {
                cartCount.textContent = data.count;
            });
    }

    // 加入购物车
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.closest('.product-card').dataset.productId;
            
            addToCart(productId);
        });
    });

    // 立即购买
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            buyNow(productId);
        });
    });

    // 关闭模态框
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 提交订单
    purchaseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        fetch('/purchase', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('订单提交成功！', 'success');
                closeModal();
            } else {
                showNotification(data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('订单提交失败，请重试', 'error');
        });
    });

    // 通知提示
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 初始化购物车数量
    updateCartCount();
}); 

function addToCart(productId) {
    fetch(`/add_to_cart/${productId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 显示成功提示
            const toast = document.createElement('div');
            toast.className = 'toast-message success';
            toast.textContent = '已添加到购物车';
            document.body.appendChild(toast);
            
            // 更新购物车数量
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = data.cart_count;
            }
            
            // 3秒后移除提示
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    });
} 

function buyNow(productId) {
    // 获取商品信息
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const name = productCard.querySelector('.product-name').textContent;
    const price = productCard.querySelector('.current-price').textContent;
    
    // 显示结算模态框
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
    
    // 等待模态框显示完成后再填充数据
    setTimeout(() => {
        // 填充商品信息
        const selectedItemsContainer = modal.querySelector('.selected-items');
        selectedItemsContainer.innerHTML = `
            <div class="selected-item">
                <span>${name}</span>
                <span>x1</span>
                <span>${price}</span>
            </div>
        `;
        
        // 设置总价
        document.getElementById('modal-total').textContent = price;
        
        // 获取并填充用户信息
        fetch('/get_user_info')
            .then(response => response.json())
            .then(data => {
                console.log('获取到的用户信息:', data);
                
                if (data.success && data.user_info) {
                    // 确保在模态框内查找元素
                    const receiverInput = modal.querySelector('#receiver');
                    const phoneInput = modal.querySelector('#phone');
                    const addressInput = modal.querySelector('#address');
                    
                    console.log('找到的表单元素:', {
                        receiver: receiverInput,
                        phone: phoneInput,
                        address: addressInput
                    });
                    
                    // 直接设置值
                    if (receiverInput) receiverInput.value = data.user_info.real_name;
                    if (phoneInput) phoneInput.value = data.user_info.phone;
                    if (addressInput) addressInput.value = data.user_info.address;
                    
                    // 验证填充后的值
                    console.log('填充后的值:', {
                        receiver: receiverInput?.value,
                        phone: phoneInput?.value,
                        address: addressInput?.value
                    });
                }
            })
            .catch(error => {
                console.error('获取用户信息时发生错误:', error);
            });
    }, 100); // 给模态框一点时间完全显示
    
    // 绑定关闭按钮事件
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // 处理订单提交
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.onsubmit = function(e) {
        e.preventDefault();
        
        // 创建订单数据
        const orderData = {
            product_id: productId,
            quantity: 1,
            receiver: document.getElementById('receiver').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            note: document.getElementById('note').value
        };
        
        // 提交订单
        fetch('/create_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('订单提交成功！');
                modal.style.display = 'none';
            } else {
                alert('订单提交失败：' + data.message);
            }
        })
        .catch(error => {
            alert('提交订单时发生错误');
            console.error('Error:', error);
        });
    };
}