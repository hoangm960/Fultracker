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
    class_level = { 'Co26': 1, 'Co25': 2, 'Co24': 3, 'Co23': 3 }
    button = e.currentTarget
    setCookie('class', class_level[button.innerText])
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if (name.trim() == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}

function setCookie(name, value, expires, path, domain, secure) {
    // Build the cookie string
    var cookieStr = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";";

    // Add expires parameter if exists
    if (expires) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expires);
        cookieStr += "expires=" + expirationDate.toUTCString() + ";";
    }

    // Add path parameter if exists
    if (path) {
        cookieStr += "path=" + path + ";";
    }

    // Add domain parameter if exists
    if (domain) {
        cookieStr += "domain=" + domain + ";";
    }

    // Add secure parameter if exists
    if (secure) {
        cookieStr += "secure;";
    }

    // Set the cookie
    document.cookie = cookieStr;
}

function deleteCookie(name, path, domain) {
    // Set the expiration date in the past
    setCookie(name, "", -1, path, domain);
}