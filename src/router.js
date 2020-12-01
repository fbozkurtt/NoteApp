import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import HomeScreen from './screens/home';
import NoteScreen from './screens/note';

const RouterComp = () => {
    return (
        <Router titleStyle={{ color: '#000' }}  >
            <Scene key='root' hideNavBar={true}>
                <Scene key='main'>
                    <Scene key='home'
                        component={HomeScreen}
                        title='Anasayfa'
                        hideNavBar={true}
                        animation='fade'
                        initial
                        //type='refresh'
                    />
                    <Scene key='note'
                        component={NoteScreen}
                        title='Not Al'
                        hideNavBar={true}
                        animation='fade'
                        //type='reset'
                    />
                </Scene>
            </Scene>
        </Router>
    )
}
export default RouterComp