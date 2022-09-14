const add_cart = document.getElementsByClassName("add-button");
for (var i = 0; i < add_cart.length; i++) {
    var add = add_cart[i];
    add.addEventListener("click", event => addToCart(event))
}

const remove_cart = document.getElementsByClassName("remove-button");
for (var i = 0; i < remove_cart.length; i++) {
    var remove = remove_cart[i];
    remove.addEventListener("click", event => removeFromCart(event))
}

function addToCart(event) {
    var button = event.target;
    var course = button.parentElement.parentElement.parentElement;
    var title = course.getElementsByClassName("course-name").innerText
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
    course.getElementsByClassName("remove-button")[0].addEventListener("click", function (event) {
        var button = event.target;
        var course = button.parentElement.parentElement.parentElement
        course.remove()
        addToHome()
    })
    var course = button.parentElement.parentElement.parentElement
    course.remove()
}

function removeFromCart(event) {
    var button = event.target;
    var course = button.parentElement.parentElement.parentElement
    course.remove()
    addToHome()
}

function addToHome(title) {
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
            <button class="add-button">
                <img class="add-button-icon" src="icons/add-to-cart.png">
            </button>
        </div>
    </div>`
    document.getElementById("course-grid").append(course)
    course.getElementsByClassName("add-button")[0].addEventListener("click", event => addToCart(event))
}