const express = require('express');
const cors = require ('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const productosYServicios = [
        { 
        id: "01", 
        nombre: "Maquillaje de novia", 
        descripcion: "Maquillaje especializado para novias.", 
        precio: "$ 450.000",
        tiempo: "2,5 - 3 horas"
    },
    { 
        id: "02", 
        nombre: "Maquillaje social", 
        descripcion: "Maquillaje para eventos y ocasiones especiales.", 
        precio: "$ 200.000",
        tiempo: "2 horas"
    },
    { 
        id: "03", 
        nombre: "Ondas", 
        descripcion: "Peinado con ondas para complementar tu look.", 
        precio: "$ 50.000",
        tiempo: "30 - 50 minutos"
    },
    { 
        id: "04", 
        nombre: "Alisado", 
        descripcion: "Servicio de alisado para un acabado elegante.", 
        precio: "$ 50.000",
        tiempo: "30 - 50 minutos"
    }
];
app.get('/', (req, res) => {
    res.send('¡API de Guía de Maquillaje funcionando correctamente!');
});

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});