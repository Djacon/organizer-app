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

function initDrag(e, block) {
    isDragging = true;
    currBlock = block;
    halfBlockWidth = currBlock.offsetWidth / 2;
}

function initDragDesktop(e) {
    initDrag(e, this);
    this.style.cursor = 'grabbing';
    initialX = e.clientX;
}

function initDragMobile(e) {
    initDrag(e, this);
    initialX = e.touches[0].clientX;
}

for (let block of blocks) {
    block.addEventListener('mousedown', initDragDesktop);
    block.addEventListener('touchstart', initDragMobile);
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
            editNoteStorage(currBlock);
        } else if (newX == -halfBlockWidth) {
            tasks.removeChild(currBlock);
            updateStorage();
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
            editNoteStorage(currBlock);
        } else if (newX == -halfBlockWidth) {
            tasks.removeChild(currBlock);
            updateStorage();
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
    if (!intro_wrap.classList.contains('hide-section')) {
        intro_wrap.classList.add('hide-section');
        task_adder.classList.add('show-section');
    } else {
        intro_wrap.classList.remove('hide-section');
        task_adder.classList.remove('show-section');
    }
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
    let type = task_type.value.trim();
    if (addTask(name, src, type)) {
        updateStorage();
    }
});

const task_adder = document.getElementById('new-task-section');
const task_name = document.getElementById('task-name');
const task_src  = document.getElementById('task-src');
const task_type = document.getElementById('task-type');

function addTask(name, src, type, finished=false) {
    if (!name) return false;

    task_name.value = ''; task_src.value = ''; task_type.value = '';

    let new_task = document.createElement('div');
    new_task.classList.add('task-block', 'w-clearfix');
    
    let checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');

    let new_task_name = document.createElement('div');
    new_task_name.classList.add('task-name');
    new_task_name.innerHTML = name;

    new_task.addEventListener('mousedown', initDragDesktop);
    new_task.addEventListener('touchstart', initDragMobile);

    new_task.appendChild(checkbox);
    new_task.appendChild(new_task_name);

    if (src) {
        let new_task_src = document.createElement('a');
        new_task_src.classList.add('link-block', 'w-inline-block');
        new_task_src.href = src;
        new_task_src.target = '_blank';
        new_task.appendChild(new_task_src);
    }

    if (finished) {
        pinTask(new_task);
    }

    tasks.appendChild(new_task);

    intro_wrap.classList.remove('hide-section');
    task_adder.classList.remove('show-section');
    return true;
}

let notes = localStorage['notes'];
if (!notes || notes === '[]') {
    notes = [{name: '🔥 Finish Leetcode Daily',    src: 'https://leetcode.com/problemset/',                   type: ''},
             {name: '👨‍💻 Open LocalHost',           src: 'http://localhost:8080/',                             type: ''},
             {name: '💬 Talk with ChatGPT',        src: 'https://chat.openai.com/',                           type: ''},
             {name: '🌍 Translate Some Text',      src: 'https://www.deepl.com/translator#en/ru/some%20text', type: ''},
             {name: '📝 Summarize Youtube Videos', src: 'https://youtubesummarizer.com/',                     type: ''}]
} else {
    notes = JSON.parse(notes);
}

let CURR_DATE = new Date().toLocaleDateString("en-US");
for (note of notes) {
    if (note.finished) {
        if (note.last_date) {
            let day_changed = (CURR_DATE !== new Date(note.last_date).toLocaleDateString("en-US"));
            if (day_changed) {
                note.finished = false;
                console.log('Day Changed! New day - New task');
            }
        }
        note.last_date = CURR_DATE;
    }
    addTask(note.name, note.src, note.type, note.finished);
}

localStorage['notes'] = JSON.stringify(notes);


function updateStorage() {
    let notes = [];
    for (let block of blocks) {
        let finished = block.children[0].classList.contains('active-btn');
        let task_header = block.children[1].innerHTML;
        let task_src = '';
        if (block.children.length > 2) { // have source
            task_src = block.children[2].href;
        }
        notes.push({name: task_header, src: task_src, type: '', finished: finished});
    }
    localStorage['notes'] = JSON.stringify(notes);
    console.log(`Storage Updated! Size - ${notes.length}`)
}

function editNoteStorage(currBlock) {
    let notes = JSON.parse(localStorage['notes']);
    let task_header = currBlock.children[1].innerHTML;
    for (let i = 0; i < notes.length; i++) {
        let note_header = notes[i].name;
        if (note_header === task_header) {
            notes[i].finished = !notes[i].finished;
            break;
        }
    }

    localStorage['notes'] = JSON.stringify(notes);
    console.log(`Storage was Edit!`);
}
