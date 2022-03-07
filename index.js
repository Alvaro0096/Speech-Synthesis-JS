//BUTTONS
const start_btn = document.getElementById('start_btn');
const pause_btn = document.getElementById('pause_btn');
const stop_btn = document.getElementById('stop_btn');
const cancel_btn = document.getElementById('cancel_btn');

let texto_input = document.getElementById('text_input');
let selector_voz = document.getElementById('selector');

var synth = window.speechSynthesis;
var voz = [];

//LISTA DE IDIOMAS
function vozOpciones(){
    voz = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
    var indexActual = selector_voz.indexActual < 0 ? 0 : selector_voz.indexActual;
    selector_voz.innerHTML = '';
    for (let i = 0; i < voz.length; i++) {
        var opcion = document.createElement('option');
        opcion.textContent = voz[i].name + '('+ voz[i].lang +')';

        if (voz[i].default) {
            opcion.textContent += ' - DEFAULT';
        }

        opcion.setAttribute('data-lang', voz[i].lang);
        opcion.setAttribute('data-name', voz[i].name);
        selector_voz.appendChild(opcion);
    }
    selector_voz.indexActual = indexActual;
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = vozOpciones;
    }
}
vozOpciones();

//FUNCIONES
function hablar(){
    if (speechSynthesis.pause && speechSynthesis.speaking) {
        return speechSynthesis.resume();
    }
    const pronunciar = new SpeechSynthesisUtterance(texto_input.value);
    texto_input.disabled = true;
    var vozElegida = selector_voz.selectedOptions[0].getAttribute('data-name');
    for (i = 0; i < voz.length; i++) {
        if (voz[i].name === vozElegida) {
            pronunciar.voice = voz[i];
            break;
        }
    } 
    pronunciar.addEventListener('end', () => {
        texto_input.disabled = false;
    });
    speechSynthesis.speak(pronunciar);
}

function pausa(){
    if (speechSynthesis.speaking) {
        speechSynthesis.pause();
    }
}

function detener(){
    speechSynthesis.resume();
    speechSynthesis.cancel();
}

//EVENT LISTENER BUTTONS
start_btn.addEventListener('click', () => {
    hablar(texto_input.value);
});

pause_btn.addEventListener('click', () => {
    pausa();
});

stop_btn.addEventListener('click', () => {
    detener();
});

cancel_btn.addEventListener('click', () => {
    detener();
    texto_input.value = '';
});
