import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CoinPage from './components/CoinPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  App: {
    minHeight: '100vh',
    backgroundColor: '#14161a',
    color: 'white'
  }
}))

function App() {

  const classes = useStyles();

  return (
    <BrowserRouter>
    <div className={classes.App}>
      <Header />
    
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/coin/:id' element={<CoinPage />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
