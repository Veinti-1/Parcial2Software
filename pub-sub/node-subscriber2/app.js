//
// Copyright 2021 The Dapr Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

const express = require('express');
const lzbase62 = require('lzbase62');
const bodyParser = require('body-parser');

const app = express();
// Dapr publishes messages with the application/cloudevents+json content-type
app.use(bodyParser.json({ type: 'application/*+json' }));

const port = 3001;

app.get('/dapr/publish', (_req, res) => {
    res.json([
        {
            pubsubname: "pubsub",
            topic: "Resultado",
            route: "Resultado"
        }
    ]);
});

app.post('/Evaluar', (req, res) => {
    console.log("Evaluando: ", req.body.data.message);
    var x = req.body.data.message;
    if (x.contains("Ingeniero")) {
        res.sendStatus(403);
    } 
    res.sendStatus(200);
});

app.post('/Resultado', (req, res) => {
    const response = app.post('/Evaluar', { data: { message: req.body.data.message } });
    if (response.status === 200) {
        console.log("Comprimir: ", lzbase62.compress(req.body.data.message));
    }else{
        console.log("Se rechazo la solicitud por escribir un token prohibido");
    }
    res.sendStatus(200);
});


app.listen(port, () => console.log(`Node App listening on port ${port}!`));
