
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';

firebase.initializeApp({
    apiKey: "AIzaSyBVPNvxhM7SxmY_TH6J5V5J8P38eBZ04bU",
    authDomain: "fir-cloud-notification-ed8a7.firebaseapp.com",
    projectId: "fir-cloud-notification-ed8a7",
    storageBucket: "fir-cloud-notification-ed8a7.appspot.com",
    messagingSenderId: "113157422836",
    appId: "1:113157422836:web:f77ebee014e6ed670228a1"

})

const auth = firebase.auth();
const firestore =firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const[user] =useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>♔ChatRoom❗️ ❗️ </h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
 const signInWithGoogle =()=>{
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider);
 }
  return(<>
    <button className="sign-in" onClick={signInWithGoogle}>Sign In with Google</button>
    <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}
 
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}> Sign Out</button>
  )
}

function ChatRoom(){
  const scrollview = useRef();
 const messagesRef = firestore.collection('messages');
 const query = messagesRef.orderBy('createdAt').limit(25);

 const [messages] = useCollectionData(query, {idField: 'id'});
 const [formValue,setFormValue] = useState('');

 const sendMessageHandler =async (e)=>{
   e.preventDefault();
   const {uid, photoURL}= auth.currentUser;

   await messagesRef.add({
     text: formValue,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     uid,
     photoURL
   });
   setFormValue('');
   scrollview.current.scrollIntoView({behavior: 'smooth'});
 }
 return (
   <>
   <main>
     {messages && messages.map(msg => <ChatMessage key={msg.id} messages={msg} />)}

     <div ref={scrollview}></div>
   </main>
    <form onSubmit={sendMessageHandler}>
      <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} placeholder='Type a message'/>
      <button type="submit">✔</button>
    </form>
   </>
 )
}
function ChatMessage(props){
  
  const {text, uid, photoURL} = props.messages;
   const messageClassType = uid === auth.currentUser.uid ? 'sent' : 'received'; 
  return (
    <div className={`message ${messageClassType}`}>
      <img src={photoURL} />
        <p>{text}</p>
    </div>
  )
}
export default App;
