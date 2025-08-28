import express from 'express';
const app = express();
const port = process.env.PORT || 3001;
import rutaDentrificos from './Dentistas/dentistas.js'


app.use('/dentistas/dentrificos', rutaDentrificos);



// Define a route for the home page
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});