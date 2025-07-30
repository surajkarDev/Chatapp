import React,{useImperativeHandle, forwardRef,useRef,memo} from "react";

export type ChildCompProps = {
    focus: () => void;
}

const ChildComp = forwardRef<ChildCompProps, {}>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handlerClick = () => {
        if (inputRef.current) {
            inputRef.current.value = "Hello World!";
        }
    }     
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        handlerClick:handlerClick
    }));
         

    return <input ref={inputRef} />;
});

export default memo(ChildComp);