import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './pages/CreateRoom';
import Room from './pages/Room';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreateRoom />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </Router>
    );
}

export default App;
