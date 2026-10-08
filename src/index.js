require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require("./routes");
const db = require("./models");

const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());

app.use('/api', routes);


async function startServer() {
    try {
        await db.sequelize.authenticate();
        console.log("connect to mySql via sequelize");

        await db.sequelize.sync();

        app.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error('Database connection error:', error);
    }
}


startServer();