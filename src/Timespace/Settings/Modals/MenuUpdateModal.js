import React from "react"
import { Row, Col, ListGroup, ListGroupItem, FormInput, Button } from "shards-react"
import { CSwitch } from '@coreui/react'
import Modal from "../../../components/common/Modal"
import firebase from "../../../util/firebase"
const db = firebase.firestore()

const MenuUpdateModal = ({ setMenuModalForUpdate, menu, classNames, getMenus, setIsMenusLoading }) => {
  const [name, setName] = React.useState("")
  const [status, setStatus] = React.useState(false)

  React.useEffect(() => {
    setName(menu.name)
    setStatus(menu.status)
  }, [menu])

  const updateMenu = async () => {
    if (name) {
      setIsMenusLoading(true)
      await db.collection("menus").doc(menu.id).update({
        name: name,
        status: status,
        updated_at: firebase.firestore.Timestamp.now(),
      })
      closeModal()
      await getMenus()
    } else {
      alert("Please check the input fields below.")
    }
  }

  const allClear = () => {
    setName("")
    setStatus(false)
  }

  const closeModal = () => {
    allClear()
    setMenuModalForUpdate(false)
  }

  return (
    <Modal
      classNames={classNames}
      title="Update Menu"
      onClick={() => closeModal()}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row form>
            <Col md="12" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>Menu Name:</label>
              <FormInput
                placeholder="Menu Name"
                value={name ? name : ""}
                onChange={e => setName(e.target.value)}
              /><br /><br />
              <label style={{ fontWeight: 'bold' }}>Menu Status:</label>
              <CSwitch onChange={() => setStatus(!status)} checked={status ? true : false} className='mb-0 float-right' color='info' size='lg' tabIndex="0" /><br /><br />
              <Button onClick={() => updateMenu()} size="sm" theme="primary" style={{ float: "right" }}>
                Update
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default MenuUpdateModal