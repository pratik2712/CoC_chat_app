import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState , useRef, useEffect} from 'react';
import coc from './img/coc.jpg'

import { useAuthState } from 'react-firebase-hooks/auth';

firebase.initializeApp({
  apiKey: "AIzaSyCN7zh_GzJ2iqSfkwQwDFdizpgNURhAPIQ",
  authDomain: "cocchat-8b741.firebaseapp.com",
  projectId: "cocchat-8b741",
  storageBucket: "cocchat-8b741.appspot.com",
  messagingSenderId: "727695867517",
  appId: "1:727695867517:web:e2f9624df044ef7445fb14",
  measurementId: "G-VM0604VD2P"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();



function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <div>
        {user ? <Chatroom></Chatroom> : <SignIn></SignIn>}
      </div>
    </>
  );
}

function SignIn () {
    const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
    }
     return (
    <div className='signin'>
      <h2>COC CHAT ROOM</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines</p>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className='signout' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Chatroom () {
  const [user] = useAuthState(auth);
  const [msg,setmsg] = useState();



// collection is mapped in local array collarray
  const [collectionarray , setcollectionarray] = useState([]);

  useEffect(
    () =>{
      firestore.collection('room').orderBy('createdAt','desc').limit(75).onSnapshot(
        (snapshot) => setcollectionarray(
          snapshot.docs.map((mappedin) => ({
            id : mappedin.id,
            user : mappedin.data().user,
            userimg : mappedin.data().userimg,
            createdAt : mappedin.data().createdAt,
            msg : mappedin.data().msg,
            uid : mappedin.data().uid
          }))
        )
      )
    },[]
  )
//

//collection is made and write op is done in firebase
  const sendmsg = (e) => {
    e.preventDefault();
    firestore.collection('room').add({
      uid : user.uid,
      user : user.displayName,
      userimg : user.photoURL,
      msg,
      createdAt : firebase.firestore.FieldValue.serverTimestamp()
    })
    .catch((error) => {
      alert(error)
    });
    setmsg('');
  }

  //trial

  // const rev = collectionarray.reverse();
  // console.log(rev)
  // console.log(collectionarray)

  //

  return(
    <>
      <div className='main'>
       <nav>
         <p>Welcome To Chatroom </p>
         <SignOut/>
      </nav>
      <section>
        <div className='chatroom'>
        { // collarray is mapped in chatmsg component //
       collectionarray && collectionarray.map(
        (mappedin) => {
          return (<Chatmsg key={mappedin.id} msg = {mappedin.msg} user = {mappedin.user} uid = {mappedin.uid} img = {mappedin.userimg} />)
        }
      ) }
      </div>
       <form onSubmit={sendmsg}>
        <input type="text" placeholder='type your message' value={msg} 
          onChange = {(e) => setmsg(e.target.value)} 
        />
        {/* <button type='submit'>send</button> */}
        <button type="submit" disabled={!msg}>send  🕊️</button>
      </form>
      </section>
    </div>
    </>
  )

  
}

function Chatmsg (props) {
  // msg is diplayed here
  const messageclass = props.uid === auth.currentUser.uid ? 'sent' : 'received';
  // console.log(props.uid);
  // console.log(auth.currentUser.uid);
  //
  return(
    <>
    <div className={`message ${messageclass}`} >
      <h6>{props.user}</h6>
       <img src={props.img || 'https://picsum.photos/200/300'} alt="" />
       <div className='box'>
         <p>{props.msg}</p>
       </div>
       
    </div>
    </>
  )
}

export default App;
