import React from "react";
import { Row, Col, ListGroup, ListGroupItem } from "shards-react";
import Modal from "../../../../components/common/Modal";

const ViewUser = ({user, classNames, setModalForView}) => {
  return (
    <Modal
      classNames={classNames}
      title="View User Details"
      onClick={() => setModalForView(false)}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Row form>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>User Name</label>
                  <span>{user.name}</span>
                </Col>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Contact Number</label>
                  <span>{user.mobile}</span>
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Email</label>
                  <span>{user.email}</span>
                </Col>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>User Type</label>
                  <span>{user.userType}</span>
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>State</label>
                  <span>{user.state}</span>
                </Col>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>District</label>
                  <span>{user.district}</span>
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Registration Date</label>
                  <span>{user.updated_at ? user.updated_at.toDate().toLocaleDateString() : null}</span>
                </Col>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Registered By</label>
                  <span>{user.addminitstratedBy}</span>
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Subscription Type</label>
                  {user.subscriptionEndDate ? user.subscriptionEndDate.seconds < new Date().getTime() / 1000 ? <span>Expired</span> : <span>{user.subscriptionType}</span> : null}
                </Col>
                <Col md="6" className="form-group">
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Subscription End Date</label>
                  <span>{user.subscriptionEndDate ? user.subscriptionEndDate.toDate().toLocaleDateString() : null}</span>
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
