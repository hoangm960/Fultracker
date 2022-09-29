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

function updateClass(e) {
    class_level = {'Co26': 1, 'Co25':2, 'Co24':3, 'Co23':3}
    button = e.currentTarget
    localStorage.setItem('level', class_level[button.innerText])
}