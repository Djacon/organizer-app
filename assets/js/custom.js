window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; 
    return ''; 
});

localStorage.getItem('')

const tasks = document.getElementById('tasks');
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

// const maxWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const intro_wrap = document.getElementById('intro-wrap');

const task_adder_btn = document.getElementById('add-task');
task_adder_btn.addEventListener('click', function() {
    intro_wrap.classList.add('hide-section');
    task_adder.classList.add('show-section');
});

const task_adder_btn_2 = document.getElementById('add-task-2');
task_adder_btn_2.addEventListener('click', function() {
    intro_wrap.classList.add('hide-section');
    task_adder.classList.add('show-section');
});

const task_close_btn = document.getElementById('cancel-btn');
task_close_btn.addEventListener('click', function() {
    intro_wrap.classList.remove('hide-section');
    task_adder.classList.remove('show-section');
});

const add_task_btn = document.getElementById('add-task-btn');
add_task_btn.addEventListener('click', function() {
    let name = task_name.value.trim();
    let src = task_src.value.trim();
    let desc = task_desc.value.trim();
    addTask(name, src, desc);
});

const task_adder = document.getElementById('new-task-section');
const task_name = document.getElementById('task-name');
const task_src  = document.getElementById('task-src');
const task_desc = document.getElementById('task-desc');

function addTask(name, src, desc) {
    if (!name || !src) return;

    task_name.value = ''; task_src.value = ''; task_desc.value = '';
    
    let new_task = document.createElement('div');
    new_task.classList.add('task-block', 'w-clearfix');
    
    let checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');
    
    let new_task_name = document.createElement('div');
    new_task_name.classList.add('task-name');
    new_task_name.innerHTML = name;
    
    checkbox.addEventListener('click', function() {
        if (this.classList.contains('active-btn')) {
            this.classList.remove('active-btn');
            new_task_name.classList.remove('finished-task');
        } else {
            this.classList.add('active-btn');
            new_task_name.classList.add('finished-task');
        }
    });
    
    let new_task_src = document.createElement('a');
    new_task_src.classList.add('link-block', 'w-inline-block');
    new_task_src.href = src;
    new_task_src.target = '_blank';
    
    new_task.appendChild(checkbox);
    new_task.appendChild(new_task_name);
    new_task.appendChild(new_task_src);
    tasks.appendChild(new_task);

    intro_wrap.classList.remove('hide-section');
    task_adder.classList.remove('show-section');
}