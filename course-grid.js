
fetch("./data/course.json")
    .then(response => response.json())
    .then(json => updateGrid(json))

function updateGrid(data) {
    data.forEach(element => {
        fetch("./course-home.html")
            .then(response => response.text())
            .then(html => {
                course = document.createElement('div')
                course.className = "course-container"
                course.innerHTML = html.replace('Course name', element['name']).replace('Category name', element['category'].join(', '))
                document.getElementById("course-grid").append(course)
            })

    });
}