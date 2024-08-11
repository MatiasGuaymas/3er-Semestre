function enviarDatos() {
    const form = document.getElementById('vehiculoForm');
    const data = {
        id: form.id.value,
        type: form.type.value,
        distance: form.distance.value,
        fuelConsumption: form.fuelConsumption.value
    };

    fetch('http://localhost:3000/insertarVehiculo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Se pudieron Enviar:', data);
        alert('Vehículo agregado con éxito');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al agregar el vehículo');
    });
}