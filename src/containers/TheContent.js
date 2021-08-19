import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to="/login" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
// import React, {useEffect, useState, Suspense } from 'react'
// import {
//   Redirect,
//   Route,
//   Switch
// } from 'react-router-dom'
// import { CContainer, CFade } from '@coreui/react'

// // routes config
// import routes from '../routes'
  
// const loading = (
//   <div className="pt-3 text-center">
//     <div className="sk-spinner sk-spinner-pulse"></div>
//   </div>
// )

// const TheContent = () => {
//   const[email, Setemail] = useState('')
//   useEffect(()=>{

//     const data = localStorage.getItem('data')
   
    
//     if(data){
//       console.log(data)
//       Setemail(data)
//      }
    
//     },[])

//     const LoginFunction = ()=>{
//       alert('yes')
//     }
  
//   return (
//     <main className="c-main">
//       <CContainer fluid>
//         <Suspense fallback={loading}>
//           <Switch>
//             {routes.map((route, idx) => {
//               return route.component && (
//                 <Route
//                   key={idx}
//                   path={route.path}
//                   exact={route.exact}
//                   name={route.name}
//                   render={props => 
                    
//                     email ?  (<route.component {...props} LoginFunction={LoginFunction} /> ):
//                      (   <Redirect from="/dashboard" to="/login" />)
                    
//                   } />
//               )
//             })}
//             <Redirect from="/" to="/dashboard" />
//           </Switch>
//         </Suspense>
//       </CContainer>
//     </main>
//   )
// }

// export default React.memo(TheContent)
