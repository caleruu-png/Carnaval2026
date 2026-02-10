document.addEventListener('DOMContentLoaded', () => {
    // Check URL parameter: ?win=1 to ?win=8
    const urlParams = new URLSearchParams(window.location.search);
    const winParam = urlParams.get('win');

    // Define Prizes
    const prizes = {
        'calero': '<span>@marcooo.calerooo</span><span style="font-size:0.8em">🎉 PREMIO 1 🎉</span>',
        'lupe': '<span>@lupeemendez_</span><span style="font-size:0.8em">🎉 PREMIO 2 🎉</span>',
        'coca': '<span>@daniisanche_</span><span style="font-size:0.8em">🎉 PREMIO 3 🎉</span>',
        'daniela': '<span>@danielaruiiiz_</span><span style="font-size:0.8em">🎉 PREMIO 4 🎉</span>',
        'javi': '<span>@_javieerromeroo_</span><span style="font-size:0.8em">🎉 PREMIO 5 🎉</span>',
        'guille': '<span>@guillee.ds_</span><span style="font-size:0.8em">🎉 PREMIO 6 🎉</span>',
        'tati': '<span>@juanpachecoo_05</span><span style="font-size:0.8em">🎉 PREMIO 7 🎉</span>',
    };

    const prizeContent = prizes[winParam];
    const hasWon = !!prizeContent;

    // Elements
    const resultMessage = document.getElementById('result-message');
    const canvas = document.getElementById('scratch-canvas');
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
    // We need to set the internal resolution to match the display size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill Canvas with "Scratch Material"
    ctx.fillStyle = '#C0C0C0'; // Standard latex silver
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern to make it look realistic
    ctx.fillStyle = '#A0A0A0';
    for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
            if (Math.random() > 0.8) ctx.fillRect(i, j, 2, 2);
        }
    }

    // Add text to the scratch layer
    ctx.font = 'bold 24px Roboto';
    ctx.fillStyle = '#444';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASCA AQUÍ', canvas.width / 2, canvas.height / 2);

    // Add ONCE stylized "O" or similar decoration if possible, or just keeping it simple
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Scratch Logic
    let isDrawing = false;
    let scratchedPixels = 0;
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

        e.preventDefault(); // Prevent scrolling on touch
        const pos = getMousePos(e);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Check progress periodically (debounce could be better but this is simple)
        checkProgress();
    }

    // Event Listeners
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mouseleave', () => { isDrawing = false; }); // Stop if leaves canvas

    // Touch support
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', () => { isDrawing = false; });

    let revealed = false;

    function checkProgress() {
        if (revealed) return;

        // Get pixel data to see how much is transparent
        // Optimization: Don't check every single time, or check a smaller area? 
        // For a small canvas (300x150), getImageData is okay-ish.
        // To be safer/faster, we can just count calls or estimate. 
        // But let's try the accurate way first.

        // We throttle this check to avoid lag
        if (Math.random() > 0.1) return; // check 10% of the time while scratching

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparent = 0;

        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) {
                transparent++;
            }
        }

        const percentage = (transparent / totalPixels) * 100;

        if (percentage > 40) { // If 40% cleared, reveal all
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
            if (hasWon) {
                celebrate();
            }
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

            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});
