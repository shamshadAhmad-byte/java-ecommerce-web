import React, { useContext, useEffect } from "react";
import TextContent from "../components/TextContent";
import LetestCollection from "../components/LetestCollection";
import BestSeller from "../components/BestSeller";
import { ShopContext } from "../contextStore/ShopContext";
import { useLocation } from "react-router-dom";

function Home() {
  const { showPara, setShowPara } = useContext(ShopContext);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/")) {
      setShowPara(false);
    }
  }, [location]);
  return (
    <>
      <TextContent text1={"Letest"} text2={"Seller"} />
      <LetestCollection />
      <TextContent text1={"Best"} text2={"Seller"} />
      <BestSeller />
    </>
  );
}

export default Home;
