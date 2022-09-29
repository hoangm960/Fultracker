function getGrid() {
    fetch("../data/course.json")
        .then(response => response.json())
        .then(json => updateGrid(json))
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
                        .replace('Category name', element['category'].join(', '))
                        .replace("Credits: 4", `Credits: ${element['credit']}`)

                    document.getElementById("course-grid").append(course)
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





