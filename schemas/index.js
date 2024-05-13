import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://sparta-user:aaaa4321@express-mongo.cvttvpl.mongodb.net/?retryWrites=true&w=majority&appName=express-mongo',
      {
        dbName: 'todo_memo',
      },
    )
    .then(() => console.log('MongoDB 연결에 성공!'))
    .catch((err) => console.log('MongoDB 연결에 실패. ${err}'));
};

mongoose.connection.on('errer', (err) => {
  console.error('MongoDB 연결 어레', err);
});

export default connect;
