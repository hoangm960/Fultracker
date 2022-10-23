function getGrid() {
    fetch("../data/course.json", {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    }).then(response => response.json()).then(json => updateGrid(json))
}

function updateGrid(data) {
    data.forEach(element => {
        if (element['level'] <= localStorage['level'] && element['enrolled'] < element['capacity']) {
            fetch("../html/course-home.html")
                .then(response => response.text())
                .then(html => {
                    course = document.createElement('div')
                    course.className = "course-container"
                    course.innerHTML = html
                        .replace('Course name', element['name'])
                        .replace('Enrolled state', `${element['enrolled']}/${element['capacity']}`)

                    document.getElementById("course-grid").append(course)
                    element['category'].forEach(e => {
                        category = document.createElement('p')
                        category.innerHTML = e
                        course.getElementsByClassName("type-list")[0].append(category)
                    });
                    const add_cart = course.getElementsByClassName("add-button")[0];
                    add_cart.addEventListener("click", event => {
                        addToCart(event)
                        event.stopPropagation();
                    })

                    course.getElementsByClassName("course-name")[0].addEventListener("click", e => window.open(element['link']))
                })
        }
    });
}





