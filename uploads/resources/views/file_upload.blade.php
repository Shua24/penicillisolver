<!DOCTYPE html>
<html lang="en" class="h-full" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Pola Kuman</title>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const themeToggle = document.querySelector('#theme-toggle');
            const root = document.documentElement;

            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme) {
                root.setAttribute('data-theme', savedTheme);
            } else if (systemPrefersDark) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.sestAttribute('data-theme', 'light');
            }

            themeToggle.addEventListener('click', function () {
                const currentTheme = root.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                root.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        });

        function closePage() {
            window.close();
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        :root[data-theme="light"] {
            --bg-color: #dfdfdf;
            --text-color: #005f76;
            --button-bg: #005f76;
            --button-text: #ffffff;
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
            font-family: "Poppins", Sans Serif
        }

        button {
            background-color: var(--button-bg);
            color: var(--button-text);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-family: Poppins, Sans Serif;
        }

        button:hover {
            opacity: 0.9;
        }

        input[type="file"] {
            margin: 10px 0;
            font-family: Poppins, Sans Serif
        }
    </style>
</head>
<body>
    <h1>Update Pola Kuman</h1>

    @if(session('success'))
        <p>{{ session('success') }}</p>
        <p>Anda bisa menutup halaman ini.</p>
    @endif

    <form action="{{ route('file.upload') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div>
            <label for="file">Upload Pola Kuman:</label>
            <input type="file" name="file" id="file" required>
        </div><br>
        <button type="submit">Upload</button>
        <button onclick="closePage()">Tutup</button>
    </form>
</html>
