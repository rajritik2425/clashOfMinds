'use client'
import HomeGameInterface from "./components/game-interface-home";
import { useAuth } from "./utils/AuthContext";

export default function Home() {
  const {isAuthenticated} = useAuth();
  console.log(token);
  if(!isAuthenticated){
    return <>
    You are not authenticated
    </>
  }
  return (
    <>

      <HomeGameInterface />
    </>
  );
}
