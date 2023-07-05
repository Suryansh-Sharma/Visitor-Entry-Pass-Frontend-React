import React from "react";
import "../Security/LoginPage.css"
import { useContext } from "react";
import { VisitorEntryPassContext } from "../../context/Context";
import { useMutation } from "@apollo/client";
import {LOGIN_USER} from "../../graphQl/queries"
import { toast } from "react-toastify";

function LoginPage() {
  const {setIsLogin} = useContext(VisitorEntryPassContext);
  const [loginUser,loading] = useMutation(LOGIN_USER,{fetchPolicy:'no-cache'});
  const handleSubmitForm=(e)=>{
    e.preventDefault();
    const contact = e.target.contact.value;
    const password = e.target.pass.value;
    if(contact.length===0 || password.length===0){
      handleToastNotification("isError","Please don't submit empty feild")
      return;
    }
    loginUser({
      variables:{
        input:{
        contact:contact,
        password:password
        }
      }
    })
    .then(res=>{
      handleToastNotification("isSuccess","Welcome back , "+res.data.loginUser.username)
      localStorage.setItem('userInfo', JSON.stringify(res.data.loginUser));
      setIsLogin(true);
    })
    .catch(error=>{
      console.log(error)
      handleToastNotification("isError",""+error)
    })
  }
  const handleToastNotification=(state,message)=>{
    if(state==="isError"){
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }else if(state==="isSuccess"){
      toast.success('🦄 '+message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }
  return (
    <div>
      <div className='limiter'>
        <div className='container-login100'>
          <div className='wrap-login100'>
            <form className='login100-form validate-form' onSubmit={handleSubmitForm}>
              <span className='login100-form-title p-b-26'>Welcome</span>
              <span className='login100-form-title p-b-48'>
                <i className='zmdi zmdi-font'></i>
              </span>

              <div
                className='wrap-input100 validate-input'
              >
                <input className='input100' type='text' name='contact' aria-autocomplete={"list"} />
                <span className='focus-input100' data-placeholder='contact'></span>
              </div>

              <div
                className='wrap-input100 validate-input'
                data-validate='Enter password'
              >
                <span className='btn-show-pass'>
                  <i className='zmdi zmdi-eye'></i>
                </span>
                <input className='input100' type='password' name='pass' />
                <span className='focus-input100' data-placeholder='Password'></span>
              </div>

              <div className='container-login100-form-btn'>
                <div className='wrap-login100-form-btn'>
                  <div className='login100-form-bgbtn'></div>
                  <button className='login100-form-btn'>Login</button>
                </div>
              </div>

              <div className='text-center p-t-115'>
                <span className='txt1'>Don’t have an account?</span>

                <a className='txt2' href='#'>
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
