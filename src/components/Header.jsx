import { useContext } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { GrAddCircle } from "react-icons/gr";
import { HiOutlineHome } from "react-icons/hi";
import { useNavigate } from "react-router";
import { VisitorEntryPassContext } from "../context/Context";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo , setIsLogin , setUserInfo} = useContext(VisitorEntryPassContext);
  const handleLogout=()=>{
    const ans = window.confirm('Are you sure for logout');
    if(ans){
      toast.success('See you soon !! '+userInfo.username, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      localStorage.removeItem('userInfo');
      setIsLogin(false);
      setUserInfo(null);
      navigate("/")
    }
  }
  return (
    <div className='bg-white flex items-center p-2 shadow-md top-0 sticky z-50 h-16'>
      {/* Left */}
      {/* <div className='flex min-w-fit'>
        <image
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"
          }
          alt={""}
          height={40}
          width={40}
        />
        <div
          className='flex items-center space-x-2 px-2 ml-2 rounded-full 
        bg-gray-100 text-gray-500'
        >
          <HiOutlineSearch size={20} />
          <input
            type='text'
            className='hidden lg:inline-flex bg-transparent focus:outline-none'
            placeholder='Search Here'
          />
        </div> 
         </div> */}
      {/* Center  */}
      <div className='flex flex-grow justify-center mx-2'>
        <div className='flex items-center'>
          <div
            className='flex items-center h-14 px-4
          md:px-10 rounded-md md:hover:bg-gray-100 cursor-pointer '
            onClick={() => {
              navigate("/");
            }}
          >
            <HiOutlineHome size={25} />
          </div>

          <div
            className='flex items-center h-14 px-4
          md:px-10 rounded-md md:hover:bg-gray-100 cursor-pointer '
            onClick={() => {
              navigate("/add-visit");
            }}
          >
            <GrAddCircle size={25} />
          </div>

          <div
            className='flex items-center h-14 px-4
          md:px-10 rounded-md md:hover:bg-gray-100 cursor-pointer '
            onClick={() => {
              navigate("/search");
            }}
          >
            <BsSearch size={25} />
          </div>
        </div>
      </div>
      {/* Right */}
      <div className='flex items-center justify-end space-x-2 min-w-fit'>
        {/* <img
          alt={""}
          height={40}
          width={40}
          className={"rounded-full"}
        /> */}
        {/* <l
          className='hidden xl:inline-flex font-semibold'
          href='/api/auth/login'
        >
          {user ? user.name : "Login"}
        <FiRefreshCw
          size={20}
          className='
      hidden xl:inline-flex bg-gray-200
      p-2 h-8 w-8 text-gray-600 rounded-full cursor-pointer'
        />
        <AiFillHeart
          size={20}
          className='
      hidden xl:inline-flex bg-gray-200
      p-2 h-8 w-8 text-gray-600 rounded-full cursor-pointer'
        />
        </l> */}
        <div>
          <span onClick={handleLogout} className={"cursor-pointer"}>
            {userInfo!==null?userInfo.username:""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
