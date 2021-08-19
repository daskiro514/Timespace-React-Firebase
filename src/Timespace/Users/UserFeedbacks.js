import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormCheckbox, Button } from "shards-react";
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from "@coreui/react";
import ViewFeedback from "../../components/modals/ViewFeedback";
import { BsPencil, BsTrash } from "react-icons/bs";

const UserFeedbacks = () => {
  const [modal, setModal] = useState(false);
  const [viewDataID, setViewDataID] = useState(0);
  const [modalfordel, setModalfordel] = useState(false);
  const [idfordel, setIdfordel] = useState("");
  const toggle = () => {
    setModalfordel(!modalfordel);
  };
  const openModel = id => {
    setIdfordel(id);
    setModalfordel(true);
  };
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 1,
      name: "John",
      feedDate: "22-02-2021",
      feedType: "Appreciation",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
      status: "New",
      reply: "",
    },
    {
      id: 2,
      name: "Kerry",
      feedDate: "22-02-2021",
      feedType: "Complaint",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
      status: "Replied",
      reply: "Thank You",
    },
    {
      id: 3,
      name: "Ajay",
      feedDate: "22-02-2021",
      feedType: "Complaint",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
      status: "Replied",
      reply: "Thank You",
    },
    {
      id: 4,
      name: "John doe",
      feedDate: "22-02-2021",
      feedType: "Appreciation",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
      status: "Replied",
      reply: "Thank You",
    },
  ]);
  const handleViewFeedback = ids => {
    // it will send id to viewfeedBack.js so that component will fetch data from db for perticular id
    setViewDataID(ids);
    setModal(true);
  };
  const handleDelete = () => {
    // delete request
    setFeedbackData(prevState => prevState.filter(x => x.id !== idfordel));
    console.log(`ID number ${idfordel} has been deleted`);
    setModalfordel(false);
  };
  const handleReply = (id, reply) => {
    const elementIndex = feedbackData.findIndex(item => item.id === id);
    const copyFeedbackData = [...feedbackData];
    copyFeedbackData[elementIndex] = {
      ...copyFeedbackData[elementIndex],
      status: "Replied",
      reply: reply,
    };
    console.log(copyFeedbackData);
    setFeedbackData(copyFeedbackData);
    setModal(false);
  };
  useEffect(() => { }, []);
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <h1>User Feedbacks</h1>
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Active Users</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0 checkboxLeftPadding">
                      <FormCheckbox>All</FormCheckbox>
                    </th>
                    <th scope="col" className="border-0">
                      User Name
                    </th>

                    <th scope="col" className="border-0">
                      Date of Feedback
                    </th>
                    <th scope="col" className="border-0">
                      Feedback Type
                    </th>
                    <th scope="col" className="border-0">
                      Feedback
                    </th>
                    <th scope="col" className="border-0">
                      Status
                    </th>
                    <th scope="col" className="border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackData.map((item, i) => (
                    <tr key={i}>
                      <td className="checkboxLeftPadding">
                        <FormCheckbox />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.feedDate}</td>
                      <td>{item.feedType}</td>
                      <td>{item.feedback.slice(50) + "..."}</td>
                      <td
                        style={{
                          color: item.status === "New" ? "#02d402" : "#666",
                        }}
                      >
                        {item.status}
                      </td>
                      <td className="d-flex align-items-center">
                        <Button
                          size="sm"
                          pill
                          theme="info"
                          onClick={() => handleViewFeedback(item.id)}
                        >
                          <BsPencil />
                        </Button>
                        <Button
                          size="sm"
                          pill
                          theme="danger"
                          onClick={() => openModel(item.id)}
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
        <ViewFeedback
          onClick={() => {
            setModal(false);
            setViewDataID(0);
          }}
          classNames={modal ? "modal faded d-block" : "modal faded"}
          sendData={feedbackData.find(x => x.id === viewDataID)}
          handleReply={handleReply}
        />
      </Row>
      <CModal show={modalfordel} onClose={toggle}>
        <CModalHeader closeButton style={{ color: "red" }}>
          Delete
        </CModalHeader>
        <CModalBody>Are you Sure you want to delete this item</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleDelete}>
            Confirm
          </CButton>{" "}
          <CButton color="secondary" onClick={toggle}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </Container>
  );
};

export default UserFeedbacks;
