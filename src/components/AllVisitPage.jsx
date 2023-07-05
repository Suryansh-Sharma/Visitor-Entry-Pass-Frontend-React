import { useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_TODAY_ALL_VISIT } from "../graphQl/queries";
import ProfileCard from "./ProfileCard";
import LoadingPage from "./LoadingPage";
import { useLocation } from "react-router";
function AllVisitPage({ pageTitle }) {
  const client = useApolloClient();
  const location = useLocation();
  const [isPageLoading, setisPageLoading] = useState(true);
  const [data, setData] = useState({ visits: [] });
  const [pageNo, setPageNo] = useState(0);
  useEffect(() => {
    document.title = pageTitle;
    handleFetchData();
  }, [pageNo]);

  const handleFetchData = () => {
    setisPageLoading(true);
    client
      .query({
        query: GET_TODAY_ALL_VISIT,
        variables: {
          pageSize: 4,
          pageNumber: pageNo,
        },
      })
      .then((response) => {
        console.log(response)
        setData(response.data.getTodayAllVisit);
        setisPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
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
  if (isPageLoading) return <LoadingPage />;

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-semibold mb-4'>{pageTitle}</h1>
      <div className={"flex my-2 "}>
        <span className={"font-semibold"}>Total Entries: </span>
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

      <div className='flex justify-center mt-8' hidden={data.visits.length===0?true:false}>
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
  );
}

export default AllVisitPage;
