import React, { useState, useEffect } from "react";
import toml from "@iarna/toml";
import dataTomlPath from "./all_dependencies.toml";
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function TomlReader() {
  const [data, setData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    document.title = "Soldeer - minimal solidity dependency manager";
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(dataTomlPath);
        const text = await response.text();
        const parsedData = toml.parse(text);

        // Extract the keys, sort them, then reconstruct the sorted data
        const sortedKeys = Object.keys(parsedData["sdependencies"]).sort((a, b) => {
          // Split the keys by "~" to get the prefix and version
          const [aPrefix, aVersion] = a.split("~");
          const [bPrefix, bVersion] = b.split("~");

          // Group by prefix first
          if (aPrefix > bPrefix) return -1;
          if (aPrefix < bPrefix) return 1;

          // If prefixes are the same, sort by version in descending order
          if (aVersion > bVersion) return -1;
          if (aVersion < bVersion) return 1;

          return 0; // Equal
        });

        const sortedData = {};
        for (const key of sortedKeys) {
          sortedData[key] = parsedData["sdependencies"][key];
        }

        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching TOML data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(data);
      return;
    }

    const newFilteredData = Object.keys(data).reduce((acc, key) => {
      if (key.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
    setFilteredData(newFilteredData);
  }, [searchQuery, data]);

  const [showAlert, setShowAlert] = useState(false);

  // Function to handle the copy action
  const handleCopy = (dependencyName) => {
    copy(`soldeer install ${dependencyName}`);
    // You can also add some feedback here, e.g., displaying a tooltip or changing the icon
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-8">
      {/* Helmet for document head */}

      {/* Logo Image */}
      <div className="mb-2">
        <img src="https://github.com/mario-eth/soldeer/raw/main/soldeer.jpeg" alt="Logo" className="mx-auto w-1/2" />
      </div>

      {/* Big Title */}
      <h1 className="text-4xl font-bold mb-4">Soldeer - minimal solidity dependency manager</h1>
      {/* Code Block */}
      <div className="w-4/5 md:w-3/4 lg:w-1/2 mb-4 bg-gray-800 p-4 rounded">
        <code className="text-white">
          <p>
            To install Soldeer you must install cargo first{" "}
            <a
              href="https://doc.rust-lang.org/cargo/getting-started/installation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              read here
            </a>
            .
          </p>
          <div className="px-2 py-1 rounded mt-2"></div>
          <div className="py-1 rounded mt-2">
            Then you can just{" "}
            <div className="bg-gray-700 px-2 py-1 rounded mt-2">
              {" "}
              {/* Darker background for this part */}
              cargo install soldeer
            </div>
          </div>
          <div className="px-2 py-1 rounded mt-2"></div>
          To install a dependency use{" "}
          <div className="bg-gray-700 px-2 py-1 rounded mt-2">
            {" "}
            {/* Darker background for this part */}
            soldeer install &lt;dependency_name&gt;~&lt;dependency_version&gt;
          </div>
          <div className="px-2 py-1 rounded mt-2"></div>
          Example
          <div className="bg-gray-700 px-2 py-1 rounded mt-2">
            {" "}
            {/* Darker background for this part */}
            soldeer install @openzeppelin-contracts~5.0.0
          </div>
          <div className="mt-2">
            More details{" "}
            <a
              href="https://github.com/mario-eth/soldeer#how-to-install-it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              read here
            </a>
            .
          </div>
          <p>
            Built with Rust. Current version: <span className="font-bold">0.1.5</span>
          </p>
          <p>
            Present on{" "}
            <a
              href="https://crates.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              <a
                href="https://crates.io/crates/soldeer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400"
              >
                crates.io
              </a>
            </a>
          </p>
        </code>
      </div>

      {/* Search Bar */}
      <div className="w-4/5 md:w-3/4 lg:w-1/2 mb-4">
        <input
          type="text"
          placeholder="Search dependency..."
          className="w-full p-4 text-lg rounded bg-gray-800 text-white placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Alert */}
      {showAlert && <div className="fixed top-4 right-4 bg-green-500 p-2 rounded" style={{ backgroundColor: '#1f2937' }}>Copied to clipboard!</div>}
      {/* Table */}
      <table
        className="min-w-full border-collapse border border-slate-500 rounded"
        style={{ backgroundColor: "#1e293b" }}
      >
        <thead>
          <tr>
            <th className="border border-slate-600 px-6 py-4" style={{ backgroundColor: "#334156" }}>
              Dependency
            </th>
            <th className="border border-slate-600 px-6 py-4" style={{ backgroundColor: "#334156" }}>
              Zip Link
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(filteredData).map(([key, value]) => (
            <tr key={key}>
              <td className="border border-slate-700 px-6 py-4">
                <div className="group ml-2 relative">
                  <button onClick={() => handleCopy(key)}>
                    <FontAwesomeIcon icon={faClipboard} /> {key}
                  </button>
                  <span className="absolute left-0 bottom-full mb-2 px-2 py-1 text-xs bg-gray-800 rounded invisible group-hover:visible">
                    Copy to clipboard
                  </span>
                </div>
              </td>
              <td className="border border-slate-700 px-6 py-4">
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
                  {value}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TomlReader;
