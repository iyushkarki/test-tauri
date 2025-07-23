// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Uncomment this main function
fn main() {
    test_tauri_lib::run()
}

// src-tauri/src/main.rs
use std::process::Command;
use serde::{Deserialize, Serialize};
// Remove this unused import
// use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct SystemInfo {
    platform: String,
    version: String,
    arch: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've got a beautiful day ahead.", name)
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    SystemInfo {
        platform: std::env::consts::OS.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        arch: std::env::consts::ARCH.to_string(),
    }
}

#[tauri::command]
fn get_random_quote() -> String {
    let quotes = vec![
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is during our darkest moments that we must focus to see the light.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The way to get started is to quit talking and begin doing.",
        "Don't let yesterday take up too much of today.",
        "You learn more from failure than from success.",
        "If you are working on something exciting that you really care about, you don't have to be pushed.",
        "Experience is the name everyone gives to their mistakes.",
        "Optimism is the faith that leads to achievement.",
        "The only impossible journey is the one you never begin.",
    ];
    
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    use std::time::{SystemTime, UNIX_EPOCH};
    
    let mut hasher = DefaultHasher::new();
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    // Use day-based seed so quotes change daily but are consistent within a day
    let day_seed = timestamp / (24 * 60 * 60);
    day_seed.hash(&mut hasher);
    let index = hasher.finish() as usize % quotes.len();
    
    quotes[index].to_string()
}

#[tauri::command]
fn get_weather_info() -> String {
    // In a real app, you'd call a weather API here
    // For demo purposes, we'll return a simulated response
    let conditions = vec!["☀️ Sunny", "🌤️ Partly Cloudy", "⛅ Cloudy", "🌧️ Light Rain", "❄️ Snow"];
    let temps = vec!["18°C", "22°C", "25°C", "19°C", "15°C"];
    
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    use std::time::{SystemTime, UNIX_EPOCH};
    
    let mut hasher = DefaultHasher::new();
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    let hour_seed = timestamp / (60 * 60); // Changes every hour
    hour_seed.hash(&mut hasher);
    let condition_index = hasher.finish() as usize % conditions.len();
    
    let mut temp_hasher = DefaultHasher::new();
    (hour_seed + 1).hash(&mut temp_hasher);
    let temp_index = temp_hasher.finish() as usize % temps.len();
    
    format!("{} {}", conditions[condition_index], temps[temp_index])
}

#[tauri::command]
async fn open_directory(path: String) -> Result<String, String> {
    let expanded_path = if path.starts_with("~/") {
        match dirs::home_dir() {
            Some(home) => path.replacen("~", &home.to_string_lossy(), 1),
            None => return Err("Could not find home directory".to_string()),
        }
    } else {
        path
    };

    #[cfg(target_os = "macos")]
    {
        let result = Command::new("open")
            .arg(&expanded_path)
            .output();
            
        match result {
            Ok(_) => Ok(format!("Opened directory: {}", expanded_path)),
            Err(e) => Err(format!("Failed to open directory: {}", e)),
        }
    }
    
    #[cfg(target_os = "windows")]
    {
        let result = Command::new("explorer")
            .arg(&expanded_path)
            .output();
            
        match result {
            Ok(_) => Ok(format!("Opened directory: {}", expanded_path)),
            Err(e) => Err(format!("Failed to open directory: {}", e)),
        }
    }
    
    #[cfg(target_os = "linux")]
    {
        let result = Command::new("xdg-open")
            .arg(&expanded_path)
            .output();
            
        match result {
            Ok(_) => Ok(format!("Opened directory: {}", expanded_path)),
            Err(e) => Err(format!("Failed to open directory: {}", e)),
        }
    }
}

#[tauri::command]
async fn run_command(command: String) -> Result<String, String> {
    // For security, we'll only allow specific safe commands
    let safe_commands = vec![
        "code .",
        "open -a Terminal",
        "open -a 'Google Chrome'",
        "open -a Spotify",
        "open -a Notes",
        "open -a Calculator",
        "open -a Calendar",
        "open -a Mail",
        "explorer",
        "notepad",
        "calc",
        "xdg-open",
    ];
    
    // Check if the command starts with any safe command
    let is_safe = safe_commands.iter().any(|safe_cmd| {
        command.starts_with(safe_cmd)
    });
    
    if !is_safe {
        return Err("Command not allowed for security reasons".to_string());
    }
    
    #[cfg(target_os = "macos")]
    {
        let parts: Vec<&str> = command.split_whitespace().collect();
        if parts.is_empty() {
            return Err("Empty command".to_string());
        }
        
        let result = if parts.len() == 1 {
            Command::new(parts[0]).output()
        } else {
            Command::new(parts[0]).args(&parts[1..]).output()
        };
        
        match result {
            Ok(output) => {
                if output.status.success() {
                    Ok("Command executed successfully".to_string())
                } else {
                    Err(format!("Command failed: {}", String::from_utf8_lossy(&output.stderr)))
                }
            }
            Err(e) => Err(format!("Failed to execute command: {}", e)),
        }
    }
    
    #[cfg(target_os = "windows")]
    {
        let result = Command::new("cmd")
            .args(&["/C", &command])
            .output();
            
        match result {
            Ok(output) => {
                if output.status.success() {
                    Ok("Command executed successfully".to_string())
                } else {
                    Err(format!("Command failed: {}", String::from_utf8_lossy(&output.stderr)))
                }
            }
            Err(e) => Err(format!("Failed to execute command: {}", e)),
        }
    }
    
    #[cfg(target_os = "linux")]
    {
        let result = Command::new("sh")
            .arg("-c")
            .arg(&command)
            .output();
            
        match result {
            Ok(output) => {
                if output.status.success() {
                    Ok("Command executed successfully".to_string())
                } else {
                    Err(format!("Command failed: {}", String::from_utf8_lossy(&output.stderr)))
                }
            }
            Err(e) => Err(format!("Failed to execute command: {}", e)),
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            get_random_quote,
            get_weather_info,
            open_directory,
            run_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}