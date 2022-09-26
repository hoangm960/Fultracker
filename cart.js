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
    cart_menu = document.getElementById("cart-menu")
    if (cart_menu.getElementsByClassName("course-container").length < 4) {
        var button = event.currentTarget;
        var course = button.parentElement.parentElement
        var title = course.getElementsByClassName("course-name").innerText
        new_course = document.createElement('div')
        new_course.className = "course-container"
        new_course.innerHTML = `
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
            </div>`
        cart_menu.append(new_course)
        new_course.getElementsByClassName("remove-button")[0].addEventListener("click", event => removeFromCart(event))
        course.remove()
        updateFooter([1, 25], [[0, 2], 1])
    }
}

function removeFromCart(event) {
    var button = event.currentTarget;
    var course = button.parentElement.parentElement
    course.remove()
    var title = course.getElementsByClassName("course-name").innerText
    addToHome(title)

    updateFooter([1, -25], [[0, 2], -1])
}

function addToHome(title) {
    course = document.createElement('div')
    course.className = "course-container"
    course.innerHTML = `
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
        </div>`
    document.getElementById("course-grid").append(course)
    course.getElementsByClassName("add-button")[0].addEventListener("click", event => addToCart(event))
}

function updateFooter(percent, category_dict) {
    progress = document.getElementById(`progress-${percent[0]}`)
    progress_bar = progress.parentElement
    new_percent = Math.round(progress.clientWidth / (progress_bar.clientWidth - 4) * 100) + percent[1]
    if (new_percent > 100) {
        new_percent = 100
    }
    progress.style.width = `${new_percent}%`

    category_section = document.getElementsByClassName("category-section")[0]
    categories = category_section.getElementsByTagName("p")
    category_dict[0].forEach(i => {
        category_texts = categories[i].innerText.split(": ")
        cat_val = parseInt(category_texts[1].slice(0, -2)) + category_dict[1]
        categories[i].innerHTML = `${category_texts[0]}: ${cat_val}/2`
    });
}
