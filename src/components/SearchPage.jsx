import { useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import Calendar from "react-calendar";
import { SEARCH_VISITOR } from "../graphQl/queries";
import LoadingPage from "./LoadingPage";
import ProfileCard from "./ProfileCard";
function SearchPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [data, setData] = useState({ visits: [] });
  const [pageNo, setPageNo] = useState(0);
  const [isPageLoading, setisPageLoading] = useState(true);
  const client = useApolloClient();
  useEffect(() => {
    document.title = "Search Person";
    handleSearchApi();
  }, [pageNo]);

  //   const [date, setDate] = useState(new Date());
  const [searchData, setSearchData] = useState({
    searchData: "",
    date: "",
    field: "contact",
  });

  const handleShowCalendar = () => {
    // If user off calendar then remove date
    setSearchData({ ...searchData, date: "" });
    setShowCalendar(!showCalendar ? true : false);
  };

  const handleCalendarClick = (e) => {
    const date = new Date(e);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
  
    const formattedDate = year+"-"+month+"-"+day;
    console.log(formattedDate);
  
    handleChangeData("date", formattedDate);
  };
  
  

  const handleChangeData = (key, value) => {
    setSearchData({ ...searchData, [key]: value });
  };

  const handleSearchApi = () => {
    setisPageLoading(true);
    client
      .query({
        query: SEARCH_VISITOR,
        variables: {
          field: searchData.field,
          searchData: searchData.searchData,
          pageSize: 4,
          pageNumber: pageNo,
          date: searchData.date,
        },
      })
      .then((res) => {
        setData(res.data.searchVisitor);
        console.log(res.data);
        setisPageLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const handlePagination = (direction, target) => {
    if (direction === "previous" && pageNo > 0) {
      setPageNo(pageNo - 1);
    } else if (direction === "forward" && pageNo < data.totalPages - 1) {
      setPageNo(pageNo + 1);
    } else if (direction === "target") {
      setPageNo(target);
    }
  };
  if(isPageLoading)return <LoadingPage/>
  return (
    <>
      <div className='bg-white flex items-center p-2'>
        <div className={"flex items-center"} hidden={!showCalendar}>
          <Calendar onChange={handleCalendarClick} />
        </div>
        <div className='flex min-w-fit'>
          <Button
            className={"mx-2"}
            variant={"outline-primary"}
            onClick={handleShowCalendar}
          >
            {!showCalendar ? "Show Calendar" : "Hide Calendar"}
          </Button>
          <Dropdown onSelect={(e) => handleChangeData("field", e)}>
            <Dropdown.Toggle variant={"outline-secondary"}>
              {searchData.field}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Dropdown items */}
              <Dropdown.Item eventKey='contact'>Contact</Dropdown.Item>
              <Dropdown.Item eventKey='visitorName'>Visitor Name</Dropdown.Item>
              <Dropdown.Item eventKey='Reception'>Reception</Dropdown.Item>
              <Dropdown.Item eventKey='Fees Counter'>
                Fees Counter
              </Dropdown.Item>
              <Dropdown.Item eventKey='Teacher'>Teacher</Dropdown.Item>
              <Dropdown.Item eventKey='P.T.M'>P.T.M</Dropdown.Item>
              <Dropdown.Item eventKey='Rajesh Sir'>Rajesh Sir</Dropdown.Item>
              <Dropdown.Item eventKey='Sanjeev Sir'>Sanjeev Sir</Dropdown.Item>
              <Dropdown.Item eventKey='Principal Sir'>
                Principal Sir
              </Dropdown.Item>
              <Dropdown.Item eventKey={'Admission'}>Admission</Dropdown.Item>
              <Dropdown.Item eventKey={'ChildrenName'}>Children Name</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Center */}
        <div className='flex flex-grow items-center'>
          <div
            className='w-full items-center space-x-2 px-2 m-2 rounded-full 
          bg-gray-100  h-12'
          >
            <input
              type='text'
              className='p-2 w-full bg-transparent focus:outline-none'
              placeholder='Search Here'
              value={searchData.searchData}
              onChange={(e) => handleChangeData("searchData", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchApi();
                }
              }}
            />
          </div>
          <div>
            <Button
              variant={"outline-success"}
              size={"lg"}
              onClick={handleSearchApi}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      {/* Result section  */}
      <div className={"container mx-auto py-8"}>
      <div className={"flex my-2 "}>
        <span className={"font-semibold mx-2"}>Total Entries:- </span>
        <span>{data.totalData}</span>
      </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {data.visits.map((visit) => (
            <div className='m-3' key={visit.visitorContact}>
              <ProfileCard
                name={visit.visitorName}
                date={visit.latestVisitDate}
                time={visit.latestVisitTime}
                to={visit.location}
                visitorContact={visit.visitorContact}
                image={
                  "http://localhost:8080/api/v1/file/image-by-name/" +
                  visit.visitorImage
                }
              />
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className='flex justify-center mt-8'>
        <nav aria-label='Page navigation example'>
          <ul className='pagination'>
            <li className='page-item'>
              <span
                className='page-link cursor-pointer'
                href='#'
                onClick={() => handlePagination("previous", 0)}
              >
                Previous
              </span>
            </li>
            {Array.from({ length: data.totalPages }).map((_, index) => (
              <li className='page-item' key={index}>
                <span
                  className={
                    pageNo === index
                      ? "page-link bg-blue-500 text-white"
                      : "page-link"
                  }
                  href='#'
                  onClick={() => handlePagination("target", index)}
                >
                  {index}
                </span>
              </li>
            ))}
            <li className='page-item'>
              <span
                className='page-link cursor-pointer'
                href='#'
                onClick={() => handlePagination("forward", 0)}
              >
                Next
              </span>
            </li>
          </ul>
        </nav>
      </div>
      </div>
    </>
  );
}

export default SearchPage;
