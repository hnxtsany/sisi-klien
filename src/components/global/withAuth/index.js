import app from "@/config/firebase";
import db from "@/config/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppLayout from "../appLayout";
import LoadingLayout from "../loadingLayout";

const withAuth = (WrappedComponent, allowedRoles) => {
    return (props) => {
      const router = useRouter();
      const [loading, setLoading] = useState(true);
      const [authorized, setAuthorized] = useState(false);
  
      useEffect(() => {
        const auth = getAuth(app);
        const checkAuth = async () => {
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (allowedRoles.includes(role) && allowedRoles === "admin") {
                  setAuthorized(true);
                } else {
                  router.push("/auth/login");
                }
              } else {
                router.push("/auth/login");
              }
            } else {
              router.push("/auth/login");
            }
            setLoading(false);
          });
        };
  
        checkAuth();
      }, [router]);
  
      if (loading) {
        return <AppLayout>
          <div className="flex justify-center items-center h-screen">
            <LoadingLayout/>
          </div>
        </AppLayout>;
      }
  
      if (!authorized) {
        return null;
      }
  
      return <WrappedComponent {...props} />;
    };
  };
  
  export default withAuth;