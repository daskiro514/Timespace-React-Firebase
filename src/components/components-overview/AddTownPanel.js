import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormGroup,
  FormInput,
  Button,
  FormSelect,
} from "shards-react";
//import * as globalMethod from "../../helper/globalMethods.js";
import { API_URL } from "../../api/apiUrl.js";
import axios from "axios";
const AddTownPanel = () => {
  const [loading, setLoading] = useState(true);
  const [myCSV, setMyCSV] = useState();
  const [update, SetUpdate] = useState(false)
  const [stateList, setStateList] = useState([]);
  const [chooseState, setChooseState] = useState("");
  const [chooseStateID, setChooseStateID] = useState(0);
  const [chooseDistrict, setChooseDistrict] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [town, setTown] = useState("");
  const [classUpdate, setClassUpdate] = useState(false);
  const [editID, setEditID] = useState(0);
  const [updateState, setUpdateState] = useState("");
  const [updateDistrict, setUpdateDistrict] = useState("");
  const [updateTown, setUpdateTown] = useState("");
  const [allTownData, setAllTownData] = useState([]);
  function handleSave() {
    //post data for town
    const state = stateList.find((each) => each.name === chooseState);
    const district = districtList.find((each) => each.name === chooseDistrict);
    const stateID = state.id;
    const districtID = district.id;
    const sendData = {
      state_id: stateID,
      district_id: districtID,
      name: town,
    };
    setAllTownData((prev) => [...prev, sendData]);
    axios({
      method: "post",
      url: `${API_URL}/towns`,
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
        console.log(loading)
      }
    );
  }
  useEffect(() => {
    async function fetchData() {
      await axios.get(`${API_URL}/states`).then((res) => {
        console.log(`towns_states`, res.data.data)
        setStateList(res.data.data);
      });
      await axios.get(`${API_URL}/districts`).then((res) => {
        console.log(`Towns_DistrictList`, res.data.data)
        setDistrictList(res.data.data);
      });
      await axios
        .get(`${API_URL}/towns`)
        .then((res) => {
       
          setAllTownData(res.data.data);
        })
        .then(() => setLoading(false));
    }
    fetchData();
  }, [update]);
  const handleEdit = (id) => {
    // setEditID(id);
    // setClassUpdate(true);
  };
  const handleSubmit = () => {
    const townData = new FormData();
    townData.append("townCSV", myCSV);
    console.log(townData);
  };
  const handleUpdate = (id) => {
    const elementIndex = allTownData.findIndex((x) => x.id === id);
    const newArray = [...allTownData];
    if (updateState !== "") {
      const state = stateList.find((x) => x.name === updateState);
      const stateID = state.id;
      newArray[elementIndex] = { ...newArray[elementIndex], stateID: stateID };
      setAllTownData(newArray);
    }

    if (updateDistrict !== "") {
      const district = districtList.find((x) => x.district === updateDistrict);
      const districtID = district.id;
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        districtID: districtID,
      };
      setAllTownData(newArray);
    }
    if (updateTown !== "") {
      newArray[elementIndex] = { ...newArray[elementIndex], town: updateTown };
      setAllTownData(newArray);
    }
    setEditID(0);
    setChooseStateID(0);
    setClassUpdate(false);
  };
  const handelDelete = (id) => {
    alert(id)
    const result = window.confirm(
      "Are you sure you want to delete this account"
    );
    if (result) {
      axios({
        method: "delete",
        url: `${API_URL}/towns/${id}`,
       //data: uploadData,
        headers: {
          "Content-type": "application/json",
        },
      }).then(() => SetUpdate((prevState) => !prevState));
    }
  };
  const handelCancel = () => {
    setEditID(0);
    setChooseStateID(0);
    setClassUpdate(false);
  };
  // if (loading) {
  //   return <div>Please Wait...</div>;
  // }

  return (
    <Row>
      <Col md="4">
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Row>
                  <Col md="12" className="form-group border rounded p-3">
                    <label>State</label>
                    <FormSelect
                      id="feInputState"
                      value={chooseState}
                      onChange={(e) => {
                        setChooseState(e.target.value);
                        const state = stateList.filter(
                          (each) => each.name === e.target.value
                        );
                        setChooseStateID(state[0].id);
                      }}
                    >
                      <option>Choose State</option>
                      {stateList.map((each, id) => (
                        <option key={id}>{each.name}</option>
                      ))}
                    </FormSelect>
                    <label className="mt-2">District</label>
                    <FormSelect
                      id="feInputState"
                      value={chooseDistrict}
                      onChange={(e) => setChooseDistrict(e.target.value)}
                    >
                      <option>Choose District</option>
                      {districtList.map((each, id) => {
                        if (each.state_id === chooseStateID) {
                          return <option key={id}>{each.name}</option>;
                        }
                      })}
                    </FormSelect>
                    <label className="mt-2">Town</label>
                    <FormInput
                      type="text"
                      placeholder="Town Name"
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
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
              style={{
                backgroundColor: "black",
                border: "none",
                marginLeft: "36px",
              }}
              onClick={handleSubmit}
            >
              Upload CSV
            </Button>
          </Col>
        </Row>
      </Col>

      {/* District DATA VIEW */}
      <Col md="8" className="mt-2 mb-sm-0">
        <Row>
          <Col md="9">
            <FormGroup inline className="d-flex mb-0 align-items-center">
              <FormInput
                id="searchtown"
                placeholder="Search Name"
                className="mr-1"
              />
              <FormInput
                id="seacrhName"
                placeholder="Search Name"
                className="mr-1"
              />
              <FormInput
                id="searchValue"
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
                District Name
              </th>
              <th scope="col" className="border-0">
                Town Name
              </th>
              <th scope="col" className="border-0">
                Action
              </th>
            </tr>
          </thead>
          {allTownData.map((item, id) => {
            const state = stateList.find((x) => x.id === item.state_id);
            const district = districtList.map((x) => {
              if(x.id === item.district_id){
                return x.name
              }
            });
            return (
              <tbody key={id}>
                {classUpdate && editID === item.id ? (
                  <tr>
                    <td>
                      <FormSelect
                        id="feInputState"
                        onChange={(e) => {
                          setUpdateState(e.target.value);
                          const state = stateList.filter(
                            (each) => each.name === e.target.value
                          );
                          setChooseStateID(state[0].id);
                        }}
                        defaultValue={state.name}
                      >
                        <option>Choose State</option>
                        {stateList.map((each, id) => (
                          <option key={id}>{each.name}</option>
                        ))}
                      </FormSelect>
                    </td>
                    <td>
                      <FormSelect
                        id="feInputState"
                        onChange={(e) => setUpdateDistrict(e.target.value)}
                        defaultValue={district.name}
                      >
                        <option>Choose District</option>
                        {districtList.map((each, id) => {
                          if (
                            chooseStateID === each.state_id ||
                            item.state_id === each.state_id
                          ) {
                            return <option key={id}>{each.name}</option>;
                          }
                        })}
                      </FormSelect>
                    </td>
                    <td>
                      <FormInput
                        type="text"
                        placeholder="District"
                        defaultValue={item.town}
                        onChange={(e) => setUpdateTown(e.target.value)}
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
                    <td>{chooseStateID}</td>
                    <td>{district}</td>
                    <td>{item.name}</td>

                    <td className="d-flex align-items-center">
                      <Button
                        className="mr-1"
                        pill
                        theme="success"
                        onClick={() => handleEdit(item.id)}
                      >
                        <i className="material-icons">edit</i>
                      </Button>
                      <Button
                        size="sm"
                        pill
                        theme="primary"
                        onClick={() => handelDelete(item.id)}
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
  );
};

export default AddTownPanel;
