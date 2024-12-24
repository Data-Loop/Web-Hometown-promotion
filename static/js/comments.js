$(document).ready(function() {
    $('#commentForm').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const textarea = form.find('textarea[name="content"]');
        const submitBtn = form.find('button[type="submit"]');
        const btnText = submitBtn.find('.btn-text');
        const spinner = submitBtn.find('.loading-spinner');
        
        if (!textarea.val().trim()) {
            $('#modalMessage').text('评论内容不能为空');
            $('#messageModal').modal('show');
            return;
        }
        
        const formData = new FormData();
        formData.append('content', textarea.val().trim());
        
        textarea.prop('disabled', true);
        submitBtn.prop('disabled', true);
        btnText.text('提交中...');
        spinner.show();
        
        $.ajax({
            url: '/comments',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function(xhr) {
                console.log("Sending content:", textarea.val().trim());
                console.log("FormData content:", formData.get('content'));
            },
            success: function(response) {
                if (response && response.message) {
                    $('#modalMessage').text(response.message);
                    $('#messageModal').modal('show');
                    
                    if (response.success) {
                        textarea.val('');
                        reloadComments();
                    }
                }
            },
            error: function(xhr, status, error) {
                console.log('Error:', xhr.responseText);
                console.log('Status:', status);
                console.log('Error:', error);
                
                let errorMessage = '系统错误，请稍后重试';
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        errorMessage = response.message;
                    }
                } catch(e) {}
                
                $('#modalMessage').text(errorMessage);
                $('#messageModal').modal('show');
            },
            complete: function() {
                textarea.prop('disabled', false);
                submitBtn.prop('disabled', false);
                btnText.text('发表评论');
                spinner.hide();
            }
        });
    });
});

function reloadComments() {
    const commentsContainer = $('#comments-container');
    $.ajax({
        url: window.location.pathname + window.location.search,
        type: 'GET',
        success: function(response) {
            const newComments = $(response).find('#comments-container').html();
            commentsContainer
                .fadeOut(300, function() {
                    $(this).html(newComments).fadeIn(300);
                });
        },
        error: function() {
            $('#modalMessage').text('刷新评论列表失败');
            $('#messageModal').modal('show');
        }
    });
} 