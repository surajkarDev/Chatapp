'use client';
import { useState,memo,useCallback,useContext,useEffect } from "react";
import { ThemeContext } from "../ThemeContext";
export default function CODETEST() {
  const [counter,setCounter] = useState(0);
  const changeThemes = useContext(ThemeContext);
  const [annotationsfun,setAnnotationsfun] = useState('');
  const Result = BasicGenericFunction<string>({ value: "Hello, TypeScript Generics!" });
  const increment = useCallback(() => {
    setCounter((prev) => prev + 1);
  },[])
  const decriment = useCallback(() => {
    setCounter((prev)=> (prev > 0 ? prev - 1 : prev));
  },[]);
  useEffect(()=>{
    setAnnotationsfun('Annotations function')
  },[])
  return (
    <div className={changeThemes == 'dark' ? 'light' : 'dark'}>
      <h5>home Page</h5>
      <p>{counter}</p>
      <Increments onClick={increment} />
      <Decrement onClick={decriment} /><br/>
      <Annotations parrams={annotationsfun}></Annotations><br/>
      <Arrowfun a={2} b={2}></Arrowfun><br/>
      <OptionalParrams name={'Suraj'}></OptionalParrams><br/>
      <OptionalParrams age={26} name={'Suraj'}></OptionalParrams><br/>
      <Defaultvalue num1={2}></Defaultvalue><br/>
      <Defaultvalue num1={2} num2={4}></Defaultvalue><br/>
      <button onClick={VoidFunction} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Void Function</button><br/>
      <p>Divide: {Divide(10,2)}</p>
      <p>Multiply: {multiplyWithAlias(10,8)}</p>
      <p>{PrintUserInfo({user:{name:'Suraj',age:26}})}</p>
      { MisString('Hello','World') }
      {Result}<br/>
      {name}
    </div>
  );
}

// function Increments({onClick}: {onClick:()=> void}){
//   console.log("Increment Button Clicked");
//   return <button onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Increment </button>
// }
// function Decrement({onClick}:{onClick:()=>void}){
//   console.log("Decrement click");
//   return <button onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Decrement</button>
// }
const  Increments = memo(({onClick}: {onClick:()=> void}) => {
  console.log("Increment Button Clicked");
  return <button onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Increment </button>
});
const Decrement = memo(({onClick}:{onClick:()=>void})=>{
  console.log("Decrement click");
  return <button onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Decrement</button>
});

function Annotations({parrams}:{parrams:string}) {
  return `Hello it is ${parrams} function TS`
}
const Arrowfun = ({a,b}:{a:number,b:number}) => {
  return a + b
}

function OptionalParrams({name,age}:{name:string,age?:number}){
  if (age) {
    return `Hello ${name}, you are ${age} years old.`;
  }
  return `Hello ${name}, age is not provide`;
}

const Defaultvalue = ({num1,num2 = 3}:{num1:number, num2?:number}) => {
  return num1 + num2
} 

function VoidFunction(): void {
  const alertMsg = "This function does not return anything";
  console.log(alertMsg);
  window.alert(alertMsg);
}

type MathOperation = (a: number, b: number) => number;
type StringConcat = (a: string, b: string) => string;
const MisString:StringConcat = (a, b) => {
  return a + b;
}
const Divide: MathOperation= (a,b)=>{
  return a / b;
}
const multiplyWithAlias: MathOperation = (a, b) => {
  return a * b;
}

interface User {
  name:string,
  age:number,
}

const PrintUserInfo = ({user}:{user:User}) => {
  return `${user.name} is ${user.age} years old used interface`;
}
const BasicGenericFunction = <T,>({value}:{value: T}) => {
  return <div>{JSON.stringify(value)}</div>;
}
function getProperty<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = { name: "Alice", age: 25 };

const name = getProperty(user, "name"); // "Alice"
// const invalid = getProperty(user, "address"); // ❌ Error: 'address' doesn't exist on type
