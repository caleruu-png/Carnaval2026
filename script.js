document.addEventListener('DOMContentLoaded', () => {
    // Shared Prizes Definition
    const prizes = {
        'calero': '<span>@marcooo.calerooo</span><span style="font-size:0.8em">🎉 PREMIO  🎉</span>',
        'lupe': '<span>@lupeemendez_</span><span style="font-size:0.8em">🎉 PREMIO  🎉</span>',
        'coca': '<span>@daniisanche_</span><span style="font-size:0.8em">🎉 PREMIO  🎉</span>',
        'daniela': '<span>@danielaruiiiz_</span><span style="font-size:0.8em">🎉 PREMIO  🎉</span>',
        'javi': '<span>@_javieerromeroo_</span><span style="font-size:0.8em">🎉 PREMIO 🎉</span>',
        'guille': '<span>@guillee.ds_</span><span style="font-size:0.8em">🎉 PREMIO  🎉</span>',
        'tati': '<span>tati</span><span style="font-size:0.8em">🎉 PREMIO  🎉</span>',
    };

    // Route Detection
    const path = window.location.pathname;
    if (path.endsWith('admin.html')) {
        initAdmin(prizes);
    } else {
        initLottery(prizes);
    }
});

// --- Admin Logic ---
function initAdmin(prizes) {
    // Simple Authentication
    // Check if already authenticated in session
    if (!sessionStorage.getItem('admin_auth')) {
        const password = prompt("Introduce la contraseña de administrador:");
        if (password !== "lilaos2026") {
            alert("Contraseña incorrecta.");
            window.location.href = "index.html";
            return;
        } else {
            sessionStorage.setItem('admin_auth', 'true');
        }
    }

    const select = document.getElementById('prize-select');
    const qrContainer = document.getElementById('qr-code');
    const generateBtn = document.getElementById('btn-generate');
    const serialSpan = document.getElementById('serial-number');

    if (!select || !qrContainer) return; // Safety check

    // Populate Select
    Object.keys(prizes).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.toUpperCase();
        select.appendChild(option);
    });

    // Add Loser Option
    const loserOption = document.createElement('option');
    loserOption.value = 'none';
    loserOption.textContent = 'PERDEDOR (SIN PREMIO)';
    select.appendChild(loserOption);

    // Initial Generation
    generateCoupon();

    // Event Listener for Button (if exists) or Change
    if (generateBtn) {
        generateBtn.addEventListener('click', generateCoupon);
    }

    // Also generate on change
    select.addEventListener('change', generateCoupon);

    function generateCoupon() {
        const selected = select.value;
        qrContainer.innerHTML = ''; // Clear previous

        // Detect base URL
        const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        const baseUrl = window.location.origin + path + '/index.html';

        const finalUrl = `${baseUrl}?win=${selected}`;

        // Generate QR
        new QRCode(qrContainer, {
            text: finalUrl,
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        // Random Serial
        if (serialSpan) {
            serialSpan.textContent = Math.floor(100000 + Math.random() * 900000);
        }
    }
}

// --- Lottery Logic ---
function initLottery(prizes) {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    let winParam = urlParams.get('win');

    // If win=true, pick a random prize
    if (winParam === 'true') {
        const keys = Object.keys(prizes);
        winParam = keys[Math.floor(Math.random() * keys.length)];
    }

    const prizeContent = prizes[winParam];
    const hasWon = !!prizeContent;

    // Elements
    const resultMessage = document.getElementById('result-message');
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return; // Not on lottery page?

    const ctx = canvas.getContext('2d');
    const container = document.getElementById('scratch-container');

    // Set Result Message
    if (hasWon) {
        resultMessage.innerHTML = prizeContent;
        resultMessage.style.color = '#27ae60'; // Green for win
    } else {
        resultMessage.innerHTML = '<span>No te vas a comer un rosco aqui</span>';
        resultMessage.style.color = '#c0392b'; // Red for lose
    }

    // Canvas Setup
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill Canvas
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texture
    ctx.fillStyle = '#A0A0A0';
    for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
            if (Math.random() > 0.8) ctx.fillRect(i, j, 2, 2);
        }
    }

    // Text & Decoration
    ctx.font = 'bold 24px Roboto';
    ctx.fillStyle = '#444';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASCA AQUÍ', canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Scratch Logic
    let isDrawing = false;
    const totalPixels = canvas.width * canvas.height;

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function scratch(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getMousePos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();
        checkProgress();
    }

    // Event Listeners
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mouseleave', () => { isDrawing = false; });
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', () => { isDrawing = false; });

    let revealed = false;
    function checkProgress() {
        if (revealed) return;
        if (Math.random() > 0.1) return; // throttle

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparent = 0;

        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) transparent++;
        }

        if ((transparent / totalPixels) * 100 > 40) {
            revealAll();
        }
    }

    function revealAll() {
        revealed = true;
        canvas.style.transition = 'opacity 0.5s';
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
            resultMessage.classList.add('win-animate');
            if (hasWon) celebrate();
        }, 500);
    }

    function celebrate() {
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }
}
