import React, { useContext } from "react";
import { ShopContext } from "../contextStore/ShopContext";

function TextContent({ text1, text2 }) {
  const { showPara } = useContext(ShopContext);
  return (
    <div className="ml-[142px] flex flex-col mb-[10px]">
      <div className="flex flex-row gap-2 mb-[5px]">
        <h1 className="text-[30px] font-[600]">{text1}</h1>
        <p className="self-center text-[25px] font-[500]">{text2}</p>
        <div className="w-[120px] h-[2px] bg-black mt-[30px] ml-1"></div>
      </div>
      {!showPara ? (
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      ) : null}
    </div>
  );
}

export default TextContent;
