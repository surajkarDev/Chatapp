"use client"
import React,{useImperativeHandle,forwardRef,memo,useState} from "react";

export type ContactCompProps = {
    hanflerClick:() => void
}
 const ContactComp = forwardRef<ContactCompProps, ContactCompProps>((props, ref) => {
    const handlerClick = () => {
        return "Hello from ContactComp!";
    }
    const [childcontent,setChildContent] = useState<any>("Child Comp Data Functionality");
    const handlerClickSecond = () => {
        return "Hello from ContactComp! 2";
    }
    useImperativeHandle(ref, () => ({
        hanflerClick: handlerClick,
        handlerClickSecond:handlerClickSecond,
        setChildContent: (content: any) => setChildContent(content)
    }), []);
    return(
        <>
        <p>{childcontent}</p>
        Child Comp Data
        </>
    )

 })

 export default memo(ContactComp);