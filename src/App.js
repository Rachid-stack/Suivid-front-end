import React from 'react';

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import Login from './components/Login';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CategorieCourrier from './components/CategorieCourrier';
import NotFound from './components/NotFound';
import TypeCourrier from './components/TypeCourrier';
import TypeCorrespondant from './components/TypeCorrespondant';
import RegistreCourrier from './components/RegistreCourrier';
//import StatutCourrier from './components/StatutCourrier';
//import Service from './components/Service';
//import TypeDossier from './components/TypeDossier';


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CategorieCourrier}/>
        <Route path="/categories-courrier" exact component={CategorieCourrier}/>
        <Route path="/types-courrier" exact component={TypeCourrier}/>
        <Route path="/types-correspondant" exact component={TypeCorrespondant}/>
        <Route path="/registre-courrier" exact component={RegistreCourrier}/>
        <Route path="/login" exact component={Login}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
