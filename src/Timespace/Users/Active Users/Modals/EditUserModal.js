import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Form, FormInput, FormSelect, Button } from "shards-react";
import Modal from "../../../../components/common/Modal";
import { SingleDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import firebase from '../../../../util/firebase'
const EditUser = props => {
  const [sendData, setSendData] = React.useState([]);
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contactNum, setContactNum] = React.useState("");
  const [userType, setUserType] = React.useState("Tester");
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [town, setTown] = React.useState("");
  const [subscriptionTypes, setSubscriptionTypes] = React.useState([])
  const [subscriptionType, setSubscriptionType] = React.useState("");
  const [subscriptionEndDate, setSubscriptionEndDate] = React.useState(new Date());

  React.useEffect(() => {
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
      setTown(props.sendData.town)
      setSubscriptionType(props.sendData.subscriptionType);
      setSubscriptionEndDate(props.sendData.subscriptionEndDate.toDate());
    }
  }, [props.sendData]);

  React.useEffect(() => {
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

  const handleClickSave = async () => {
    const sendDB_data = {
      name: userName,
      email: email,
      mobile: contactNum,
      userType: userType,
      state: state,
      district: district,
      town: town,
      updated_at: firebase.firestore.Timestamp.now(),
      subscriptionType: subscriptionType,
      subscriptionEndDate: firebase.firestore.Timestamp.fromDate(subscriptionEndDate),
    }
    if (userName && email && contactNum && userType && state && district && town && subscriptionType && subscriptionEndDate) {
      props.setModalForUpdate(false);
      props.setShowEditUserID(0)
      await props.updateUser(sendData[0].id, sendDB_data)
    } else {
      alert("Please complete the inputs below")
    }
  };

  const handleInactive = async () => {
    const sendDB_data = {
      inactive_at: firebase.firestore.Timestamp.now(),
    }
    props.setModalForUpdate(false);
    props.setShowEditUserID(0)
    await props.inactiveUser(sendData[0].id, sendDB_data)
  }

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
              props.setModalForUpdate(false);
              props.setShowEditUserID(0)
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
                            autoFocus
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
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                          >
                            <option value="">Choose...</option>
                            <option value="Tester">Tester</option>
                            <option value="Admin">Admin</option>
                            <option value="App User">App User</option>
                            <option value="Super Admin">Super Admin</option>
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feInputState">Subscription Type</label>
                          <FormSelect
                            name="subscriptiontype"
                            value={subscriptionType}
                            onChange={(e) => setSubscriptionType(e.target.value)}
                          >
                            <option value="">Choose...</option>
                            {subscriptionTypes.map((each, id) => (
                              <option key={id}>{each}</option>
                            ))}
                          </FormSelect>
                        </Col>

                        <Col md="6" className="form-group">
                          <label htmlFor="feInputState">State</label>
                          <FormSelect
                            defaultValue={each.state}
                            onChange={(e) => setState(e.target.value)}
                          >
                            <option value="">Choose...</option>
                            {props.states.map((item, idx) => <option key={idx}>{item.name}</option>)}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label>District</label>
                          <FormSelect
                            defaultValue={each.district}
                            onChange={e => setDistrict(e.target.value)}
                          >
                            <option value="">Choose...</option>
                            {props.districts.filter(element => element.state === state).map((item, idx) => <option key={idx}>{item.name}</option>)}
                          </FormSelect>
                        </Col>

                        <Col md="6" className="form-group">
                          <label>Town</label>
                          <FormSelect
                            defaultValue={each.town}
                            onChange={e => setTown(e.target.value)}
                          >
                            <option value="">Choose...</option>
                            {props.towns.filter(element => element.district === district && element.state === state).map((item, idx) => <option key={idx}>{item.name}</option>)}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label>Subscription End Date</label>
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
                      <Button size="sm" pill theme="primary" onClick={handleClickSave}>
                        Update
                      </Button>
                      <Button size="sm" pill theme="danger" onClick={handleInactive}>
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
