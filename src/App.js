import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import ClassesPage from './components/ClassesPage/ClassesPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ClassPage from './components/ClassPage/ClassPage'
//import AssignmentDetailPage from './components/AssignmentDetailPage/AssignmentDetailPage'
import AssignmentPage from './components/Assignment/Assignments.jsx';
import AssignmentDetailPage from './components/AssignmentDetailPage/AssignmentDetailPage';
function App() {
  return (
    <Router>
    <div className="App">
     <Switch>
     <Route path='/classesPage/:userId/:userName' component={ClassesPage}/>
       <Route path='/classPage/:userId/:userName/:classId/:name/:courseId/:isInstructor' render={(props) => <ClassPage {...props}/>}/>
       <Route exact path='/' component={AssignmentPage}/>
       <Route path='/assignmentDetailPage/:userId/:userName' component={AssignmentDetailPage}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
