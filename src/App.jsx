import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeData } from './data/mockData';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import UserSwitcher from './components/UserSwitcher';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize mock data on app start
    initializeData();
  }, []);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Product Review System</h1>
          <UserSwitcher />
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
