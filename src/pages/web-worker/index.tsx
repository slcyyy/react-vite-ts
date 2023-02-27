//单页面应用使用如下方式引入
const worker = new Worker(new URL('./worker.js', import.meta.url));

worker.onmessage = (e) => {
  console.log('主线程收到worker线程消息：', e.data);
};

const WebWorker = () => {
  const startWorker = () => {
    worker.postMessage('子worker启动');
  };
  return (
    <div>
      <button onClick={startWorker}>点击触发worker</button>
    </div>
  );
};
export default WebWorker;
