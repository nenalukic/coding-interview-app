const io = require('socket.io-client');
const axios = require('axios');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('Starting Integration Tests...');

    // 1. Create a Room
    let roomId;
    try {
        const res = await axios.post(`${BASE_URL}/rooms`);
        roomId = res.data.roomId;
        console.log(`[PASS] Created room: ${roomId}`);
    } catch (e) {
        console.error(`[FAIL] Create room failed: ${e.message}`);
        process.exit(1);
    }

    // 2. Connect two clients
    const client1 = io(BASE_URL);
    const client2 = io(BASE_URL);

    let client1Connected = false;
    let client2Connected = false;

    client1.on('connect', () => {
        client1Connected = true;
        client1.emit('join-room', roomId);
    });

    client2.on('connect', () => {
        client2Connected = true;
        client2.emit('join-room', roomId);
    });

    // Wait for connections
    await new Promise(resolve => setTimeout(resolve, 500));
    if (client1Connected && client2Connected) {
        console.log('[PASS] Both clients connected');
    } else {
        console.error('[FAIL] Clients failed to connect');
        process.exit(1);
    }

    // 3. Test Sync
    const testCode = 'console.log("Hello World")';

    const syncPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject('Timeout waiting for code-update'), 2000);

        client2.on('code-update', (code) => {
            clearTimeout(timeout);
            if (code === testCode) {
                console.log('[PASS] Code sync verified');
                resolve();
            } else {
                reject(`Mismatch code: ${code}`);
            }
        });

        client1.emit('code-change', { roomId, code: testCode });
    });

    try {
        await syncPromise;
    } catch (e) {
        console.error(`[FAIL] Sync verification failed: ${e}`);
        process.exit(1);
    }

    // 4. Test Language Sync
    const testLang = 'python';
    const langPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject('Timeout waiting for language-update'), 2000);

        client2.on('language-update', (lang) => {
            clearTimeout(timeout);
            if (lang === testLang) {
                console.log('[PASS] Language sync verified');
                resolve();
            } else {
                reject(`Mismatch lang: ${lang}`);
            }
        });

        client1.emit('language-change', { roomId, language: testLang });
    });

    try {
        await langPromise;
    } catch (e) {
        console.error(`[FAIL] Language sync failed: ${e}`);
        process.exit(1);
    }

    console.log('All Tests Passed!');
    client1.disconnect();
    client2.disconnect();
    process.exit(0);
}

// Ensure server is running before running this
runTests().catch(e => {
    console.error('Test script error:', e);
    process.exit(1);
});
