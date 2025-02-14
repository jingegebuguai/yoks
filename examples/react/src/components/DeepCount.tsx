import React from 'react';
import { useStore } from '@yoks/react';
import { countStore } from '../store/deep';

const DeepState: React.FC = () => {
  // 使用 useStore 订阅深层状态
  const deepState = useStore(countStore);

  return (
    <div className="deep-state">
      <h2>Deep Store Example</h2>

      <div>
        <p>Current Count: {deepState.deep.nested.obj.count}</p>
        <p>Array Values: {deepState.deep.nested.arr.join(', ')}</p>
      </div>

      <div className="button-group">
        <button onClick={() => countStore.actions.increaseDeepCount()}>
          Increase Count
        </button>

        <button onClick={() => countStore.actions.increaseDeepCountByImmer()}>
          Increase Count By Immer
        </button>

        <button onClick={() => countStore.actions.initDeepCount()}>Init Count</button>
      </div>
    </div>
  );
};

export default DeepState;
