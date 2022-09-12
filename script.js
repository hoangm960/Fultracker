function getHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(text => document.getElementById('header').innerHTML = text);
}

function studentOption() {
    document.getElementById("button-container-1").style.display = "none"
    button_container_style = document.getElementById("button-container-2").style
    button_container_style.display = "flex"
    button_container_style.flexDirection = "column"
    button_container_style.justifyContent = "center"
    button_container_style.alignItems = "center"
}