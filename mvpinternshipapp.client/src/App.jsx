import './App.css';
import Navbar from './components/Navbar';

function App() {

    return (
        <div>
            <Navbar/>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
        </div>
    );
}

export default App;