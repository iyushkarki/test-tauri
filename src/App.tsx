import { useState, useEffect } from "react";

interface SystemInfo {
  platform: string;
  version: string;
  arch: string;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    platform: "Loading...",
    version: "Loading...",
    arch: "Loading...",
  });
  const [randomQuote, setRandomQuote] = useState("Loading inspiration...");
  const [weatherInfo, setWeatherInfo] = useState("Checking weather...");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load system info on startup
  useEffect(() => {
    loadSystemInfo();
    loadRandomQuote();
    loadWeatherInfo();
  }, []);

  async function loadSystemInfo() {
    try {
      // Mock Tauri invoke for demo
      // const info = await invoke("get_system_info");
      // setSystemInfo(info);

      // Fallback for demo
      setTimeout(() => {
        setSystemInfo({
          platform: "Desktop",
          version: "1.0.0",
          arch: "x64",
        });
      }, 500);
    } catch (error) {
      console.error("Failed to load system info:", error);
    }
  }

  async function loadRandomQuote() {
    try {
      // Mock Tauri invoke for demo
      // const quote = await invoke("get_random_quote");
      // setRandomQuote(quote);

      const fallbackQuotes = [
        "Code is poetry written in logic.",
        "Every bug is a feature waiting to be discovered.",
        "The best code is code that doesn't need to exist.",
        "Simplicity is the ultimate sophistication.",
        "Programs must be written for people to read.",
      ];
      setRandomQuote(
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      );
    } catch (error) {
      console.error("Failed to load quote:", error);
    }
  }

  async function loadWeatherInfo() {
    try {
      // Mock weather for demo
      const conditions = [
        "☀️ Sunny",
        "🌤️ Partly Cloudy",
        "⛅ Cloudy",
        "🌧️ Raining",
      ];
      setWeatherInfo(
        `${conditions[Math.floor(Math.random() * conditions.length)]} 22°C`
      );
    } catch (error) {
      console.error("Failed to load weather:", error);
    }
  }

  async function openDirectory(path: string) {
    try {
      // Mock Tauri invoke for demo
      // await invoke("open_directory", { path });
      console.log(`Opening directory: ${path}`);
    } catch (error) {
      console.error("Failed to open directory:", error);
    }
  }

  async function runCommand(command: string) {
    try {
      // Mock Tauri invoke for demo
      // const result = await invoke("run_command", { command });
      // alert(`Command result: ${result}`);
      console.log(`Running command: ${command}`);
    } catch (error) {
      console.error("Failed to run command:", error);
    }
  }

  function addTask() {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  function toggleTask(id: number) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function removeTask(id: number) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="p-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-light mb-2 text-gray-900">
            {formatTime(currentTime)}
          </h1>
          <p className="text-xl text-gray-600">{formatDate(currentTime)}</p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* System Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <span className="text-xl mr-3">💻</span>
                System Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-medium">{systemInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{systemInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture:</span>
                  <span className="font-medium">{systemInfo.arch}</span>
                </div>
              </div>
            </div>

            {/* Weather Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <span className="text-xl mr-3">🌤️</span>
                Weather
              </h3>
              <p className="text-lg font-medium">{weatherInfo}</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <span className="text-xl mr-3">⚡</span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openDirectory("~/Desktop")}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors duration-200 rounded-lg p-3 text-center text-sm font-medium"
                >
                  📁 Desktop
                </button>
                <button
                  onClick={() => openDirectory("~/Documents")}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-colors duration-200 rounded-lg p-3 text-center text-sm font-medium"
                >
                  📄 Documents
                </button>
                <button
                  onClick={() => runCommand("code .")}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors duration-200 rounded-lg p-3 text-center text-sm font-medium"
                >
                  💻 VS Code
                </button>
                <button
                  onClick={() => runCommand("open -a Terminal")}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors duration-200 rounded-lg p-3 text-center text-sm font-medium"
                >
                  ⌨️ Terminal
                </button>
              </div>
            </div>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            {/* Daily Quote */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center text-gray-900">
                <span className="text-xl mr-3">💭</span>
                Daily Inspiration
              </h3>
              <p className="text-lg italic leading-relaxed text-gray-700 mb-4">
                "{randomQuote}"
              </p>
              <button
                onClick={loadRandomQuote}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 rounded-lg px-6 py-2 text-sm font-medium"
              >
                New Quote
              </button>
            </div>

            {/* Task Manager */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-gray-900">
                <span className="flex items-center">
                  <span className="text-xl mr-3">✅</span>
                  Tasks ({tasks.length})
                </span>
              </h3>

              <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    placeholder="Add a new task..."
                    className="max-w-[250px] border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addTask}
                    className=" bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 rounded-lg px-4 py-2 font-medium"
                  >
                    Add
                  </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {task.completed && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-lg font-semibold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No tasks yet. Add one above!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <span className="text-xl mr-3">📊</span>
                Today's Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter((t) => t.completed).length}
                  </div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Date().getHours()}h
                  </div>
                  <div className="text-sm text-purple-700">Hours Today</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">
                    {tasks.length > 0
                      ? Math.round(
                          (tasks.filter((t) => t.completed).length /
                            tasks.length) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-orange-700">Completed</div>
                </div>
              </div>
            </div>

            {/* App Launcher */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <span className="text-xl mr-3">🚀</span>
                Quick Launch
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    name: "Browser",
                    icon: "🌐",
                    cmd: "open -a 'Google Chrome'",
                  },
                  { name: "Music", icon: "🎵", cmd: "open -a Spotify" },
                  { name: "Notes", icon: "📝", cmd: "open -a Notes" },
                  { name: "Calculator", icon: "🔢", cmd: "open -a Calculator" },
                  { name: "Calendar", icon: "📅", cmd: "open -a Calendar" },
                  { name: "Mail", icon: "📧", cmd: "open -a Mail" },
                ].map((app, idx) => (
                  <button
                    key={idx}
                    onClick={() => runCommand(app.cmd)}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl mb-1">{app.icon}</div>
                    <div className="text-xs text-gray-700">{app.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-500">
          <p>Powered by Tauri + React • Your Personal Desktop Dashboard</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
