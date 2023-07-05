import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {GET_VISITOR_POFILE_BY_CONTACT} from "../graphQl/queries"
import { useApolloClient, useQuery } from "@apollo/client";
import LoadingPage from "./LoadingPage";
function UserProfile() {
  const [isLoading, setisLoading] = useState(true)
  const client = useApolloClient();
  const {contact} = useParams();
  const [user, setuser] = useState();

  useEffect(() => {
    client.query({
      query:GET_VISITOR_POFILE_BY_CONTACT,
      variables:{
        visitorContact:contact
      }
    })
    .then(res=>{
      setuser(res.data.getVisitorByContact);
      document.title = res.data.getVisitorByContact.visitorName
      setisLoading(false);
    })
    .catch()

  }, [contact,user])
  if(isLoading)return <LoadingPage/>
  return (
    <div className=''>
      {/* User Profile Section */}
      <div className='flex justify-center'>
        <img
          src={"http://localhost:8080/api/v1/file/image-by-name/"+user.visitorImage}
          alt='User Profile'
          className='h-56 w-56 rounded-full mt-4'
        />
      </div>

      {/* User Details */}
      <div className={"m-5 "}>
        <span className={"sm:font-semibold"}>Visitor Name :</span>
        <h6 className={"bg-slate-200 p-3 "}>{user.visitorName}</h6>

        <span className={"sm:font-semibold"}>Contact :</span>
        <h6 className={"bg-slate-200 p-3"}>{user.visitorContact}</h6>

        <span className={"sm:font-semibold"}>Email :</span>
        <h6 className={"bg-slate-200 p-3"}>{user.visitorEmail}</h6>

        <span className={"sm:font-semibold"}>Address :</span>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-600">
            City:<span class="font-semibold">{user.visitorAddress.city}</span>
          </p>
          <p className="text-gray-600">
            Pincode: <span class="font-semibold">{ user.visitorAddress.pincode }</span>
          </p>
          <p className="text-gray-600">
            Line 1: <span class="font-semibold">{ user.visitorAddress.line1 }</span>
          </p>
        </div>


        <span className={"sm:font-semibold"}>Is Parent of School Student</span>
        <h6 className={"bg-slate-200 p-3"}>
          {user.hasChildrenInSchool
            ? "Yes of " + user.visitorChildren.length
            : "NO"}
        </h6>
      </div>

      {/* User Children Details */}
      <div className={"m-5"} hidden={!user.hasChildrenInSchool}>
        <span className={"sm:font-semibold"}>Childrens Record :</span>
        {user.visitorChildren.map((child) => (
          <h6 className='bg-sky-100 p-3 whitespace-nowrap child'>
            {child.childName} Of {child.childClass}
          </h6>
        ))}
      </div>

      {/* User Visiting Record */}
      <div className={"m-5"}>
        <span className={"sm:font-semibold"}>User Visit's Record</span>
        {user.visitingRecord.map((visit, i) => (
          <div class='max-w-md mx-auto mt-3 bg-white shadow-lg rounded-lg overflow-hidden '>
            <div class='p-4'>
              <h2 class='text-xl font-semibold mb-2'>Visit {i + 1}</h2>
              <p class='text-gray-600'>Date: {visit.date}</p>
              <p class='text-gray-600'>Time: {visit.time}</p>
              <p class='text-gray-600'>Reason: {visit.reason}</p>
              <p class='text-gray-600'>Location: {visit.location}</p>
              <p class='text-gray-600'>Status: {visit.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
