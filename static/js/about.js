document.addEventListener('DOMContentLoaded', function() {
    const contactButtons = document.querySelectorAll('.contact-btn');
    const tooltip = document.getElementById('tooltip');

    // 检查元素是否存在
    if (!tooltip) {
        console.error('Tooltip element not found!');
        return;
    }

    console.log('Found buttons:', contactButtons.length);

    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            const contact = this.getAttribute('data-contact');
            console.log('Clicked button with contact:', contact);
            
            // 设置提示框内容和位置
            tooltip.textContent = contact;
            tooltip.style.display = 'block';
            
            // 计算位置（居中显示）
            const buttonRect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // 调整位置计算，让提示框显示在按钮下方
            const left = buttonRect.left + (buttonRect.width - tooltipRect.width) / 2;
            const top = buttonRect.bottom + 10; // 改为显示在按钮下方

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;

            console.log('Tooltip position:', { left, top });

            // 3秒后隐藏提示框
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 3000);
        });
    });

    // 点击其他地方时隐藏提示框
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.contact-btn')) {
            tooltip.style.display = 'none';
        }
    });
});