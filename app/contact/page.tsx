"use client"
import React,{useRef,useState} from "react";
import ContactComp,{ContactCompProps} from "../components/ContactComp/page";
type ContactComphandler = {
    hanflerClick: () => string,
    handlerClickSecond: () => string,
    setChildContent?: (content: any) => void
}
const ContactPage = () => {
    const [childContent, setChildContent] = useState<string>("Child Comp Data Functionality");
   const contactRef = useRef<ContactComphandler>(null);
   const handleClick = () => {
       if (contactRef.current) {
           console.log(contactRef.current.hanflerClick());
           console.log(contactRef.current.handlerClickSecond());
           setChildContent(contactRef.current.handlerClickSecond());
       }
    } 
    console.log("ContactPage rendered");
    return (
        <>
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <p>If you have any questions, feel free to reach out!</p>
            <ContactComp
                ref={contactRef}
                hanflerClick={() => {
                    // Provide a handler function as required by ContactCompProps
                    console.log("hanflerClick called from ContactPage");
                }}
            />
            <h1>{childContent} parent</h1>
            <button onClick={() => contactRef.current?.setChildContent && contactRef.current.setChildContent("Updated from ContactPage")}
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            >
                Set Child Content
            </button>
            <button
                onClick={handleClick}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                Click Me
            </button>

        </>
    );
}

export default ContactPage;