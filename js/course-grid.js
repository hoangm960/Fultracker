window.onload = fetch("../data/course.json", {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}).then(response => response.json()).then(json => updateGrid(json))


function updateGrid(data) {
    data.forEach(element => {
        if (element['level'] <= localStorage['level'] && element['enrolled'] < element['capacity']) {
            window.addToHome(element['name'])
        }
    });
}





