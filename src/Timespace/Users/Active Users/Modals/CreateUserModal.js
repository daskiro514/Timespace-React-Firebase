import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Form, FormInput, FormSelect, Button } from "shards-react";
import { SingleDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import firebase from '../../../../util/firebase'
import Modal from "../../../../components/common/Modal";
const db = firebase.firestore();

const CreateUser = (props) => {
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contactNum, setContactNum] = React.useState("");
  const [userType, setUserType] = React.useState("Tester");
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [town, setTown] = React.useState("");
  const [registeredBy, setRegisteredBy] = React.useState("");
  const [subscriptionTypes, setSubscriptionTypes] = React.useState([])
  const [subscriptionType, setSubscriptionType] = React.useState("");
  const [subscriptionEndDate, setSubscriptionEndDate] = React.useState(new Date().getTime());
  const [properAdmin, setProperAdmin] = React.useState("")

  React.useEffect(() => {
    const getSubscriptionTypes = () => {
      db.collection("subscriptions").onSnapshot(function (data) {
        let subscriptions = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setSubscriptionTypes(subscriptions);
        setSubscriptionType(subscriptions[0].planType);
        let nowDateMiliSeconds = new Date().getTime();
        let estimateMiliSeconds = 0;
        if (subscriptions[0].durationType === "days") {
          estimateMiliSeconds = nowDateMiliSeconds + 86400000 * Number(subscriptions[0].duration);
        } else if (subscriptions[0].durationType === "weeks") {
          estimateMiliSeconds = nowDateMiliSeconds + 604800000 * Number(subscriptions[0].duration);
        } else if (subscriptions[0].durationType === "months") {
          estimateMiliSeconds = nowDateMiliSeconds + 2628000000 * Number(subscriptions[0].duration);
        } else if (subscriptions[0].durationType === "years") {
          estimateMiliSeconds = nowDateMiliSeconds + 31540000000 * Number(subscriptions[0].duration);
        }
        setSubscriptionEndDate(estimateMiliSeconds)
      });
    }
    getSubscriptionTypes();
  }, []);

  const allClear = () => {
    setUserName("");
    setEmail("");
    setContactNum("");
    setUserType("Tester");
    setState("");
    setDistrict("");
    setTown("");
    setRegisteredBy("")
    setDistrict("");
    setProperAdmin("")
  }

  function ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
      return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
  }

  const handleButton = async () => {
    const sendDB_data = {
      name: userName,
      email: email,
      mobile: contactNum,
      userType: userType,
      state: state,
      district: district,
      town: town,
      created_at: firebase.firestore.Timestamp.now(),
      updated_at: firebase.firestore.Timestamp.now(),
      administratedBy: registeredBy,
      subscriptionType: subscriptionType,
      subscriptionEndDate: firebase.firestore.Timestamp.fromDate(new Date(subscriptionEndDate)),
      deleted_at: null,
    }

    if (userName && ValidateEmail(email) && contactNum && state && district && town && registeredBy) {
      props.setModalForCreate(false);
      await props.addNewUser(sendDB_data);
      allClear();
    } else {
      alert("please insert correct info")
    }
  }

  const selectType = (subscriptType) => {
    setSubscriptionType(subscriptType);
    let tempSubscript = subscriptionTypes.find(element => element.planType === subscriptType);
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
    setSubscriptionEndDate(estimateMiliSeconds);
  }

  const onSelectTown = (town) => {
    setTown(town)
    let admins = props.admins
    let adminForRequest = {};
    admins.forEach(element => {
      if (element.town === town) {
        adminForRequest = element;
      }
    });
    if (adminForRequest.name) {
      setProperAdmin(adminForRequest.name)
    } else {
      setProperAdmin("")
    }
  }

  const superAdmins = () => {
    let admins = props.admins
    let adminsForRequest = admins.filter(element => element.userType === "Super Admin");
    return adminsForRequest
  }

  return (
    <Modal
      classNames={props.classNames}
      title="Create User"
      onClick={() => { props.setModalForCreate(false); allClear() }}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Form>
            <Row form>
              <Col md="6" className="form-group">
                <label>User Name</label>
                <FormInput
                  placeholder="User name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Col>

              <Col md="6" className="form-group">
                <label>Email</label>
                <FormInput
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
            </Row>
            <Row form>
              <Col md="6" className="form-group">
                <label htmlFor="userContact">Contact Number</label>
                <FormInput
                  placeholder="Contact Number"
                  value={contactNum}
                  onChange={(e) => setContactNum(e.target.value)}
                />
              </Col>

              <Col md="6" className="form-group">
                <label htmlFor="feCity">User Type</label>
                <FormSelect
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="Tester">Tester</option>
                  <option value="Admin">Admin</option>
                  <option value="App User">App User</option>
                  <option value="Super Admin">Super Admin</option>
                </FormSelect>
              </Col>
            </Row>
            <Row form>
              <Col md="6" className="form-group">
                <label>Subscription Type</label>
                <FormSelect
                  value={subscriptionType}
                  onChange={(e) => selectType(e.target.value)}
                >
                  {subscriptionTypes.map((each, id) => (
                    <option key={id} value={each.planType}>{each.planType}</option>
                  ))}
                </FormSelect>
              </Col>

              <Col md="6" className="form-group">
                <label>State</label>
                <FormSelect
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {props.states.map((each, id) => (
                    <option key={id} value={each.name}>{each.name}</option>
                  ))}
                </FormSelect>
              </Col>
            </Row>

            <Row form>
              <Col md="6" className="form-group">
                <label>District</label>
                <FormSelect
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {props.districts.filter(element => element.state === state).map((each, id) => (
                    <option key={id} value={each.name}>{each.name}</option>
                  ))}
                </FormSelect>
              </Col>

              <Col md="6" className="form-group">
                <label>Town</label>
                <FormSelect
                  value={town}
                  onChange={(e) => onSelectTown(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {props.towns.filter(element => element.district === district && element.state === state).map((each, id) => (
                    <option key={id} value={each.name}>{each.name}</option>
                  ))}
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

              <Col md="6" className="form-group">
                <label>Registered By</label>
                <FormSelect
                  value={registeredBy}
                  onChange={(e) => setRegisteredBy(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {properAdmin ? <option value={properAdmin}>{properAdmin + "(Local Admin)"}</option> : null}
                  {superAdmins().map((each, i) =>
                    <option key={i} value={each.name}>{each.name + "(Super Admin)"}</option>
                  )}
                </FormSelect>
              </Col>
            </Row>

            <Button
              size="sm"
              pill
              theme="primary"
              onClick={handleButton}
            >
              Save
            </Button>

            <Button
              size="sm"
              pill
              theme="info"
              onClick={allClear}
            >
              Clear
            </Button>
          </Form>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  );
};

export default CreateUser;
