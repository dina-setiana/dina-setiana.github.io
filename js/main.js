function loadImage(id, targetId) {
    var el = document.getElementById(id);
    var targetEl = targetId ? document.getElementById(targetId) : el;
    var imageToLoad;
    if (el.dataset.image) {
        imageToLoad = el.dataset.image;
    } else if (typeof el.currentSrc === 'undefined') {
        imageToLoad = el.src;
    } else {
        imageToLoad = el.currentSrc;
    }
    if (imageToLoad) {
        var img = new Image();
        img.src = imageToLoad;
        img.onload = function () {
            targetEl.classList.add('is-loaded');
        };
    }
}

function activateNavbar() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadImage('pictureImage', 'picture');
});

document.addEventListener('DOMContentLoaded', function () {
    activateNavbar();
});