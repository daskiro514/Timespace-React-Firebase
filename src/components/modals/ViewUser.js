import React, { useState, useEffect } from "react";
import {Row,Col,ListGroup,ListGroupItem} from "shards-react";
//import RangeDatePicker from "../common/RangeDatePicker";
import Modal from "../common/Modal";

const ViewUser = (props) => {
  const [viewData, setViewData] = useState({});
  useEffect(() => {
    if (props.sendData === undefined) {
      return setViewData({});
    } else {
      return setViewData(props.sendData);
    }
  }, [props.sendData]);
  if (props.viewType === "expired")
    return (
      <Modal
        classNames={props.classNames}
        title="View User Details"
        onClick={() => {
          props.onClick();
          setViewData({});
        }}
      >
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>User Name</label>
                    <span>{viewData.name}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Contact Number</label>
                    <span>{viewData.mobile}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Email</label>
                    <span>{viewData.email}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>User Type</label>
                    <span>{viewData.userType}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>State</label>
                    <span>{viewData.state}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>District</label>
                    <span>{viewData.district}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Registration Date</label>
                    <span>{viewData.updated_at ? viewData.updated_at.toDate().toLocaleDateString() : null}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Registered By</label>
                    <span>{viewData.addminitstratedBy}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Subscription Type</label>
                    {viewData.subscriptionEndDate ? viewData.subscriptionEndDate.seconds < new Date().getTime() / 1000 ? <span>Expired</span> : <span>{viewData.subscriptionType}</span> : null}
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Subscription End Date</label>
                    <span>{viewData.subscriptionEndDate ? viewData.subscriptionEndDate.toDate().toLocaleDateString() : null}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Modal>
    );
  else 
    return (
      <Modal
        classNames={props.classNames}
        title="View User Details"
        onClick={() => {
          props.onClick();
          setViewData({});
        }}
      >
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>User Name</label>
                    <span>{viewData.name}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Contact Number</label>
                    <span>{viewData.mobile}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Email</label>
                    <span>{viewData.email}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>User Type</label>
                    <span>{viewData.userType}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>State</label>
                    <span>{viewData.state}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>District</label>
                    <span>{viewData.district}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Registration Date</label>
                    <span>{viewData.updated_at ? viewData.updated_at.toDate().toLocaleDateString() : null}</span>
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Registered By</label>
                    <span>{viewData.addminitstratedBy}</span>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Subscription Type</label>
                    {viewData.subscriptionEndDate ? viewData.subscriptionEndDate.seconds < new Date().getTime() / 1000 ? <span>Expired</span> : <span>{viewData.subscriptionType}</span> : null}
                  </Col>
                  <Col md="6" className="form-group">
                    <label className="d-block" style={{ fontWeight: 'bold' }}>Subscription End Date</label>
                    <span>{viewData.subscriptionEndDate ? viewData.subscriptionEndDate.toDate().toLocaleDateString() : null}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Modal>
    );
};

export default ViewUser;
