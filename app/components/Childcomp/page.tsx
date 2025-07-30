"use client";
import React, { useImperativeHandle, forwardRef, useRef, memo } from "react";

export type ChildCompRef = {
  focus: () => void;
  handlerClick: () => void;
};

const ChildComp = forwardRef<ChildCompRef, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlerClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "Hello World!";
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    handlerClick,
  }));

  return <input ref={inputRef} className="border px-2 py-1 rounded" />;
});

export default memo(ChildComp);