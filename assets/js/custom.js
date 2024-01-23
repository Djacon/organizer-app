window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; 
    return ''; 
});

blocks = document.getElementsByClassName('task-block');

for (let block of blocks) {
    checkbox = block.children[0];
    checkbox.addEventListener("click", function() {
        if (this.classList.contains('active-btn')) {
            this.classList.remove('active-btn');
            block.children[1].classList.remove('finished-task');
        } else {
            this.classList.add('active-btn');
            block.children[1].classList.add('finished-task');
        }
    })
}