import React from 'react';
import LiveSearch from './components/LiveSearch';
import LiveSearchWithReducers from './components/LiveSearchWithReducers';
import './App.css';

const App = () => {
  return (
    <>
      <div id='mainSection'>
        <h1>
          Manager Search Componenet: Type in Searchbox to get the Manager's
          detail
        </h1>
        <LiveSearch placeholder='Choose Manager' debounceDelay='300' />
        {/* <LiveSearchWithReducers
          placeholder='Choose Manager'
          debounceDelay='300'
        /> */}
      </div>
    </>
  );
};

export default App;
