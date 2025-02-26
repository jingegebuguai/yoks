import React from 'react';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import { reduxStore } from './store/reduxStore';
import BenchmarkRunner from './runner';

const App: React.FC = () => {
  return (
    <Provider store={reduxStore}>
      <RecoilRoot>
        <div className="App">
          <BenchmarkRunner />
        </div>
      </RecoilRoot>
    </Provider>
  );
};

export default App;
