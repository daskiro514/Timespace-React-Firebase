import React from "react";
import { Row, Col, ListGroup, ListGroupItem, Form, FormSelect, Button, } from "shards-react";
import Modal from "../../../../components/common/Modal";
import firebase from "../../../../util/firebase";
const db = firebase.firestore();

const EditUser = props => {
  const [sendData, setSendData] = React.useState([]);
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [userType, setUserType] = React.useState("App User");
  const [state, setState] = React.useState(null);
  const [district, setDistrict] = React.useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = React.useState([])
  const [subscriptionEndDate, setSubscriptionEndDate] = React.useState(new Date().getTime());
  const [subscriptionType, setSubscriptionType] = React.useState("Pending");
  const [registeredBy, setRegisteredBy] = React.useState("");
  const [adminsNames, setAdminNames] = React.useState([]);
  const [created_at, setCreatedAt] = React.useState("");

  React.useEffect(() => {
    if (props.sendData === undefined) {
      setSendData([]);
    } else {
      setSendData([props.sendData]);
      setUserName(props.sendData.name);
      setEmail(props.sendData.email ? props.sendData.email : "");
      setMobile(props.sendData.number ? props.sendData.number : "");
      setState(props.sendData.state ? props.sendData.state : "");
      setDistrict(props.sendData.district ? props.sendData.district : "");
      setSubscriptionType(props.sendData.subscriptionType);
      setRegisteredBy(props.properAdmin(props.sendData.town).name);
      setCreatedAt(props.sendData.created_at ? props.sendData.created_at : firebase.firestore.Timestamp.now());
    }
  }, [props, props.sendData]);

  React.useEffect(() => {

    const getSubscriptionTypes = () => {
      db.collection("subscriptions").onSnapshot(function (data) {
        let subscriptions = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setSubscriptionTypes(subscriptions);
      });
      db.collection("users").onSnapshot(function (data) {
        let temp = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        let nowDateSeconds = new Date().getTime() / 1000;
        temp = temp.filter(element => element.deleted_at === null && element.subscriptionEndDate.seconds > nowDateSeconds);
        let tempAdmins = temp.filter(element => element.userType === "Admin" || element.userType === "Super Admin");
        let tempAdminNames = [];
        tempAdmins.forEach(element => {
          tempAdminNames.push(element.name)
        });
        setAdminNames(tempAdminNames);
        setRegisteredBy(tempAdminNames[0]);
      });
    }
    getSubscriptionTypes();
  }, []);

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

  const allClear = () => {
    setUserName("");
    setEmail("");
    setMobile("");
    setUserType("Tester");
  }

  const approvePendingUser = async () => {
    const sendDB_data = {
      name: userName,
      email: email,
      mobile: mobile,
      userType: userType,
      state: state,
      district: district,
      created_at: created_at,
      updated_at: firebase.firestore.Timestamp.now(),
      administratedBy: registeredBy,
      subscriptionType: subscriptionType,
      subscriptionEndDate: firebase.firestore.Timestamp.fromDate(new Date(subscriptionEndDate)),
      deleted_at: null,
    }
    if (userName && mobile && subscriptionType && subscriptionEndDate && registeredBy) {
      props.setModalForUpdate(false);
      props.setIsLoading(true);
      await db.collection("new_users").doc(sendData[0].id).delete()
      await db.collection("users").add(sendDB_data);
      await props.getPendingUsers();
      allClear()
    } else {
      alert("Please check the subscriptionType");
    }
  };

  return (
    <div>
      {sendData.map((each, id) => {
        return (
          <Modal
            containModalSize="bd-example-modal-lg"
            modalSize="modal-lg"
            classNames={props.classNames}
            title="Approve Pending User"
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
                          <label htmlFor="feInputState">Subscription Type</label>
                          <FormSelect
                            name="subscriptiontype"
                            value={subscriptionType}
                            onChange={(e) => selectType(e.target.value)}
                          >
                            <option value="">Pending</option>
                            {subscriptionTypes.map((each, id) => (
                              <option key={id} value={each.planType}>{each.planType}</option>
                            ))}
                          </FormSelect>
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="feCity">Registered By</label>
                          <FormSelect
                            placeholder="User Type"
                            value={registeredBy}
                            onChange={(e) => setRegisteredBy(e.target.value)}
                          >
                            {adminsNames.map((each, id) => (
                              <option key={id}>{each}</option>
                            ))}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Button size="sm" pill onClick={approvePendingUser} theme="primary">
                        Approve
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
