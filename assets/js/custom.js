window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; 
    return ''; 
});

const tasks = document.getElementById('tasks');
const blocks = document.getElementsByClassName('task-block');

var isDragging = false;
var initialX;
var currBlock;
var halfBlockWidth;

function pinTask(block) {
    let checkbox = block.children[0];
    let task_header = block.children[1]
    if (checkbox.classList.contains('active-btn')) {
        checkbox.classList.remove('active-btn');
        task_header.classList.remove('finished-task');
    } else {
        checkbox.classList.add('active-btn');
        task_header.classList.add('finished-task');
    }
}

function initDrag(e) {
    isDragging = true;
    initialX = e.touches[0].clientX;
    this.style.cursor = 'grabbing';
    currBlock = this;
    halfBlockWidth = currBlock.offsetWidth / 2;
}

for (let block of blocks) {
    block.addEventListener('mousedown', initDrag);
    block.addEventListener('touchstart', initDrag);
}

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        let newX = e.clientX - initialX;
        newX = Math.min(Math.max(newX, -halfBlockWidth), halfBlockWidth);
        currBlock.style.transform = `translateX(${newX}px)`;
    }
});

document.addEventListener('mouseup', function(e) {
    if (isDragging) {
        isDragging = false;
        currBlock.style.transform = ``;

        let newX = e.clientX - initialX;
        newX = Math.min(Math.max(newX, -halfBlockWidth), halfBlockWidth);
        if (newX == halfBlockWidth) {
            pinTask(currBlock);
        } else if (newX == -halfBlockWidth) {
            tasks.removeChild(currBlock);
        }
        currBlock.style.cursor = 'grab';
    }
});

document.addEventListener('touchmove', function(e) {
    if (isDragging) {
        let newX = e.touches[0].clientX - initialX;
        newX = Math.min(Math.max(newX, -halfBlockWidth), halfBlockWidth);
        currBlock.style.transform = `translateX(${newX}px)`;
    }
});

document.addEventListener('touchend', function(e) {
    if (isDragging) {
        isDragging = false;
        currBlock.style.transform = ``;

        let newX = e.changedTouches[0].clientX - initialX;
        newX = Math.min(Math.max(newX, -halfBlockWidth), halfBlockWidth);
        if (newX == halfBlockWidth) {
            pinTask(currBlock);
        } else if (newX == -halfBlockWidth) {
            tasks.removeChild(currBlock);
        }
        currBlock.style.cursor = 'grab';
    }
});

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
    if (!name) return;

    task_name.value = ''; task_src.value = ''; task_desc.value = '';

    let new_task = document.createElement('div');
    new_task.classList.add('task-block', 'w-clearfix');
    
    let checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');

    let new_task_name = document.createElement('div');
    new_task_name.classList.add('task-name');
    new_task_name.innerHTML = name;

    new_task.addEventListener('mousedown', initDrag);
    new_task.addEventListener('touchstart', initDrag);

    new_task.appendChild(checkbox);
    new_task.appendChild(new_task_name);

    if (src) {
        let new_task_src = document.createElement('a');
        new_task_src.classList.add('link-block', 'w-inline-block');
        new_task_src.href = src;
        new_task_src.target = '_blank';
        new_task.appendChild(new_task_src);
    }

    tasks.appendChild(new_task);

    intro_wrap.classList.remove('hide-section');
    task_adder.classList.remove('show-section');
}