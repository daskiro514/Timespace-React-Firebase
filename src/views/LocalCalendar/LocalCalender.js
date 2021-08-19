import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, FormGroup, FormInput } from "shards-react";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
//import PageTitle from "../components/common/PageTitle";
//import AddNewEvent from "../components/modals/AddNewEvent";
import "../../assets/style.css";
import EditEvent from "../../components/modals/EditEvent";
import ViewEvent from "../../components/modals/ViewEvent";

import { BsEye, BsTrash, BsPencil, BsPlus } from "react-icons/bs";
//import { Link } from "react-router-dom";

const FetchCalendarData = [
  {
    id: 1,
    calendarName: "Local Event Calendar",
    location: "Maysoor",
    admin: "davidson",
    eventtime: "08:22 AM",
    startDate: "22-02-2021",
    endDAte: "28-02-2021",
    tags: [
      {
        tagName: "sports",
      },
      {
        tagName: "dfdf",
      },
    ],
    details: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    calendarName: "Panchangam",
    location: "Maysoor",
    admin: "John doe",
    eventtime: "02:22 PM",
    startDate: "22-02-2021",
    endDAte: "28-02-2021",
    tags: [
      {
        tagName: "sports",
      },
      {
        tagName: "dfdf",
      },
    ],
    details: "Lorem ipsum dolor sit amet",
  },
];

const LocalCalender = () => {
  // const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [loading, setLoading] = useState(true);
  //const [eventData, setEventData] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCreatedBy, setfilterCreatedBy] = useState("");

  //for addNewEvent
  const [calendarData, setCalendarData] = useState([]); //props
  // const [stateData,setStateData] = useState([]) // props
  // const [districtData,setDistrictData] = useState([]) //props

  const handleCreateEvent = () => {
    // setModal1(true);
  };
  const handleEditEvent = () => {
    setModal2(true);
  };
  const handleViewEvent = () => {
    setModal3(true);
  };
  const filterNameFunction = ({ calendarName }) =>
    calendarName.toUpperCase().includes(filterName.toUpperCase());
  const filterLocationFunction = ({ location }) =>
    location.toUpperCase().includes(filterLocation.toUpperCase());
  const filterCreatedByFunction = ({ admin }) =>
    admin.toUpperCase().includes(filterCreatedBy.toUpperCase());

  const handleSearch = () => {
    const filterData = calendarData
      .filter(filterNameFunction)
      .filter(filterLocationFunction)
      .filter(filterCreatedByFunction);
    console.log(filterData);
    //setEventData(filterData);
  };
  const handleClearFilter = () => {
    window.location.reload();
  };
  useEffect(() => {
    setCalendarData(FetchCalendarData);
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        {/* <PageTitle
          sm="4"
          title="Local Calender Management"
          subtitle="Local Calender"
          className="text-sm-left"
        /> */}
        Local Calendar Management
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Events</h6>
              <Button
                size="md"
                theme="secondary"
                className="d-flex ml-auto ml-auto ml-sm-auto mr-sm-2 mt-3 mt-sm-0"
                onClick={handleCreateEvent}
              >
                <BsPlus /> Add New Event
              </Button>
              {/* <NavLink
                size="md"
                theme="primary"
                className=" rounded"
                style={{
                  backgroundColor: "#f84646",
                  color: "#fff",
                  borderRadius: "6px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingLeft: "10px",
                  paddingRight: "10px"
                }}
                to="/upload-csv"
                tag={Link}
                className="d-flex  mr-sm-0 mt-3 mt-sm-0"
              >
                Upload CSV
              </NavLink> */}
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <Col>
                <Row className="border-bottom align-items-center px-3 py-2 bg-light">
                  <Col sm="4" className="d-flex mb-2 mb-sm-0">
                    <RangeDatePicker
                      startDate={new Date()}
                      endDate={new Date()}
                      minDate={new Date(1900, 0, 1)}
                      maxDate={new Date(2100, 0, 1)}
                      monthFormat="MMM YYYY"
                      startDatePlaceholder="Start Date"
                      endDatePlaceholder="End Date"
                      disabled={false}
                      className="my-own-class-name"
                      startWeekDay="monday"
                    />
                  </Col>

                  <Col md="6" className="mt-2 mb-sm-0">
                    <FormGroup
                      inline
                      className="d-flex mb-0 align-items-center"
                    >
                      <FormInput
                        id="feLastName"
                        placeholder="Event Name"
                        className="mr-1"
                        defaultValue={filterName}
                        onChange={e => setFilterName(e.target.value)}
                      />
                      <FormInput
                        placeholder="Location"
                        className="mr-1"
                        defaultValue={filterLocation}
                        onChange={e => setFilterLocation(e.target.value)}
                      />
                      <FormInput
                        placeholder="Created By..."
                        className="mr-1"
                        defaultValue={filterCreatedBy}
                        onChange={e => setfilterCreatedBy(e.target.value)}
                      />
                    </FormGroup>
                  </Col>

                  <Button
                    size="sm"
                    theme="secondary"
                    className="d-flex mr-auto mr-sm-auto mt-3 mt-sm-0"
                    onClick={() => handleSearch()}
                  >
                    Search
                    </Button>&nbsp;


                    <Button
                    size="sm"
                    theme="primary"
                    className="d-flex mr-auto mr-sm-auto mt-3 mt-sm-0"
                    onClick={() => handleClearFilter()}
                  >
                    Clear
                    </Button>

                </Row>
              </Col>
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0 ">
                      Sr.No
                    </th>
                    <th scope="col" className="border-0">
                      Event Name
                    </th>
                    <th scope="col" className="border-0">
                      Location
                    </th>
                    <th scope="col" className="border-0">
                      Created By
                    </th>
                    <th scope="col" className="border-0">
                      Created At
                    </th>
                    <th scope="col" className="border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FetchCalendarData.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.calendarName}</td>
                      <td>{item.location}</td>
                      <td>{item.admin}</td>
                      <td>{item.eventtime}</td>
                      <td className="d-flex align-items-center">
                        <Button pill size="sm" theme="success" className="mr-1">
                          Approve
                        </Button>
                        <Button
                          pill
                          size="sm"
                          theme="info"
                          className="mr-1"
                          onClick={handleViewEvent}
                        >
                          <BsEye />
                        </Button>
                        <Button
                          pill
                          size="sm"
                          theme="secondary"
                          className="mr-1"
                          onClick={handleEditEvent}
                        >
                          <BsPencil />
                        </Button>
                        <Button
                          pill
                          size="sm"
                          theme="danger"
                          onClick={() => alert("delete")}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        {/* <AddNewEvent
          onClick={() => setModal1(false)}
          classNames={
            modal1
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
          calendarData={calendarData}
          stateData={stateData}
          districtData={districtData}
        /> */}

        <EditEvent
          onClick={() => setModal2(false)}
          classNames={
            modal2
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
        />
        <ViewEvent
          onClick={() => setModal3(false)}
          classNames={
            modal3
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
        />
      </Row>
    </Container>
  );
};

export default LocalCalender;
