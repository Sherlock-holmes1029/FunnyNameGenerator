import React from 'react';

const GeneratedNames = ({ teamNames }) => {
    return (
        <div>
            <h2>Your Funny Team Names:</h2>
            <ul>
                {teamNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </div>
    );
};

export default GeneratedNames;
