document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.auth-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 重置错误信息
        usernameError.textContent = '';
        passwordError.textContent = '';

        // 获取表单数据
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // 表单验证
        let hasError = false;

        if (!username) {
            usernameError.textContent = '请输入用户名';
            hasError = true;
        }

        if (!password) {
            passwordError.textContent = '请输入密码';
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // 提交表单
        this.submit();
    });

    // 输入时清除错误信息
    usernameInput.addEventListener('input', function() {
        usernameError.textContent = '';
    });

    passwordInput.addEventListener('input', function() {
        passwordError.textContent = '';
    });
}); 