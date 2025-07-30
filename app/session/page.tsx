// import { useEffect, useRef } from "react";

// const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// function useSessionTimeout(onTimeout: () => void) {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const resetTimeout = () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(onTimeout, SESSION_TIMEOUT);
//       localStorage.setItem("loginTime", Date.now().toString());
//     };

//     // Listen for user activity
//     window.addEventListener("mousemove", resetTimeout);
//     window.addEventListener("keydown", resetTimeout);
//     window.addEventListener("mousedown", resetTimeout);
//     window.addEventListener("touchstart", resetTimeout);

//     // Start timer on mount
//     resetTimeout();

//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       window.removeEventListener("mousemove", resetTimeout);
//       window.removeEventListener("keydown", resetTimeout);
//       window.removeEventListener("mousedown", resetTimeout);
//       window.removeEventListener("touchstart", resetTimeout);
//     };
//   }, [onTimeout]);
// }

// export default useSessionTimeout