import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import Filials from './Filials'
import RegisterClinica from './RegisterClinica'
import TransferLabTables from './TransferLabTables'
import Users from './Users'

const Admin = ({ setIsAuthenticated, setUser }) => {
    return (
        <>
            <Navbar setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            <Switch>
                <Route path="/admin" exact>
                    <RegisterClinica />
                </Route>
                <Route path="/admin/users">
                    <Users />
                </Route>
                <Route path="/admin/filials">
                    <Filials />
                </Route>
                <Route path="/admin/transfer_tables">
                    <TransferLabTables />
                </Route>
            </Switch>
        </>
    )
}

export default Admin