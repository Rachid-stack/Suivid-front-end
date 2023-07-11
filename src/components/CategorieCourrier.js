import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import Header from './common/Header';
import Footer from './common/Footer';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import FadeLoader from "react-spinners/FadeLoader";
import CategorieCourrierService from '../services/CategorieCourrierService';

const CategorieCourrier = () => {  
  const [items, setItems] = useState();
  const [element, setElement] = useState();
  const [loading, setLoading] = useState(false);   //Loading de la page (partie interne)
  const [dtLoading, setDtLoading] = useState(false); //loading du Datatable
  const [total, setTotal] = useState();
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 5,
    page: 1,
  });
  const [showDialog, setShowDialog] = useState(false); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const [btLoading, setBtLoading ] = useState(false); //loading du bon de validation
  const [btConfirmLoading, setBtConfirmLoading ] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isAddMode, setIsAddMode] = useState(null);
  const toast = useRef(null);

  const actionsBody = (rowData) => {
    return <div className="bt-actions">
      <Button type='button' icon='pi pi-pencil' className='bt-action' onClick={() => {afficheDialog(rowData)}}/>
      <Button type='button' icon='pi pi-trash' className='bt-action' onClick={() => confirmDelete(rowData)}/>
    </div>
  };

  const dialogFooter = (
    <div>
        <Button onClick={() => setShowDialog(false)} className="p-button-secondary" label="Fermer" />
        <Button onClick={() => formik.submitForm()} loading={btLoading} className="p-button-primary" label="Enregistrer"/>
    </div>
  );

  /**
   * Ouverture du popup d'Ajout/Modification de l'item
   * @param {} item 
   */
  const afficheDialog = (item) => {
    formik.resetForm(); //on réinitialiser le formulaire
    if(item == null){ //cas d'un ajout
      setFormValues(null); //on réinitialise les valeur du formulaire à vide
      setIsAddMode(true); //Ajout
    }else{
      setIsAddMode(false);
      const rowValues = {...item};
      setFormValues(rowValues);
    }
    setShowDialog(true);
  };

  const confirmDelete = (item) => {
    setElement(item);
    setShowConfirmDialog(true);
  }

  const hideConfirmDialog = () => {
    setElement(null);
    setShowConfirmDialog(false);
  }

  const findIndexById = (id) => {
    let index = -1;
    for(let i = 0; i < items.length; i++){
      if(items[i].id === id){
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * Fermer la boite de dialogue
   */
  const hideDialog = () => {
    setShowDialog(false);
  }

  //Valeurs initales du formulaire
  const initialValues = {
    code: '',
    libelle: ''
  };

  //Fonction appelée lors de la soumission du formulaire
  const onFormSubmit = (values) => {
    setBtLoading(true);
    let message = "Une erreur est survenue veuillez réessayer ultérieurement";
    let _items = [...items]; //on copie les items;
    if(!isAddMode){ //MOD
      CategorieCourrierService.update(values).then((res)=>{
        if(res.status !== 200){ 
          toast.current.show({severity:'error', detail: message, life:'3000'});
        }else{  
         if(res.data.id){
           const index = findIndexById(res.data.id);
           _items[index] = res.data;
           message = "Modification enregistrée";
         }
         hideDialog();
         setItems(_items);
         toast.current.show({severity:'success', detail: message, life:'3000'});
        }
        setBtLoading(false);
      }).catch(err => {toast.current.show({severity:'error', detail: message, life:'3000'}); setBtLoading(false);} );
    }else{ //ADD
      CategorieCourrierService.create(values).then((res)=>{
        if(res.status !== 201){ //si la création est OK !
          toast.current.show({severity:'error', detail: message, life:'3000'});
        }else{  
          message = "Enregistrement effectué";
          _items.push(res.data); //on ajoute la nouvelle valeur
          _items.sort((a,b) => a.libelle.localeCompare(b.libelle, undefined, {sensitivity: 'base'})); //On trie par ordre aphab. de libellé 
          setItems(_items);
          setFormValues(null);
          hideDialog();
          toast.current.show({severity:'success', detail: message, life:'3000'});
        }
        setBtLoading(false);
      }).catch(err => {toast.current.show({severity:'error', detail: message, life:'3000'}); setBtLoading(false);});
    }
  };

  const validateForm = (values) => {
    let errors = {};
      if(!values.code){
        errors.code = 'Ce champ est obligatoire';
      }
      if(!values.libelle){
        errors.libelle = 'Ce champ est obligatoire';
      }
      return errors;
  }

  const deleteSelectedItem = () => {
    //suppression dans les items et dans la BD (application du )
    //let _items = items.fil
    setBtConfirmLoading(true);
    let _items = [...items]; //on copie les items;
    let message = "Une erreur est survenue veuillez réessayer ultérieurement";
    CategorieCourrierService.delete(element).then((res) => {
      if(res.status !== 200){
        toast.current.show({severity:'error', detail: message, life:'3000'});
      }else{
        message = "Suppression effecutée";
        const index = findIndexById(res.data.id);
        _items.splice(index, 1);
        setItems(_items);
        toast.current.show({severity:'success', detail: message, life:'3000'});
      }
      setBtConfirmLoading(false);
      hideConfirmDialog();
    }).catch(err => {toast.current.show({severity:'error', detail: message, life:'3000'}); setBtLoading(false);});
  };

  const confirmFooter = (
    <div>
        <Button onClick={() => setShowConfirmDialog(false)} className="p-button-secondary" label="Non" />
        <Button onClick={deleteSelectedItem} loading={btConfirmLoading} className="p-button-primary" label="Oui"/>
    </div>
  );

  /** Gestion du formulaire avec formik */
  const formik = useFormik({ 
    initialValues: (formValues || initialValues),
    onSubmit: onFormSubmit,
    validate: validateForm,
    enableReinitialize: true
  });

  //Chargement des données dans le datatable
  const itemsLoading = (params) => {
    setDtLoading(true);
    CategorieCourrierService.getAll(params).then((data) => {
      setTotal(data.total);
      //Tri par ordre aphabetique de libelle
      //source: https://www.codegrepper.com/code-examples/typescript/sort+array+of+objects+in+react+js
      //https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-in-javascript
      data.items.sort((a,b) => a.libelle.localeCompare(b.libelle, undefined, {sensitivity: 'base'})); 
      setItems(data.items);
      setDtLoading(false);
    }).catch( err => {
      /** TODO: Notification d'erreur */
    });
    //setDtLoading(false);
  }

  const onPage = (event) => {
    let _lazyParams = {...lazyParams, ...event};
    setLazyParams(_lazyParams);
  }

  const onFilter = (event) => {
    let _lazyParams = { ...lazyParams, ...event };
    _lazyParams['first'] = 0;
    _lazyParams['filters'] = globalFilter;
}

  const doFilter = () => {
    let _lazyParams = {...lazyParams};
    _lazyParams['filters'] = globalFilter;
    setLazyParams(_lazyParams);
  }
 
  useEffect(() => {
    itemsLoading(lazyParams);
  }, [lazyParams]);



  return (
      <div>
        {/* Header + Menu sur le sidebar */}
        <Header />
        <Toast ref={toast}/>
        <div className="main">
        <div className="main-content">
          <div className="p-grid">
            <div className="p-col-12">
              <div className="card">
                <div className="entete">
                  <h5>Catégories de courrier</h5>
                  <Button className="p-button-primary" onClick={() => afficheDialog(null)} icon="pi pi-plus" label="Nouveau"></Button>
                </div>
                <div className='filter'>
                    <InputText placeholder="Recherche" value={globalFilter}  onChange={(e) => setGlobalFilter(e.target.value)}></InputText>
                    <Button type='button' icon='pi pi-search' onClick={doFilter} className='p-button-primary'></Button>
                    {/*<Button type='button' icon='pi pi-file-excel' className='btn-icon' onClick={exportExcel} data-pr-tooltip="XLS"></Button>*/} 
                </div>
                <div>
                  {
                    //pendant le chargement
                    loading ?
                    <div className="p-grid">
                      <div className="p-col-12 loading">
                        <FadeLoader color="#f5a833"/>
                      </div>   
                    </div>
                    :
                    <DataTable value={items} paginator={true} rows={lazyParams.rows} 
                        lazy={true} first={lazyParams.first} totalRecords={total} 
                        loading={dtLoading}
                        onPage={onPage} onFilter={onFilter}
                        className="d-table">
                      <Column field="code" header="Code"></Column>
                      <Column field="libelle" header="Nom"></Column>
                      <Column field="actions" body={actionsBody} header=""></Column>
                    </DataTable>
                  }
                </div>
              </div>
            </div>
          </div> {/* p-grid */}
        </div>
      </div>
      <Footer/>
      
      {/* Les Dialog (popup) */}
      <Dialog header='Catégories courrier' style={{ width: '50vw'}} footer={dialogFooter} onHide={hideDialog} visible={showDialog}> 
        <form onSubmit={formik.handleSubmit}>
          <div className="p-fluid">
            <div className="p-formgrid p-grid">
              <div className="p-field p-col-4">
                <label htmlFor='code' className="p-d-block">Code</label>
                <InputText name="code" 
                  className={(formik.errors.code && formik.touched.code ? 'p-invalid' : '')}
                  {... formik.getFieldProps('code')} />
                { formik.touched.code && formik.errors.code ? <div className='p-error'><small>{formik.errors.code}</small></div> :  null}
              </div>
              <div className="p-field p-col-8">
                <label htmlFor='libelle' className="p-d-block">Catégorie</label>
                <InputText name="libelle" 
                  className={(formik.errors.code && formik.touched.code ? 'p-invalid' : '')}
                  {... formik.getFieldProps('libelle')} />
                { formik.touched.libelle && formik.errors.libelle ? <div className='p-error'><small>{formik.errors.libelle}</small></div> :  null}
              </div>
            </div>
          </div> {/* p-fluid */}
        </form>
      </Dialog>


      <Dialog header="Confirmation" style={{ width: '30vw'}} footer={confirmFooter} onHide={hideConfirmDialog} visible={showConfirmDialog}>
        <div className='confirmation-content'>
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
          <span>Êtes-vous sur de vouloir confirmer la suppression ?</span>
        </div>
      </Dialog>
    </div>
    );
};

export default CategorieCourrier;