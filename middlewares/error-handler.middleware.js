export default function (err, req, res, next) {
  console.error(err);

  // Joi 검증에서 에러 발생 시, 클라에게 에러 메시지 전달
  if (err.name === 'ValidationError') {
    return res.status(400).json({ errorMessage: err.message });
  }

  // 그 외 에러 발생 시, 서버 에러로 처리
  return res.status(500).json({ errorMessage: '서버에서 에러 발생' });
}
