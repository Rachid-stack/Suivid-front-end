import React from 'react';
import { Button } from 'primereact/button';
import { PanelMenu } from 'primereact/panelmenu';
import Logo from './Logo';

const Header = () => {

    const menu = [
        {
            label: 'Tableau de bord', icon: 'pi pi-fw pi-chart-bar', to: '/'
        },
        {
            label: 'Dossiers', icon: 'pi pi-fw pi-folder',
            items: [
                {label: 'Mes dossiers'}
            ]
        },
        {
            label: 'Courrier', icon: 'pi pi-fw pi-envelope',
            items: [
                {label: 'Mes dossiers', to: '/', className: ''}
            ]
        },
        {
            label: 'Rapports & Statistiques', icon: 'pi pi-fw pi-file',
            items: [
                {label: 'Mes dossiers', to: '/', className: ''}
            ]
        },
        {
            label: 'Paramètres', icon: 'pi pi-fw pi-cog',
            items: [
                {label: 'Catégories courrier', command: () =>{console.log("ICI")}, to: '/categories-courrier', className: ''},
                {label: 'Types courrier', to: '/types-courrier', className: ''},
                {label: 'Types correspondant', to: '/', className: ''},
                {label: 'Statuts courrier', to: '/', className: ''},
                {label: 'Régistres courrier', to: '/', className: ''},

                {label: 'Services', to: '/', className: ''},
                {label: 'Types dossier', to: '/', className: ''},
                {label: 'Régistre courrier', to: '/', className: ''},
                {label: 'Régistre courrier', to: '/', className: ''},
                {label: 'Régistre courrier', to: '/', className: ''},

                {label: 'Utilisateurs', to: '/', className: ''},
            ]
        },
        /*{
            label: 'Start', icon: 'pi pi-fw pi-download',
            items: [
                { label: 'Documentation', icon: 'pi pi-fw pi-question', to: '/start/documentation' },
                { label: 'Buy Now', icon: 'pi pi-fw pi-shopping-cart', command: () => { window.location = "https://www.primefaces.org/store" } }
            ]
        }*/
    ];
    

    return (
        <div className='header'>
            <div className='header-wrapper'>
                <div className="header-left">
                    {/* menu responsive a voir plus tard */}
                </div>
                <div className='menu'>
                    <Logo/>
                    <div className="menu-container">
                        <div className="menu-layout" >
                            <PanelMenu model={menu} style={{width:'100%'}}/>
                        </div>
                    </div>
                </div>
                <div className="header-right">
                    <ul className="header-actions">
                        <li className="connected"> Marcus Kaboret (administrateur) </li>
                        <li>
                            <Button icon="pi pi-user" className="p-button-rounded p-button-icon-only  p-button-outlined"></Button>
                        </li>
                        <li>
                            <Button icon="pi pi-question" className="p-button-rounded p-button-outlined" ></Button>
                        </li>
                        <li>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-outlined" ></Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;