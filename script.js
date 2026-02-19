let userTasks = [];

function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const time = document.getElementById("taskTime").value;
    const duration = Number(document.getElementById("taskDuration").value);

    if (!name || !time || duration <= 0) {
        alert("Please enter task name, time, and duration.");
        return;
    }

    userTasks.push({
        name,
        start: toMinutes(time),
        duration
    });

    document.getElementById("taskName").value = "";
    document.getElementById("taskTime").value = "";
    document.getElementById("taskDuration").value = "";
}

function generateRoutine() {
    const day = document.getElementById("day").value;
    const wakeTime = document.getElementById("wakeTime").value;
    const sleepTime = document.getElementById("sleepTime").value;
    const studyHours = Number(document.getElementById("studyHours").value);
    const breakMinutes = Number(document.getElementById("breakMinutes").value);
    const error = document.getElementById("errorMsg");

    error.textContent = "";

    if (!wakeTime || !sleepTime || studyHours <= 0 || breakMinutes <= 0) {
        error.textContent = "Please fill all inputs correctly.";
        return;
    }

    let wake = toMinutes(wakeTime);
    let sleep = toMinutes(sleepTime);
    if (sleep <= wake) sleep += 1440;

    let routine = [];
    let current = wake;

    routine.push(createTask("Wake & Freshen", current, 30));
    current += 30;

    let studyMinutes = studyHours * 60;
    while (studyMinutes > 0) {
        let session = Math.min(120, studyMinutes);
        routine.push(createTask("Study Session", current, session));
        current += session;
        studyMinutes -= session;

        if (studyMinutes > 0) {
            routine.push(createTask("Break", current, breakMinutes));
            current += breakMinutes;
        }
    }

    // ADD USER TASKS AT EXACT TIME
    userTasks.forEach(t => {
        routine.push({
            name: t.name,
            start: toTime(t.start),
            end: toTime(t.start + t.duration)
        });
    });

    // SORT ROUTINE BY TIME
    routine.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    routine.push(createTask("Free Time", current, sleep - current));

    displayRoutine(day, routine);
}

function saveRoutine() {
    const day = document.getElementById("day").value;
    localStorage.setItem(day, document.getElementById("output").innerHTML);
    alert(day + " routine saved!");
}

function clearRoutine() {
    const day = document.getElementById("day").value;
    localStorage.removeItem(day);
    document.getElementById("output").innerHTML = "";
    userTasks = [];
}

function displayRoutine(day, routine) {
    let html = `<h2>${day} Routine</h2><ul>`;
    routine.forEach(r => {
        html += `<li><strong>${r.name}</strong>: ${r.start} - ${r.end}</li>`;
    });
    html += "</ul>";
    document.getElementById("output").innerHTML = html;
}

function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

function toTime(min) {
    min %= 1440;
    return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function createTask(name, start, duration) {
    return {
        name,
        start: toTime(start),
        end: toTime(start + duration)
    };
}
