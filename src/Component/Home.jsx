import React from 'react'
import "./Home.css"
import { Link } from 'react-router-dom';
function Home(){
  return (
    
    <div className="home-container">
      <h1 className="home-heading">Welcome to Perisync</h1>
    
    <Link to={"/todo"}>
    

      <button className="home-button">
        Enter Todo App
      </button>
      </Link>
    </div>
  );
};

export default Home;








