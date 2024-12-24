document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // 为每个输入框添加失去焦点时的验证
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');

        // 用户名实时验证
        username.addEventListener('blur', function() {
            if (!/^[A-Za-z0-9]{4,20}$/.test(this.value)) {
                showError('username-error', '用户名必须是4-20位字母或数字');
            } else {
                clearError('username-error');
            }
        });

        // 密码实时验证
        password.addEventListener('blur', function() {
            if (this.value.length < 6) {
                showError('password-error', '密码长度至少6位');
            } else {
                clearError('password-error');
            }
        });

        // 确认密码实时验证
        confirmPassword.addEventListener('blur', function() {
            if (this.value !== password.value) {
                showError('confirm-password-error', '两次输入的密码不一致');
            } else {
                clearError('confirm-password-error');
            }
        });

        // 邮箱实时验证
        email.addEventListener('blur', function() {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
                showError('email-error', '请输入有效的邮箱地址');
            } else {
                clearError('email-error');
            }
        });

        // 手机号实时验证
        phone.addEventListener('blur', function() {
            if (!/^1[3-9]\d{9}$/.test(this.value)) {
                showError('phone-error', '请输入有效的手机号码');
            } else {
                clearError('phone-error');
            }
        });

        // 原有的表单提交验证保持不变
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // 用户名验证
            if (!/^[A-Za-z0-9]{4,20}$/.test(username.value)) {
                showError('username-error', '用户名必须是4-20位字母或数字');
                isValid = false;
            } else {
                clearError('username-error');
            }

            // 密码验证
            if (password.value.length < 6) {
                showError('password-error', '密码长度至少6位');
                isValid = false;
            } else {
                clearError('password-error');
            }

            if (password.value !== confirmPassword.value) {
                showError('confirm-password-error', '两次输入的密码不一致');
                isValid = false;
            } else {
                clearError('confirm-password-error');
            }

            // 邮箱验证
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showError('email-error', '请输入有效的邮箱地址');
                isValid = false;
            } else {
                clearError('email-error');
            }

            // 手机号验证
            if (!/^1[3-9]\d{9}$/.test(phone.value)) {
                showError('phone-error', '请输入有效的手机号码');
                isValid = false;
            } else {
                clearError('phone-error');
            }

            if (isValid) {
                // 如果验证通过，创建 FormData 对象
                const formData = new FormData(registerForm);
                
                // 发送注册请求
                fetch('/register', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // 显示注册成功弹窗
                        alert('注册成功！');
                        // 跳转到登录页面
                        window.location.href = '/login';
                    } else {
                        // 显示错误信息
                        if (data.errors) {
                            Object.keys(data.errors).forEach(field => {
                                showError(`${field}-error`, data.errors[field]);
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('注册过程中出现错误，请稍后重试');
                });
            }
        });
    }
});

// 登录表单验证也添加实时验证
const loginForm = document.getElementById('login-form');
if (loginForm) {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    username.addEventListener('blur', function() {
        if (!this.value.trim()) {
            showError('username-error', '请输入用户名');
        } else {
            clearError('username-error');
        }
    });

    password.addEventListener('blur', function() {
        if (!this.value) {
            showError('password-error', '请输入密码');
        } else {
            clearError('password-error');
        }
    });
}

function validateLoginForm(e) {
    let isValid = true;
    
    const username = document.getElementById('username');
    if (!username.value.trim()) {
        showError('username-error', '请输入用户名');
        isValid = false;
    } else {
        clearError('username-error');
    }

    const password = document.getElementById('password');
    if (!password.value) {
        showError('password-error', '请输入密码');
        isValid = false;
    } else {
        clearError('password-error');
    }

    if (!isValid) {
        e.preventDefault();
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
} 