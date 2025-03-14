document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const status = document.getElementById('status');

    if (!username || !password) {
        status.innerText = 'Please enter both username and password';
        status.classList.add('show-status');
        return;
    }

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'login',
            username: username,
            password: password
        });

        if (response.success) {
            status.innerText = 'Login successful!';
            status.classList.add('show-status');
            setTimeout(() => window.close(), 1500);
        } else {
            status.innerText = response.error || 'Login failed';
            status.classList.add('show-status');
        }
    } catch (error) {
        status.innerText = 'Error occurred';
        status.classList.add('show-status');
    }
});

document.getElementById('clearCookiesBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    try {
        const response = await chrome.runtime.sendMessage({ action: 'clearCookies' });
        status.innerText = response.success ? 'Cookies cleared successfully!' : 'Failed to clear cookies';
        status.classList.add('show-status');
    } catch (error) {
        status.innerText = 'Error clearing cookies';
        status.classList.add('show-status');
    }
});

