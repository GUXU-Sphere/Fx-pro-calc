document.addEventListener('DOMContentLoaded', () => {
    // 1. CONSTANTES
    // Para pares como GBPUSD, 1 Lote Estándar mueve aprox $10 por pip.
    const VALOR_PIP = 10; 

    // 2. SELECCIÓN DE ELEMENTOS DEL DOM (Tus inputs y salidas)
    const inputs = {
        cap1: document.getElementById('cap1'),
        cap2: document.getElementById('cap2'),
        risk: document.getElementById('risk'),
        sl: document.getElementById('sl-input')
    };

    const btnCalcular = document.getElementById('btn-calcular');

    const outputs = {
        lot1: document.getElementById('res-lot-1'),
        risk1: document.getElementById('res-amount-1'),
        lot2: document.getElementById('res-lot-2'),
        risk2: document.getElementById('res-amount-2')
    };

    const labels = {
        acc1: document.getElementById('label-acc-1'),
        acc2: document.getElementById('label-acc-2')
    };

    // 3. FUNCIÓN DE FORMATO DE DINERO (Para que se vea bonito: $250.00)
    const formatoDinero = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    // 4. LÓGICA DE CÁLCULO
    function calcularRiesgo() {
        // Obtenemos los valores numéricos de los inputs
        const capital1 = parseFloat(inputs.cap1.value) || 0;
        const capital2 = parseFloat(inputs.cap2.value) || 0;
        const porcentajeRiesgo = parseFloat(inputs.risk.value) || 0;
        const stopLoss = parseFloat(inputs.sl.value) || 0;

        // Validación básica: Evitar dividir por cero si el SL está vacío
        if (stopLoss === 0) {
            alert("El Stop Loss no puede ser 0");
            return;
        }

        // --- CÁLCULOS MATEMÁTICOS ---
        
        // Fórmula: Monto en Riesgo = Capital * (Porcentaje / 100)
        const riesgoMonetario1 = capital1 * (porcentajeRiesgo / 100);
        const riesgoMonetario2 = capital2 * (porcentajeRiesgo / 100);

        // Fórmula: Lotaje = Riesgo Monetario / (Stop Loss * Valor del Pip)
        const lotaje1 = riesgoMonetario1 / (stopLoss * VALOR_PIP);
        const lotaje2 = riesgoMonetario2 / (stopLoss * VALOR_PIP);

        // --- ACTUALIZACIÓN DE LA INTERFAZ ---

        // Cuenta 1
        outputs.lot1.textContent = lotaje1.toFixed(2); // Redondeamos a 2 decimales
        outputs.risk1.textContent = `${formatoDinero.format(riesgoMonetario1)} Risk`;

        // Cuenta 2
        outputs.lot2.textContent = lotaje2.toFixed(2);
        outputs.risk2.textContent = `${formatoDinero.format(riesgoMonetario2)} Risk`;

        // Actualizar los títulos con los pips confirmados
        labels.acc1.textContent = `Lotaje de Cuenta 1 para ${stopLoss} pips`
        labels.acc2.textContent = `Lotaje de Cuenta 2 para ${stopLoss} pips`
        
    }

    // 5. EVENT LISTENERS (Escuchar el clic)
    btnCalcular.addEventListener('click', calcularRiesgo);

    // Opcional: Calcular también si presionan "Enter" en el input de SL
    inputs.sl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calcularRiesgo();
    });

    // --- 6. FUNCIONALIDAD DE COPIAR AL PORTAPAPELES ---
    
    // Seleccionamos todos los botones de copiar
    const botonesCopiar = document.querySelectorAll('.btn-copy');

    botonesCopiar.forEach(boton => {
        boton.addEventListener('click', () => {
            // 1. Identificar qué texto copiar
            const targetId = boton.getAttribute('data-target');
            const textoACopiar = document.getElementById(targetId).textContent;

            // 2. Copiar al portapapeles (API moderna)
            navigator.clipboard.writeText(textoACopiar).then(() => {
                
                // 3. Feedback visual (Cambiar color o ícono temporalmente)
                const iconoOriginal = boton.innerHTML;
                
                // Agregamos clase para ponerlo verde y cambiamos ícono a un "Check"
                boton.classList.add('copied');
                boton.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                // 4. Regresar al estado original después de 2 segundos
                setTimeout(() => {
                    boton.classList.remove('copied');
                    boton.innerHTML = iconoOriginal;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
            });
        });
    });
});