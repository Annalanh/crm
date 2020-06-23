import React from 'react';
import ManagePage from './ManagePage'
import EditPage from './EditPage'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class App extends React.Component{
    constructor(props){
      super(props)
    }
    render(){
      return (
        <>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ManagePage}/>
              <Route exact path="/edit" component={EditPage}/>
            </Switch>
          </BrowserRouter>
        </>
      )
    }
}


export default App;
