document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const accountInput = document.getElementById('account');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // First, check if the account is available
        fetch('/check-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account: accountInput.value }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 1) {
                // Account is available, proceed with full registration
                submitFullRegistration();
            } else {
                // Account already exists
                alert('此帳號名稱已被使用，請選擇其他帳號名稱。');
                accountInput.value = '';
                accountInput.focus();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('檢查帳號時發生錯誤，請重試。');
        });
    });

    function submitFullRegistration() {
        const formData = {
            name: document.getElementById('name').value,
            sex: document.getElementById('sex').value,
            identity: document.getElementById('identity').value,
            account: accountInput.value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "申請成功") {
                alert('註冊成功！');
                window.location.href = 'login.html';
            } else {
                alert('註冊失敗，請重試。');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('發生錯誤，請重試。');
        });
    }
});
