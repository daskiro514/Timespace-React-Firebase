import React from "react";
import { Row, Col, FormInput, FormTextarea, Form, ListGroupItem } from "shards-react";

const NotificationManageFields = props => {
  return (
    <ListGroupItem key={props.key} className="p-3">
      <Row>
        <Col>
          <Form className="border border-bottom p-4 rounded mb-4">
            <Row className="justify-content-start">
              <Col md="8" className="form-group">
                <label htmlFor="feInputState">Notification Title</label>
                <FormInput
                  autoFocus
                  id="userName"
                  placeholder="Ex. Custom Message"
                  value={props.notificationTitle}
                  onChange={e => props.setNotificationTitle(e.target.value)}
                />
              </Col>
            </Row>
            <Row form className="justify-content-start">
              {/* Description */}
              <Col md="8" className="form-group">
                <label htmlFor="feDescription">Notification Description</label>
                <FormTextarea
                  id="feDescription"
                  value={props.notificationDescription}
                  onChange={e => props.setNotificationDescription(e.target.value)}
                  rows="5"
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default NotificationManageFields;
