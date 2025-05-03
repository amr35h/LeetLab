import fs from "fs";

//reading input from data response stream 0 shows that then trim for remove whitespaces
//this comes as string
const input = fs.readFileSync(0, "utf-8").trim();

// array destructring to get seperate out input numbers
const [a, b] = input.split(" ").map(Number);
