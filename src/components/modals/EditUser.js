import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, ListGroupItem, Form, FormInput, FormSelect, Button } from "shards-react";
import Modal from "../common/Modal";
import { SingleDatePicker  } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import firebase from "../../util/firebase";
const EditUser = props => {
  const [sendData, setSendData] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [userType, setUserType] = useState("Tester");
  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState([])
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(new Date());

  useEffect(() => {
    if (props.sendData === undefined) {
      setSendData([]);
    } else {
      setSendData([props.sendData]);
      setUserName(props.sendData.name);
      setEmail(props.sendData.email);
      setContactNum(props.sendData.mobile);
      setUserType(props.sendData.userType);
      setState(props.sendData.state);
      setDistrict(props.sendData.district);
      setSubscriptionType(props.sendData.subscriptionType);
      setSubscriptionEndDate(props.sendData.subscriptionEndDate.toDate());
    }
  }, [props.sendData]);

  useEffect(() => {
    const db = firebase.firestore();
    const getSubscriptionTypes = () => {
      db.collection("subscriptions").onSnapshot(function (data) {
        let subscriptions = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        let temp = [];
        subscriptions.forEach(element => {
          temp.push(element.planType)
        });
        setSubscriptionTypes(temp);
      });
    }
    getSubscriptionTypes();
  }, []);

  const handleClickSave = () => {
    const db = firebase.firestore();
    const sendDB_data = {
      name: userName,
      email: email,
      mobile: contactNum,
      userType: userType,
      state: state,
      district: district,
      updated_at: firebase.firestore.Timestamp.now(),
      subscriptionType: subscriptionType,
      subscriptionEndDate: firebase.firestore.Timestamp.fromDate(subscriptionEndDate),
    }
    db.collection("users").doc(sendData[0].id).update(sendDB_data);
    props.setModal2(false);
  };

  const handleInactive = () => {
    const db = firebase.firestore();
    const sendDB_data = {
      deleted_at: firebase.firestore.Timestamp.now(),
    }
    db.collection("users").doc(sendData[0].id).update(sendDB_data);
    props.setModal2(false);
  }

  if (props.viewType === "expired")
    return (
      <div>
        {sendData.map((each, id) => {
          return (
            <Modal
              containModalSize="bd-example-modal-lg"
              modalSize="modal-lg"
              classNames={props.classNames}
              title="Edit User"
              key={id}
              onClick={() => {
                props.onClick();
                setSendData([]);
              }}
            >
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="userName">User Type</label>
                            <FormSelect
                              placeholder="User Type"
                              defaultValue={userType}
                              onChange={(e) => setUserType(e.target.value)}
                            >
                              <option>Tester</option>
                              <option>Admin</option>
                              <option>Regular User</option>
                              <option>Super Admin</option>
                            </FormSelect>
                          </Col>
                        </Row>
                        <Row form>
                          {/* subscription type */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feInputState">Subscription Type</label>
                            <FormSelect
                              name="subscriptiontype"
                              value={subscriptionType}
                              onChange={(e) => setSubscriptionType(e.target.value)}
                            >
                              {subscriptionTypes.map((each, id) => (
                                <option key={id}>{each}</option>
                              ))}
                            </FormSelect>
                          </Col>
                          {/* subscription end date */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feCity">Subscription End Date</label>
                            <SingleDatePicker
                              startDate={subscriptionEndDate}
                              onChange={(startDate) => setSubscriptionEndDate(startDate)}
                              dateFormat="MMM DD"
                              monthFormat="MMM YYYY"
                              startDatePlaceholder="Date"
                              disabled={false}
                              className="my-own-class-name"
                              startWeekDay="monday"
                            />
                          </Col>
                        </Row>
                        <Button
                          size="sm"
                          pill
                          theme="primary"
                          className="mr-1"
                          onClick={handleClickSave}
                        >
                          Update
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Modal>
          );
        })}
      </div>
    );
  else 
    return (
      <div>
        {sendData.map((each, id) => {
          return (
            <Modal
              containModalSize="bd-example-modal-lg"
              modalSize="modal-lg"
              classNames={props.classNames}
              title="Edit User"
              key={id}
              onClick={() => {
                props.onClick();
                setSendData([]);
              }}
            >
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="userName">User Name</label>
                            <FormInput
                              placeholder="User name"
                              defaultValue={each.name}
                              onChange={e => setUserName(e.target.value)}
                            />
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="userContact">Email</label>
                            <FormInput
                              placeholder="Email"
                              defaultValue={each.email}
                              onChange={e => setEmail(e.target.value)}
                            />
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="userName">Contact Number</label>
                            <FormInput
                              placeholder="Contact Number"
                              defaultValue={each.mobile}
                              onChange={e => setContactNum(e.target.value)}
                            />
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="userName">User Type</label>
                            <FormSelect
                              placeholder="User Type"
                              defaultValue={userType}
                              onChange={(e) => setUserType(e.target.value)}
                            >
                              <option>Tester</option>
                              <option>Admin</option>
                              <option>Regular User</option>
                              <option>Super Admin</option>
                            </FormSelect>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="feInputState">State</label>
                            <FormSelect
                              defaultValue={each.state}
                              onChange={(e) => setState(e.target.value)}
                            >
                              {props.sendAllStates.map((item, idx) => <option key={idx}>{item.name}</option>)}
                            </FormSelect>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="feCity">District</label>
                            <FormSelect
                              defaultValue={each.district}
                              onChange={e => {
                                setDistrict(e.target.value);
                              }}
                            >
                              {props.sendAllDistricts.map((item, idx) => <option key={idx}>{item.name}</option>)}
                            </FormSelect>
                          </Col>
                        </Row>
                        <Row form>
                          {/* subscription type */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feInputState">Subscription Type</label>
                            <FormSelect
                              name="subscriptiontype"
                              value={subscriptionType}
                              onChange={(e) => setSubscriptionType(e.target.value)}
                            >
                              {subscriptionTypes.map((each, id) => (
                                <option key={id}>{each}</option>
                              ))}
                            </FormSelect>
                          </Col>
                          {/* subscription end date */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feCity">Subscription End Date</label>
                            <SingleDatePicker
                              startDate={subscriptionEndDate}
                              onChange={(startDate) => setSubscriptionEndDate(startDate)}
                              dateFormat="MMM DD"
                              monthFormat="MMM YYYY"
                              startDatePlaceholder="Date"
                              disabled={false}
                              className="my-own-class-name"
                              startWeekDay="monday"
                            />
                          </Col>
                        </Row>
                        <Button
                          size="sm"
                          pill
                          theme="primary"
                          className="mr-1"
                          onClick={handleClickSave}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          pill
                          theme="primary"
                          className="mr-1"
                          onClick={handleInactive}
                        >
                          Make User Inactive
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Modal>
          );
        })}
      </div>
    );
};

export default EditUser;
