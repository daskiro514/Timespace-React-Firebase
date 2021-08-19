import React from "react"
import { Row, Col, ListGroup, ListGroupItem, FormInput, Button } from "shards-react"
import { CSwitch } from '@coreui/react'
import Modal from "../../../components/common/Modal"
import firebase from "../../../util/firebase"
const db = firebase.firestore()

const LanguageCreateModal = ({ setLanguageModalForCreate, classNames, getLanguages, setIsLanguagesLoading }) => {
  const [name, setName] = React.useState("")
  const [status, setStatus] = React.useState(false)

  const createLanguage = async () => {
    if (name) {
      setIsLanguagesLoading(true);
      await db.collection("Languages").add({
        name: name,
        status: status,
        created_at: firebase.firestore.Timestamp.now(),
        updated_at: firebase.firestore.Timestamp.now(),
      })
      closeModal()
      await getLanguages()
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
    setLanguageModalForCreate(false)
  }

  return (
    <Modal
      classNames={classNames}
      title="Create Language"
      onClick={() => closeModal()}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row form>
            <Col md="12" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>Language Name:</label>
              <FormInput
                placeholder="Language..."
                value={name ? name : ""}
                onChange={e => setName(e.target.value)}
              /><br /><br />
              <label style={{ fontWeight: 'bold' }}>Language Status:</label>
              <CSwitch onChange={() => setStatus(!status)} checked={status ? true : false} className='mb-0 float-right' color='info' size='lg' tabIndex="0" /><br /><br />
              <Button onClick={() => createLanguage()} size="sm" theme="primary" style={{ float: "right" }}>
                Save
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default LanguageCreateModal