import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Form,
  FormInput,
  Button
} from "shards-react";
import Modal from "../common/Modal";

const ViewFeedback = props => {
  const [viewData, setViewData] = useState({});
  const [reply,setReply] = useState('')
  useEffect(() => {
    if (props.sendData === undefined) {
      return setViewData({});
    } else {
      return setViewData(props.sendData);
    }
  }, [props.sendData]);
  function handleSend(id,reply) {
    props.handleReply(id,reply)
   
  }
  return (
    <Modal
      classNames={props.classNames}
      onClick={props.onClick}
      title="User Feedback"
      modalSize="modal-lg"
      containModalSize="bd-example-modal-lg"
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <Row form>
                  {/* First Name */}
                  <Col md="6" className="form-group">
                    <h6>
                      <strong>User Name :</strong>
                    </h6>
                    <span>{viewData.name}</span>
                  </Col>
                  {/* Last Name */}
                  <Col md="6" className="form-group">
                    <h6>
                      <strong>Date of Feedback :</strong>
                    </h6>
                    <span>{viewData.feedDate}</span>
                  </Col>
                  {/* Last Name */}
                </Row>
                <Row form>
                  {/* First Name */}
                  <Col md="6" className="form-group">
                    <h6>
                      <strong>Feedback Type :</strong>
                    </h6>
                    <span>{viewData.feedtype}</span>
                  </Col>
                  {/* Last Name */}
                  <Col md="12" className="form-group">
                    <h6>
                      <strong>Feedback :</strong>
                    </h6>
                    <span>{viewData.feedback}</span>
                  </Col>
                  {/* Last Name */}
                </Row>
                <Row form>
                  {/* First Name */}
                  {/* <Col md="8" className="form-group">
                      <h6>
                      <strong>Reply :</strong>
                      </h6>
                      <span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam,
                      </span>
                    </Col> */}
                  {/* Last Name */}
                  {/* <Col md="6" className="form-group">
                    <h6>
                      <strong>Date of Reply :</strong>
                    </h6>
                    <span>24-02-2021</span>
                  </Col> */}
                  {/* Last Name */}
                  <Col md="6" className="form-group">
                    <h6>
                      <strong>Status :</strong>
                    </h6>
                    <span>{viewData.status}</span>
                  </Col>
                </Row>
                <Row></Row>
                <Row form>
                  {/* City */}
                  <Col md="12" className="form-group">
                    <label htmlFor="feCity">Reply </label>
                    {viewData.status === "New" ? (
                      <div>
                        <FormInput
                          id="feCity"
                          placeholder="Reply Message"
                          value={reply}
                          onChange={e => setReply(e.target.value)}
                        />
                        <Button
                          theme="accent"
                          onClick={e => {
                            handleSend(viewData.id,reply);
                          }}
                        >
                          Send
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <span>{viewData.reply}</span>
                      </div>
                    )}
                  </Col>
                  {/* State */}
                </Row>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  );
};

export default ViewFeedback;
