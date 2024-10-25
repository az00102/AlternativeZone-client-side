import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import app from "../components/firebaseconfig";

const auth = getAuth(app);

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password, name, photoURL) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            await updateProfile(newUser, {
                displayName: name,
                photoURL: photoURL
            });
            setUser(newUser);
            setProfilePictureUrl(photoURL);
            return newUser;
        } catch (error) {
            // Handle error here (e.g., log the error or show a user-friendly message)
            console.error("Error creating user:", error.message);
            throw error;
        } finally {
            setLoading(false); // Set loading to false after operation completes
        }
    };

    const logIn = async (email, password) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            // Handle error here (e.g., log the error or show a user-friendly message)
            console.error("Error logging in:", error.message);
            throw error;
        } finally {
            setLoading(false); // Set loading to false after operation completes
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            // Handle error here (e.g., log the error or show a user-friendly message)
            console.error("Error logging out:", error.message);
            throw error;
        } finally {
            setLoading(false); // Set loading to false after operation completes
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        profilePictureUrl,
        createUser,
        logIn,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
