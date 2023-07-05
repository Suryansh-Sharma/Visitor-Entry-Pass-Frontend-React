import "react-calendar/dist/Calendar.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddVisit from "./components/AddVisit";
import AllVisitPage from "./components/AllVisitPage";
import LoginPage from "./components/Security/LoginPage";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import LoadingPage from "./components/LoadingPage";
import SearchPage from "./components/SearchPage";
import UserProfile from "./components/UserProfile";
import Context, { VisitorEntryPassContext } from "./context/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";
function App() {
  const {isLogin, setIsLogin,setUserInfo } = useContext(VisitorEntryPassContext);
  useEffect(() => {
    const res = JSON.parse(localStorage.getItem('userInfo'));
    if(res!==null){
      setUserInfo(res);
      setIsLogin(true);
    }
  }, [isLogin]);
  if (isLogin) {
    return (
      <>
        <ToastContainer />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route
              element={<AllVisitPage pageTitle={"Home Page"} />}
              path={"/"}
            />
            <Route element={<AddVisit />} path={"add-visit"} />
            <Route element={<SearchPage />} path={"search"} />
            <Route element={<LoadingPage />} path={"loading"} />
            <Route element={<UserProfile />} path={"user-profile/:contact"} />
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    return (
      <>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path={""} element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default () => {
  return (
    <Context>
      <App />
    </Context>
  );
};
