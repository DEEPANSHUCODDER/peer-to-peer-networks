import React, { useState, useEffect } from 'react';
import SessionCard from './SessionCard';
import { getDatabase, ref, onValue } from "firebase/database";
import './AllSession.css';
import { initializeApp } from "firebase/app";
import NavBar from './NavBar';
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "hacks-df68f.firebaseapp.com",
  projectId: "hacks-df68f",
  storageBucket: "hacks-df68f.appspot.com",
  messagingSenderId: "361173421570",
  appId: "1:361173421570:web:79e4391a42d4564c8f211b",
  measurementId: "G-24BW9CM14D"
};

const AllSession = () => {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const sessionsRef = ref(db, 'session');

    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessionArray = Object.values(data);
        setSessions(sessionArray);
      }
    });
  }, []);

  // Handle search box activation and query clearing
  const handleSearchClick = () => {
    if (isActive) {
      // If search is active, clear the search
      setSearchQuery('');
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const handleCloseClick = () => {
    setIsActive(false);
    setSearchQuery('');
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session =>
    session.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <h2 className="all-session-heading">All Sessions</h2>

      <div className="search">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-box"
          placeholder="Search..."
          
        />
        <button className="search-btn" onClick={handleSearchClick}>
          <FaSearch />
        </button>

        {isActive && (
          <button className="close-btn" onClick={handleCloseClick}>
            <RxCross2 />
          </button>
        )}
      </div>
      </div>q

      {/* Display session cards */}
      <div className="session-card-container">
        {sessions.map((session, index) => {
          const isMatch = session.title?.toLowerCase().includes(searchQuery.toLowerCase());
          return (
            <div
              key={index}
              className={`session-card ${isMatch ? 'show' : 'hide'}`} // Only show matching sessions
            >
              <SessionCard session={session} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllSession;
