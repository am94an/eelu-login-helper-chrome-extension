chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'login') {
        const loginUrl = 'https://sis.eelu.edu.eg/studentLogin';
        const loginData = new URLSearchParams({
            UserName: request.username,
            Password: request.password,
            sysID: '313.',
            UserLang: 'E',
            userType: '2'
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
            'Origin': 'https://sis.eelu.edu.eg',
            'Referer': 'https://sis.eelu.edu.eg/static/index.html',
            'X-Requested-With': 'XMLHttpRequest'
        };

        fetch(loginUrl, {
            method: 'POST',
            headers: headers,
            body: loginData,
            credentials: 'include',
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) throw new Error(`Login failed with status ${response.status}`);
            return fetch('https://sis.eelu.edu.eg/getJCI', {
                method: 'POST',
                headers: {
                    ...headers,
                    'Referer': 'https://sis.eelu.edu.eg/static/PortalStudent.html'
                },
                body: new URLSearchParams({
                    param0: 'stuAdmission.stuAdmission',
                    param1: 'moodleLogin',
                    param2: '2'
                }),
                credentials: 'include',
                mode: 'cors'
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.loginurl) {
                chrome.tabs.create({ url: data.loginurl });
                sendResponse({ success: true });
            } else {
                throw new Error('Invalid response format');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ success: false, error: error.message });
        });

        return true;
    }

    if (request.action === 'clearCookies') {
        const domainsToClear = ['eelu.edu.eg', 'sis.eelu.edu.eg', 'moodlelms.eelu.edu.eg'];
        
        const clearPromises = domainsToClear.map(domain => {
            return new Promise(resolve => {
                chrome.cookies.getAll({ domain: domain }, cookies => {
                    cookies.forEach(cookie => {
                        chrome.cookies.remove({
                            url: `https://${domain}${cookie.path}`,
                            name: cookie.name
                        });
                    });
                    resolve();
                });
            });
        });

        Promise.all(clearPromises)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;
    }
});