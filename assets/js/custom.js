checkboxes = document.getElementsByClassName('checkbox');

for (let checkbox of checkboxes) {
    checkbox.addEventListener("click", function() {
        if (checkbox.classList.contains('active-btn')) {
            checkbox.classList.remove('active-btn');
        } else {
            checkbox.classList.add('active-btn');
        }
        console.log(checkbox, )
    })
}