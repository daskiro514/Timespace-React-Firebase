import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, ListGroupItem, Form, FormGroup, FormSelect, Button } from "shards-react";
import Modal from "../common/Modal";
// import emailjs from 'emailjs-com';
import firebase from "../../util/firebase";

const NotificationUser = props => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("notifications").onSnapshot(function (data) {
      let temp = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setNotifications(temp);
      // props.setCurrentNotification(temp[0]);
    });
  }, []);

  return (
    <Modal
      classNames={props.classNames}
      title="Notification to User"
      onClick={props.onClick}
    >
      <ListGroup flush>
        <Form>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="feTown">Notification Type</label>
                  <FormSelect id="noficationType" onChange={(e) => props.setCurrentNotification(notifications.find(element => element.id === e.target.value))} >
                    {notifications.map((each, i) => (
                      <option value={each.id} key={i}>{each.title}</option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  {/* <FormTextarea onChange={handleChange} /> */}
                </FormGroup>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Button theme="accent" onClick={() => props.sendNotification()} >Send</Button>
          </ListGroupItem>
        </Form>
      </ListGroup>
    </Modal>
  );
};

export default NotificationUser;
