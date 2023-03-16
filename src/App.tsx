import { get, del } from './utils/request';
import './App.css';

function App() {
  const testget = async () => {
    const res = await del('www2.baidu.com', { params: { name: 'luo' } });
    console.log('compelte', res);
    await get('wwww.juejin.com');
    console.log('all complete');
  };

  return (
    <div className="App">
      <button onClick={testget}>count is 0</button>
    </div>
  );
}

export default App;
