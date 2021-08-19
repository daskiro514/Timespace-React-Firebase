import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  Row,
  Col,
  CardBody,
  FormInput,
  CardFooter,
  FormSelect,
  Button,
} from "shards-react";
import {CButton, CModal, CModalHeader, CModalBody, CModalFooter} from '@coreui/react'
import PageTitle from "../../components/common/PageTitle";
import Plans from "../../components/components-overview/Plans";
import axios from 'axios';
import { API_URL } from "../../api/apiUrl";
import "../../assets/style.css";

const SubscriptionPlan = () => {
  const [planType, setPlanType] = useState("");
  const [price, setPrice] = useState("");
  const [update, setUpdate] = useState(false)
  const [duration, setDuration] = useState(0);
  const durationUnits = ["Choose...", "Days", "Weeks", "Months", "Years"];
  const [choosedUnit, setChoosedUnit] = useState("");
  const [updatePlantype, setUpdatePlanType] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDuration, setUpdateDuration] = useState("");
  const [updateDurationUnit, setUpdateDurationUnit] = useState("");
  
  const [durationAuth, setDurationAuth] = useState("none");
  //const [loading, setLoading] = useState(true);
  const [classUpdate, setClassUpdate] = useState(false);
  const [editID, setEditID] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [modal, setModal] = useState(false);
  const [idfordel, setIdfordel]=useState('')
  //post subscription plan data in handle save
  // function handleSave() {
  //   if (isNaN(duration) || duration === "") {
  //     return setDurationAuth("block");
  //   }
  //   const sendData = {
  //     planType: planType,
  //     price: price,
  //     duration: duration,
  //     choosedUnit: choosedUnit,
  //   };
  //   setSubscriptionData((prevState)=>[...prevState,sendData])
  // }
  useEffect(() => {
    axios
      .get(`${API_URL}/subscriptions`)
      .then((res) => setSubscriptionData(res.data.data));
  }, [update]);
  const handleSave = () => {
   // .then(() => setUpdate((prevState) => !prevState));
    const uploadData = {
      name:planType,
      price:price,
     // theme_color: theme_color,
     duration: duration,
     duration_unit_id:durationUnits,
    
    };
   console.log(uploadData)
    axios({
      method: "post",
      url: `${API_URL}/subscriptions`,
      data: uploadData,
      headers: {
        "Content-type": "application/json",
      },
    }).then(() => setUpdate((prevState) => !prevState));
  };
  const handleEdit = (id) => {
    setEditID(id);
    setClassUpdate(true);
  };

  const toggle = ()=>{
    setModal(!modal);
  }
  const DeleteItem = ()=>{
    setModal(false)
    axios({
      method: "DELETE",
      url: `${API_URL}/subscriptions/${idfordel}`,
      headers: {
        "Content-type": "application/json",
      },
    }).then(() => setUpdate((prevState) => !prevState));
  }
  const handleCancel = () => {
    setEditID(0);
    setClassUpdate(false);
  };
  const handUpdate = (id) => {
    const elementIndex = subscriptionData.findIndex((x) => x.id ===id);
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
    setEditID(0)
    setClassUpdate(false)
  };

  const openModel=(id)=>{
    setIdfordel(id)
    setModal(true)
  }
  // const handelDelete = (id) => {
  //   const result = window.confirm(
  //     "Are you sure you want to delete this account"
  //   );
  //   if (result) {
  //     axios({
  //       method: "DELETE",
  //       url: `${API_URL}/subscriptions/${id}`,
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     }).then(() => setUpdate((prevState) => !prevState));
  //     // if (result) {
  //     //   setThemedata((prevData) => prevData.filter((x) => x.id !== id));
  //     // }
  //    // return setSubscriptionData((prevState) => prevState.filter((x) => x.id != id));
  //   }
  // };
  // if(loading){
  //   return <div>Please Wait...</div>
  // }
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Subscription Plan"
      
          className="text-sm-left"
        />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Plans</h6>
            </CardHeader>
            <CardBody>
              <Row>
                <Plans
                  setPlanType={setPlanType}
                  setDuration={setDuration}
                  setPrice={setPrice}
                  setChoosedUnit={setChoosedUnit}
                  setDurationAuth={setDurationAuth}
                  durationAuth={durationAuth}
                  choosedUnit={choosedUnit}
                  planType={planType}
                  duration={duration}
                  price={price}
                  durationUnits={durationUnits}
                />
              </Row>
            </CardBody>
            <CardFooter>
              <Button
                onClick={() => {
                  handleSave();
                }}
              >
                Create
              </Button>
            </CardFooter>
          </Card>
        </Col>

        <Col sm="12 mt-4">
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Plans</h6>
            </CardHeader>
            <CardBody className="py-0">
              <table className="table mb-0">
                <thead className="bg-light">
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
                {subscriptionData.map((item, id) => {
                  return (
                    <tbody key={id}>
                      {classUpdate && editID === item.id ? (
                        <tr>
                          <td>
                            <FormInput
                              size="sm"
                              placeholder="Plan Type"
                              defaultValue={item.name}
                              onChange={(e) =>
                                setUpdatePlanType(e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <FormInput
                              size="sm"
                              placeholder="Price"
                              defaultValue={item.price}
                              onChange={(e) => setUpdatePrice(e.target.value)}
                            />
                          </td>{" "}
                          <td>
                            <FormInput
                              size="sm"
                              placeholder="Duration"
                              defaultValue={item.duration}
                              onChange={(e) => setUpdateDuration(e.target.value)}
                            />
                          </td>{" "}
                          <td>
                            <FormSelect
                              size="sm"
                              id="feInputState"
                              name="durationUnit"
                              defaultValue={item.Duration_unit}
                              onChange={(e) =>
                                setUpdateDurationUnit(e.target.value)
                              }
                            >
                              {durationUnits.map((each, id) => {
                                return <option key={id}>{each}</option>;
                              })}
                            </FormSelect>
                          </td>
                          <td className="d-flex align-items-center">
                            <Button size="sm" className="mr-1" theme="primary" onClick={()=>handUpdate(item.id)}>
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
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td>{item.duration}</td>
                          <td>{item.Duration_unit}</td>
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
                              onClick={() =>
                                openModel(item.id)
                              }
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
            </CardBody>
          </Card>
        </Col>
      </Row>
   
      <CModal
        show={modal}
        onClose={toggle}
      >
        <CModalHeader closeButton style={{color:'red'}}>Delete</CModalHeader>
        <CModalBody>
          Are you Sure you want to delete this item
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={DeleteItem}>Confirm</CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    </Container>
  );
};

export default SubscriptionPlan;
