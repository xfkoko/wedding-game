const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
app.use(express.static(__dirname));

function updateTopList(body, obj) {
    if (obj.top10.length < 10) {
        obj.top10.push(body);
    } else {
        var lowest = obj.top10[0];
        for (var i in obj.top10) {
            data = obj.top10[i];
            if (data.score < lowest.score) {
                lowest.name = data.name;
                lowest.score = data.score;
            }
        }
        console.log("LOWEST ATM:", lowest);
        if (lowest.score <= body.score) {
            const index = obj.top10.findIndex((i) => i.score === lowest.score && i.name === lowest.name);
            obj.top10.splice(index, 1);
            obj.top10.push(body);
        }
    }
}

async function getTopListInOrder() {
    const data = await fs.readFile("scores.json", "utf-8");
    var json = JSON.parse(data).top10;
    json.sort((a, b) => (a.score < b.score) ? 1 : -1);
    return json;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/top10', async (req, res) => {
    var topList = await getTopListInOrder();
    res.json({"top10": topList});
});

app.post('/newscore', async (req, res) => {
    const body = req.body;
    console.log("body to be added:", body);
    const data = await fs.readFile("scores.json", "utf-8");
    let obj = JSON.parse(data);
    obj.scores.push(body);
    updateTopList(body, obj);
    await fs.writeFile("scores.json", JSON.stringify(obj, null, 4));
    res.status(200);
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});