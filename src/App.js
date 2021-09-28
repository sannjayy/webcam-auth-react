import './App.css';
import Home from './components/Home/Home'
import Footer from './components/Footer'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
function App() {
  return (
    <div className="App">
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
