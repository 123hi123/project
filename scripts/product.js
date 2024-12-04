const urlParams = new URLSearchParams(window.location.search);
const id = JSON.parse(decodeURIComponent(urlParams.get('id')));
product = JSON.parse(localStorage.getItem(id));
document.querySelector('.product-image').src = product.img;
document.querySelector(".product-name").innerHTML = product.name;
document.querySelector(".product-discount").innerHTML = product.discount + "折";
document.querySelector(".origin-price").innerHTML = "$" + product.originPrice;
document.querySelector(".discount-price").innerHTML = "$" + product.discountPrice;
//localStorage.removeItem('cart')
let cart = JSON.parse(localStorage.getItem("cart"));
if(!cart){
    cart = {
        TotalAmount : 0,
        ProductNum : 0
    };
}
document.querySelector(".cart-num").innerHTML = cart.ProductNum

function buyThisProduct(){
    let quantity = parseInt(document.querySelector(".buy-num").value, 10);
    if ( id in cart){
        cart[id].quantity += quantity;
    }
    else{
        cart[id]={
            discountPrice: Number(product.discountPrice),
            quantity: quantity
        }
        
    }
    cart.ProductNum += quantity;
    cart.TotalAmount += product.discountPrice*quantity;
    const jsonProduct = JSON.stringify(cart);
    localStorage.setItem("cart",jsonProduct);
    document.querySelector(".cart-num").innerHTML = cart.ProductNum
}

function goToPage(){
    keyword = document.querySelector(".search-input").value
    window.location.href = `home.html?keyword=${keyword}`;
}