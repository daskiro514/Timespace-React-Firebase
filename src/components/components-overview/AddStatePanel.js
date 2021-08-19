import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  FormGroup,
  Button,
} from "shards-react";
import axios from "axios";
import { API_URL } from "../../api/apiUrl.js";
const AddStatePanel = () => {
  const [countryState, setcountryState] = useState("");
  const [update, SetUpdate] = useState(false);
  const [myCSV, setMyCSV] = useState();
  const [classUpdate, setClassUpdate] = useState(false);
  const [editID, setEditID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updateStateChange, setUpdateStateChange] = useState("");
  const [allStates, setAllStates] = useState([]);
  function handleSave() {
    const sendData = {
      name: countryState,
    };
    axios({
      method: "post",
      url: `${API_URL}/states`,
      data: sendData,
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    ).then(() => SetUpdate((prevState) => !prevState));
    setcountryState("");
  }
  useEffect(() => {
    axios.get(`${API_URL}/states`).then((res) => {
      console.log(res.data.data);
      setAllStates(res.data.data);
    });
    setIsLoading(false);
  }, [update]);
  const handleSubmit = () => {
    const stateData = new FormData();
    stateData.append("stateCSV", myCSV);
    console.log(stateData);
  };
  const handleEdit = (id) => {
    setEditID(id);
    setClassUpdate(true);
  };
  const handleUpdate = (id) => {
    if (updateStateChange !== "") {
      const elementIndex = allStates.findIndex((ele) => ele.id === id);
      const newArray = [...allStates];
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        name: updateStateChange,
      };
      setAllStates(newArray);
      setEditID(0);
      setClassUpdate(false);
    } else {
      setEditID(0);
      setClassUpdate(false);
    }
  };
  const handleDelete = (id) => {
    const result = window.confirm(
      "Are you sure you want to delete this account"
    );
    if (result) {
      axios({
        method: "delete",
        url: `${API_URL}/states/${id}`,
       //data: uploadData,
        headers: {
          "Content-type": "application/json",
        },
      }).then(() => SetUpdate((prevState) => !prevState));
    }
  };
  const handelCancel = () => {
    setEditID(0);
    setClassUpdate(false);
  };

  if (isLoading) {
    return <div>Please Wait...</div>;
  }
  return (
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col md="5">
            <Row form>
              {/* First Name */}
              <Col md="6" className="form-group">
                <label className="border-bottom pb-2 d-block font-weight-bold">
                  Create State
                </label>
              </Col>
            </Row>
            <Row form>
              <Col md="6" className="form-group">
                <FormInput
                  id="feFirstName"
                  placeholder="State"
                  value={countryState}
                  onChange={(e) => setcountryState(e.target.value)}
                />
              </Col>
              <Col>
                <Button
                  outline
                  size="sm"
                  style={{ fontSize: "14px" }}
                  onClick={(e) => setcountryState("")}
                >
                  Clear
                </Button>
              </Col>
            </Row>

            <Button
              theme="primary"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              Save
            </Button>
            <Row style={{ marginTop: "20px" }}>
              <Col md="6">
                <input
                  type="file"
                  name="StateData"
                  onChange={(e) => setMyCSV(e.target.files[0])}
                />
              </Col>
              <Col md="6">
                <Button
                  style={{ backgroundColor: "black", border: "none" }}
                  onClick={ handleSubmit }
                >
                  Upload CSV
                </Button>
              </Col>
            </Row>
          </Col>

          {/* STATE DATA VIEW */}
          <Col md="7">
          <Row>
          <Col md="9">
            <FormGroup inline className="d-flex mb-0 align-items-center">
              <FormInput
                id="searchstate"
                placeholder="Search Name"
                className="mr-1"
              />
              
            </FormGroup>
          </Col>
          <Col md="1">
            <Button
              size="sm"
              theme="primary"
              className="d-flex mr-auto mr-sm-auto mt-3 mt-sm-0"
            >
              Search
            </Button>
          </Col>
          <Col md="1 " style={{marginLeft:"15px"}}>
            <Button
              size="sm"
              theme="primary"
              className="d-flex mr-auto mr-sm-auto mt-3 mt-sm-0"
            >
              Clear
            </Button>
          </Col>
        </Row>
            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    State Name
                  </th>
                  <th scope="col" className="border-0">
                    Action
                  </th>
                </tr>
              </thead>
              {allStates.map((item, id) => (
                <tbody key={id}>
                  <tr>
                    {classUpdate && item.id === editID ? (
                      <td>
                        {" "}
                        <FormInput
                          id="feFirstName"
                          placeholder="First Name"
                          defaultValue={item.name}
                          onChange={(e) => setUpdateStateChange(e.target.value)}
                        />
                      </td>
                    ) : (
                      <td>{item.name}</td>
                    )}

                    {classUpdate && item.id === editID ? (
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
                    ) : (
                      <td className="d-flex align-items-center">
                        <Button
                          size="sm"
                          pill
                          className="mr-1"
                          theme="success"
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
                    )}
                  </tr>
                </tbody>
              ))}
            </table>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  );
};

export default AddStatePanel;
