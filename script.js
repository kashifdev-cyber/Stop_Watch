// =========================
// Stopwatch App Controller
// =========================

const StopwatchApp = (() => {
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let running = false;
    let laps = [];

    // DOM cache
    const dom = {
        display: document.getElementById("display"),
        laps: document.getElementById("laps"),
        progress: document.querySelector(".timer__progress"),
        click: document.getElementById("clickSound")
    };

    // =========================
    // Time formatting
    // =========================
    const formatTime = (ms) => {
        const milliseconds = Math.floor((ms % 1000) / 10);
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
    };

    const pad = (n) => n.toString().padStart(2, "0");

    // =========================
    // Core timer logic
    // =========================
    const start = () => {
        if (running) return;

        running = true;
        startTime = Date.now() - elapsedTime;

        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateUI();
        }, 10);
    };

    const stop = () => {
        running = false;
        clearInterval(timerInterval);
    };

    const reset = () => {
        stop();
        elapsedTime = 0;
        laps = [];
        renderLaps();
        updateUI();
        updateProgress(0);
    };

    const toggle = () => {
        running ? stop() : start();
        playClick();
    };

    const addLap = () => {
        if (!running) return;

        laps.unshift(formatTime(elapsedTime));
        renderLaps();
        playClick();
    };

    // =========================
    // UI updates
    // =========================
    const updateUI = () => {
        dom.display.textContent = formatTime(elapsedTime);
        updateProgress(elapsedTime);
    };

    const updateProgress = (ms) => {
        const cycle = 60 * 1000; // 1 minute cycle for ring animation
        const offset = 817 - ((ms % cycle) / cycle) * 817;
        dom.progress.style.strokeDashoffset = offset;
    };

    const renderLaps = () => {
        dom.laps.innerHTML = laps
            .map((lap, i) => `<li>Lap ${laps.length - i}: ${lap}</li>`)
            .join("");
    };

    const playClick = () => {
        dom.click.currentTime = 0;
        dom.click.play();
    };

    // =========================
    // Export
    // =========================
    const exportLaps = () => {
        const data = laps.join("\n");
        const blob = new Blob([data], { type: "text/plain" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "laps.txt";
        a.click();

        URL.revokeObjectURL(url);
    };

    // =========================
    // Public API
    // =========================
    return {
        startStop: toggle,
        reset,
        lap: addLap,
        exportLaps
    };
})();

// =========================
// Global bindings (HTML buttons)
// =========================
const startStop = StopwatchApp.startStop;
const reset = StopwatchApp.reset;
const lap = StopwatchApp.lap;
const exportLaps = StopwatchApp.exportLaps;

// Fullscreen helper (clean + safe)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Theme switch (simple but structured)
function setTheme(theme) {
    const root = document.documentElement;

    const themes = {
        dark: "rgb(31, 21, 12)",
        amber: "rgb(225, 220, 201)",
        sage: "rgb(66, 132, 117)",
        ice: "rgb(114, 136, 174)"
    };

    root.style.setProperty("--accent", themes[theme] || themes.dark);
}
