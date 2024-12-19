let creditCards = []; // 全局變數，用於存儲信用卡列表
let isEditMode = false;
let originalUserData = {};

// Set a fixed user ID for testing
let userId = localStorage.getItem('userId');
// let userId = '1';
// now is test mode

// Function to handle user logout
function handleLogoutUserButtonClick() {
    localStorage.setItem('userId', '0');
    let cart = {
        ProductNum: 0,
        TotalAmount: 0
    };
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = 'home.html';
}

let cart = JSON.parse(localStorage.getItem("cart"));
if (!cart) {
    cart = { ProductNum: 0 };
}
document.querySelector(".cart-num").innerHTML = cart.ProductNum;

// Function to delete a credit card
async function deleteCard(event) {
    const cardItem = event.target.closest('.credit-card-item');
    const cardNumber = cardItem.querySelector('.card-number').textContent;

    const confirmDelete = confirm(`確定要刪除卡號 ${cardNumber} 嗎？`);
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/deleteCreditCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, cardNumber }),
        });

        const data = await response.json();
        // alert(data.result);
        if (data.result) {
            creditCards = creditCards.filter(card => card.number !== cardNumber);
            renderCreditCards();
            alert('信用卡已成功刪除。');
        } else {
            alert('刪除信用卡失敗，請稍後再試。');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('刪除信用卡時發生錯誤，請稍後再試。');
    }
}

// Function to add a new credit card
async function addCard() {
    const cardNumberInput = document.getElementById('newCardNumber');
    const cvvInput = document.getElementById('newCardCVV');
    const cardNumber = cardNumberInput.value.trim();
    const cvv = cvvInput.value.trim();

    if (!cardNumber || !cvv) {
        alert('請填寫完整的卡號和 CVV。');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/addCreditCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, cardNumber, cvv }),
        });

        const data = await response.json();

        if (data.result) {
            creditCards.push({ number: cardNumber, cvv });
            renderCreditCards();
            cardNumberInput.value = '';
            cvvInput.value = '';
            alert('信用卡已成功添加。');
        } else {
            alert('添加信用卡失敗，請稍後再試。');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('添加信用卡時發生錯誤，請稍後再試。');
    }
}

// Function to render credit cards in the list
function renderCreditCards() {
    const creditCardList = document.getElementById('creditCardList');
    creditCardList.innerHTML = '';

    if (creditCards.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = '還沒綁卡呢親';
        creditCardList.appendChild(emptyMessage);
    } else {
        creditCards.forEach((card, index) => {
            const li = document.createElement('li');
            li.className = 'credit-card-item';
            li.innerHTML = `
                <span class="card-number">${card.number}</span>
                <span class="cvv">${card.cvv}</span>
                <button class="delete-card-btn">刪除</button>
            `;
            li.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s both`;
            li.querySelector('.delete-card-btn').addEventListener('click', deleteCard);
            creditCardList.appendChild(li);
        });
    }
}

// Function to toggle edit mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    const userInfo = document.getElementById('userInfo');
    const userInfoEdit = document.getElementById('userInfoEdit');
    const editBtn = document.getElementById('editUserInfoBtn');
    const saveBtn = document.getElementById('saveUserInfoBtn');
    const cancelBtn = document.getElementById('cancelUserInfoBtn');

    if (isEditMode) {
        userInfo.style.display = 'none';
        userInfoEdit.style.display = 'block';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
        document.getElementById('userAccountEdit').textContent = document.getElementById('userAccount').textContent;
        document.getElementById('userPassword').value = originalUserData.password;
    } else {
        userInfo.style.display = 'block';
        userInfoEdit.style.display = 'none';
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}

// Function to cancel changes
function cancelChanges() {
    populateUserInfo(originalUserData);
    toggleEditMode();
    clearErrorMessages();
}

// Function to validate user input
function validateUserInput() {
    let isValid = true;
    clearErrorMessages();

    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const address = document.getElementById('userAddress').value;
    const phone = document.getElementById('userPhone').value;
    if (!password) {
        displayErrorMessage('passwordError', '請輸入密碼');
        isValid = false;
    }

    if (!name) {
        displayErrorMessage('nameError', '請輸入姓名');
        isValid = false;
    }

    if (!email) {
        displayErrorMessage('emailError', '請輸入電子信箱');
        isValid = false;
    } else if (!isValidEmail(email)) {
        displayErrorMessage('emailError', '請輸入有效的電子信箱');
        isValid = false;
    }

    // if (!address) {
    //     displayErrorMessage('addressError', '請輸入地址');
    //     isValid = false;
    // }

    if (!phone) {
        displayErrorMessage('phoneError', '請輸入電話號碼');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        displayErrorMessage('phoneError', '請輸入有效的電話號碼');
        isValid = false;
    }

    return isValid;
}

// Function to display error message
function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    // document.getElementById(elementId.replace('Error', '')).classList.add('invalid-input');
}

// Function to clear error messages
function clearErrorMessages() {
    const errorElements = document.getElementsByClassName('error-message');
    for (let element of errorElements) {
        element.textContent = '';
        element.style.display = 'none';
    }
    const inputElements = document.querySelectorAll('#userInfoEdit input');
    for (let element of inputElements) {
        element.classList.remove('invalid-input');
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number format
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Function to save user changes
async function saveUserChanges() {
    if (!validateUserInput()) {
        return;
    }
    showPasswordVerificationModal();
    return;
    // const newPassword = document.getElementById('userPassword').value;
    // if (newPassword !== originalUserData.password) {
    //     showPasswordVerificationModal();
    //     return;
    // }

    // await updateUserInformation();
}

// Function to show password verification modal
function showPasswordVerificationModal() {
    document.getElementById('passwordVerificationModal').style.display = 'block';
}

// Function to close password verification modal
function closePasswordVerificationModal() {
    document.getElementById('passwordVerificationModal').style.display = 'none';
}

// Function to verify old password
async function verifyOldPassword() {
    const oldPassword = document.getElementById('oldPasswordInput').value;
    if (oldPassword === originalUserData.password) {
        closePasswordVerificationModal();
        await updateUserInformation();
    } else {
        alert('密碼驗證失敗，無法保存。');
        closePasswordVerificationModal();
    }
}

// Function to update user information
async function updateUserInformation() {
    const userPassword = document.getElementById('userPassword').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userAddress = document.getElementById('userAddress').value;
    const userPhone = document.getElementById('userPhone').value;
    const userSex = document.getElementById('userSex').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/updateUserInformation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                password: userPassword,
                name: userName,
                email: userEmail,
                address: userAddress,
                phone: userPhone,
                sex: userSex
            }),
        });

        const data = await response.json();
        if (data.result) {
            alert('使用者資訊已成功更新');
            
            // Update originalUserData here
            originalUserData = {
                ...originalUserData, // Keep other data
                password: userPassword,
                name: userName,
                email: userEmail,
                address: userAddress,
                phone: userPhone,
                sex: userSex,
            };

            updateDisplayFields();
            toggleEditMode();
        } else {
            alert('更新失敗，請稍後再試');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('更新時發生錯誤，請稍後再試');
    }
}

// Function to update display fields
function updateDisplayFields() {
    document.getElementById('passwordDisplay').textContent = '********';
    document.getElementById('nameDisplay').textContent = document.getElementById('userName').value;
    document.getElementById('emailDisplay').textContent = document.getElementById('userEmail').value;
    document.getElementById('addressDisplay').textContent = document.getElementById('userAddress').value;
    document.getElementById('phoneDisplay').textContent = document.getElementById('userPhone').value;
    document.getElementById('sexDisplay').textContent = document.getElementById('userSex').value;
}

// Function to populate user info
function populateUserInfo(userinf) {
    document.getElementById('userAccount').textContent = userinf.account || '未提供';
    document.getElementById('passwordDisplay').textContent = '********';
    document.getElementById('nameDisplay').textContent = userinf.name || '';
    document.getElementById('emailDisplay').textContent = userinf.email || '';
    document.getElementById('addressDisplay').textContent = userinf.address || '';
    document.getElementById('phoneDisplay').textContent = userinf.phone || '';
    document.getElementById('sexDisplay').textContent = userinf.sex || '其他';

    document.getElementById('userAccountEdit').textContent = userinf.account || '未提供';
    document.getElementById('userPassword').value = userinf.password || '';
    document.getElementById('userName').value = userinf.name || '';
    document.getElementById('userEmail').value = userinf.email || '';
    document.getElementById('userAddress').value = userinf.address || '';
    document.getElementById('userPhone').value = userinf.phone || '';
    document.getElementById('userSex').value = userinf.sex || '其他';
}

// Event listeners for real-time error message removal
document.getElementById('userName').addEventListener('input', () => clearErrorMessage('nameError'));
document.getElementById('userEmail').addEventListener('input', () => clearErrorMessage('emailError'));
document.getElementById('userAddress').addEventListener('input', () => clearErrorMessage('addressError'));
document.getElementById('userPhone').addEventListener('input', () => clearErrorMessage('phoneError'));

// Function to clear a specific error message
function clearErrorMessage(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Function to toggle password visibility
function togglePasswordVisibility(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '隱藏密碼';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '顯示密碼';
    }
}

// Event listeners for password visibility toggle
document.getElementById('togglePassword').addEventListener('click', () => togglePasswordVisibility('userPassword', 'togglePassword'));

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', async () => {
    if (userId && userId !== '0') {
        try {
            const response = await fetch('http://127.0.0.1:5000/getUserImformation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            const result = data.result;
            // alert(result);

            if (result && result.length > 0) {
                const userinf = result[0];
                const creditCardInf = result[1];

                originalUserData = {
                    account: userinf[5] || '未提供',
                    password: userinf[6] || '',
                    name: userinf[0] || '',
                    email: userinf[1] || '',
                    address: userinf[2] || '',
                    phone: userinf[3] || '',
                    sex: userinf[4] || '其他'
                };

                populateUserInfo(originalUserData);

                if (creditCardInf) {
                    creditCards = creditCardInf.map(card => ({
                        number: card[0],
                        cvv: card[1]
                    }));
                } else {
                    creditCards = [];
                }

                renderCreditCards();
            } else {
                console.error('No user information found.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('User ID is 0 or not set.');
        window.location.href = 'not_logged_in.html';
    }
});

// Add CSS animation to head
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);