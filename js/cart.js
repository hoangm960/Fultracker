fetch("../data/major.json")
    .then(response => response.json())
    .then(json => {
        for (const [key, value] of Object.entries(json)) {
            localStorage.setItem(key, value)
        }
    })

function addToCart(event) {
    cart_menu = document.getElementById("cart-menu")
    if (cart_menu.getElementsByClassName("course-container").length < 4) {
        var button = event.currentTarget;
        var course = button.parentElement.parentElement
        var title = course.getElementsByClassName("course-name")[0].innerText
        var category = course.getElementsByClassName("course-type")[0].innerText
        var enrolled = course.getElementsByClassName("course-enrolled")[0].innerText
        fetch("../data/course.json")
            .then(response => response.json())
            .then(json => {
                course_data = json.find(element => element['name'] == title)
                fetch("../html/course-cart.html")
                    .then(response => response.text())
                    .then(html => {
                        new_course = document.createElement('div')
                        new_course.className = "course-container"
                        new_course.innerHTML = html
                            .replace('Course name', title)
                            .replace('Enrolled: Enrolled state', `Enrolled: ${enrolled}`)

                        cart_menu.append(new_course)
                        if (course_data['category'])
                            course_data['category'].forEach(e => {
                                category = document.createElement('p')
                                category.innerHTML = e
                                new_course.getElementsByClassName("type-list")[0].append(category)
                            });
                        new_course.getElementsByClassName("remove-button")[0].addEventListener("click", event => {
                            removeFromCart(event)
                            event.stopPropagation();
                        })
                        new_course.getElementsByClassName("course-name")[0].addEventListener("click", e => window.open(course_data['link']))
                        course.remove()
                        updateCategory(course_data['category'], 1)
                    })
            })
    }
}

function removeFromCart(event) {
    var button = event.currentTarget;
    var course = button.parentElement.parentElement
    var title = course.getElementsByClassName("course-name")[0].innerText
    fetch("../data/course.json")
        .then(response => response.json())
        .then(json => {
            course_data = json.find(element => element['name'] == title)
            addToHome(course_data)
            updateCategory(course_data['category'], -1)
        })
    course.remove()

}

function addToHome(course_data) {
    fetch("../html/course-home.html")
        .then(response => response.text())
        .then(html => {
            course = document.createElement('div')
            course.className = "course-container"
            course.innerHTML = html
                .replace('Course name', course_data['name'])
                .replace('Enrolled state', `${course_data['enrolled']}/${course_data['capacity']}`)

            document.getElementById("course-grid").append(course)
            if (course_data['category'])
                course_data['category'].forEach(e => {
                    category = document.createElement('p')
                    category.innerHTML = e
                    course.getElementsByClassName("type-list")[0].append(category)
                });
            course.getElementsByClassName("add-button")[0].addEventListener("click", event => {
                addToCart(event)
                event.stopPropagation();
            })
            course.getElementsByClassName("course-name")[0].addEventListener("click", e => window.open(course_data['link']))
        })
}

function updateCategory(category_dict, mode) {
    category_section = document.getElementsByClassName("category-section")[0]
    categoryElements = category_section.getElementsByTagName("p")
    category_indexes = []
    for (var i = 0; i < categoryElements.length; i++) {
        for (var j = 0; j < category_dict.length; j++) {
            if (categoryElements[i].innerText.split(": ")[0] == category_dict[j].split(" (")[0]) {
                category_indexes.push(i)
            }
        }
    }

    counters = category_section.getElementsByClassName("counter")
    category_indexes.forEach(i => {
        counters[i].innerHTML = parseInt(counters[i].innerText) + mode
    });
}
