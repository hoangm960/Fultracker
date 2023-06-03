fetch("../data/course.json")
    .then(response => response.json())
    .then(json => updateGrid(json))


function updateGrid(data) {
    data.forEach(element => {
        if (element['level'] <= localStorage.getItem('class') && element['enrolled'] < element['capacity']) {
            window.addToHome(element)
        }
    });
}





