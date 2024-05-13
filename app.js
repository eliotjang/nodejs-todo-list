import express from 'express';
import connect from './schemas/index.js';
import todosRouter from './routes/todos.router.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정
// body parser 구현
app.use(express.json());
// content-type이 form인 경우에 body data를 가져올 수 있도록 구현
app.use(express.urlencoded({ extended: true }));

// static Middleware, express.static()을 사용하여 정적 파일 제공
app.use(express.static('./assets'));

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

// 전역 미들웨어로 구현
app.use('/api', [router, todosRouter]);

// 에러 처리 미들웨어 구현
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
