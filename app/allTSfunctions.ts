 //1. Basic Function with Type Annotations

function greet(name: string): string {
  return `Hello, ${name}`;
}

// 2. Arrow Function with Types

const add = (a: number, b: number): number => {
  return a + b;
};

//  3. Function with Optional Parameters
function greetUser(name: string, age?: number): string {
  return age ? `Hello ${name}, age ${age}` : `Hello ${name}`;
}

//  4. Default Parameter
function multiply(a: number, b: number = 2): number {
  return a * b;
}

// 5. Function with Return Type void (no return)

function logMessage(message: string): void {
  console.log(message);
}

//  6. Function with Type Alias for Signature
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => a / b;

// 7. Function with Interface for Parameters

interface User {
  name: string;
  age: number;
}

function printUser(user: User): void {
  console.log(`${user.name} is ${user.age} years old`);
}

// 8. Generic Function

function identity<T>(value: T): T {
  return value;
}

const result = identity<string>("Hello");