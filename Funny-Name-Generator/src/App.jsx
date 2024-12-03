import React, { useState } from 'react';
import NameGenerator from './components/NameGenerator';
import './App.css';

const App = () => {
    const [teamNames, setTeamNames] = useState([]); // State for generated names

    return (
        <div className="App">
            <NameGenerator setTeamNames={setTeamNames} teamNames={teamNames} />
        </div>
    );
};

export default App;