import React, { useEffect, useRef, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Webcam from "react-webcam";
import "../css/AddVisit.css";
import { ADD_NEW_VISIT , GET_VISITOR_BY_CONTACT} from "../graphQl/queries";
import { useApolloClient, useMutation } from "@apollo/client";
import LoadingPage from "./LoadingPage";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
function AddVisit() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [showImagSec, setShowImgSec] = useState(true);
  const [addNewVisit, { loading}] = useMutation(ADD_NEW_VISIT,{fetchPolicy:'no-cache'});
  const [isPageLoading,setPageLoading] = useState(false);
  const client = useApolloClient();
  // User Ref for moving up and down in form on Key Press
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    document.title = "Add Visit";
    // Get available media devices
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      setSelectedDeviceId(videoDevices[0].deviceId); // Set the initial selected device ID
    });
  }, []);
  
  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value); // Update the selected device ID
  };
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const resetCapture = () => {
    setCapturedImage(null);
  };

  const [postData, setPostData] = useState({
    visitorContact: "",
    visitorName: "",
    visitorImage:"",
    visitorAddress: {
      city: "",
      pinCode: "",
      line1: "",
      __typename:""
    },
    hasChildrenInSchool: false,
    location: "Select Host",
    reason: "",
    visitorChildren: [],
    __typename:""
  });

  const handlePostFormChange = (key, value) => {
    setPostData({ ...postData, [key]: value });
  };
  const handleAddressChange = (key, value) => {
    setPostData((prevData) => ({
      ...prevData,
      visitorAddress: {
        ...prevData.visitorAddress,
        [key]: value,
      },
    }));
  };

  const handleCheckUserAndUpdateContact = (contactNo) => {
    if (!showImagSec) {
      alert("You can't modify contact !!");
      return;
    }
    if (contactNo.length === 10) {
      handleFetchVisitorByContact(contactNo);
      setPostData({ ...postData, visitorContact: contactNo });
    } else {
      setPostData({ ...postData, visitorContact: contactNo });
    }
  };
  const handleFetchVisitorByContact=(contact)=>{
    setPageLoading(true);
    client.query({
      query:GET_VISITOR_BY_CONTACT,
      variables:{
        visitorContact:contact
      },
      addTypename: false
    })
    .then(res=>{
      console.log(res.data.getVisitorByContact);
      setShowImgSec(false);
      setPostData(res.data.getVisitorByContact);
    })
    .catch(error=>{
      console.log(error);
    })
    setPageLoading(false);
  }
  const handleAddChildRecord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentName = formData.get("studentName");
    const studentClass = formData.get("studentClass");
    const newChildRecord = [
      ...postData.visitorChildren,
      { childName: studentName, childClass: studentClass },
    ];
    setPostData({ ...postData, visitorChildren: newChildRecord });
    e.currentTarget.reset();
  };

  const handleDeleteChild = (index) => {
    let updateRecord = postData.visitorChildren.filter((_, i) => i !== index);
    setPostData({ ...postData, visitorChildren: updateRecord });
  };

  const handleAddVisitButton = (e) => {
    if (e.target.name === "addVisit") {
      if(!validateFields()){
        return;
      }else if(showImagSec&&handlePostImageApi()){
        postNewVisitApi();
      }else{
        postNewVisitApi();
      }
    }
  };

  const postNewVisitApi = () => {
    addNewVisit({
      variables: {
        input: {
          visitorName: postData.visitorName,
          visitorContact: postData.visitorContact,
          visitorImage:postData.visitorContact,
          reason: postData.reason,
          location: postData.location,
          visitorAddress: {
            city: postData.visitorAddress.city,
            pinCode: postData.visitorAddress.pinCode,
            line1: postData.visitorAddress.line1,
          },
          hasChildrenInSchool: postData.hasChildrenInSchool,
          visitorChildren: postData.visitorChildren,
        },
      },
    })
      .then((result) => {
        handleToastNotification("isSuccess","New visit added successfully !!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        handleToastNotification("isError",error);
        console.log(error);
      });
  };
  const handlePostImageApi=()=>{
    setPageLoading(true);
    const formData = new FormData();
    formData.append('image', dataURItoBlob(capturedImage,postData.visitorContact)); // Convert the data URI to a Blob

    axios.post('http://localhost:8080/api/v1/file/new-image/'+postData.visitorContact, formData)
    .then(response => {
      console.log('Image uploaded successfully:', response.data);
      handlePostFormChange("visitorImage",postData.visitorContact)
      setPageLoading(false);
      return true;
    })
    .catch(error => {
      // Handle any error that occurred during the request
      console.error('Failed to upload image:', error);

      return false;
    });

    // console.log(formData);
  }
  const dataURItoBlob = (dataURI, contactNumber) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const fileName = `${contactNumber}.${mimeString.split('/')[1]}`;
    return new Blob([ab], { type: mimeString, name: fileName });
  };
  
  const handleKeyDown = (event, currentIndex) => {
    if (event.key === "Enter") {
      event.preventDefault();
      inputRefs[currentIndex + 1]?.current?.focus();
    } else if (
      event.key === "ArrowDown" &&
      currentIndex < inputRefs.length - 1
    ) {
      event.preventDefault();
      inputRefs[currentIndex + 1]?.current?.focus();
    } else if (event.key === "ArrowUp" && currentIndex > 0) {
      event.preventDefault();
      inputRefs[currentIndex - 1]?.current?.focus();
    }
  };

  const validateFields = () => {
    let isValid = true;
    const contactRegex = /^[0-9]{10}$/;

    // Validate visitorContact
    if (!contactRegex.test(postData.visitorContact)) {
      isValid = false;
      handleToastNotification("isError","Contact number is in-valid ")
    }
  
    // Validate visitorName
    if (!postData.visitorName) {
      isValid = false;
      handleToastNotification("isError","Visitor name is empty")

    }
  
    // Validate visitorAddress
    const { city, pinCode} = postData.visitorAddress;
    if (!city || !pinCode ) {
      isValid = false;
      handleToastNotification("isError","Verify Visitor Address")
    }
    if(pinCode.length<6 || pinCode.length>6){
      handleToastNotification("isError","Check Pincode Length ")
    }
  
    // Validate location
    if (postData.location === "Select Host") {
      isValid = false;
      handleToastNotification("isError","Please Select host")

    }
  
    // Validate reason
    if (!postData.reason) {
      isValid = false;
      handleToastNotification("isError","Reason is empty")
    }
  
    // Validate visitorChildren
    if (postData.hasChildrenInSchool&&postData.visitorChildren.length === 0) {
      isValid = false;
      handleToastNotification("isError","Children Section is empty");
    }
    
    if(capturedImage===null && postData.visitorImage===""){
      isValid=false;
      handleToastNotification("isError","Please Capture Image of Visitor")
    
    }
    return isValid;
  };
  
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
  if(loading || isPageLoading)return <LoadingPage/>

  return (
    <div className={"m-5"}>
      {/* Image Section */}
      <div className='image-section' hidden={!showImagSec}>
        {/* Left Section - Preview */}
        <div className='preview-section'>
          {capturedImage ? (
            <img src={capturedImage} alt='Captured' />
          ) : (
            <p>No image captured</p>
          )}
        </div>

        {/* Right Section - Capture Image */}
        <div className='capture-section'>
        <select value={selectedDeviceId} onChange={handleDeviceChange}>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
          <Webcam
            audio={false}
            height={200}
            screenshotFormat='image/jpeg'
            width={300}
            ref={webcamRef}
            mirrored={true}
          />
          <div className='button-section'>
            <Button onClick={captureImage} variant='outline-success'>
              Capture Image
            </Button>
            {capturedImage && (
              <Button onClick={resetCapture} variant='outline-danger'>
                Reset Capture
              </Button>
            )}
          </div>
        </div>
      </div>

      <h4 className={"my-4 font-medium"} style={{fontSize:30}}>Visitor Details</h4>
      <form className={"my-3"}>
        <div className='form-group' key={"Key1"}>
          <span className={""}>Contact Number</span>
          <input
            aria-autocomplete={"list"}
            onChange={(e) => handleCheckUserAndUpdateContact(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            value={postData.visitorContact}
            ref={inputRefs[0]}
            name='contactNo'
            type='text'
            className='my-2 form-control'
            placeholder='10 Digit Mobile Number'
          />
        </div>

        <div className='form-group'>
          <span>Visitor Name</span>
          <input
            aria-autocomplete={"list"}
            ref={inputRefs[1]}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            onKeyUp={(e) => handleKeyDown(e, 2)}
            onChange={(e) =>
              handlePostFormChange(e.target.name, e.target.value)
            }
            name='visitorName'
            type='text'
            className='my-2 form-control'
            value={postData.visitorName}
            placeholder='Visitor Name'
          />
        </div>

        <h5 className={"my-4 font-medium"} style={{fontSize:30}}>Visitor Address</h5>
        <div className='form-group'>
          <div class='flex flex-col mb-4'>
            <label className='' for='city'>
              City
            </label>
            <input
              class='my-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500'
              type='text'
              placeholder='City'
              value={postData.visitorAddress.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              aria-autocomplete={"list"}
            />
          </div>

          <div class='flex flex-col mb-4'>
            <label class='' for='pinCode'>
              Pincode
            </label>
            <input
              class='my-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500'
              type='text'
              placeholder='Pincode'
              aria-autocomplete={"list"}
              value={postData.visitorAddress.pinCode}
              onChange={(e) => handleAddressChange("pinCode", e.target.value)}
            />
          </div>

          <div class='flex flex-col mb-4'>
            <label class='' for='line1'>
              Line 1
            </label>
            <input
              class='my-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500'
              type='text'
              placeholder='Address Line 1'
              value={postData.visitorAddress.line1}
              onChange={(e) => handleAddressChange("line1", e.target.value)}
            />
          </div>
        </div>

        <div className='input-group my-3'>
          <div className='input-group-prepend'>
            <div className='input-group-text'>
              <input
                type='checkbox'
                checked={postData.hasChildrenInSchool}
                onChange={(e) =>
                  handlePostFormChange(e.target.name, e.target.checked)
                }
                name='hasChildrenInSchool'
              />
            </div>
          </div>
          <label className='px-2'>Is Parent of School Children</label>
        </div>
      </form>

      {/* Child Record Section */}
      <div hidden={!postData.hasChildrenInSchool}>
        {postData.visitorChildren.map((child, index) => (
          <div key={index} className='child-record'>
            <span>{child.childName}</span>
            <span>{child.childClass}</span>
            <button onClick={() => handleDeleteChild(index)}>Delete</button>
          </div>
        ))}

        <Form onSubmit={handleAddChildRecord}>
          <Form.Group className='mb-3'>
            <Form.Label>Enter Student Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Student Name'
              name='studentName'
              aria-autocomplete={"list"}
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Select Student Class</Form.Label>
            <Form.Control as='select' name='studentClass'>
              <option>Select Class</option>
              <option>Class Kg</option>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
              <option>Class 4</option>
              <option>Class 5</option>
              <option>Class 6</option>
              <option>Class 7</option>
              <option>Class 7</option>
              <option>Class 8</option>
              <option>Class 9</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>

              {/* Add more options as needed */}
            </Form.Control>
          </Form.Group>

          <Button variant='outline-primary' type='submit'>
            Add Child
          </Button>
        </Form>
      </div>

      {/* User Visit and visiting to */}

      <h5 className={"my-4 font-medium"} style={{fontSize:30}}>Visiting Details</h5>
      <div className={"my-3"}>
        <Dropdown
          className={"my-3"}
          onSelect={(e) => handlePostFormChange("location", e)}
        >
          {/* <s>Please Select Host Details</s> */}
          <Dropdown.Toggle
            variant='outline-secondary'
            id='dropdownMenuLink'
            className={""}
          >
            {postData.location}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey='Reception'>Reception</Dropdown.Item>
            <Dropdown.Item eventKey='Fees Counter'>Fees Counter</Dropdown.Item>
            <Dropdown.Item eventKey='Teacher'>Teacher</Dropdown.Item>
            <Dropdown.Item eventKey='P.T.M'>P.T.M</Dropdown.Item>
            <Dropdown.Item eventKey='Rajesh Sir'>Rajesh Sir</Dropdown.Item>
            <Dropdown.Item eventKey='Sanjeev Sir'>Sanjeev Sir</Dropdown.Item>
            <Dropdown.Item eventKey='Principal Sir'>
              Principal Sir
            </Dropdown.Item>
            <Dropdown.Item eventKey={'Admission'}>Admission</Dropdown.Item>
            <Dropdown.Item eventKey='Office'>Office</Dropdown.Item>
            <Dropdown.Item eventKey='Other'>Other</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className='form-group'>
          <FormLabel htmlFor='exampleFormControlInput1'>
            Reason for visit
          </FormLabel>
          <textarea
            rows='2'
            onChange={(e) => {
              handlePostFormChange(e.target.name, e.target.value);
            }}
            value={postData.reason}
            className='form-control'
            name={"reason"}
          ></textarea>
        </div>
      </div>
      <div className='d-flex justify-content-between'>
        <Button
          variant='outline-success'
          name={"addVisit"}
          onClick={handleAddVisitButton}
        >
          Add Visit
        </Button>
        <Button
          variant='outline-secondary'
          name={"updateBtn"}
          onClick={handleAddVisitButton}
        >
          Modify User Details
        </Button>
      </div>
    </div>
  );
}

export default AddVisit;
