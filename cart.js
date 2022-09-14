const add_cart = document.getElementsByClassName("add-button");
for (var i = 0; i < add_cart.length; i++) {
    var add = add_cart[i];
    add.addEventListener("click", function (event) {
        var button = event.target;
        var course = button.parentElement.parentElement;
        var title = course.getElementsByClassName("course-name").innerText
        addItemToCart(title)
    })
}

function addItemToCart(title) {
    document.createElement('div')
    fetch("course.html")
        .then(response => response.text())
        .then(text => document.getElementById("cart-menu").innerHTML += text)
}