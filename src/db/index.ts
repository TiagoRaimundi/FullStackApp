import mongoose from 'mongoose';

const URI = 'mongodb://127.0.0.1:27017/podify';

mongoose.connect(URI).then(() => {
    console.log('db is connected');
}).catch((err) => {
    console.log('db connection failed', err);
});
