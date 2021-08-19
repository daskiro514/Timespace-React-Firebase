import React from "react";
import { Row, Col, ListGroup, ListGroupItem } from "shards-react";
import Modal from "../../../components/common/Modal";

const AdminViewModal = ({admin, classNames, setAdminModalForView}) => {
  return (
    <Modal
      classNames={classNames}
      title="View Admin"
      onClick={() => setAdminModalForView(false)}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row form>
            <Col md="6" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>User Name</label>
              <span>{admin.name}</span>
            </Col>
            <Col md="6" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>Contact Number</label>
              <span>{admin.mobile}</span>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
};

export default AdminViewModal;
