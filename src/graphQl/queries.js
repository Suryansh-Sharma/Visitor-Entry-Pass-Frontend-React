import { gql } from "@apollo/client";

export const GET_VISITOR_BY_CONTACT = gql`
  query GetVisitorByContact($visitorContact: String!) {
    getVisitorByContact(visitorContact: $visitorContact) {
      visitorName
      visitorContact
      visitorImage
      reason
      location
      visitorAddress {
        city
        pinCode
        line1
      }
      hasChildrenInSchool
      visitorChildren{
        childName
        childClass
        __typename
      }
      latestVisitDate
      latestVisitTime
    }
  }
`;

export const GET_TODAY_ALL_VISIT = gql`
  query GetTodayAllVisit($pageSize: Int, $pageNumber: Int) {
    getTodayAllVisit(pageSize: $pageSize, pageNumber: $pageNumber) {
      totalPages
      pageNo
      visits {
        visitorName
        visitorContact
        visitorImage
        location
        reason
        latestVisitDate
        latestVisitTime
      }
      pageSize
      totalData
    }
  }
`;

export const ADD_NEW_VISIT = gql`
  mutation AddNewVisit($input: VisitInput!) {
    addNewVisit(input: $input) {
      visitorName
      visitorContact
      visitorImage
      reason
      location
      visitorAddress {
        city
        pinCode
        line1
      }
      hasChildrenInSchool
      visitorChildren{
        childName
        childClass
      }
      latestVisitDate
      latestVisitTime
    }
  }
`;

export const GET_VISITOR_POFILE_BY_CONTACT = gql`
  query GetVisitorByContact($visitorContact: String!) {
    getVisitorByContact(visitorContact: $visitorContact) {
      visitorName
      visitorContact
      visitorImage
      reason
      location
      visitorAddress {
        city
        pinCode
        line1
      }
      hasChildrenInSchool
      visitorChildren{
        childName
        childClass
        __typename
      }
      latestVisitDate
      latestVisitTime
      visitingRecord{
        date
        time
        reason
        location
        status
      }
    }
  }
`;

export const SEARCH_VISITOR = gql`
  query SearchVisitor($field:String,$searchData:String,$date: String,$pageSize:Int,$pageNumber:Int){
    searchVisitor(field: $field,searchData: $searchData
    ,pageSize: $pageSize,pageNumber: $pageNumber,date: $date){
      totalPages
      pageNo
      visits {
        visitorName
        visitorContact
        visitorImage
        location
        reason
        latestVisitDate
        latestVisitTime
      }
      pageSize
      totalData
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: UserLoginInput!) {
    loginUser(input: $input) {
      username
      contact
      schoolRole
      isValid
    }
  }
`;
