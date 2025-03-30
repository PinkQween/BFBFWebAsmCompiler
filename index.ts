#!/usr/bin/env bun

import fs from "fs";

const brainfuckInterpreter = (code: string, input = "") => {
  let tape = Array(30000000).fill(0); // Start with a 1 million cell tape
  let pointer = 0;
  let inputIndex = 0;
  let output = "";

  const loopStack = [];
  let i = 0;

  while (i < code.length) {
    const command = code[i];

    switch (command) {
      case ">":
        pointer++;
        if (pointer >= tape.length) {
          tape.push(0); // Expand the tape when pointer exceeds current size
        }
        break;
      case "<":
        pointer--;
        if (pointer < 0) {
          tape.unshift(0); // Insert at the start if the pointer goes negative
          pointer = 0;
        }
        break;
      case "+":
        tape[pointer]++;
        break;
      case "-":
        tape[pointer]--;
        break;
      case ".":
        output += String.fromCharCode(tape[pointer]);
        break;
      case ",":
        if (inputIndex < input.length) {
          tape[pointer] = input.charCodeAt(inputIndex++);
        }
        break;
      case "[":
        if (tape[pointer] === 0) {
          let openBrackets = 1;
          while (openBrackets !== 0) {
            i++;
            if (code[i] === "[") openBrackets++;
            if (code[i] === "]") openBrackets--;
          }
        } else {
          loopStack.push(i);
        }
        break;
      case "]":
        if (tape[pointer] !== 0) {
          i = loopStack[loopStack.length - 1];
        } else {
          loopStack.pop();
        }
        break;
    }

    i++;
  }

  return output;
};

// Function to read a Brainfuck file and execute it
const executeBrainfuckFile = (filePath: string, input: string = ""): void => {
  try {
    // Read Brainfuck code from the file
    const code = fs.readFileSync(filePath, "utf-8");

    // Clean up the code (remove non-Brainfuck characters)
    const cleanedCode = code.replace(/[^<>+\-.,\[\]]/g, ""); // Only keep valid Brainfuck chars

    // Execute the Brainfuck code
    const result = brainfuckInterpreter(cleanedCode, input);

    // Output the result
    if (typeof result === "string") {
      console.log(result);
    } else {
      console.error("Unexpected result type:", typeof result);
    }
  } catch (error: unknown) {
    console.error(`Error reading the file: ${(error as Error).message}`);
  }
};

const args = process.argv.slice(2);
const filePath = args[0];
const input = args[1] || ""; // Optional input for ',' command in Brainfuck

if (filePath) {
  executeBrainfuckFile(filePath, input);
} else {
  console.log("Please provide the Brainfuck file path as an argument.");
}
