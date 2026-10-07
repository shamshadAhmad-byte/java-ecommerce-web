import React from "react";
import { assets } from "../../assets/assets";

function About() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-row justify-center">
          <h1 className="text-[25px] font-[600]">About Us</h1>
          <div className="self-center bg-black h-[2px] w-[100px] ml-2 mt-[2px]"></div>
        </div>
        <div className="flex flex-row justify-around">
          <img src={assets.about_img} className="size-[400px]" />
          <div className="flex flex-col w-[550px] h-[400px] border-black border-[2px] rounded-[5px]">
            <div className="px-5 pt-[10px]">
              Forever was born out of a passion for innovation and a desire to
              revolutionize the way people shop online. Our journey began with a
              simple idea: to provide a platform where customers can easily
              discover, explore, and purchase a wide range of products from the
              comfort of their homes.
            </div>
            <div className="px-5 pt-[10px]">
              Since our inception, we've worked tirelessly to curate a diverse
              selection of high-quality products that cater to every taste and
              preference. From fashion and beauty to electronics and home
              essentials, we offer an extensive collection sourced from trusted
              brands and suppliers.
            </div>
            <div className="px-5 pt-[10px]">
              <h1 className="text-[20px] font-[550]">Our Mission</h1> Our
              mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-[50px] gap-10 mx-10">
        <div className="flex flex-row">
          <h1 className="text-[25px] font-[700]">Why Choose Us</h1>
          <div className="bg-black w-[100px] h-[2px] self-center ml-2 mt-[4px]"></div>
        </div>
        <div className="flex flex-row justify-around">
          <div className="flex flex-col border-black border-[2px] w-[533px] h-[385px] place-content-center p-[10px] border-r-0">
            <div className="text-[20px] font-[550] px-10">
              Quality Assurence:
            </div>
            <div className="p-10 pt-5">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </div>
          </div>
          <div className="flex flex-col border-black border-[2px] w-[533px] h-[385px] place-content-center p-[10px] border-r-0">
            <div className="text-[20px] font-[550] px-10">convenience:</div>
            <div className="p-10 pt-5">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </div>
          </div>
          <div className="flex flex-col border-black border-[2px] w-[533px] h-[385px] place-content-center p-[10px]">
            <div className="text-[20px] font-[550] px-10">
              Exceptional Customer Service:
            </div>
            <div className="p-10 pt-5">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col w-full gap-2.5 my-10">
          <h1 className="text-[25px] font-[550] mx-auto">
            Subscribe now & get 20% off
          </h1>
          <div className="mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </div>
          <div className="mx-auto">
            <input
              type="text"
              placeholder="Enter your email id"
              className="border-black border-[2px] outline-none rounded-l-[5px] px-2.5 py-2.5 pl-5 placeholder:text-black"
            />
            <button className="bg-black text-white rounded-r-[5px] px-2.5 py-[12px]">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
