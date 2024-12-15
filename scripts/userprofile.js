// Global variables to store credit card information
let creditCards = [];
let currentCardIndex = 0;

// Function to handle changing credit card information
function handleChangeCard() {
    if (creditCards.length === 0) {
        document.getElementById('cardNumber').textContent = '還沒綁卡呢親';
        document.getElementById('cvv').textContent = '還沒綁卡呢親';
    } else {
        // Increment the index, but reset to 0 if it's at the last card
        currentCardIndex = (currentCardIndex + 1) % creditCards.length;

        // Update the DOM with the new card information
        document.getElementById('cardNumber').textContent = creditCards[currentCardIndex].number;
        document.getElementById('cvv').textContent = creditCards[currentCardIndex].cvv;
    }
}

// Function to handle user logout
function handleLogoutUserButtonClick() {
    // Set userId to zero in localStorage
    localStorage.setItem('userId', '0');
    // Redirect to home.html
    window.location.href = 'home.html';
}

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch user ID from localStorage
    const userId = localStorage.getItem('userId');

    // Check if the user ID exists
    if (userId) {
        // Fetch user data from the server
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
            const creditCardInf = result[1]; // [[c1.num,c1.cvv],[c2.num,c2.cvv]]

            // Update the DOM with the user information
            document.getElementById('userName').textContent = userinf[0] || '未提供';
            document.getElementById('userEmail').textContent = userinf[1] || '未提供';
            document.getElementById('userAddress').textContent = userinf[2] || '未提供';
            document.getElementById('userPhone').textContent = userinf[3] || '未提供';
            document.getElementById('userSex').textContent = userinf[4] || '未提供';
            document.getElementById('userAccount').textContent = userinf[5] || '未提供';
            document.getElementById('userPassword').textContent = userinf[6] || '未提供';

            // Store credit card information in the global array
            creditCards = creditCardInf.map(card => ({
                number: card[0],
                cvv: card[1]
            }));

            // Initially display the first card or "還沒綁卡呢親" if no cards
            handleChangeCard();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('User ID not found in localStorage');
    }
});
