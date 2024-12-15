// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch user ID from localStorage
    const userId = localStorage.getItem('userId');

    // Check if the user ID exists
    if (userId) {
        // Fetch user data from the server
        fetch('/getUserImformation', {
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

            // Update the DOM with the user information
            document.getElementById('userName').textContent = userinf[0] || '未提供';
            document.getElementById('userEmail').textContent = userinf[1] || '未提供';
            document.getElementById('userAddress').textContent = userinf[2] || '未提供';
            document.getElementById('userPhone').textContent = userinf[3] || '未提供';
            document.getElementById('userSex').textContent = userinf[4] || '未提供';
            document.getElementById('userAccount').textContent = userinf[5] || '未提供';
            document.getElementById('userPassword').textContent = userinf[6] || '未提供';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('User ID not found in localStorage');
    }

    // Function to handle user logout
    function handleLogoutUserButtonClick() {
        // Set userId to zero in localStorage
        localStorage.setItem('userId', '0');
        // Redirect to home.html
        window.location.href = 'home.html';
    }
});
