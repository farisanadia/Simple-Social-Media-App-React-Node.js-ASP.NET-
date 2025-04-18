// Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";



export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigateMain = () => {
    navigate('/');
  }

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const navProfile = () => {
    navigate('/profile');
  }

  const logout = () => {
    localStorage.clear();
    setUser({});
  };

  const deleteAccount = () => {
    fetch("/api/users/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    })
      .then(() => {
        localStorage.clear();
        setUser({});
      })
      .catch((err) => console.error("Error deleting account:", err));
  };

  return (
    <header>
      <nav>
        <div onClick={navigateMain} style={{ cursor: "pointer" }} className='safari-header'>
          SAFARI
        </div>
        {/* dropdown */}
        {user && user.username && (
          <div>
            <div
              onClick={toggleDropdown}
              style={{
                cursor: "pointer",
                padding: "0.5rem",
                color: "#fff",
                fontSize: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                lineHeight: "1.5",
                borderRadius: "5px",
              }}
            >
              <span style={{ fontWeight: "400" }}>Hi, {user.username}</span>
              <FaRegUserCircle style={{ padding: "0rem 0rem 0rem 0.5rem", fontSize: "1.5rem" }}/>
              {dropdownOpen ?  <FaAngleUp /> : <FaAngleDown />}
            </div>

            {dropdownOpen && (
              <div className='dropdown'>
                <button
                  onClick={navProfile}
                  style={{ margin: "0.5rem 0rem 0.5rem 0rem" }}
                  className='dropdown-button'
                >
                  View Profile
                </button>
                <button
                  onClick={navigateMain}
                  style={{ margin: "0.5rem 0rem 0.5rem 0rem" }}
                  className='dropdown-button'
                >
                  Home
                </button>
                <button
                  onClick={logout}
                  style={{ margin: "0rem 0rem 0.5rem 0rem" }}
                  className='dropdown-button'
                >
                  Log Out
                </button>
                <button
                  onClick={deleteAccount}
                  className='dropdown-button'
                  style={{ color: "red", marginBottom: "0.5rem" }}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
