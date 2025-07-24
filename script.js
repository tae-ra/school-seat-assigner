
let total = 0, rows = 0, cols = 0;
let names = [];
let assigned = [];
let assignIndex = 0;

// 단계별 요소
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const totalInput = document.getElementById('total');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const toStep2Btn = document.getElementById('toStep2');
const toStep3Btn = document.getElementById('toStep3');
const backToStep1Btn = document.getElementById('backToStep1');
const backToStep2Btn = document.getElementById('backToStep2');
const namesInputsDiv = document.getElementById('names-inputs');
const assignAllBtn = document.getElementById('assignAll');
const assignOneBtn = document.getElementById('assignOne');
const seatingChartDiv = document.getElementById('seating-chart');

// 1단계 → 2단계
toStep2Btn.onclick = () => {
    total = parseInt(totalInput.value);
    rows = parseInt(rowsInput.value);
    cols = parseInt(colsInput.value);
    if (!total || !rows || !cols) {
        alert('모든 값을 입력하세요.');
        return;
    }
    if (rows * cols < total) {
        alert('좌석 수가 학생 수보다 적으면 안 됩니다.');
        return;
    }
    // 이름 입력창 생성
    namesInputsDiv.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `${i+1}번 학생 이름`;
        namesInputsDiv.appendChild(input);
    }
    step1.style.display = 'none';
    step2.style.display = '';
    step3.style.display = 'none';
    window.scrollTo({top:0, behavior:'smooth'});
};

// 2단계 → 1단계
backToStep1Btn.onclick = () => {
    step1.style.display = '';
    step2.style.display = 'none';
    step3.style.display = 'none';
    window.scrollTo({top:0, behavior:'smooth'});
};

// 2단계 → 3단계
toStep3Btn.onclick = () => {
    names = [];
    assigned = [];
    assignIndex = 0;
    const inputs = namesInputsDiv.querySelectorAll('input');
    for (let i = 0; i < total; i++) {
        let val = inputs[i].value.trim();
        if (!val) val = `${i+1}번`;
        names.push(val);
    }
    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = '';
    seatingChartDiv.innerHTML = '';
    drawChart();
    window.scrollTo({top:0, behavior:'smooth'});
};

// 3단계 → 2단계
backToStep2Btn.onclick = () => {
    step1.style.display = 'none';
    step2.style.display = '';
    step3.style.display = 'none';
    window.scrollTo({top:0, behavior:'smooth'});
};



// 효과음
const drumrollAudio = document.getElementById('drumroll');
const popAudio = document.getElementById('pop');
const fireworkAudio = document.getElementById('firework');
const fireworksCanvas = document.getElementById('fireworks-canvas');

assignAllBtn.onclick = () => {
    // 전체 좌석에 이름 돌아가는 효과
    let tempNames = [...names];
    let interval = 60; // ms
    let rounds = 15; // 반복 횟수 (짧게)
    let count = 0;
    drumrollAudio.currentTime = 0;
    drumrollAudio.play();
    let anim = setInterval(() => {
        shuffleArray(tempNames);
        assigned = [...tempNames];
        drawChart();
        count++;
        if (count >= rounds) {
            clearInterval(anim);
            assigned = [...names];
            shuffleArray(assigned);
            assignIndex = assigned.length;
            drawChart();
            drumrollAudio.pause();
            popAudio.currentTime = 0;
            popAudio.play();
            fireworkAudio.currentTime = 0;
            fireworkAudio.play();
            showFireworks();
        }
    }, interval);
};

// 감탄사 리스트
const exclamations = [
    "야호!", "굿굿!", "최고!", "멋져!", "짱!", "나이스!", "오예!", "브라보!", "예스!", "훌륭해!"
];
let lastBubbleTimeout = null;
assignOneBtn.onclick = () => {
    if (assignIndex >= names.length) {
        alert('모든 자리가 이미 배정되었습니다.');
        return;
    }
    let remaining = names.filter(n => !assigned.includes(n));
    let slot = assignIndex;
    let tempName = '';
    let interval = 80; // ms
    let rounds = 20 + Math.floor(Math.random()*10); // 랜덤 반복
    let count = 0;
    drumrollAudio.currentTime = 0;
    drumrollAudio.play();
    let anim = setInterval(() => {
        tempName = remaining[Math.floor(Math.random() * remaining.length)];
        assigned[slot] = tempName;
        drawChart();
        assigned[slot] = undefined; // 다시 비움
        count++;
        if (count >= rounds) {
            clearInterval(anim);
            let pick = remaining[Math.floor(Math.random() * remaining.length)];
            assigned[slot] = pick;
            assignIndex++;
            // 랜덤 감탄사
            let ex = exclamations[Math.floor(Math.random()*exclamations.length)];
            drawChart(slot, ex);
            drumrollAudio.pause();
            popAudio.currentTime = 0;
            popAudio.play();
            fireworkAudio.currentTime = 0;
            fireworkAudio.play();
            showFireworks();
            // 말풍선 1초 후 사라짐
            if (lastBubbleTimeout) clearTimeout(lastBubbleTimeout);
            lastBubbleTimeout = setTimeout(() => {
                drawChart();
            }, 1000);
        }
    }, interval);
};

function drawChart(bubbleIdx = null, bubbleText = null) {
    seatingChartDiv.innerHTML = '';
    let idx = 0;
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        for (let c = 0; c < cols; c++) {
            // seat-wrapper로 감싸기
            const wrapper = document.createElement('div');
            wrapper.className = 'seat-wrapper';
            wrapper.style.position = 'relative';
            const seatDiv = document.createElement('div');
            seatDiv.className = 'seat';
            if (assigned[idx]) seatDiv.classList.add('assigned');
            seatDiv.innerHTML = `<div class='seat-num'>${idx+1}번</div>`;
            seatDiv.innerHTML += `<div>${assigned[idx] ? assigned[idx] : '-'}</div>`;
            wrapper.appendChild(seatDiv);
            // 말풍선 표시
            if (bubbleIdx !== null && idx === bubbleIdx && bubbleText) {
                const bubble = document.createElement('div');
                bubble.className = 'speech-bubble';
                bubble.innerText = bubbleText;
                wrapper.appendChild(bubble);
            }
            rowDiv.appendChild(wrapper);
            idx++;
            if (idx >= rows * cols) break;
        }
        seatingChartDiv.appendChild(rowDiv);
    }
}

// 폭죽 애니메이션 (간단 버전)
function showFireworks() {
    const canvas = fireworksCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    let particles = [];
    let colors = ['#fbbf24','#f87171','#60a5fa','#34d399','#a78bfa','#f472b6'];
    for (let i = 0; i < 30; i++) {
        let angle = Math.random() * 2 * Math.PI;
        let speed = 3 + Math.random() * 3;
        particles.push({
            x: canvas.width/2,
            y: canvas.height/2,
            vx: Math.cos(angle)*speed,
            vy: Math.sin(angle)*speed,
            color: colors[Math.floor(Math.random()*colors.length)],
            alpha: 1
        });
    }
    let frame = 0;
    function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let p of particles) {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, 2*Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // gravity
            p.alpha -= 0.018;
        }
        frame++;
        if (frame < 60) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            canvas.style.display = 'none';
        }
    }
    animate();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
