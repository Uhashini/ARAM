import React from "react";
import "./LogicGatesGame.css";

const gates = [
  {
    name: "AND",
    description: "The AND gate outputs 1 only if both inputs are 1.",
    table: [
      { A: 0, B: 0, Output: 0 },
      { A: 0, B: 1, Output: 0 },
      { A: 1, B: 0, Output: 0 },
      { A: 1, B: 1, Output: 1 },
    ],
  },
  {
    name: "OR",
    description: "The OR gate outputs 1 if at least one input is 1.",
    table: [
      { A: 0, B: 0, Output: 0 },
      { A: 0, B: 1, Output: 1 },
      { A: 1, B: 0, Output: 1 },
      { A: 1, B: 1, Output: 1 },
    ],
  },
  {
    name: "NOT",
    description: "The NOT gate outputs the opposite of the input.",
    table: [
      { A: 0, Output: 1 },
      { A: 1, Output: 0 },
    ],
  },
  {
    name: "NAND",
    description: "The NAND gate outputs 0 only if both inputs are 1.",
    table: [
      { A: 0, B: 0, Output: 1 },
      { A: 0, B: 1, Output: 1 },
      { A: 1, B: 0, Output: 1 },
      { A: 1, B: 1, Output: 0 },
    ],
  },
  {
    name: "NOR",
    description: "The NOR gate outputs 1 only if both inputs are 0.",
    table: [
      { A: 0, B: 0, Output: 1 },
      { A: 0, B: 1, Output: 0 },
      { A: 1, B: 0, Output: 0 },
      { A: 1, B: 1, Output: 0 },
    ],
  },
  {
    name: "XOR",
    description: "The XOR gate outputs 1 if only one input is 1.",
    table: [
      { A: 0, B: 0, Output: 0 },
      { A: 0, B: 1, Output: 1 },
      { A: 1, B: 0, Output: 1 },
      { A: 1, B: 1, Output: 0 },
    ],
  },
];

function LogicGatesGame() {
  return (
    <div className="logic-gates-game">
      <h1>Learn Logic Gates!</h1>
      <p>Explore how different logic gates work with simple tables and explanations.</p>
      {gates.map((gate) => (
        <div className="gate-card" key={gate.name}>
          <h2>{gate.name} Gate</h2>
          <p>{gate.description}</p>
          <table>
            <thead>
              <tr>
                {Object.keys(gate.table[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gate.table.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default LogicGatesGame;
