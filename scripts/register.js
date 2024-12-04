$(document).ready(function() {
    $('#sex').select2({
        minimumResultsForSearch: Infinity
    });

    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            name: $('#name').val(),
            sex: $('#sex').val(),
            account: $('#account').val(),
            password: $('#password').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val()
        };

        $.ajax({
            url: '/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                if (response.result === "申請成功") {
                    alert('註冊成功！');
                    window.location.href = 'login.html';
                } else {
                    alert('註冊失敗，請重試。');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('發生錯誤，請重試。');
            }
        });
    });
});
