import React, { useState } from "react";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  FormInput,
  Button,
  Badge
} from "shards-react";
import Modal from "../common/Modal";

const EditEvent = props => {
  const [tagData, setTagData] = useState("");
  const [newtags, setNewTag] = useState([]);

  const handleSetTagData = () => {
    setNewTag(oldTags => {
      return [...oldTags, tagData];
    });
    setTagData("");
  };

  const handleClose = itemval => {
    const remainTag = newtags.filter(x => x !== itemval);
    setNewTag(remainTag);
  };
  return (
    <Modal
      containModalSize="bd-example-modal-lg"
      modalSize="modal-lg"
      classNames={props.classNames}
      title="Edit Event"
      onClick={props.onClick}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <Row form>
                  {/* First Name */}
                  <Col md="6">
                    <FormGroup>
                      <label htmlFor="spaceName">Event Name</label>
                      <FormInput
                        id="spaceName"
                        placeholder="Event Name"
                        value=""
                        onChange={() => {}}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Location</label>
                      <FormInput
                        placeholder="Location"
                        value=""
                        onChange={() => {}}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    <label className="font-weight-bold ">Details</label>
                  </Col>
                  <Col sm="10" className="form-group">
                    <ListGroup>
                      <ListGroupItem>
                        <FormInput
                          placeholder="Subtitle"
                          value=""
                          onChange={() => {}}
                        />
                        <FormInput
                          className="mt-2"
                          placeholder="Description"
                          value=""
                          onChange={() => {}}
                        />
                      </ListGroupItem>
                    </ListGroup>
                  </Col>
                  <Col sm="2">
                    <Button outline theme="primary" size="sm">
                      <i className="material-icons">add</i>
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col sm="8">
                    <label>Tags</label>
                    <FormInput
                      placeholder="Tag Name"
                      value={tagData}
                      onChange={e => setTagData(e.target.value)}
                    />
                  </Col>
                  <Col sm="4" className="pt-2">
                    <Button
                      className="mt-4"
                      onClick={handleSetTagData}
                      outline
                      theme="secondary"
                    >
                      Add More
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col sm="12">
                    {/* Tag List */}
                    {newtags.map((itemval, id) => {
                      return (
                        <Badge pill outline className="mr-2">
                          {itemval}{" "}
                          <i
                            className="material-icons"
                            onClick={() => handleClose(itemval)}
                          >
                            close
                          </i>
                        </Badge>
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-4">
                    <Button theme="accent">Update Event</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  );
};

export default EditEvent;
