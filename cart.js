const add_cart = document.getElementsByClassName("add-button");
for (var i = 0; i < add_cart.length; i++) {
    var add = add_cart[i];
    add.addEventListener("click", function (event) {
        var button = event.target;
        var course = button.parentElement.parentElement.parentElement;
        var title = course.getElementsByClassName("course-name").innerText
        addItemToCart(title)
    })
}

const remove_cart = document.getElementsByClassName("remove-button");
for (var i = 0; i < remove_cart.length; i++) {
    var remove = remove_cart[i];
    remove.addEventListener("click", function (event) {
        var button = event.target;
        var course = button.parentElement.parentElement.parentElement
        course.remove()
    })
}

function addItemToCart(title) {
    course = document.createElement('div')
    course.innerHTML = `
    <div class="course-container">
        <div class="course-name">
            <p>Course name</p>
        </div>
        <div class="info-row">
            <div class="course-type">
                <p>Category: Category name</p>
            </div>
            <div class="course-credit">
                <p>Credits: 4</p>
            </div>
            <button class="remove-button">
                <img class="remove-button-icon" src="icons/remove.png">
            </button>
        </div>
    </div>`
    document.getElementById("cart-menu").append(course)
    console.log(course.getElementsByClassName("remove-button"));
    course.getElementsByClassName("remove-button")[0].addEventListener("click", function (event) {
        var remove = event.target
        remove.parentElement.parentElement.parentElement.remove()
    })
}