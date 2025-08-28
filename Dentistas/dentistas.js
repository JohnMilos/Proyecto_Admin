import express from "express";
const router = express.Router();

// Define a route for the home page
router.get('/colgate', (req, res) => {
    res.send('Pancho pericles');
});

router.get('/oralB', (req, res) => {
    res.send('Margarita Azucena');
});

export default router;