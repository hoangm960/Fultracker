function studentOption() {
    document.getElementById("button-container-1").style.display = "none"
    button_container_style = document.getElementById("button-container-2").style
    button_container_style.display = "flex"
    button_container_style.flexDirection = "column"
    button_container_style.justifyContent = "center"
    button_container_style.alignItems = "center"
}

function openCart() {
    document.getElementById("cart-menu").style.width = "34%"
    grid_style = document.getElementById("course-grid").style
    grid_style.marginRight = "38%"
    grid_style.gridTemplateColumns = "1fr 1fr"
}

function closeCart() {
    document.getElementById("cart-menu").style.width = "0"
    grid_style = document.getElementById("course-grid").style
    grid_style.marginRight = "0"
    grid_style.gridTemplateColumns = "1fr 1fr 1fr"
}