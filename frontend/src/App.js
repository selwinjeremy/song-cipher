import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:5000/')
      .then((response) => response.text())  // Get the response as text
      .then((data) => setData(data))  // Set the response text into state
      .catch((error) => console.error('Error fetching data:', error));
  }, []);  // Empty dependency array to fetch data only once when the component mounts

  return (
    <div className="App">
      <h1>Backend Response:</h1>
      <p>{data}</p>  {/* Display the "Hello, World!" text from the backend */}
    </div>
  );
}

export default App;