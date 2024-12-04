function getProductsInformations() {
    keyword = document.querySelector(".search-input").value
    fetch('http://127.0.0.1:5000/home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({keyword}),
    })
    .then(response => response.json())
    .then(data => {
        const products = [];
        const result = data.result;
        for (let i = 0; i < result.length; i++) {
            const product = result[i];
            products.push({
                id: `${product[0]}`,
                img: `products_image/Id${product[0]}.jpg`,
                name: `${product[1]}`,
                discount: `${product[4]*10}`,
                originPrice: `${product[3]}`,
                discountPrice: `${Math.round(product[3] * product[4])}`
            });
        }
        let html = "";
        for (let i=0; i<products.length; i++) {
            const jsonProduct = JSON.stringify(products[i]);
            localStorage.setItem(products[i].id,jsonProduct);
            html += `
                <div class="product-block">
                    <a href="product.html?id=${products[i].id}">
                        <div class="product-image-row">
                            <img class="product-image" src="${products[i].img}">
                            <p class="product-discount">${products[i].discount}折</p>
                        </div>
                        <div class="product-information">
                            <div class="product-text">
                                <p class="product-name">${products[i].name}</p>
                                <div class="add-success hidden-element">
                                    <img class="check-icon" src="images/icons/check.png">
                                    <p class="add-success-p">加入購物車</p>
                                </div>
                                <div class="product-price-row">
                                    <div class="product-price">
                                        <p class="discount-price">$${products[i].discountPrice}</p>
                                        <p class="origin-price">$${products[i].originPrice}</p>
                                    </div>
                                    <img class="add-to-cart" src="images/icons/cart.png">
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }

        document.querySelector(".product-grid").innerHTML = html;
    })
    .catch(error => {
        console.error('錯誤:', error);
        alert('Error');
    });
}
const urlParams = new URLSearchParams(window.location.search);
let keyword = urlParams.get('keyword');
if (keyword){
    document.querySelector(".search-input").value = keyword;
}

getProductsInformations()
let cart = JSON.parse(localStorage.getItem("cart"));
if(!cart){
    cart = {ProductNum : 0};
}
document.querySelector(".cart-num").innerHTML = cart.ProductNum
