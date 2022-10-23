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
        document.cookie = `title=${title};`
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
                        getCourse(1)
                    })
            })
    }
}

function removeFromCart(event) {
    var button = event.currentTarget;
    var course = button.parentElement.parentElement
    var title = course.getElementsByClassName("course-name")[0].innerText
    addToHome(title)
    course.remove()
    getCourse(-1)
}

function addToHome(title) {
    fetch("../data/course.json")
        .then(response => response.json())
        .then(json => {
            course_data = json.find(element => element['name'] == title)
            fetch("../html/course-home.html")
                .then(response => response.text())
                .then(html => {
                    course = document.createElement('div')
                    course.className = "course-container"
                    course.innerHTML = html
                        .replace('Course name', title)
                        .replace('Enrolled state', `${course_data['enrolled']}/${course_data['capacity']}`)

                    document.getElementById("course-grid").append(course)
                    course_data['category'].forEach(e => {
                        category = document.createElement('p')
                        category.innerHTML = e
                        course.getElementsByClassName("type-list")[0].append(category)
                    });
                    course.getElementsByClassName("add-button")[0].addEventListener("click", event => {
                        addToCart(event)
                        event.stopPropagation();
                    })
                    course.addEventListener("click", e => window.open(course_data['link']))

                })
        })
}

function getCourse(mode) {
    fetch("../data/course.json")
        .then(response => response.json())
        .then(json => {
            course = json.find(element => element['name'] == document.cookie.split(';')[0].split('=')[1])
            updateFooter(course['major'], 12 * mode, [course['category'], 1 * mode])
        })

}

function updateFooter(major, percent, category_dict) {
    // Update major progress bar
    localStorage[major] = String(parseInt(localStorage[major]) + percent)
    footer = document.getElementsByClassName('footer')[0]
    var [major, minor] = footer.getElementsByClassName('progress-container')
    major_text = major.getElementsByTagName('p')[0]
    var [major_val, minor_val] = Object.entries(localStorage).sort(([, a], [, b]) => b - a).slice(0, 2).map(([n]) => n)
    major_text.innerHTML = major_val
    minor_text = minor.getElementsByTagName('p')[0]
    minor_text.innerHTML = minor_val

    progress_major = document.getElementById(`progress-1`)
    progress_major.style.width = `${localStorage[major_val]}%`
    progress_minor = document.getElementById(`progress-2`)
    progress_minor.style.width = `${localStorage[minor_val]}%`

    // Update category
    category_section = document.getElementsByClassName("category-section")[0]
    categories = category_section.getElementsByTagName("p")
    category_indexes = []
    for (var i = 0; i < categories.length; i++) {
        for (var j = 0; j < category_dict[0].length; j++) {
            if (categories[i].innerText.split(": ")[0] == category_dict[0][j].split(" (")[0]) {
                category_indexes.push(i)
            }
        }
    }
    category_indexes.forEach(i => {
        category_texts = categories[i].innerText.split(": ")
        cat_val = parseInt(category_texts[1].slice(0, -2)) + category_dict[1]
        categories[i].innerHTML = `${category_texts[0]}: ${cat_val}/2`
    });
}
