'use client'
import HomeGameInterface from "./components/game-interface-home";
import { useAuth } from "./utils/AuthContext";
import Loading from './components/ui/loading'

export default function Home() {
  const {user} = useAuth();
  if(!user){
    return <Loading/>
  } 
  
  return (
    <>
      <HomeGameInterface />
    </>
  );
}
