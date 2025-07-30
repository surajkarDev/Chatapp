// import { useState, useEffect, useDebugValue } from "react";

// const useOnlineStatus = () => {
//   const [isOnline, setIsOnline] = useState(true);

//   useEffect(() => {
//     function handleOnline() {
//       const userStr = localStorage.getItem('user');
//       const userLoginStatus = userStr ? JSON.parse(userStr) : null;
//       if (userLoginStatus && userLoginStatus.onlineStatus) {
//         setIsOnline(true);
//       } else {
//         setIsOnline(false);
//       }
//     }
//     function handleOffline() {
//       setIsOnline(false);
//     }

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     // Initial check
//     handleOnline();

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   useDebugValue(isOnline ? "Online 🟢" : "Offline 🔴");
//   return isOnline;
// };

// export default useOnlineStatus;