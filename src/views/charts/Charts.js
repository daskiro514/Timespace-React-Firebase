import React from 'react'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader
} from '@coreui/react'
import { DocsLink } from 'src/reusable'

const Charts = () => {

  return (
    <CCardGroup columns className = "cols-2" >
      <CCard>
        <CCardHeader>
          Subscription Plan
          <DocsLink href="http://www.chartjs.org"/>
        </CCardHeader>
        <CCardBody>
           <h1>Subscription plan</h1>
        </CCardBody>
      </CCard>

    </CCardGroup>
  )
}

export default Charts
