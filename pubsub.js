import redis from 'redis';
const redisPort = 6379;

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor ({ blockchain }) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient(redisPort)
            .on('error', err => console.error('ERR:REDIS:', err))
            .on('connect', function () {
                console.log('Redis connected publisher');
            });
        this.subscriber = redis.createClient(redisPort)
            .on('error', err => console.error('ERR:REDIS:', err))
            .on('connect', function () {
                console.log('Redis connected subscriber');
            });
    }

    async init() {
        await this.publisher.connect();
        await this.subscriber.connect();
        await this.subscribeToChannels(); 
    }

    handleMessage(channel, message) {
        if (channel === CHANNELS.BLOCKCHAIN) {
            const parsedMessage = JSON.parse(message);
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels () {
        Object.values(CHANNELS).forEach(async (channel) => 
            await this.subscriber.subscribe(
                channel,
                (message, channel) => this.handleMessage(channel, message),
                false
            ));
    }

    async publishFn({channel, message}) {
        await this.subscriber.unsubscribe(channel);
        await this.publisher.publish(channel, message);
        this.subscriber.subscribe(channel, () => this.handleMessage(channel, message), false);         
    }

    async broadcastChain() {
        this.publishFn({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }
}

export default PubSub;
