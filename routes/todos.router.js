import express from 'express';
import Todo from '../schemas/todo.schema.js';
import joi from 'joi';

const router = express.Router();

const createTodoSchema = joi.object({
  value: joi.string().min(1).max(50).required(),
});

router.post('/todos', async (req, res, next) => {
  try {
    // 클라에게 전달받은 데이터 검증
    const validation = await createTodoSchema.validateAsync(req.body);

    // 클라에게 전달받은 value 데이터를 변수에 저장
    const { value } = validation;

    // Todo 모델로 MongoDB에서 'order' 값이 가장 높은 '해야할 일' 찾기
    // findOne = 1개의 데이터 조회
    // sort = 정렬 -> order 필드를 내림차순으로
    const todoMaxOrder = await Todo.findOne().sort('-order').exec();

    // 'order' 값이 가장 높은 document의 1을 추가하거나, 없다면 1 할당
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    // 해야할 일 등록
    const todo = new Todo({ value, order });
    // 생성한 '해야할 일'을 MongoDB에 저장
    await todo.save();

    // 해야할 일을 클라에게 반환
    return res.status(201).json({ todo });
  } catch (error) {
    next(error);
  }
});

/** 해야할 일 목록 조회 API **/
router.get('/todos', async (req, res, next) => {
  // Todo 모델로 MongoDB에서 'order'값이 가장 높은 '해야할 일' 찾기
  // find = 여러개의 데이터 조회 (배열)
  const todos = await Todo.find().sort('-order').exec();

  return res.status(200).json({ todos: todos });
});

/** 해야할 일 순서 변경, 완료/해제, 내용 변경 API **/
router.patch('/todos/:todoId', async (req, res) => {
  // 변경할 해야할 일의 ID 값 가져오기
  const { todoId } = req.params;
  // 해야할 일을 몇번째 순서로 설정할 지 order 값 가져오기
  const { order, done, value } = req.body;

  // 현재 나의 order가 무엇인지
  // 변경하려는 해야할 일 가져오기. 만약, 해당 ID값을 가진 해야할 일이 없다면 에러 발생
  const currentTodo = await Todo.findById(todoId).exec();
  if (!currentTodo) {
    return res
      .status(404)
      .json({ errorMeassage: '존재하지 않는 todo 데이터입니다.' });
  }

  if (order) {
    // 변경하려는 order 값을 가지고 있는 해야할 일 찾기
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      // 이미 order 값을 가진 해야할 일 이 있다면, 해당 해야할 일의 order값을 변경하고 저장
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }
    // 변경하려는 '해야할 일'의 order 값을 변경
    currentTodo.order = order;
  }

  if (done !== undefined) {
    // 변경하려는 해야할 일의 doneAt 값 변경
    currentTodo.doneAt = done ? new Date() : null;
  }

  if (value) {
    currentTodo.value = value;
  }

  // 변경된 해야할 일을 저장
  await currentTodo.save();

  return res.status(200).json({});
});

/** 할일 삭제 API **/
router.delete('/todos/:todoId', async (req, res, next) => {
  // 삭제할 해야할 일 ID 가져오기
  const { todoId } = req.params;

  // 삭제하려는 해야할 일 가져오기. 없다면 에러 발생
  const todo = await Todo.findById(todoId).exec();
  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 todo 데이터입니다.' });
  }

  // 조회된 해야할 일 삭제
  await Todo.deleteOne({ _id: todoId }).exec();

  return res.status(200).json({});
});

export default router;
