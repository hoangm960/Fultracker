fetch('header.html')
    .then(response => response.text())
    .then(text => document.getElementById('header').innerHTML = text);