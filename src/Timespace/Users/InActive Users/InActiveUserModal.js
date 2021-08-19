import React, { useState, useEffect } from "react"
import { Row, Col, ListGroup, ListGroupItem, Button } from "shards-react"
import firebase from "../../../util/firebase"
import Modal from "../../../components/common/Modal"
const db = firebase.firestore()

const InActiveUserModal = ({userForView, setModalForView, getUsers, setIsLoading, classNames}) => {
  const [user, setUser] = useState({})

  useEffect(() => {
    if (userForView === undefined) {
      return setUser({})
    } else {
      return setUser(userForView)
    }
  }, [userForView])

  const reactiveUser = async () => {
    closeModal()
    setIsLoading(true)
    await db.collection("users").doc(userForView.id).update({inactive_at: null})
    await getUsers()
  }

  const closeModal = () => {
    setModalForView(false)
    setUser({})
  }

  return (
    <Modal
      classNames={classNames}
      title="View User Details"
      onClick={() => closeModal()}
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
                  <label className="d-block" style={{ fontWeight: 'bold' }}>Inactive Date</label>
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
              <Button
                size="sm"
                pill
                theme="primary"
                className="mr-1"
                onClick={reactiveUser}
              >
                Re-Active
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default InActiveUserModal
