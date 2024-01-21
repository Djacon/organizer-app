window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; 
    return ''; 
});

const blocks = document.getElementsByClassName('task-block');

for (let block of blocks) {
    checkbox = block.children[0];
    checkbox.addEventListener('click', function() {
        if (this.classList.contains('active-btn')) {
            this.classList.remove('active-btn');
            block.children[1].classList.remove('finished-task');
        } else {
            this.classList.add('active-btn');
            block.children[1].classList.add('finished-task');
        }
    });
}

const maxWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

// Handle hidden panel only on mobile version (yet)
if (maxWidth < 991) {
    const task_adder = document.getElementById('new-task-section');

    const task_adder_btn = document.getElementById('add-task');
    task_adder_btn.addEventListener('click', function() {
        task_adder.classList.add('show-section');
    });

    const task_close_btn = document.getElementById('cancel-btn');
    task_close_btn.addEventListener('click', function() {
        task_adder.classList.remove('show-section');
    });
}