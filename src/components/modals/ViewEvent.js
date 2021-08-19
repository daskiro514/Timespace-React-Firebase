import React from "react";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  FormGroup,
  Badge
} from "shards-react";
import Modal from "../common/Modal";

const ViewEvent = props => {
  return (
    <Modal
      containModalSize="bd-example-modal-lg"
      modalSize="modal-lg"
      classNames={props.classNames}
      title="View Event Details"
      onClick={props.onClick}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Row form>
                {/* First Name */}
                <Col md="12" className="form-group">
                  <FormGroup>
                    <label className="d-block">
                      <strong>Title</strong>
                    </label>
                    <span>My School</span>
                  </FormGroup>
                  <FormGroup>
                    <label className="d-block">
                      <strong>Location</strong>
                    </label>
                    <span>Maysoor</span>
                  </FormGroup>

                  <FormGroup>
                    <label className="d-block">
                      <strong>Details</strong>
                    </label>
                    <span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex
                    </span>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="8">
                  <label className="d-block">
                    <strong>Tags</strong>
                  </label>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="12">
                  {/* Tag List */}
                  <Badge pill outline className="mr-2">
                    Tag name
                  </Badge>
                </Col>
              </Row>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  );
};

export default ViewEvent;
