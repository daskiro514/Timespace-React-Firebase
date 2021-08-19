import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  Button,
  FormGroup,
  Form,
} from "shards-react";
import axios from "axios";
import { API_URL } from "../../api/apiUrl";
// const FeedbackTypeData = [
//   {
//     id: 1,
//     feedbackType: "Complaint",
//   },
//   {
//     id: 2,
//     feedbackType: "Appreciation",
//   },
// ];
const ManageFeedbackTypes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [feedbackType, setfeedBackType] = useState("");
  const [allFeedbackType, setAllFeedbackType] = useState([]);
  const [editID, setEditID] = useState(0);
  const [classUpdate, setClassUpdate] = useState(false);
  const [updateFeedbackType, setUpdateFeedbackType] = useState("");
  useEffect(() => {
    axios
      .get(`${API_URL}/feedback-types`)
      .then((res) => setAllFeedbackType(res.data.data));
    setIsLoading(false);
  }, [update]);
  const handleSave = () => {
    const newFeedbackType = {
      feedbackType: feedbackType,
    };
    axios({
      method: "post",
      url: `${API_URL}/feedback-types`,
      data: newFeedbackType,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(() => setfeedBackType(""))
      .then(() => {
        setUpdate((prevState) => !prevState);
      });
  };
  const handleDelete = (id) => {
    const result = window.confirm(
      "Are you sure you want to delete this account"
    );
    if (result) {
      setAllFeedbackType((prevState) => prevState.filter((x) => x.id !== id));
    }
  };
  const handleEdit = (id) => {
    setClassUpdate(true);
    setEditID(id);
  };

  const handelCancel = () => {
    setClassUpdate(false);
    setEditID(0);
  };
  const handleUpdate = (id) => {
    const elementIndex = allFeedbackType.findIndex((x) => x.id === id);
    const newArray = [...allFeedbackType];
    if (updateFeedbackType !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        feedbackType: updateFeedbackType,
      };
      setAllFeedbackType(newArray);
      setEditID(0);
      setClassUpdate(false);
    } else {
      setEditID(0);
      setClassUpdate(false);
    }
  };
  if (isLoading) {
    return <div>Please Wait..</div>;
  }
  return (
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col md="4">
            <Row form>
              {/* First Name */}
              <Col sm="11" className="form-group">
                <label className="border-bottom pb-2 d-block font-weight-bold">
                  Create Feedback Types
                </label>
              </Col>
            </Row>
            <Row form>
              <Col sm="11" className="form-group">
                <Form>
                  <FormGroup>
                    <FormInput
                      placeholder="Feedback Type"
                      value={feedbackType}
                      onChange={(e) => setfeedBackType(e.target.value)}
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row>

            <Button theme="primary" onClick={() => handleSave()}>
              Save
            </Button>
          </Col>

          <Col md="8">
            <table className="table mb-0">
              <thead className="bg-dark">
                <tr>
                  <th scope="col" className="border-0">
                    Language
                  </th>
                  <th scope="col" className="border-0">
                    Action
                  </th>
                </tr>
              </thead>
              {allFeedbackType.map((item, i) => {
                return (
                  <tbody key={i}>
                    {classUpdate && editID === item.id ? (
                      <tr>
                        <td>
                          {" "}
                          <FormInput
                            id="feFirstName"
                            placeholder="Feedback Type"
                            defaultValue={item.feedbackType}
                            onChange={(e) =>
                              setUpdateFeedbackType(e.target.value)
                            }
                          />
                        </td>
                        <td className="d-flex align-items-center">
                          <Button
                            className="mr-1"
                            theme="primary"
                            onClick={() => handleUpdate(item.id)}
                          >
                            <i className="material-icons">update</i>
                          </Button>
                          <Button
                            className="mr-1"
                            theme="primary"
                            onClick={() => handelCancel()}
                          >
                            <i className="material-icons">cancel</i>
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>{item.feedbackType}</td>
                        <td className="d-flex align-items-center">
                          <Button
                            size="sm"
                            pill
                            theme="success"
                            className="mr-2"
                            onClick={() => handleEdit(item.id)}
                          >
                            <i className="material-icons">edit</i>
                          </Button>
                          <Button
                            size="sm"
                            pill
                            theme="primary"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="material-icons">delete</i>
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </table>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  );
};

export default ManageFeedbackTypes;
