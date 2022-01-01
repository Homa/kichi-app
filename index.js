import express from 'express';
import Blockchain from './blockchain';
import PubSub from './pubsub';
import TcpPortUsed from 'tcp-port-used';
import axios from 'axios';

const app = express();
app.use(express.json());

const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});
pubsub.init();

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', async (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });
    await pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

const ROOT_PORT = 3000;
let PORT = 3000;

const syncChains = async () => {
    const response = await axios.get(`http://localhost:${ROOT_PORT}/api/blocks`);
    blockchain.replaceChain(response.data);
};

TcpPortUsed.check(PORT, '127.0.0.1').then((inuse) => {
    if (inuse) PORT += Math.ceil(Math.random() * 1000);    
    
    app.listen(PORT, () => {
        console.log(`listening at localhost:${PORT}`);
        if( PORT !== ROOT_PORT) syncChains();
    });
});
