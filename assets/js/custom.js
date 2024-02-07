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
    intro_wrap.classList.add('hide-section');
    group_section.classList.add('show-section');

    group_section.children[1].innerHTML = group_title;
    group_tasks.innerHTML = '';

    let group = NOTES[group_title];
    for (let note in group) {
        addTask(note, group[note].src, group[note].type, group_tasks, group[note].finished);
    }
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
            updateStorage(op='rm', info=currBlock);
            let parentNode = currBlock.parentNode.parentNode;
            let group_title = (parentNode.id === 'intro-wrap') ? OTHER: parentNode.children[1].innerHTML;
            if (group_title === OTHER) {
                tasks.removeChild(currBlock);
            } else {
                group_tasks.removeChild(currBlock);
            }
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
            updateStorage(op='rm', info=currBlock);
            let parentNode = currBlock.parentNode.parentNode;
            let group_title = (parentNode.id === 'intro-wrap') ? OTHER: parentNode.children[1].innerHTML;
            if (group_title === OTHER) {
                tasks.removeChild(currBlock);
            } else {
                group_tasks.removeChild(currBlock);
            }
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
    let type = task_type.value.trim() || 'basic';
    if (!NOTES[OTHER][name] && addTask(name, src, type)) {
        updateStorage(op='add', info=[name, src, type]);
        intro_wrap.classList.remove('hide-section');
        task_adder.classList.remove('show-section');
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
    return true;
}

const OTHER = '%OTHER%';

let NOTES = localStorage['notes'];
if (!NOTES || NOTES === '{}') {
    NOTES = {
        '🛢️ Daily Tasks': {
            '🔥 Finish Leetcode Daily': {src: 'https://leetcode.com/problemset/', type: 'basic', finished: true},
            '👨‍💻 Open LocalHost':        {src: 'http://localhost:8080/',           type: 'basic'},
            '💬 Talk with ChatGPT':     {src: 'https://chat.openai.com/',         type: 'basic'},
        },
        '🤖 ML Links': {
            '🌍 Translate Some Text': {src: 'https://www.deepl.com/translator#en/ru/some%20text', type: 'basic'},
            '📝 Summarize Youtube Videos': {src: 'https://youtubesummarizer.com/',                type: 'basic'},
        },
        '💹 Сrypto Links': {
            '🍉 Arbuz': {src: 'https://t.me/wmclick_bot/click', type: 'basic'} // need to delete
        },
        [OTHER]: {
            '⌚ Start Timer':     {src: 'https://onlinetimer.ru/#!/', type: 'basic'},
            '🎨 Yandex Images':   {src: 'https://yandex.ru/images/',  type: 'basic'},
            '📊 Check Out Excel': {src: 'https://docs.google.com/spreadsheets/d/1AhSWk6SeviV5QItrO1zD54VoN-t3yhjo-k3DN3qY7K0/edit?usp=sharing', type: 'basic'} // need to delete
        }
    }
} else {
    NOTES = JSON.parse(NOTES);
}

// Need some improvements!
let CURR_DATE = new Date().toLocaleDateString("en-US");
for (let group_title in NOTES) {
    let group = NOTES[group_title];
    if (group_title !== OTHER) {
        for (let note in group) {
            if (group[note].finished) {
                if (group[note].last_date) {
                    let day_changed = (CURR_DATE !== new Date(group[note].last_date).toLocaleDateString("en-US"));
                    if (day_changed) {
                        group[note].finished = false;
                        console.log('Day Changed! New day - New task');
                    }
                }
                group[note].last_date = CURR_DATE;
            }
        }
        addGroup(group_title);
        continue;
    }

    for (let note in group) {
        if (group[note].finished) {
            if (group[note].last_date) {
                let day_changed = (CURR_DATE !== new Date(group[note].last_date).toLocaleDateString("en-US"));
                if (day_changed) {
                    group[note].finished = false;
                    console.log('Day Changed! New day - New task');
                }
            }
            group[note].last_date = CURR_DATE;
        }
        addTask(note, group[note].src, group[note].type, tasks, group[note].finished);
    }
}

localStorage['notes'] = JSON.stringify(NOTES);


function updateStorage(op, info) {
    if (op === 'add') {
        NOTES[OTHER][info[0]] = {src: info[1], type: info[2]};
        console.log(info, NOTES[OTHER]);
    } else {
        let parentNode = info.parentNode.parentNode;
        let group_title = (parentNode.id === 'intro-wrap') ? OTHER: parentNode.children[1].innerHTML;
        let task_header = info.children[1].innerHTML;
        delete NOTES[group_title][task_header];
        if (group_title !== OTHER && isEmpty(NOTES[group_title])) {
            delete NOTES[group_title];
            console.log(`Group ${group_title} was deleted!`);
        }
    }
    localStorage['notes'] = JSON.stringify(NOTES);
    console.log(`Storage Updated!`);
    return;
}


function editNoteStorage(currBlock) {
    let parentNode = currBlock.parentNode.parentNode;
    let group_title = (parentNode.id === 'intro-wrap') ? OTHER: parentNode.children[1].innerHTML;
    let task_header = currBlock.children[1].innerHTML;

    NOTES[group_title][task_header].finished = !NOTES[group_title][task_header].finished;

    localStorage['notes'] = JSON.stringify(NOTES);
    console.log(`Storage was Edit!`);
    return;
}


function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}
