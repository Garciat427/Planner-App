//React Dependencies
import React from 'react';
import ReactDOM from 'react-dom';

//Redux Dependencies
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './store/reducers/rootReducer'
import { Provider, useSelector } from 'react-redux'
import thunk from 'redux-thunk'

//Firebase and Firestore Dependencies
import fbConfig from './config/fbConfig'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ReactReduxFirebaseProvider, getFirebase, isLoaded } from 'react-redux-firebase'
import { reduxFirestore, getFirestore, createFirestoreInstance } from 'redux-firestore';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//Firestore Initalization
firebase.firestore()


const store = createStore(
   rootReducer,
   compose(
      applyMiddleware(thunk.withExtraArgument({ getFirestore, getFirebase })),
      reduxFirestore(firebase, fbConfig)
   )
);

const rrfProps = {
   firebase,
   config: fbConfig,
   dispatch: store.dispatch,
   createFirestoreInstance,
   userProfile: 'users', // where profiles are stored in database
   presence: 'presence', // where list of online users is stored in database
   sessions: 'sessions'
};

function AuthIsLoaded({ children }) {
   const auth = useSelector(state => state.firebase.auth)
   if (!isLoaded(auth)) return <div>Loading Screen...</div>;
   return children
}

ReactDOM.render(
   <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
         <AuthIsLoaded>
            <App />
         </AuthIsLoaded>
      </ReactReduxFirebaseProvider>
   </Provider>,
   document.getElementById("root")
);


serviceWorker.unregister();

