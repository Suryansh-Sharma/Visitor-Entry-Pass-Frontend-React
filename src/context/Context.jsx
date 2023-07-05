import { createContext, useState } from "react";

export const VisitorEntryPassContext = createContext();

const Context = ({ children }) => {
  const baseUrl = "localhost:8080/";
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo,setUserInfo] = useState(null);
  return (
    <VisitorEntryPassContext.Provider
      value={{
        baseUrl,
        isLogin,
        setIsLogin,
        userInfo,
        setUserInfo
      }}
    >
      {children}
    </VisitorEntryPassContext.Provider>
  );
};
export default Context;
