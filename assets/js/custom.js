window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = ''; 
    return ''; 
});

const tasks = document.getElementById('tasks');
const blocks = document.getElementsByClassName('task-block');

const group_tasks = document.getElementById('group-tasks');

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

function initDrag(block) {
    isDragging = true;
    currBlock = block;
    halfBlockWidth = currBlock.offsetWidth / 2;
}

function initDragDesktop(e) {
    initDrag(this);
    this.style.cursor = 'grabbing';
    initialX = e.clientX;
}

function initDragMobile(e) {
    initDrag(this);
    initialX = e.touches[0].clientX;
}

function showGroup(group_title) {
    group_section.children[1].innerHTML = group_title;
    intro_wrap.classList.add('hide-section');
    group_section.classList.add('show-section');

    group_tasks.innerHTML = '';
    for (let note of notes) {
        if (note.group_title === group_title) {
            for (let group_note of note.group_notes) {
                addTask(group_note.name, group_note.src, group_note.type, group_tasks, group_note.finished);
            }
        }
    }
    console.log(group_tasks);
}

for (let block of blocks) {
    if (block.classList.contains('group-block')) {
        let group_title = block.children[0].innerHTML;
        if (!group_title || group_title == '<br>') { // <br> need to fix!!
            continue
        }
        block.addEventListener('click', _ => showGroup(group_title));
        continue;
    }
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
    if (!intro_wrap.classList.contains('hide-section')) {
        intro_wrap.classList.add('hide-section');
        task_adder.classList.add('show-section');
    } else {
        intro_wrap.classList.remove('hide-section');
        task_adder.classList.remove('show-section');
    }
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

const group_close_btn = document.getElementById('cancel-btn-group');
group_close_btn.addEventListener('click', function() {
    intro_wrap.classList.remove('hide-section');
    group_section.classList.remove('show-section');
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        intro_wrap.classList.remove('hide-section');
        task_adder.classList.remove('show-section');
        group_section.classList.remove('show-section');
    }
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

const group_section = document.getElementById('group-section');

const task_adder = document.getElementById('new-task-section');
const task_name = document.getElementById('task-name');
const task_src  = document.getElementById('task-src');
const task_type = document.getElementById('task-type');

function addGroup(group_title) {
    if (!group_title) return false;

    let group = document.createElement('div');
    group.classList.add('div-block-5');

    let ind_group_block;
    let group_block;

    for (let ind of ['first', 'second', 'third']) {
        ind_group_block = document.createElement('div');
        ind_group_block.classList.add('task-block', 'group-block', `${ind}-group-block`, 'w-clearfix');
    
        group_block = document.createElement('div');
        group_block.classList.add('task-name', 'group-name');
        group_block.innerHTML = (ind === 'first' ? group_title : '');
        if (ind === 'first') ind_group_block.addEventListener('click', _ => showGroup(group_title));
    
        ind_group_block.appendChild(group_block);
        group.appendChild(ind_group_block);
    }
    tasks.appendChild(group);
}

function addTask(name, src, type, block=tasks, finished=false) {
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

    block.appendChild(new_task);

    intro_wrap.classList.remove('hide-section');
    task_adder.classList.remove('show-section');
    return true;
}

let notes = localStorage['notes'];
if (!notes || notes === '[]') {
    notes = [{group_title: '🛢️ Daily Tasks', group_notes: [
                {name: '🔥 Finish Leetcode Daily',    src: 'https://leetcode.com/problemset/',                   type: ''},
                {name: '👨‍💻 Open LocalHost',           src: 'http://localhost:8080/',                             type: ''},
                {name: '💬 Talk with ChatGPT',        src: 'https://chat.openai.com/',                           type: ''},
            ]},
            {group_title: '🤖 ML Links', group_notes: [
                {name: '🌍 Translate Some Text',      src: 'https://www.deepl.com/translator#en/ru/some%20text', type: ''},
                {name: '📝 Summarize Youtube Videos', src: 'https://youtubesummarizer.com/',                     type: ''},
            ]},
            {group_title: '💹 Сrypto Links', group_notes: []},
            {name: '⌚ Start Timer',   src: 'https://onlinetimer.ru/#!/', type: ''},
            {name: '🎨 Yandex Images', src: 'https://yandex.ru/images/',  type: ''}
            ]
} else {
    notes = JSON.parse(notes);
}

let CURR_DATE = new Date().toLocaleDateString("en-US");
for (let note of notes) {
    if (note.group_title) {
        addGroup(note.group_title);
        continue
    } else if (note.finished) {
        if (note.last_date) {
            let day_changed = (CURR_DATE !== new Date(note.last_date).toLocaleDateString("en-US"));
            if (day_changed) {
                note.finished = false;
                console.log('Day Changed! New day - New task');
            }
        }
        note.last_date = CURR_DATE;
    }
    addTask(note.name, note.src, note.type, tasks, note.finished);
}

localStorage['notes'] = JSON.stringify(notes);


function updateStorage() {
    return false; // cos group problem
    let notes = [];
    for (let block of blocks) {
        if (block.classList.contains('group-block')) {
            continue; // temporary
        }
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
        if (notes[i].group_title) {
            let group_notes = notes[i].group_notes
            for (let j = 0; j < group_notes.length; j++) {
                let note_header = group_notes[j].name;
                if (note_header === task_header) {
                    group_notes[j].finished = !group_notes[j].finished;
                    break;
                }
            }
            // need to stop here if already found!
        }
        let note_header = notes[i].name;
        if (note_header === task_header) {
            notes[i].finished = !notes[i].finished;
            break;
        }
    }

    localStorage['notes'] = JSON.stringify(notes);
    console.log(`Storage was Edit!`);
}
