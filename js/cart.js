function addToCart(event) {
    cart_menu = document.getElementById("cart-menu")
    if (cart_menu.getElementsByClassName("course-container").length < 4) {
        var button = event.currentTarget;
        var course = button.parentElement.parentElement
        var title = course.getElementsByClassName("course-name")[0].innerText
        var category = course.getElementsByClassName("course-type")[0].innerText
        var credit = course.getElementsByClassName("course-credit")[0].innerText
        fetch("../html/course-cart.html")
            .then(response => response.text())
            .then(html => {
                new_course = document.createElement('div')
                new_course.className = "course-container"
                new_course.innerHTML = html
                    .replace('Course name', title)
                    .replace('Category: Category name', category)
                    .replace("Credits: 4", `Credits: ${credit}`)
                cart_menu.append(new_course)
                new_course.getElementsByClassName("remove-button")[0].addEventListener("click", event => removeFromCart(event))
                course.remove()
                updateFooter([1, 25], [[0, 2], 1])
            })
    }
}

function removeFromCart(event) {
    var button = event.currentTarget;
    var course = button.parentElement.parentElement
    var title = course.getElementsByClassName("course-name")[0].innerText
    var category = course.getElementsByClassName("course-type")[0].innerText
    var credit = course.getElementsByClassName("course-credit")[0].innerText

    addToHome(title, category, credit)
    course.remove()

    updateFooter([1, -25], [[0, 2], -1])
}

function addToHome(title, category, credit) {
    fetch("../html/course-home.html")
        .then(response => response.text())
        .then(html => {
            course = document.createElement('div')
            course.className = "course-container"
            course.innerHTML = html
                .replace('Course name', title)
                .replace('Category: Category name', category)
                .replace("Credits: 4", `Credits: ${credit}`)

            document.getElementById("course-grid").append(course)
            course.getElementsByClassName("add-button")[0].addEventListener("click", event => addToCart(event))
        })

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
