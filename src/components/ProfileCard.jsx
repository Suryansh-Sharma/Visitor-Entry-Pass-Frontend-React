import React from "react";
import { useNavigate } from "react-router";

function ProfileCard({name, time, to, date, image, visitorContact }) {
  const navigate = useNavigate();
  const handleNavigate=()=>{
    navigate("/user-profile/"+visitorContact)
  }
  return (
    <div className='card-width mx-auto cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105'
      onClick={handleNavigate}
    >
      <div className='relative'>
        <img
          className='h-64 w-80 object-cover'
          src={image}
          alt='Profile Picture'
        />
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='absolute bottom-4 left-4'>
          <h2 className='text-white text-2xl font-semibold'>{name}</h2>
        </div>
      </div>
      <div className='p-6'>
        <p className='text-gray-500 text-base'>Visitor Contact : {visitorContact}</p>
        <p className='text-gray-500 text-base'>Last Visit Time : {time}</p>
        <p className='text-gray-500 text-base'>Last Visit Date : {date}</p>
        <p className='text-gray-500 text-base'>Visit Location : {to}</p>
      </div>
    </div>
  );
}

export default ProfileCard;
