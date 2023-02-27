// self 代表子线程自身，即子线程的全局对象
self.addEventListener('message', function (e) {
  // e.data表示主线程发送过来的数据
  console.log('子线程worker执行代码');
  self.postMessage('执行完毕'); // 向主线程发送消息
});
