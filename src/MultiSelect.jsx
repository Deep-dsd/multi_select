import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Pill from "./Pill";

const MultiSelect = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const inputRef = useRef(null);
  //To avoid duplication in suggestions array
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  useEffect(() => {
    const fetchUser = async () => {
      if (searchTerm.trim()) {
        try {
          const res = await fetch(
            `https://dummyjson.com/users/search?q=${searchTerm}`
          );
          const data = await res.json();
          console.log(data.users);
          setSuggestions(data.users);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUser();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUser([...selectedUser, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const pillHandler = (user) => {
    const updatedUsers = selectedUser.filter(
      (selectedUser) => selectedUser.email !== user.email
    );
    setSelectedUser(updatedUsers);
    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUser.length > 0
    ) {
      const lastUser = selectedUser[selectedUser.length - 1];
      pillHandler(lastUser);
      setSuggestions([]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {selectedUser.map((selectedUser) => {
          return (
            <Pill
              key={selectedUser.email}
              text={`${selectedUser.firstName} ${selectedUser.lastName}`}
              image={selectedUser.image}
              onClick={() => pillHandler(selectedUser)}
            />
          );
        })}
        <div className="input-field">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a User..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <ul className="user-suggestions">
              {suggestions.map((user, index) => {
                return (
                  !selectedUserSet.has(user.email) && (
                    <li key={user.email} onClick={() => handleSelectUser(user)}>
                      <img
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <div>
                        <span className="userName">{`${user.firstName} ${user.lastName}`}</span>
                        <span className="email">{user.email}</span>
                      </div>
                    </li>
                  )
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
