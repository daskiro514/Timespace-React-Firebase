import React, { useState } from "react";
import { Row, Col, CardBody, Card, FormInput, FormTextarea, Button, ListGroupItem } from "shards-react";
import { BsTrash, BsPencil } from "react-icons/bs";

const NotificationDataFields = props => {
  const [classUpdate, setClassUpdate] = useState(false);
  const [editID, setEditID] = useState(0);

  const handleEdit = id => {
    props.setUpdateTitle(props.notificationData.title);
    props.setUpdateDescription(props.notificationData.description);
    setClassUpdate(true);
    setEditID(id);
  };

  const handleUpdate = id => {
    props.handleUpdate(id);
    setClassUpdate(false);
    setEditID(0);
  };

  const handleDelete = id => {
    const result = window.confirm(
      "Are you sure you want to delete this account"
    );
    if (result) {
      props.handleDelete(id);
      setClassUpdate(false);
      setEditID(0);
    }
  };

  const handleCancel = () => {
    setClassUpdate(false);
    setEditID(0);
  };

  return (
    <ListGroupItem className="p-3">
      <Row>
        {classUpdate && props.notificationData.id === editID ? (
          <Col>
            <Row className="justify-content-start">
              <Col md="10" className="form-group">
                <label htmlFor="feInputState">Notification Title</label>
                <FormInput
                  name="title"
                  placeholder="Ex. Custom Message"
                  onChange={e => props.setUpdateTitle(e.target.value)}
                  value={props.notificationData.title}
                />
              </Col>
              <Col md="2" style={{ marginTop: 30 }}>
                <Button
                  className="mr-1"
                  theme="primary"
                  onClick={() => handleUpdate(props.notificationData.id)}
                >
                  <i className="material-icons">update</i>
                </Button>
                <Button
                  className="mr-1"
                  theme="primary"
                  onClick={() => handleCancel()}
                >
                  <i className="material-icons">cancel</i>
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-start">
              <Col md="10" className="form-group">
                <label htmlFor="feDescription">Notification Description</label>
                <FormTextarea
                  name="description"
                  onChange={e => props.setUpdateDescription(e.target.value)}
                  value={props.notificationData.description}
                  rows="5"
                />
              </Col>
            </Row>
          </Col>
        ) : (
          <Col>
            <Card>
              <CardBody>
                <Row className="justify-content-start">
                  <Col md="10" className="form-group">
                    <label htmlFor="feInputState">Notification Title</label>
                    <p>{props.notificationData.title}</p>
                  </Col>
                  <Col md="2" style={{ marginTop: 30 }}>
                    <Button
                      pill
                      className="mr-1"
                      theme="success"
                      onClick={() => handleEdit(props.notificationData.id)}
                    >
                      <BsPencil />
                    </Button>
                    <Button
                      pill
                      className="mr-1"
                      theme="primary"
                      onClick={() => handleDelete(props.notificationData.id)}
                    >
                      <BsTrash />
                    </Button>
                  </Col>
                </Row>
                <Row className="justify-content-start">
                  <Col md="10" className="form-group">
                    <label htmlFor="feDescription">
                      Notification Description
                    </label>
                    <p>{props.notificationData.description}</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </ListGroupItem>
  );
};

export default NotificationDataFields;
