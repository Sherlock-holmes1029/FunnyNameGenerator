import React, { useState, useEffect } from "react";
import { languageData } from "../languageData";
import like from "../assets/like.svg";

const NameGenerator = ({ setTeamNames, teamNames }) => {
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");
  const [randomMode, setRandomMode] = useState(false);
  const [likedNames, setLikedNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const currentData = languageData[language];
  const ui = currentData.ui;

  const isValidJson = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed); // Ensure it's an array
    } catch {
      return false;
    }
  };

  // Load liked names from localStorage on mount
  useEffect(() => {
    const storedLikedNames = localStorage.getItem("likedNames");
    if (storedLikedNames && isValidJson(storedLikedNames)) {
      setLikedNames(JSON.parse(storedLikedNames));
    }
  }, []);

  // Save liked names to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("likedNames", JSON.stringify(likedNames));
    } catch (error) {
      console.error("Failed to save liked names to localStorage:", error);
    }
  }, [likedNames]);

  // Update suggestions based on input
  useEffect(() => {
    if (keyword) {
      const allWords = [...currentData.nouns, ...(currentData.names || [])];
      const filteredSuggestions = allWords.filter((word) =>
        word.toLowerCase().startsWith(keyword.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [keyword, language]);

  const validateInput = () => {
    if (randomMode) return true; // Skip validation for random mode

    if (language === "en" && /[^\x00-\x7F]/.test(keyword)) {
      setError(ui.errorEnglish);
      return false;
    } else if (language === "ar" && !/^[\u0600-\u06FF\s]+$/.test(keyword)) {
      setError(ui.errorArabic);
      return false;
    }
    setError("");
    return true;
  };

  const generateNames = () => {
    if (!randomMode && !keyword.trim()) {
      setError(ui.errorEnglish);
      return;
    }

    if (!validateInput()) return;

    const generatedNames = Array.from({ length: 5 }, () => {
      if (language === "en") {
        const randomPrefix =
          currentData.prefixes[
            Math.floor(Math.random() * currentData.prefixes.length)
          ];
        const randomAdjective =
          currentData.adjectives[
            Math.floor(Math.random() * currentData.adjectives.length)
          ];
        const randomNoun =
          currentData.nouns[
            Math.floor(Math.random() * currentData.nouns.length)
          ];
        const randomSuffix =
          currentData.suffixes[
            Math.floor(Math.random() * currentData.suffixes.length)
          ];
        const randomKeyword = randomMode
          ? currentData.nouns[
              Math.floor(Math.random() * currentData.nouns.length)
            ]
          : keyword;

        return `${randomPrefix}-${randomAdjective} ${randomKeyword}${randomSuffix}`;
      } else if (language === "ar") {
        const randomPrefix =
          currentData.prefixes[
            Math.floor(Math.random() * currentData.prefixes.length)
          ];
        const randomNoun =
          currentData.nouns[
            Math.floor(Math.random() * currentData.nouns.length)
          ];
        const randomSuffix =
          currentData.suffixes[
            Math.floor(Math.random() * currentData.suffixes.length)
          ];
        const randomKeyword = randomMode
          ? currentData.names[
              Math.floor(Math.random() * currentData.names.length)
            ]
          : keyword;

        return `${randomKeyword}${randomSuffix} ${randomNoun} ${randomPrefix}`;
      }
    });

    setTeamNames(generatedNames); // Update the parent state with new names
  };

  const likeName = (name) => {
    if (!likedNames.includes(name)) {
      setLikedNames([...likedNames, name]); // Update liked names
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion); // Set the clicked suggestion as the input value
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <h1>{ui.title}</h1>
      <div>
        <label htmlFor="language">{ui.chooseLanguage}</label>
        <select id="language" onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={ui.enterKeyword}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={randomMode}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              listStyle: "none",
              padding: "0.5em",
              margin: 0,
              width: "100%",
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                style={{ cursor: "pointer", padding: "0.25em" }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <p>
          <input
            type="checkbox"
            id="randomMode"
            checked={randomMode}
            onChange={(e) => setRandomMode(e.target.checked)}
          />
          <label htmlFor="randomMode">{ui.randomCheckbox}</label>
        </p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={generateNames}>{ui.generateButton}</button>
      <div className="center-columns">
        <h2>{ui.generatedNames}</h2>
        <ul>
          {teamNames.map((name, index) => (
            <li key={index}>
              {name}
              <button onClick={() => likeName(name)}>
                <i class="fa-solid fa-heart"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="center-columns center-li">
        <h2>{ui.likedNames}</h2>
        <ul>
          {likedNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NameGenerator;
