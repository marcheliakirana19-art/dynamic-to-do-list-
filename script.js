// ==============================
// script.js (ganti file lama dengan ini)
// Semua inisialisasi DOM dilakukan setelah DOMContentLoaded
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  // Ambil elemen setelah DOM siap
  const taskList = document.getElementById("taskList");
  const popup = document.getElementById("popup");

  let tasks = [];

  /* -------------------------
     Tambah Tugas
  -------------------------- */
  function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const time = document.getElementById("taskTime").value;
    const priority = document.getElementById("taskPriority").value;

    if (!text || !time) return alert("Isi kegiatan dan waktu!");

    const task = {
      id: Date.now(),
      text,
      time,
      priority,
      done: false,
    };

    tasks.push(task);
    document.getElementById("taskInput").value = "";
    document.getElementById("taskTime").value = "";
    renderTasks();
  }

  /* -------------------------
     Render Tasks
  -------------------------- */
  function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";
      li.classList.add(`priority-${task.priority}`);

      li.innerHTML = `
        <span>
          ${task.text}
          <br>
          <small>${new Date(task.time).toLocaleString()}</small>
        </span>

        <div>
          <button onclick="toggleDone(${task.id})">✔</button>
          <button onclick="deleteTask(${task.id})">🗑</button>
        </div>
      `;

      taskList.appendChild(li);
    });
  }

  /* -------------------------
     Toggle Done
  -------------------------- */
  function toggleDone(id) {
    tasks = tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t));
    renderTasks();
  }

  /* -------------------------
     Delete Task
  -------------------------- */
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
  }

  /* -------------------------
     Popup Notifikasi
     (Interval di-set di sini agar popup dapat akses 'popup' element)
  -------------------------- */
  setInterval(() => {
    const now = new Date();
    const overdue = tasks.some(t => new Date(t.time) < now && !t.done);
    popup.style.display = overdue ? "block" : "none";
  }, 10000);

  /* -------------------------
     Kalender Interaktif
  -------------------------- */
  function renderCalendar() {
    const calendar = document.getElementById("calendar");
    if (!calendar) return; // safety check

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let table = `
      <h3>${now.toLocaleString("id-ID", { month: "long", year: "numeric" })}</h3>
      <table>
        <tr>
          <th>Min</th><th>Sen</th><th>Sel</th><th>Rab</th>
          <th>Kam</th><th>Jum</th><th>Sab</th>
        </tr>
        <tr>
    `;

    for (let i = 0; i < firstDay; i++) table += "<td></td>";

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate();
      table += `
        <td class="${isToday ? "today" : ""}" 
            data-day="${d}" onclick="showTasksByDate(${year}, ${month}, ${d})">
            ${d}
        </td>
      `;
      if ((d + firstDay) % 7 === 0) table += "</tr><tr>";
    }

    table += "</tr></table>";
    calendar.innerHTML = table;
  }

  /* -------------------------
     Tampilkan tugas berdasarkan tanggal
  -------------------------- */
  function showTasksByDate(y, m, d) {
    const selected = tasks.filter(t => {
      const date = new Date(t.time);
      return (
        date.getFullYear() === y &&
        date.getMonth() === m &&
        date.getDate() === d
      );
    });

    if (selected.length === 0) {
      alert(`Tidak ada tugas pada ${d}/${m + 1}/${y}`);
    } else {
      const msg = selected
        .map(t => `- ${t.text} (${t.priority})`)
        .join("\n");
      alert(`Tugas tanggal ${d}/${m + 1}/${y}:\n\n${msg}`);
    }
  }

  /* -------------------------
     Expose fungsi ke global (supaya onclick di HTML bisa akses)
  -------------------------- */
  window.addTask = addTask;
  window.toggleDone = toggleDone;
  window.deleteTask = deleteTask;
  window.showTasksByDate = showTasksByDate;

  /* -------------------------
     Inisialisasi awal
  -------------------------- */
  renderCalendar();
  // renderTasks(); // kalau mau ada preload tasks dari localStorage, bisa aktifkan
});