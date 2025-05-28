'use client'
import HomeGameInterface from "./components/game-interface-home";
import { useAuth } from "./utils/AuthContext";

export default function Home() {
  const {isAuthenticated} = useAuth();
  if(!isAuthenticated){
    return <>
    Loading...
    </>
  }
  return (
    <>
      <HomeGameInterface />
    </>
  );
}
