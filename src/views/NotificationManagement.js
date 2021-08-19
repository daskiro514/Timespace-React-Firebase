import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, ListGroup, CardFooter } from "shards-react";
import NotificationManageFields from "../components/components-overview/NotificationManageFields";
import NotificationDataFields from "../components/components-overview/NotificationDataFields";
import firebase from "../util/firebase";

const NotificationManagement = () => {
  const [notificationTitle, setNotificationTitle] = useState("Title");
  const [notificationDescription, setNotificationDescription] = useState("Description");
  const [notificationData, setNotificationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  const handleSave = async () => {
    const db = firebase.firestore();
    const sendData = {
      title: notificationTitle,
      description: notificationDescription,
      created_at: firebase.firestore.Timestamp.now(),
      updated_at: firebase.firestore.Timestamp.now(),
      deleted_at: null,
    };
    if (notificationTitle && notificationDescription) {
      await db.collection("notifications").add(sendData);
      handleClear();
    } else {
      handleClear();
      return
    }
  };

  const handleClear = () => {
    setNotificationTitle("Title");
    setNotificationDescription("Description");
  };

  const handleUpdate = async (id) => {
    const db = firebase.firestore();
    const sendData = {
      title: updateTitle,
      description: updateDescription,
      updated_at: firebase.firestore.Timestamp.now(),
    };
    if (updateTitle && updateDescription) {
      await db.collection("notifications").doc(id).update(sendData);
      handleClear();
    } else {
      handleClear();
      return
    }
  };

  const handleDelete = async (id) => {
    setNotificationData(prevState => prevState.filter(x => x.id !== id));
    const db = firebase.firestore();
    await db.collection("notifications").doc(id).delete();
  };

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("notifications").onSnapshot(function (data) {
      setNotificationData(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Please Wait...</div>;
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <h1>Notification Management</h1>
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Notification</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <ListGroup flush>
                <NotificationManageFields
                  notificationTitle={notificationTitle}
                  notificationDescription={notificationDescription}
                  setNotificationTitle={setNotificationTitle}
                  setNotificationDescription={setNotificationDescription}
                />
              </ListGroup>
            </CardBody>
            <CardFooter>
              <Row className="justify-content-start">
                <Button
                  size="md"
                  theme="primary"
                  className="d-flex mt-3 mt-sm-0"
                  style={{ marginLeft: 25 }}
                  onClick={() => handleSave()}
                >
                  Save
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      {notificationData.map((item, id) => (
        <NotificationDataFields
          notificationData={item}
          handleUpdate={handleUpdate}
          key={id}
          handleDelete={handleDelete}
          setUpdateTitle={setUpdateTitle}
          setUpdateDescription={setUpdateDescription}
          setNotificationData={setNotificationData}
        />
        )
      )}
    </Container>
  );
};

export default NotificationManagement;
