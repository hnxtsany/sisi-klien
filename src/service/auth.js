import app from "@/config/firebase";
import db from "@/config/firestore";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";

const response = {
    status: null,
    data: null,
}


const loginWithEmailAndPassword = async ({ email, password }) => {
    const auth = getAuth(app);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        response.status = "success";
        response.data = user;
    } catch (error) {
        console.error(error);
        response.status = "error";
        response.data = error.message;
    }
    return response;
}

const logout = async () => {
    const auth = getAuth(app);
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        response.status = "error";
        response.data = error.message;
    }
    return response;
}

const registerWithEmailAndPassword = async ({ fullname, email, password }) => {
    const auth = getAuth(app);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        response.status = "success";
        response.data = user;

    } catch (error) {
        response.status = "error";
        response.data = error.message;
    }

    return response;
};


const getUser = async () => {
    const auth = getAuth(app);
    let user;
    try {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                user = user;
            } else {
                console.log("No user is signed in.");
            }
        });
        response.status = "success";
        response.data = user;

    } catch (e) {
        console.error("Error getting document: ", e);
        response.status = "error";
        response.data = e.message;
    }
}


module.exports = {
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    getUser,
    logout
}