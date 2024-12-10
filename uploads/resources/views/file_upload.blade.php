<!DOCTYPE html>
<html lang="en" class="h-full" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
    <script>
        // JavaScript to toggle light/dark mode based on system preference or user choice
        document.addEventListener('DOMContentLoaded', function () {
            const themeToggle = document.querySelector('#theme-toggle');
            const root = document.documentElement;

            // Check for saved theme or system preference
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme) {
                root.setAttribute('data-theme', savedTheme);
            } else if (systemPrefersDark) {
                root.setAttribute('data-theme', 'dark');
            }

            // Toggle theme and save preference
            themeToggle.addEventListener('click', function () {
                const currentTheme = root.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                root.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        });
    </script>
    <style>
        /* Base styles for light and dark mode */
        :root[data-theme="light"] {
            --bg-color: #ffffff;
            --text-color: #000000;
            --button-bg: #f3f4f6;
            --button-text: #000000;
        }

        :root[data-theme="dark"] {
            --bg-color: #121212;
            --text-color: #ffffff;
            --button-bg: #333333;
            --button-text: #ffffff;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        button {
            background-color: var(--button-bg);
            color: var(--button-text);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.9;
        }

        input[type="file"] {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>Upload a File</h1>

    @if(session('success'))
        <p>{{ session('success') }}</p>
        <p>File path: {{ session('path') }}</p>
    @endif

    <form action="{{ route('file.upload') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div>
            <label for="file">Choose a file:</label>
            <input type="file" name="file" id="file" required>
        </div>
        <button type="submit">Upload</button>
    </form>

    <button id="theme-toggle">Toggle Theme</button>
</body>
</html>
