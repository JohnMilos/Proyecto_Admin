import express from "express";
const router = express.Router();

// Define una ruta para las paginas principales
router.get('/oralB', (req, res) => {
    res.send(
        {name: 'Margarita Azucena'
                });
});

export default router;