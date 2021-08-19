import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, Row, Col, CardBody, FormInput, CardFooter, FormSelect, Button } from "shards-react";
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from "@coreui/react";
import PageTitle from "../../components/common/PageTitle";
import Plans from "../../components/components-overview/Plans";
import { BsTrash, BsPencil } from "react-icons/bs";
import firebase from "../../util/firebase";
import "../../assets/style.css";

const SubscriptionPlan = () => {
  const [durationUnits, setDurationUnits] = useState([]);
  const [planType, setPlanType] = useState("");
  const [price, setPrice] = useState(1);
  const [duration, setDuration] = useState(0);
  const [choosedUnit, setChoosedUnit] = useState("Days");
  const subscriptionforEdit = {
    plantTypeforEdit: "",
    priceforEdit: "",
    durationforEdit: "",
    durationTypeforEdit: "",
  };
  const [currentSubscription, setCurrentSubscription] = useState(subscriptionforEdit);
  const [updatePlantype, setUpdatePlanType] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDuration, setUpdateDuration] = useState("");
  const [updateDurationUnit, setUpdateDurationUnit] = useState("");
  const [durationAuth, setDurationAuth] = useState("none");
  const [classUpdate, setClassUpdate] = useState(true);
  const [editID, setEditID] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [modal, setModal] = useState(false);
  const [idfordel, setIdfordel] = useState("");
  const [regularUsers, setRegularUsers] = useState([]);
  const [subscriptionId, setSubscriptionId] = useState();

  useEffect(() => {
    const getAllScubscriptions = () => {
      const db = firebase.firestore();
      db.collection("subscriptions").onSnapshot(function (data) {
        let temp = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setSubscriptionData(temp);
        setSubscriptionId(temp[0].id)
      });
    };
    getAllScubscriptions();
  }, []);

  useEffect(() => {
    const getAllDurationUnits = () => {
      const db = firebase.firestore();
      db.collection("duration_units").onSnapshot(function (data) {
        let tempDurationUnits = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        let tempDuraUnitArray = [];
        tempDurationUnits.forEach(element => {
          tempDuraUnitArray.push(element.name);
        });
        setDurationUnits(tempDuraUnitArray);
      });
      db.collection("users").onSnapshot(function(data) {
        let temp = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        temp = temp.filter(element => element.deleted_at === null && element.subscriptionEndDate.seconds > (new Date().getTime() / 1000) && element.userType === "Regular User");
        setRegularUsers(temp);
      })
    };
    getAllDurationUnits();
  }, []);

  const handleEdit = item => {
    setCurrentSubscription({
      plantTypeforEdit: item.planType,
      priceforEdit: item.price,
      durationTypeforEdit: item.durationType,
      durationforEdit: item.duration,
    });

    setEditID(item.id);
    setClassUpdate(true);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const DeleteItem = () => {
    setModal(false);
    const db = firebase.firestore();
    db.collection("subscriptions").doc(idfordel).delete();
  };
  const handleCancel = () => {
    setEditID(0);
    setClassUpdate(false);
  };
  const globalChangeUser = () => {
    let tempSubscript = subscriptionData.find(element => element.id === subscriptionId);
    let nowDateMiliSeconds = new Date().getTime();
    let estimateMiliSeconds = 0;
    if (tempSubscript.durationType === "days") {
      estimateMiliSeconds = nowDateMiliSeconds + 86400000 * Number(tempSubscript.duration);
    } else if (tempSubscript.durationType === "weeks") {
      estimateMiliSeconds = nowDateMiliSeconds + 604800000 * Number(tempSubscript.duration);
    } else if (tempSubscript.durationType === "months") {
      estimateMiliSeconds = nowDateMiliSeconds + 2628000000 * Number(tempSubscript.duration);
    } else if (tempSubscript.durationType === "years") {
      estimateMiliSeconds = nowDateMiliSeconds + 31540000000 * Number(tempSubscript.duration);
    }
    const db = firebase.firestore();
    regularUsers.forEach(element => {
      let updateDBData = {
        updated_at: firebase.firestore.Timestamp.now(),
        subscriptionType: tempSubscript.planType,
        subscriptionEndDate: firebase.firestore.Timestamp.fromDate(new Date(estimateMiliSeconds)),
      }
      db.collection("users").doc(element.id).update(updateDBData);
    });
    window.location.href = "/#/userManagement/activeUsers";
    alert("Global Subscription Change Success!")
  }
  const handUpdate = id => {
    const db = firebase.firestore();
    db.collection("subscriptions").doc(editID).set({
      planType: updatePlantype ? updatePlantype : currentSubscription.plantTypeforEdit,
      price: updatePrice ? updatePrice : currentSubscription.priceforEdit,
      duration: updateDuration ? updateDuration : currentSubscription.durationforEdit,
      durationType: updateDurationUnit ? updateDurationUnit : currentSubscription.durationTypeforEdit,
    });

    const elementIndex = subscriptionData.findIndex(x => x.id === id);
    const newArray = [...subscriptionData];
    if (updatePlantype !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        planType: updatePlantype,
      };
      setSubscriptionData(newArray);
    }
    if (updatePrice !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        price: updatePrice,
      };
      setSubscriptionData(newArray);
    }
    if (updateDuration !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        duration: updateDuration,
      };
      setSubscriptionData(newArray);
    }
    if (updateDurationUnit !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        choosedUnit: updateDurationUnit,
      };
      setSubscriptionData(newArray);
    }
    setEditID(0);
    setClassUpdate(false);
    setUpdatePrice("");
    setUpdateDuration("");
    setUpdatePlanType("");
  };

  const openModel = id => {
    setIdfordel(id);
    setModal(true);
  };

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  const createTodo = () => {
    let db_sendData = {
      planType: planType,
      price: price,
      duration: duration,
      durationType: choosedUnit,
    }
    if (planType.length && price && isNumber(duration)) {
      const db = firebase.firestore();
      db.collection("subscriptions").add(db_sendData);
      setPlanType("");
      setPrice(1);
      setDuration("");
      setChoosedUnit("Days");
    } else {
      alert("You inputed invalid values")
    }
  };

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Subscription Plan" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Create Plans</h6>
            </CardHeader>
            <CardBody>
              <Row>
                <Plans
                  planType={planType}
                  price={price}
                  duration={duration}
                  choosedUnit={choosedUnit}
                  durationUnits={durationUnits}
                  durationAuth={durationAuth}
                  setPlanType={setPlanType}
                  setDuration={setDuration}
                  setPrice={setPrice}
                  setChoosedUnit={setChoosedUnit}
                  setDurationAuth={setDurationAuth}
                />
              </Row>
            </CardBody>
            <CardFooter>
              <Button onClick={createTodo}>Create</Button>
            </CardFooter>
          </Card>
        </Col>

        <Col sm="12 mt-4">
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Plans</h6>
              <FormSelect
                name="subscriptiontype"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
              >
                {subscriptionData.map((each, id) => (
                  <option key={id} value={each.id}>{each.planType}</option>
                ))}
              </FormSelect>
              <Button
                size="sm"
                pill
                theme="primary"
                onClick={() => globalChangeUser()}
              >
                Global Change
              </Button>
            </CardHeader>
            <CardBody className="py-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">
                      Plan Type
                    </th>
                    <th scope="col" className="border-0">
                      Price
                    </th>
                    <th scope="col" className="border-0">
                      Duration
                    </th>
                    <th scope="col" className="border-0">
                      Details
                    </th>
                    <th scope="col" className="border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                {/* <tr>{loader?"Loading...":null}</tr> */}
                {subscriptionData.map((item, id) => {
                  return (
                    <tbody key={id}>
                      {classUpdate && editID === item.id ? (
                        <tr>
                          <td>
                            <FormInput
                              size="sm"
                              placeholder="Plan Type"
                              value={updatePlantype ? updatePlantype : item.planType}
                              onChange={e => setUpdatePlanType(e.target.value)}
                            />
                          </td>
                          <td>
                            <FormInput
                              size="sm"
                              placeholder="Price"
                              defaultValue={updatePrice ? updatePrice : item.price}
                              onChange={e => setUpdatePrice(e.target.value)}
                            />
                          </td>{" "}
                          <td>
                            <FormInput
                              size="sm"
                              placeholder="Duration"
                              defaultValue={updateDuration ? updateDuration : item.duration}
                              onChange={e => setUpdateDuration(e.target.value)}
                            />
                          </td>{" "}
                          <td>
                            <FormSelect
                              size="sm"
                              id="feInputState"
                              name="durationUnit"
                              defaltValue={item.durationType}
                              onChange={e => setUpdateDurationUnit(e.target.value)}
                            >
                              {durationUnits.map((each, id) => {
                                return (<option key={id}>{each}</option>);
                              })}
                            </FormSelect>
                          </td>
                          <td className="d-flex align-items-center">
                            <Button
                              size="sm"
                              className="mr-1"
                              theme="primary"
                              onClick={() => handUpdate(item.id)}
                            >
                              <i className="material-icons">update</i>
                            </Button>
                            <Button
                              size="sm"
                              theme="primary"
                              onClick={() => handleCancel()}
                            >
                              <i className="material-icons">cancel</i>
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>{item.planType}</td>
                          <td>{item.price}</td>
                          <td>{item.duration}</td>
                          <td>{item.durationType}</td>
                          <td className="d-flex align-items-center">
                            <Button
                              size="sm"
                              pill
                              className="mr-1"
                              theme="secondary"
                              onClick={() => handleEdit(item)}
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
                      )}
                    </tbody>
                  );
                })}
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <CModal show={modal} onClose={toggle}>
        <CModalHeader closeButton style={{ color: "red" }}>
          Delete
        </CModalHeader>
        <CModalBody>Are you Sure you want to delete this item</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={DeleteItem}>
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

export default SubscriptionPlan;
