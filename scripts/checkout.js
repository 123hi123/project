function updateWebsite(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    if(!cart){
        cart = {ProductNum : 0};
    }
    document.querySelector(".cart-num").innerHTML = cart.ProductNum
    document.querySelector(".checkout-items").innerHTML = `總共 ${cart.ProductNum} 樣商品`;
    document.querySelector(".items-price").innerHTML = `<span>金額 : </span> <span>$${cart.TotalAmount}</span>`
    keys = Object.keys(cart)
    const products = [];
    for (let i=0; i<keys.length; i++){
        if (keys[i] != "ProductNum" && keys[i] != "TotalAmount"){
            let product = JSON.parse(localStorage.getItem(Number(keys[i])));
            products.push(product)
        }
    }
    let html = "";
    for (let i=0; i<products.length; i++) {
        html += `
            <div class="product-row">
                <img class="product-image" src="${products[i].img}" />
                <div class="product-information">
                    <p class="product-name">${products[i].name}</p>
                    <div class="product-detail">
                        <div class="product-detail-left">
                            <div class="product-price">
                                <p class="origin-price">${products[i].originPrice}</p>
                                <p class="discount-price">${products[i].discountPrice}</p>
                            </div>
                            <div class="buy-num-row">
                                <p class="num-p">數量</p>
                                <p id="product${products[i].id}" class="product_quantity">${cart[products[i].id].quantity}</p>
                                <button class="adjust_quantity" onclick="adjustQuantity(0, ${products[i].id})"> + </button>
                                <button class="adjust_quantity" onclick="adjustQuantity(1, ${products[i].id})"> - </button>
                            </div>
                        </div>
                        <div class="product-detail-right">
                            <button class="delete-from-cart" onclick="removeProduct(${products[i].id})">刪除</button>
                        </div>
                    </div>
                    <hr class="product-information-hr">
                    <div class="delivery-options">
                        <p class="delivery-option-p">運送方式</p>
                        <div class="delivery-option">
                            <input type="radio" checked class="delivery-option-input" name="delivery-option-${i}">
                            <p class="delivery-option-name">自行取貨</p>
                            <p class="delivery-option-price">$0</p>
                        </div>
                        <div class="delivery-option">
                            <input type="radio"class="delivery-option-input" name="delivery-option-${i}">
                            <p class="delivery-option-name">超商取貨</p>
                            <p class="delivery-option-price">$60</p>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input" name="delivery-option-${i}">
                            <p class="delivery-option-name">宅配到家</p>
                            <p class="delivery-option-price">$120</p>
                        </div>
                    </div>             
                </div>
            </div>`;
    };
    document.querySelector(".checkout-left").innerHTML = html;
    return cart
}

function adjustQuantity(method, id){
    id = id.toString()
    if (method == 0){
        cart[id].quantity += 1;
        cart.ProductNum += 1;
        cart.TotalAmount += cart[id].discountPrice;
    }
    else{
        if (cart[id].quantity != 0){
            cart[id].quantity -= 1
            cart.ProductNum -= 1;
            cart.TotalAmount -= cart[id].discountPrice;
        }
    }
    const jsonProduct = JSON.stringify(cart);
    localStorage.setItem("cart",jsonProduct);
    document.querySelector(`#product${id}`).innerHTML = cart[id].quantity;
    document.querySelector(".cart-num").innerHTML = cart.ProductNum;
    document.querySelector(".checkout-items").innerHTML = `總共 ${cart.ProductNum} 樣商品`;
    document.querySelector(".items-price").innerHTML = `<span>金額 : </span> <span>$${cart.TotalAmount}</span>`
}

function removeProduct(id){
    id = id.toString()
    cart.ProductNum -= cart[id].quantity;
    cart.TotalAmount -= cart[id].discountPrice*cart[id].quantity;
    delete cart[id];
    const jsonProduct = JSON.stringify(cart);
    localStorage.setItem("cart",jsonProduct);
    updateWebsite();
}

function goToPage(){
    keyword = document.querySelector(".search-input").value
    window.location.href = `home.html?keyword=${keyword}`;
}

let cart = updateWebsite();