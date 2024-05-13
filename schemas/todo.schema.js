import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true, // value 필드는 필수 요소
  },
  order: {
    type: Number,
    required: true, // order 필드는 필수 요소
  },
  doneAt: {
    type: Date, // doneAt 필드는 Date 타입
    required: false,
  },
});

// FrontEnd Serving을 위한 코드
TodoSchema.virtual('todoId').get(function () {
  return this._id.toHexString();
});
TodoSchema.set('toJSON', {
  virtuals: true,
});

// TodoSchema를 바탕으로 Todo 모델 생성
export default mongoose.model('Todo', TodoSchema);
