const { redisClient } = require('./db/redis');

const sub = redisClient.duplicate();
sub.on('error', (error) => console.error('Redis Sub Client Error', error));

async function subscribeToChannel() {
    try {
        await sub.subscribe('insert');
        console.log('Subscribed to insert channel');
    } catch (error) {
        console.error('Subscribing to channel Error', error);
    }
}

sub.on('connect', () => {
    console.log('Sub client connected, re-subscribing...');
    subscribeToChannel();
});

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

async function handleMessage(channel, message) {
    try {
        const index = parseInt(message);
        const fibValue = fib(index);
        await redisClient.hset('values', message, fibValue);
        console.log(
            `Calculated fib(${index}) = ${fibValue} and stored in Redis`
        );
    } catch (error) {
        console.error(`Error processing message ${message}:`, error);
    }
}

sub.on('message', handleMessage);

subscribeToChannel();
