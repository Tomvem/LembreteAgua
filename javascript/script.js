let totalConsumed = 0;
const dailyGoal = 2000;
let timeLeft = 0;
let endTime = null;
let timerInterval = null;
let cronometroAtivo = false;

function toggleTheme() {
    const body = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        themeBtn.innerText = '🌙';
    } else {
        body.setAttribute('data-theme', 'light');
        themeBtn.innerText = '☀️';
    }
}

// Lógica para Iniciar / Parar
function toggleCronometro() {
    const btn = document.getElementById('btn-cronometro');
    const status = document.getElementById('status-tempo');
    const seletor = document.getElementById('intervalo');

    if (!cronometroAtivo) {

        const minutosSelecionados = parseInt(seletor.value);

        endTime = Date.now() + (minutosSelecionados * 60 * 1000);

        cronometroAtivo = true;

        btn.innerText = "Parar Cronômetro";
        btn.classList.add('ativo');
        status.innerText =
            `Monitorando a cada ${minutosSelecionados} min.`;
        startTimer();
    } else {

        pararCronometro();

    }
}
function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeLeft = Math.max(
            0,
            Math.floor((endTime - Date.now()) / 1000)
        );

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            resetaInterfaceBotao(true);

            triggerAlarm();

        }

    }, 1000);
}

function pararCronometro() {
    clearInterval(timerInterval);
    timeLeft = 0;
    endTime = null;
    updateTimerDisplay();
    resetaInterfaceBotao(false);
}

// Função auxiliar unificada
function resetaInterfaceBotao(tempoEsgotado = false) {
    cronometroAtivo = false;
    const btn = document.getElementById('btn-cronometro');
    const status = document.getElementById('status-tempo');

    if (btn) {
        btn.innerText = "Iniciar Cronômetro";
        btn.classList.remove('ativo');
    }

    if (status) {
        status.innerText = tempoEsgotado ? "Tempo Esgotado!" : "Cronômetro parado.";
    }
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').innerText =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function triggerAlarm() {
    document.getElementById('alarmOverlay')
        .classList.add('active');

    const audio =
        document.getElementById('alarmSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.log(
                'Não foi possível reproduzir o som:',
                err
            );
        });
    }
    if (
        'Notification' in window &&
        Notification.permission === 'granted'
    ) {
        new Notification(
            '💧 Hora de beber água!',
            {
                body:
                    'Seu lembrete de hidratação chegou.',
                icon:
                    'https://cdn-icons-png.flaticon.com/512/728/728093.png'
            }
        );
        if ('vibrate' in navigator) {
            navigator.vibrate([
                500,
                300,
                500,
                300,
                500
            ]);
        }
    }

}
function dismissAlarm() {

    document.getElementById('alarmOverlay')
        .classList.remove('active');

    const minutosSelecionados =
        parseInt(
            document.getElementById('intervalo').value
        );

    endTime =
        Date.now() +
        (minutosSelecionados * 60 * 1000);

    cronometroAtivo = true;

    const status =
        document.getElementById('status-tempo');

    status.innerText =
        `Monitorando a cada ${minutosSelecionados} min.`;

    const btn =
        document.getElementById('btn-cronometro');

    btn.innerText = 'Parar Cronômetro';
    btn.classList.add('ativo');

    startTimer();
}

function addWater(amount) {
    totalConsumed += amount;
    if (totalConsumed > dailyGoal) totalConsumed = dailyGoal;

    document.getElementById('progressDisplay').innerText = `Consumido: ${totalConsumed}ml / Meta: ${dailyGoal}ml`;
    let percentage = (totalConsumed / dailyGoal) * 100;
    document.getElementById('waterLevel').style.height = `${percentage}%`;
}
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});

