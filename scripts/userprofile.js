let creditCards = []; // 全局變數，用於存儲信用卡列表

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
    const userId = localStorage.getItem('userId');

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

        if (data.result) {
            // 從 local creditCards 陣列中移除刪除的卡
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
    const userId = localStorage.getItem('userId');

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
            // 將新卡添加到 local creditCards 陣列
            creditCards.push({ number: cardNumber, cvv });
            renderCreditCards();
            // 清空輸入欄位
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
            // 添加事件監聽器以避免內聯事件
            li.querySelector('.delete-card-btn').addEventListener('click', deleteCard);
            creditCardList.appendChild(li);
        });
    }
}

// Function to save user changes
async function saveUserChanges() {
    const userId = localStorage.getItem('userId');
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

        if (data) {
            alert('使用者資訊已成功更新');
        } else {
            alert('更新失敗，請稍後再試');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('更新時發生錯誤，請稍後再試');
    }
}

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
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

            if (result && result.length > 0) {
                const userinf = result[0];
                const creditCardInf = result[1];

                document.getElementById('userName').value = userinf[0] || '';
                document.getElementById('userEmail').value = userinf[1] || '';
                document.getElementById('userAddress').value = userinf[2] || '';
                document.getElementById('userPhone').value = userinf[3] || '';
                document.getElementById('userSex').value = userinf[4] || '其他';
                document.getElementById('userAccount').textContent = userinf[5] || '未提供';
                document.getElementById('userPassword').value = userinf[6] || '';

                // 假設 data.creditCardInf 是信用卡信息
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
        console.error('User ID not found in localStorage or is 0.');
    }

    // // 添加事件監聽器到添加卡片按鈕
    // const addCardButton = document.getElementById('addCardButton');
    // if (addCardButton) {
    //     addCardButton.addEventListener('click', addCard);
    // }
});

// 添加 CSS 動畫到頭部
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