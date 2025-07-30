"use client"
import React, { useRef, useCallback } from 'react';
import ChildComp from '../components/Childcomp/page';

// Define the type of the ref object that matches the instance methods exposed by ChildComp
type ChildCompHandle = {
    focus: () => void;
    handlerClick: () => void;
};

export default function AboutPage() {
    const childRef = useRef<ChildCompHandle>(null);
    const handlerClick = useCallback(() => {
        childRef.current?.focus();
        childRef.current?.handlerClick();
    }, []);
    console.log("AboutPage rendered");
    
    return <>
        <h1 className="text-2xl font-bold">About Us</h1>
        <ChildComp ref={childRef} />
        <button onClick={handlerClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Focus Input
        </button>
    </>
}