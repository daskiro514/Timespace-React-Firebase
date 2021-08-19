import React from 'react'
import { Container, Row, Col, Nav, NavItem, NavLink, Card, CardHeader, CardBody, CardFooter, Button, FormInput, FormSelect } from "shards-react";
import { BsTrash, BsPencil } from "react-icons/bs";
import PageTitle from "../../components/common/PageTitle";
import firebase from "../../util/firebase";
const db = firebase.firestore();

function LocationManagement() {
  const [isStatesLoading, setIsStatesLoading] = React.useState(false);
  const [state, setState] = React.useState("");
  const [stateForUpdate, setStateForUpdate] = React.useState("");
  const [states, setStates] = React.useState([]);
  const [isDistrictLoading, setIsDistrictLoading] = React.useState(false);
  const [district, setDistrict] = React.useState("");
  const [districts, setDistricts] = React.useState([]);
  const [districtForUpdate, setDistrictForUpdate] = React.useState("");
  const [isTownsLoading, setIsTownsLoading] = React.useState(false);
  const [town, setTown] = React.useState("");
  const [towns, setTowns] = React.useState([]);
  const [townForUpdate, setTownForUpdate] = React.useState("")
  const [createItem, setCreateItem] = React.useState("state");
  const [updateID, setUpdateID] = React.useState("");

  React.useEffect(() => {
    setIsStatesLoading(true);
    setIsDistrictLoading(true);
    setIsTownsLoading(true);
    async function fetchData() {
      await getStates()
      await getDistricts()
      await getTowns()
    }
    fetchData()
  }, []);

  const setForCreate = (item) => {
    setCreateItem(item);
    clearCreateInput()
  }

  const addState = async () => {
    if (state) {
      const sendData = {
        name: state,
        created_at: firebase.firestore.Timestamp.now(),
        updated_at: firebase.firestore.Timestamp.now(),
      }
      setIsStatesLoading(true);
      await db.collection("states").add(sendData);
      await getStates();
      clearCreateInput()
    } else {
      alert("Please fill the inputs below.")
    }
  }

  const getStates = async () => {
    setStates((await db.collection("states").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
    setIsStatesLoading(false);
  }

  const setForStateUpdate = (itemForUpdate) => {
    setUpdateID(itemForUpdate.id)
    setStateForUpdate(itemForUpdate.name)
  }

  const updateState = async () => {
    if (stateForUpdate) {
      setIsStatesLoading(true);
      const sendData = {
        name: stateForUpdate,
        updated_at: firebase.firestore.Timestamp.now()
      }
      await db.collection("states").doc(updateID).update(sendData)
      setUpdateID("");
      await getStates();
    } else {
      alert("Please fill the inputs below.")
    }
  }

  const deleteState = async (idForDelete) => {
    let deleteAnswser = window.confirm("Are you sure?");
    if (deleteAnswser) {
      setIsStatesLoading(true);
      await db.collection("states").doc(idForDelete).delete();
      await getStates();
    }
  }

  const addDistrict = async () => {
    if (state && district) {
      const sendData = {
        name: district,
        state: state,
        created_at: firebase.firestore.Timestamp.now(),
        updated_at: firebase.firestore.Timestamp.now(),
      }
      setIsDistrictLoading(true);
      await db.collection("districts").add(sendData);
      await getDistricts();
      clearCreateInput()
    } else {
      alert("Please fill the inputs below.")
    }
  }

  const getDistricts = async () => {
    setDistricts((await db.collection("districts").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
    setIsDistrictLoading(false);
  }

  const setForDistrictUpdate = (itemForUpdate) => {
    setUpdateID(itemForUpdate.id)
    setStateForUpdate(itemForUpdate.state)
    setDistrictForUpdate(itemForUpdate.name)
  }

  const updateDistrict = async () => {
    if (stateForUpdate && districtForUpdate) {
      setIsDistrictLoading(true);
      const sendData = {
        state: stateForUpdate,
        name: districtForUpdate,
        updated_at: firebase.firestore.Timestamp.now()
      }
      await db.collection("districts").doc(updateID).update(sendData)
      setUpdateID("");
      await getDistricts();
    } else {
      alert("Please fill the inputs below.")
    }
  }

  const deleteDistrict = async (idForDelete) => {
    let deleteAnswser = window.confirm("Are you sure?");
    if (deleteAnswser) {
      setIsDistrictLoading(true);
      await db.collection("districts").doc(idForDelete).delete();
      await getDistricts();
    }
  }

  const addTown = async () => {
    if (state && district && town) {
      const sendData = {
        name: town,
        state: state,
        district: district,
        created_at: firebase.firestore.Timestamp.now(),
        updated_at: firebase.firestore.Timestamp.now(),
      }
      setIsTownsLoading(true);
      await db.collection("towns").add(sendData);
      await getTowns();
      clearCreateInput()
    } else {
      alert("Please fill the inputs below.")
    }
  }

  const getTowns = async () => {
    setTowns((await db.collection("towns").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
    setIsTownsLoading(false);
  }

  const setForTownUpdate = (itemForUpdate) => {
    setUpdateID(itemForUpdate.id)
    setStateForUpdate(itemForUpdate.state)
    setDistrictForUpdate(itemForUpdate.district)
    setTownForUpdate(itemForUpdate.name)
  }

  const updateTown = async () => {
    if (stateForUpdate && districtForUpdate && townForUpdate) {
      setIsTownsLoading(true);
      const sendData = {
        state: stateForUpdate,
        district: districtForUpdate,
        name: townForUpdate,
        updated_at: firebase.firestore.Timestamp.now()
      }
      await db.collection("towns").doc(updateID).update(sendData)
      setUpdateID("");
      await getTowns();
    } else {
      alert("Please fill the inputs below.")
    }
  }

  const deleteTown = async (idForDelete) => {
    let deleteAnswser = window.confirm("Are you sure?");
    if (deleteAnswser) {
      setIsTownsLoading(true);
      await db.collection("towns").doc(idForDelete).delete();
      await getTowns();
    }
  }

  const clearCreateInput = () => {
    setState("");
    setDistrict("");
    setTown("");
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="6" title="Location Management" className="text-sm-left" />
      </Row>
      <Row>
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink href="#" active={createItem === "state" ? true : false} onClick={() => setForCreate("state")} >
                Add State
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={createItem === "district" ? true : false} onClick={() => setForCreate("district")} >
                Add District
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={createItem === "town" ? true : false} onClick={() => setForCreate("town")} >
                Add Town
              </NavLink>
            </NavItem>
          </Nav>
          <Card style={{ borderRadius: "0px", borderLeft: "1px solid #d1d4d8", borderRight: "1px solid #d1d4d8" }} small className="mb-4">
            <CardHeader style={{ borderRadius: "0px" }} className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">
                {createItem === "state" ? "Create State" : createItem === "district" ? "Create District" : "Create Town"}
              </h6>
            </CardHeader>
            <CardBody>
              {createItem === "state" ?
                <FormInput
                  placeholder="State Name"
                  value={state}
                  onChange={e => setState(e.target.value)}
                /> : createItem === "district" ?
                  <Row>
                    <Col>
                      <label>Choose State:</label>
                      <FormSelect
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="">Choose State ...</option>
                        {states.map((each, i) =>
                          <option value={each.name} key={i}>{each.name}</option>
                        )}
                      </FormSelect><br /><br />
                      <label>District Name:</label>
                      <FormInput
                        placeholder="District Name"
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                      />
                    </Col>
                  </Row>
                  :
                  <Row>
                    <Col>
                      <label>Choose State:</label>
                      <FormSelect
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="">Choose State ...</option>
                        {states.map((each, i) =>
                          <option value={each.name} key={i}>{each.name}</option>
                        )}
                      </FormSelect><br /><br />
                      <label>Choose District:</label>
                      <FormSelect
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      >
                        <option value="">Choose District ...</option>
                        {districts.filter(element => element.state === state).map((each, i) =>
                          <option value={each.name} key={i}>{each.name}</option>
                        )}
                      </FormSelect><br /><br />
                      <label>Town Name:</label>
                      <FormInput
                        placeholder="Town Name"
                        value={town}
                        onChange={e => setTown(e.target.value)}
                      />
                    </Col>
                  </Row>
              }
            </CardBody>
            <CardFooter style={{ borderRadius: "0px" }}>
              {createItem === "state" ?
                <Button onClick={() => addState()}>Create</Button> : createItem === "district" ?
                  <Button onClick={() => addDistrict()}>Create</Button> :
                  <Button onClick={() => addTown()}>Create</Button>}
            </CardFooter>
          </Card>
        </Col>

        <Col sm="6 mt-4">
          <Card>
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">State List</h6>
            </CardHeader>
            <CardBody className="p-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">No</th>
                    <th scope="col" className="border-0">State Name</th>
                    <th scope="col" className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isStatesLoading ? <IsLoading /> :
                    states.map((each, i) => each.id === updateID ?
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <FormInput
                            placeholder="State Name"
                            value={stateForUpdate}
                            onChange={e => setStateForUpdate(e.target.value)}
                          />
                        </td>
                        <td>
                          <Button size="sm" pill theme="success" onClick={() => updateState()}>
                            Update
                          </Button>&nbsp;
                          <Button size="sm" pill theme="primary" onClick={() => setUpdateID("")} >
                            Cancel
                          </Button>
                        </td>
                      </tr> :
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td>
                          <Button size="sm" pill theme="primary" onClick={() => setForStateUpdate(each)}>
                            <BsPencil />
                          </Button>&nbsp;
                          <Button size="sm" pill theme="danger" onClick={() => deleteState(each.id)}>
                            <BsTrash />
                          </Button>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>

        <Col sm="6 mt-4">
          <Card>
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">District List</h6>
            </CardHeader>
            <CardBody className="p-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">No</th>
                    <th scope="col" className="border-0">District Name</th>
                    <th scope="col" className="border-0">State Name</th>
                    <th scope="col" className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isDistrictLoading ? <IsLoading /> :
                    districts.map((each, i) => each.id === updateID ?
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <FormInput
                            placeholder="District Name"
                            value={districtForUpdate}
                            onChange={e => setDistrictForUpdate(e.target.value)}
                          />
                        </td>
                        <td>
                          <FormSelect
                            value={stateForUpdate}
                            onChange={e => setStateForUpdate(e.target.value)}
                          >
                            <option value="">Choose State ...</option>
                            {states.map((each, i) =>
                              <option value={each.name} key={i}>{each.name}</option>
                            )}
                          </FormSelect>
                        </td>
                        <td>
                          <Button size="sm" pill theme="success" onClick={() => updateDistrict()}>
                            Update
                          </Button>&nbsp;
                          <Button size="sm" pill theme="primary" onClick={() => setUpdateID("")} >
                            Cancel
                          </Button>
                        </td>
                      </tr> :
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td>{each.state}</td>
                        <td>
                          <Button size="sm" pill theme="primary" onClick={() => setForDistrictUpdate(each)}>
                            <BsPencil />
                          </Button>&nbsp;
                          <Button size="sm" pill theme="danger" onClick={() => deleteDistrict(each.id)}>
                            <BsTrash />
                          </Button>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>

        <Col sm="6 mt-4">
          <Card>
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Town List</h6>
            </CardHeader>
            <CardBody className="p-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">No</th>
                    <th scope="col" className="border-0">Town Name</th>
                    <th scope="col" className="border-0">District Name</th>
                    <th scope="col" className="border-0">State Name</th>
                    <th scope="col" className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isTownsLoading ? <IsLoading /> :
                    towns.map((each, i) => each.id === updateID ?
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <FormInput
                            placeholder="Town Name"
                            value={townForUpdate}
                            onChange={e => setTownForUpdate(e.target.value)}
                          />
                        </td>
                        <td>
                          <FormSelect
                            value={districtForUpdate}
                            onChange={e => setDistrictForUpdate(e.target.value)}
                          >
                            <option value="">Choose District ...</option>
                            {districts.map((each, i) =>
                              <option value={each.name} key={i}>{each.name}</option>
                            )}
                          </FormSelect>
                        </td>
                        <td>
                          <FormSelect
                            value={stateForUpdate}
                            onChange={e => setStateForUpdate(e.target.value)}
                          >
                            <option value="">Choose State ...</option>
                            {states.map((each, i) =>
                              <option value={each.name} key={i}>{each.name}</option>
                            )}
                          </FormSelect>
                        </td>
                        <td>
                          <Button size="sm" pill theme="success" onClick={() => updateTown()}>
                            Update
                          </Button>&nbsp;
                          <Button size="sm" pill theme="primary" onClick={() => setUpdateID("")} >
                            Cancel
                          </Button>
                        </td>
                      </tr> :
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td>{each.district}</td>
                        <td>{each.state}</td>
                        <td>
                          <Button size="sm" pill theme="primary" onClick={() => setForTownUpdate(each)}>
                            <BsPencil />
                          </Button>&nbsp;
                          <Button size="sm" pill theme="danger" onClick={() => deleteTown(each.id)}>
                            <BsTrash />
                          </Button>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default LocationManagement
