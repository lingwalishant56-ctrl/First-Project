function register() {
    fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: regUser.value,
            password: regPass.value
        })
    }).then(res => res.json())
      .then(data => alert(data.message));
}

function login() {
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: loginUser.value,
            password: loginPass.value
        })
    }).then(res => res.json())
      .then(data => {
          if (data.username) {
              localStorage.setItem("user", data.username.toLowerCase());

              window.location = "dashboard.html";
          } else {
              alert(data.message);
          }
      });
}

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

function addTask() {
    fetch("/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("user"),
            title: taskTitle.value,
            deadline: taskDate.value
        })
    }).then(() => loadTasks());
}

function loadTasks() {
    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("user")
        })
    }).then(res => res.json())
      .then(tasks => {
          taskList.innerHTML = "";
          tasks.forEach((t, i) => {
              taskList.innerHTML += `
                <li>
                  ${t.title} | ${t.deadline} | ${t.status}
                  <span>
                    <button onclick="completeTask(${i})">✔</button>
                    <button onclick="deleteTask(${i})">❌</button>
                  </span>
                </li>`;
          });
      });
}

function completeTask(i) {
    fetch("/updateTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("user"),
            index: i
        })
    }).then(() => loadTasks());
}

function deleteTask(i) {
    fetch("/deleteTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("user"),
            index: i
        })
    }).then(() => loadTasks());
}

if (window.location.pathname.includes("dashboard")) {
    loadTasks();
}
