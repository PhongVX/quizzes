import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';

import { Path } from './const';
import { Main } from './pages/main';
import { Quiz } from './pages/quiz';

import './styles/main.scss';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={Path.Main} element={<Main />} />
            <Route path={Path.Quiz} element={<Quiz />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
