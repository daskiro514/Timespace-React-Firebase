import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  FormGroup,
  Button,
  FormSelect,
} from "shards-react";
import axios from "axios";
import { API_URL } from "../../api/apiUrl.js";
//import EditUser from "../modals/EditUser.js";
const AddDistrictPanel = () => {
  const [loading, setloading] = useState(true);
  const [update, SetUpdate] = useState(false)
  const [ListState, setListState] = useState([]);
  const [myCSV, setMyCSV] = useState();
  const [classUpdate, setClassUpdate] = useState(false);
  const [editID, setEditID] = useState(0);
  const [chooseState, setChooseState] = useState('');
  const [district, setDistrict] = useState("");
  const [updateState, setUpdateState] = useState("");
  const [updateDistrict, setUpdateDistrict] = useState("");
  const [allDistrictData, setAllDistrictData] = useState([]);
 // const [stateName, setState] = useState({})
  //useEffect use to get all state data
  useEffect(() => {
    axios
    .get(`${API_URL}/districts`)
    .then((res) => {
      console.log(res.data.data);
      setAllDistrictData(res.data.data);
    })
    axios
      .get(`${API_URL}/states`)
      .then((res) => {
        console.log(res.data.data);
        setListState(res.data.data);
      }).then(()=>setloading(false))

      
  }, [update]);
  const handleSubmit = () => {
    const districtData = new FormData();
    districtData.append("districtCSV", myCSV);
    console.log(districtData);
  };
  //handleSave post district data
  function handleSave() {
    const state = ListState.find((each) => each.name === chooseState);
    const stateID = state.id
    const sendData ={
      state_id:stateID,
      name:district
    }
    axios({
      method: "post",
      url: `${API_URL}/districts`,
      data: sendData,
      headers: {
        "Content-Type": "application/json",
      }
    }).then(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
      );
    
    
    
    const newDistrict = {
      state_id: stateID,
      name: district,
    };
    setAllDistrictData((prevState) => [...prevState, newDistrict]);
  setDistrict("")
  }
  const handleEdit = (id) => {
    setEditID(id);
    setClassUpdate(true);
  };
  const handleUpdate = (id) => {
    if (updateState !== "" && updateDistrict !== "") {
      const elementIndex = allDistrictData.findIndex((x) => x.id === id);
      const state = ListState.find((x) => x.name === updateState);
      const stateID = state.id;
      const updateDistrictData = [...allDistrictData];
      updateDistrictData[elementIndex] = {
        ...updateDistrictData[elementIndex],
        state_id: stateID,
        name: updateDistrict,
      };
      setEditID(0);
      setClassUpdate(false);
      setAllDistrictData(updateDistrictData);
    } else {
      if (updateState !== "") {
        const elementIndex = allDistrictData.findIndex((x) => x.id === id);
        const state = ListState.find((x) => x.name === updateState);
        const stateID = state.id;
        const updateDistrictData = [...allDistrictData];
        updateDistrictData[elementIndex] = {
          ...updateDistrictData[elementIndex],
          state_id: stateID,
        };
        setEditID(0);
        setClassUpdate(false);
        setAllDistrictData(updateDistrictData);
      } else {
        const elementIndex = allDistrictData.findIndex((x) => x.id === id);
        const updateDistrictData = [...allDistrictData];
        updateDistrictData[elementIndex] = {
          ...updateDistrictData[elementIndex],
          name: updateDistrict,
        };
        setEditID(0);
        setClassUpdate(false);
        setAllDistrictData(updateDistrictData);
      }
    }
  };
  const handleDelete = (id) => {
    //alert(id)
    const result = window.confirm(
      "Are you sure you want to delete this account"+id
    );
    if (result) {
      axios({
        method: "delete",
        url: `${API_URL}/districts/${id}`,
       //data: uploadData,
        headers: {
          "Content-type": "application/json",
        },
      }).then(() => SetUpdate((prevState) => !prevState));
      // return setAllDistrictData((prevState) =>
      //   prevState.filter((x) => x.id != id)
      // );
    }
  };
  const handelCancel = () => {
    setEditID(0);
    setClassUpdate(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col md="5">
            <Row form>{/* First Name */}</Row>
            <ListGroup></ListGroup>
            <Row>
              <Col md="12" className="form-group border rounded p-3">
                <label>Select State</label>
                <FormSelect
                  id="feInputState"
                  onChange={(e) => setChooseState(e.target.value)}
                  value={chooseState}
                >
                  <option>Choose State</option>
                  {ListState.map((each, id) => (
                    <option key={id}>{each.name}</option>
                  ))}
                </FormSelect>
                <label className="mt-2">District</label>
                <FormInput
                  type="text"
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </Col>
            </Row>
            <Button
              theme="primary"
              onClick={(e) => {
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
          {/* District DATA VIEW */}
          <Col md="7">
          <Row>
          <Col md="9">
            <FormGroup inline className="d-flex mb-0 align-items-center">
              <FormInput
                id="search"
                placeholder="Search Name"
                className="mr-1"
              />
              <FormInput
                id="searchname"
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
                    Action
                  </th>
                </tr>
              </thead>
              {allDistrictData.map((item, id) => {
                const itemStateId = item.state_id;
                console.log(itemStateId)
                console.log("hi", ListState);
             const StateName = ListState.map((item)=>{
               if(itemStateId===item.id) {
                 return item.name}
             })

                //console.log(`****************NAme(((((((((((())))))))))))`, StateName)
                return (
                  <tbody key={id}>
                    {classUpdate && editID === item.id ? (
                      <tr>
                        <td>
                          <FormSelect
                            id="feInputState"
                            onChange={(e) => setUpdateState(e.target.value)}
                             defaultValue={StateName}
                          >
                            <option>Choose State</option>
                            {ListState.map((each, id) => (
                              <option key={id}>{each.name}</option>
                            ))}
                          </FormSelect>
                        </td>
                        <td>
                          <FormInput
                            type="text"
                            placeholder="District"
                            defaultValue={item.name}
                            onChange={(e) => setUpdateDistrict(e.target.value)}
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
                        <td>{StateName}</td>
                        <td>{item.name}</td>
                        {/* <td>{item.id}</td> */}
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

export default AddDistrictPanel;
