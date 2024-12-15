// Global variables to store credit card information
let creditCards = [];

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
function deleteCard(event) {
    const cardNumber = event.target.closest('.credit-card-item').querySelector('.card-number').textContent;
    const userId = localStorage.getItem('userId');
    fetch('http://127.0.0.1:5000/deleteCredit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, cardNumber }),
    })
    setTimeout(() => {
        renderCreditCards();
    }, 100); // 等待 0.1 秒
    // renderCreditCards();
}

// Function to add a new credit card
function addCard() {
    const cardNumberInput = document.getElementById('newCardNumber');
    const cvvInput = document.getElementById('newCardCVV');
    const cardNumber = cardNumberInput.value.trim();
    const cvv = cvvInput.value.trim();
    const userId = localStorage.getItem('userId');
    // add card to the database

    if (cardNumber && cvv) {
        fetch('http://127.0.0.1:5000/addCredit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, cardNumber, cvv }),
        })
        setTimeout(() => {
            renderCreditCards();
        }, 100);
    }
}

// Function to render credit cards in the list
function renderCreditCards() {
    const creditCardList = document.getElementById('creditCardList');
    creditCardList.innerHTML = '';
    const userId = localStorage.getItem('userId');
    fetch('http://127.0.0.1:5000/getUserImformation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
        const result = data.result;
        const creditCardInf = result[1];
        creditCards = creditCardInf.map(card => ({
            number: card[0],
            cvv: card[1]
        }));
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
                    <button class="delete-card-btn" onclick="deleteCard(event)">刪除</button>
                `;
                li.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s both`;
                creditCardList.appendChild(li);
            });
        }
    })    
}

// Function to save user changes
function saveUserChanges() {
    const userId = localStorage.getItem('userId');
    const userPassword = document.getElementById('userPassword').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userAddress = document.getElementById('userAddress').value;
    const userPhone = document.getElementById('userPhone').value;
    const userSex = document.getElementById('userSex').value;

    fetch('http://127.0.0.1:5000/updateUserInformation', {
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
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('使用者資訊已成功更新');
        } else {
            alert('更新失敗，請稍後再試');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('更新時發生錯誤，請稍後再試');
    });
}

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', (event) => {
    const userId = localStorage.getItem('userId');
    renderCreditCards();
    if (userId) {
        fetch('http://127.0.0.1:5000/getUserImformation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            const result = data.result;
            const userinf = result[0];

            document.getElementById('userName').value = userinf[0] || '';
            document.getElementById('userEmail').value = userinf[1] || '';
            document.getElementById('userAddress').value = userinf[2] || '';
            document.getElementById('userPhone').value = userinf[3] || '';
            document.getElementById('userSex').value = userinf[4] || '其他';
            document.getElementById('userAccount').textContent = userinf[5] || '未提供';
            document.getElementById('userPassword').value = userinf[6] || '';

            renderCreditCards();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('User ID not found in localStorage');
    }

    // Add event listener for the add card button
    const addCardButton = document.getElementById('addCardButton');
    addCardButton.addEventListener('click', addCard);
});

// Add this CSS to the head of the document for the animation
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
