document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('product-form');
    const productNameInput = document.getElementById('product-name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const discountValueInput = document.getElementById('discount-value');

    // Function to limit text input length
    function limitInputLength(input, maxLength) {
        input.addEventListener('input', () => {
            if (input.value.length > maxLength) {
                input.value = input.value.slice(0, maxLength);
            }
        });
    }

    // Function to limit numeric input
    function limitNumericInput(input, min, max) {
        input.addEventListener('input', () => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < min) {
                input.value = min;
            } else if (value > max) {
                input.value = max;
            }
        });
    }

    // Apply input restrictions
    limitInputLength(productNameInput, 50);
    limitInputLength(descriptionInput, 50);
    limitNumericInput(priceInput, 0, 100000000);
    limitNumericInput(quantityInput, 0, 100000000);

    // Discount value should be between 0 and 90 (representing 0% to 90% discount)
    limitNumericInput(discountValueInput, 0, 90);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Validate inputs before submission
        if (productNameInput.value.length > 50 || descriptionInput.value.length > 50) {
            alert('產品名稱和描述不能超過50個字符。');
            return;
        }

        const price = parseInt(priceInput.value);
        const quantity = parseInt(quantityInput.value);
        const discount = parseInt(discountValueInput.value);

        if (price > 100000000 || quantity > 100000000) {
            alert('價格和數量不能超過100,000,000。');
            return;
        }

        if (price < 0 || quantity < 0 || discount < 0) {
            alert('價格、數量和折扣不能為負數。');
            return;
        }

        if (discount > 90) {
            alert('折扣不能超過90%。');
            return;
        }

        // Prepare FormData for file upload
        const formData = new FormData(form);
        const product = {
            name: formData.get('product-name'),
            price: price,
            stock: quantity,
            description: formData.get('description'),
            product_type: formData.get('product-type'),
            discount_value: discount,
            image_url: formData.get('image').name // This is just the filename, not the actual file
        };

        try {
            // Create a new FormData object to send both the product data and the image file
            const dataToSend = new FormData();
            dataToSend.append('product', JSON.stringify(product));
            dataToSend.append('image', formData.get('image'));

            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: dataToSend // Sending both product data and image file
            });

            if (response.ok) {
                const result = await response.json();
                alert('商品添加成功：' + result.message);
                form.reset(); // Reset the form after successful submission
            } else {
                const errorData = await response.json();
                alert('添加失敗：' + (errorData.error || '未知錯誤') + ' (HTTP狀態碼: ' + response.status + ')');
            }
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = '添加失敗：';
            if (error instanceof TypeError) {
                errorMessage += '網絡錯誤 - 可能是CORS或連接問題';
            } else if (error instanceof SyntaxError) {
                errorMessage += '服務器返回了無效的JSON數據';
            } else {
                errorMessage += '未知錯誤 - ' + error.message;
            }
            alert(errorMessage);
        }
    });
});
